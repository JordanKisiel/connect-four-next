//socket.io client connection

import { io } from "socket.io-client"

const URL =
    process.env.NODE_ENV === "production"
        ? "https://connect-four-next-server-production.up.railway.app"
        : "http://localhost:3001"

console.log(`client URL: ${URL}`)

export const socket = io(URL, {
    autoConnect: false,
})
