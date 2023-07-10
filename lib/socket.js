//socket.io client connection

import { io } from "socket.io-client"

//setting this explicitly to localhost for now
const URL = "http://localhost:3001"

export const socket = io(URL, {
    autoConnect: false,
})
