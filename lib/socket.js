//socket.io client connection

import { io } from "socket.io-client"

const URL = "https://connect-four-next-server.railway.internal:3001"

export const socket = io(URL, {
    autoConnect: false,
})
