const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

app.use(cors()) //use cors middleware
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on("select_player", (data) => {
        console.log(data.message)
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
})
