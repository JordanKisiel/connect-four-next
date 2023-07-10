import { lobby, fillPlayerSlot, removePlayer, findPlayer } from "./lobby.js"
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

    //lobby events
    socket.on("start_lobby", () => {
        socket.join("lobby")
        io.to("lobby").emit("lobby_updated", lobby)
    })

    socket.on("leave_lobby", () => {
        socket.leave("lobby")
        removePlayer(socket.sessionID)
        io.to("lobby").emit("lobby_updated", lobby)
    })

    //whenever a client selects a player slot on the client
    //the server updates the lobby state and sends it back to the client
    socket.on("select_player", (data) => {
        //remove player from current room if they're in one
        const { roomID, playerSlot } = findPlayer(socket.sessionID)
        if (roomID !== "" && playerSlot !== "") {
            socket.leave(`Room ${roomID + 1}`)
        }

        fillPlayerSlot(data.roomID, data.playerSlot, socket.sessionID)
        socket.join(`Room ${data.roomID}`)
        console.log(socket.rooms)

        io.to("lobby").emit("lobby_updated", lobby)
        console.log(lobby)
    })

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.sessionID}`)

        const matchingSockets = await io.in(socket.sessionID).fetchSockets()
        const isDisconnected = matchingSockets.length === 0

        if (isDisconnected) {
            removePlayer(socket.sessionID)
            io.to("lobby").emit("lobby_updated", lobby)

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
