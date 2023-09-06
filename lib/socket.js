//socket.io client connection

import { io } from "socket.io-client"

const URL =
    process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000"

console.log(`client URL: ${URL}`)

export const socket = io(URL, {
    autoConnect: false,
})
