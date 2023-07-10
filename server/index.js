import { lobby, fillPlayerSlot, removePlayer } from "./lobby.js"

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors()) //use cors middleware
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    //inital send of lobby state on connecting
    io.emit("start_lobby", lobby)

    //whenever a client selects a player slot on the client
    //the server updates the lobby state and sends it back to the client
    socket.on("select_player", (data) => {
        console.log(lobby)
        fillPlayerSlot(data.roomID, data.playerSlot, socket.id)
        console.log(lobby)
        io.emit("lobby_updated", lobby)
    })

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}`)

        removePlayer(socket.id)
        io.emit("lobby_updated", lobby)

        console.log(lobby)
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
