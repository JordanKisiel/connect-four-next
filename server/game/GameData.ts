import { Board } from "../../types.ts"

export type GameData = {
    roomID: string
    remainingTurnTime: number
    player1: {
        playerID: string
        isReady: boolean
    }
    player2: {
        playerID: string
        isReady: boolean
    }
    board: Board
    isPlayer1Turn: boolean
    isPlayer1First: boolean
    gameState: String
}
