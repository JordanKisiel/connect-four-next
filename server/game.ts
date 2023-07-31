import {
    getEmptyBoard,
    getWinningSpaces,
    isBoardFull,
} from "../lib/connect4-utilities.ts"
import { Board } from "../types.ts"
import { Server, Socket } from "socket.io"
import { Player } from "./player.ts"

const BOARD_ROWS = 6
const BOARD_COLS = 7

export class Game {
    roomID: string
    server: Server
    player1: Player | null
    player2: Player | null
    board: Board
    isPlayer1Turn: boolean
    isPlayer1First: boolean
    stage: "waiting" | "in_progress" | "over"

    constructor(roomID: string, server: Server) {
        this.roomID = roomID
        this.server = server

        this.player1 = null
        this.player2 = null

        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)

        this.isPlayer1Turn = true
        //who goes first alternates with each game
        this.isPlayer1First = true

        this.stage = "waiting"
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
            this.stage = "over"
        } else {
            //otherwise play continues so change player turn
            this.isPlayer1Turn = !this.isPlayer1Turn
        }

        this.updateGame()
    }

    addPlayer(player: Player) {
        console.log(`${player.playerID} joining game`)
        player.playerSocket.join(this.roomID)

        player.playerSocket.on("player_joined", () => {
            console.log("player joined -- updating game")
            this.updateGame()
        })

        player.playerSocket.on("disc_dropped", ({ selectedCol, isPlayer1 }) => {
            console.log("dropping disc")
            this.dropDisc(selectedCol, isPlayer1)
        })

        player.playerSocket.on("player_left_game", () => {
            this.removePlayer(player)

            if (this.player1 !== null || this.player2 != null) {
                this.stage = "over" //other player wins by default
            } else {
                this.stage = "waiting"
            }

            this.updateGame()
        })

        //playerSlot of true denotes player1 slot
        if (player.isPlayer1) {
            this.player1 = player
        } else {
            this.player2 = player
        }

        //if both player slots are filled, start game
        if (this.player1 !== null && this.player2 !== null) {
            this.stage = "in_progress"
        }

        this.updateGame()
    }

    //sets up a new game if the players choose to play again
    startNewGame() {
        console.log("STARTING NEW GAME")
        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        //player that makes the first move of the new
        //game is the player who went second in the previous
        this.isPlayer1First = !this.isPlayer1First
        this.isPlayer1Turn = this.isPlayer1First

        this.stage = "in_progress"
    }

    removePlayer(player: Player) {
        if (player.isPlayer1) {
            this.player1 = null
        } else {
            this.player2 = null
        }

        player.playerSocket.leave(this.roomID)
        player.playerSocket.removeAllListeners("player_joined")
        player.playerSocket.removeAllListeners("disc_dropped")
        player.playerSocket.removeAllListeners("player_left_game")

        this.updateGame()
    }

    //reset game mechanic states back to defaults
    //this is for starting a completely new set of games
    resetGame() {
        console.log("RESETTING GAME")
        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        this.isPlayer1Turn = true
        this.isPlayer1First = true
        this.stage = "waiting"
    }

    //inform the clients of the change in players
    updateGame() {
        //if there are no players, reset the game
        if (this.player1 === null && this.player2 === null) {
            this.resetGame()
        }

        //when the game ends, unready players
        if (this.stage === "over") {
            if (this.player1) this.player1.isReady = false
            if (this.player2) this.player2.isReady = false
        }

        const gameState = {
            roomID: this.roomID,
            player1: {
                playerID: this.player1?.playerID || "",
                isReady: this.player1?.isReady,
            },
            player2: {
                playerID: this.player2?.playerID || "",
                isReady: this.player2?.isReady,
            },
            board: this.board,
            isPlayer1Turn: this.isPlayer1Turn,
            isPlayer1First: this.isPlayer1First,
            stage: this.stage,
        }

        console.log(gameState)

        //send the game state to the players
        this.server.to(this.roomID).emit("game_updated", gameState)
    }
}
