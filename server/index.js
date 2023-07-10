import { lobby, fillPlayerSlot, removePlayer } from "./lobby.js"
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

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

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

    //emit session details
    socket.emit("session", {
        sessionID: socket.sessionID,
    })

    //fetch existing users
    const users = []
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            connected: session.connected,
        })
    })

    //inital send of lobby state on connecting
    io.emit("start_lobby", lobby)

    //whenever a client selects a player slot on the client
    //the server updates the lobby state and sends it back to the client
    socket.on("select_player", (data) => {
        fillPlayerSlot(data.roomID, data.playerSlot, socket.sessionID)

        io.emit("lobby_updated", lobby)
        console.log(lobby)
    })

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.sessionID}`)

        const matchingSockets = await io.in(socket.sessionID).fetchSockets()
        console.log(matchingSockets.length)
        const isDisconnected = matchingSockets.length === 0

        if (isDisconnected) {
            removePlayer(socket.sessionID)
            io.emit("lobby_updated", lobby)

            sessionStore.saveSession(socket.sessionID, {
                connected: false,
            })
            console.log(lobby)
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
