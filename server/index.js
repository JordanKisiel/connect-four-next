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

    //inital send of lobby state on connecting
    io.emit("start_lobby", lobby)

    //whenever a client selects a player slot on the client
    //the server updates the lobby state and sends it back to the client
    socket.on("select_player", (data) => {
        toggleSlotState(data.roomID, data.playerSlot)
        io.emit("slot_filled", lobby)
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
