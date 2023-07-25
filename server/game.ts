import {
    getEmptyBoard,
    getWinningSpaces,
    isBoardFull,
} from "../lib/connect4-utilities.ts"
import { Board } from "../types.ts"
import { Server, Socket } from "socket.io"

const BOARD_ROWS = 6
const BOARD_COLS = 7
const CENTER_COL = 3

export class Game {
    roomID: string
    server: Server
    player1: Socket | null
    player2: Socket | null
    player1Id: string
    player2Id: string
    board: Board
    selectedCol: number
    isPlayer1Turn: boolean
    isPlayer1First: boolean
    isGameOver: boolean

    constructor(roomID: string, server: Server) {
        this.roomID = roomID
        this.server = server

        this.player1 = null
        this.player2 = null
        this.player1Id = ""
        this.player2Id = ""

        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        this.selectedCol = CENTER_COL

        this.isPlayer1Turn = true
        //who goes first alternates with each game
        this.isPlayer1First = true

        this.isGameOver = false
    }

    //increment or decrement selectedCol index
    //based on direction
    selectNewCol(isMoveToLeft: boolean) {
        const prevCol = this.selectedCol
        if (isMoveToLeft) {
            this.selectedCol = prevCol > 0 ? prevCol - 1 : 0
        } else {
            this.selectedCol = prevCol < BOARD_COLS - 1 ? prevCol + 1 : 6
        }
    }

    //handles player moves and updates board
    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //only drop in col if there's an open slot
        if (this.board[colIndex].some((slot) => slot === null)) {
            const isNull = (element: boolean | null) => element === null
            this.board = this.board.map((col, index) => {
                const firstOpenSlot = col.findIndex(isNull)

                if (index === colIndex) {
                    return col.map((slot, index) => {
                        if (index === firstOpenSlot) {
                            return isFirstPlayerDisc
                        } else {
                            return slot
                        }
                    })
                } else {
                    return col
                }
            })
        }

        //detect if there is a win
        const isWin = getWinningSpaces(this.board).length !== 0
        //if there is a win or draw, the game is over
        if (isWin || isBoardFull(this.board)) {
            this.isGameOver = true
        } else {
            //otherwise play continues so change player turn
            this.isPlayer1Turn = !this.isPlayer1Turn
        }

        //reset selected col to center col after move
        this.selectedCol = CENTER_COL
    }

    //sets up a new game if the players choose to play again
    startNewGame() {
        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        this.selectedCol = CENTER_COL
        //player that makes the first move of the new
        //game is the player who went second in the previous
        this.isPlayer1First = !this.isPlayer1First
        this.isPlayer1Turn = this.isPlayer1First

        this.isGameOver = false
    }

    addPlayer(player: Socket, isPlayer1: boolean) {
        //playerSlot of true denotes player1 slot
        if (isPlayer1) {
            this.player1 = player
            this.player1.join(this.roomID)
            this.player1Id = player.handshake.auth.id
        } else {
            this.player2 = player
            this.player2.join(this.roomID)
            this.player2Id = player.handshake.auth.id
        }

        this.updatePlayers()
    }

    removePlayer(playerId: string) {
        if (this.player1Id === playerId) {
            this.player1?.leave(this.roomID)
            this.player1 = null
            this.player1Id = ""
        }
        if (this.player2Id === playerId) {
            this.player2?.leave(this.roomID)
            this.player2 = null
            this.player2Id = ""
        }
        this.updatePlayers()
    }

    //inform the clients of the change in players
    updatePlayers() {
        this.server.to(this.roomID).emit("players_updated", {
            playerSlot1: this.player1Id,
            playerSlot2: this.player2Id,
        })
    }
}
