import { lobby, toggleSlotState } from "./lobby.js"

import express from "express"
const app = express()
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

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

    io.emit("start_lobby", lobby)

    socket.on("select_player", (data) => {
        toggleSlotState(data.roomID, data.playerSlot)
        io.emit("slot_filled", lobby)
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
