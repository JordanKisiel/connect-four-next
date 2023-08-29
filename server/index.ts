import { Lobby } from "./lobby.js"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors()) //use cors middleware
const server = createServer(app)

const NUM_LOBBY_ROOMS = 3 //keep number of rooms small for simplicity

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const lobby = new Lobby(NUM_LOBBY_ROOMS, io)

io.on("connection", (socket) => {
    const clientID = socket.handshake.auth.id

    console.log(`User connected: ${clientID}`)

    lobby.addUser(socket)

    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${clientID}`)

        //start disconnect timer for this user
        lobby.startDisconnectTimer(clientID)
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
