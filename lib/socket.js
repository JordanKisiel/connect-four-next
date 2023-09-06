//socket.io client connection

import { io } from "socket.io-client"

const URL = "https://connect-four-next-server-production.up.railway.app:3001"

export const socket = io(URL, {
    autoConnect: false,
})
