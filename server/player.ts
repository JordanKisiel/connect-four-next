import { Socket } from "socket.io"

export class Player {
    playerSocket: Socket
    playerID: string
    isPlayer1: boolean
    isReady: boolean

    constructor(playerSocket: Socket, isPlayer1: boolean, isReady: boolean) {
        this.playerSocket = playerSocket
        this.playerID = playerSocket.handshake.auth.id
        this.isPlayer1 = isPlayer1
        this.isReady = isReady
    }
}
