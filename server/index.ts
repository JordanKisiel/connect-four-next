import { Lobby } from "./lobby.js"
import { InMemorySessionStore } from "./sessionStore.js"

import crypto from "crypto"
import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import cors from "cors"

type SessionSocket = Socket & { sessionID: string }

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
let sessionSocket: SessionSocket

//grab the session id from the client if it exists
io.use((socket, next) => {
    sessionSocket = Object.assign(socket, { sessionID: "" })

    const sessionID = socket.handshake.auth.sessionID

    if (sessionID) {
        //find existing session
        const session = sessionStore.findSession(sessionID)
        if (session) {
            sessionSocket.sessionID = sessionID
            return next()
        }
    }

    //otherwise generate a new session id
    sessionSocket.sessionID = randomId()
    console.log(`generated session id: ${sessionSocket.sessionID}`)
    next()
})

io.on("connection", (socket) => {
    console.log(`User connected: ${sessionSocket.sessionID}`)

    //persist session
    sessionStore.saveSession(sessionSocket.sessionID, {
        connected: true,
    })

    //emit session id
    sessionSocket.emit("session", {
        sessionID: sessionSocket.sessionID,
    })

    lobby.addUser(sessionSocket)

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${sessionSocket.sessionID}`)

        const matchingSockets = await io
            .in(sessionSocket.sessionID)
            .fetchSockets()
        const isDisconnected = matchingSockets.length === 0

        if (isDisconnected) {
            lobby.removePlayer(sessionSocket.sessionID)

            sessionStore.saveSession(sessionSocket.sessionID, {
                connected: false,
            })
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
