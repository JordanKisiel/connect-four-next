import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
    isColOpen,
} from "../lib/connect4-utilities.ts"
import { GameState } from "./state/GameState.ts"
import { OverState } from "./state/OverState.ts"
import { Board } from "../types.ts"
import { InactiveState } from "./state/InactiveState.ts"
import { Timer } from "./timer.ts"
import { Player } from "../player.ts"
import { Server } from "socket.io"

const TURN_TIMER_START_DUR = 92 //in seconds

export class GameContext {
    state: GameState
    server: Server
    roomID: string
    board: Board
    turnTimer: Timer
    player1: Player | null
    player2: Player | null
    isPlayer1Turn: boolean
    isPlayer1First: boolean

    constructor(roomID: string, server: Server) {
        //start in waiting state
        this.state = new InactiveState(this)

        this.roomID = roomID
        this.server = server

        //TODO:
        //think about starting with new player objects
        //instead of using null
        this.player1 = null
        this.player2 = null

        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)

        this.turnTimer = new Timer(TURN_TIMER_START_DUR, () => {
            if (this.player1) this.player1.isReady = false
            if (this.player2) this.player2.isReady = false
            this.changeState(new OverState(this))
            this.updateClients()
        })

        this.isPlayer1Turn = true
        this.isPlayer1First = true
    }

    changeState(newState: GameState) {
        this.state = newState
        console.log(`changing state to: ${this.state.toString()}`)
    }

    addPlayer(player: Player): void {
        console.log(`${player.playerID} joining game`)
        player.playerSocket.join(this.roomID)

        //playerSlot of true denotes player1 slot
        if (player.isPlayer1) {
            this.player1 = player
        } else {
            this.player2 = player
        }

        //add listeners
        player.playerSocket.on("player_joined", () => {
            console.log("player joined")
            this.updateClients()
        })

        player.playerSocket.on("disc_dropped", ({ selectedCol, isPlayer1 }) => {
            //only drop disc if there's an empty space in the column
            if (isColOpen(this.board, selectedCol)) {
                console.log("dropping disc")
                this.dropDisc(selectedCol, isPlayer1)
            }
        })

        player.playerSocket.on("player_left_game", () => {
            this.removePlayer(player)
        })

        this.state.addPlayer(player)
        this.updateClients()
    }

    removePlayer(player: Player) {
        console.log("remove player called")
        this.state.removePlayer(player)
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        this.state.dropDisc(colIndex, isFirstPlayerDisc)
    }

    startNewGame(isSeries: boolean) {
        console.log("STARTING NEW GAME")
        this.state.startNewGame(isSeries)
    }

    //send updated game data to players
    updateClients() {
        const gameData = {
            roomID: this.roomID,
            remainingTurnTime: this.turnTimer.remainingTime,
            player1: {
                playerID: this.player1?.playerID || "",
                isReady: this.player1?.isReady || false,
            },
            player2: {
                playerID: this.player2?.playerID || "",
                isReady: this.player2?.isReady || false,
            },
            board: this.board,
            isPlayer1Turn: this.isPlayer1Turn,
            isPlayer1First: this.isPlayer1First,
            gameState: this.state.toString(),
        }

        console.log(gameData)

        this.server.to(this.roomID).emit("game_updated", gameData)
    }
}
