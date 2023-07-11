import { Lobby } from "./lobby.js"
import { InMemorySessionStore } from "./sessionStore.js"

import crypto from "crypto"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors()) //use cors middleware
const server = createServer(app)

const randomId = () => {
    return crypto.randomBytes(8).toString("hex")
}

const sessionStore = new InMemorySessionStore()

const NUM_LOBBY_ROOMS = 3 //keep number of rooms small for simplicity

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const lobby = new Lobby(NUM_LOBBY_ROOMS, io)

//grab the session id from the client if it exists
io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID

    if (sessionID) {
        //find existing session
        const session = sessionStore.findSession(sessionID)
        if (session) {
            socket.sessionID = sessionID
            return next()
        }
    }

    //otherwise generate a new session id
    socket.sessionID = randomId()
    console.log(`generated session id: ${socket.sessionID}`)
    next()
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.sessionID}`)

    //persist session
    sessionStore.saveSession(socket.sessionID, {
        connected: true,
    })

    //emit session id
    socket.emit("session", {
        sessionID: socket.sessionID,
    })

    lobby.addUser(socket)

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.sessionID}`)

        const matchingSockets = await io.in(socket.sessionID).fetchSockets()
        const isDisconnected = matchingSockets.length === 0

        if (isDisconnected) {
            lobby.removePlayer(socket.sessionID)

            sessionStore.saveSession(socket.sessionID, {
                connected: false,
            })
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
