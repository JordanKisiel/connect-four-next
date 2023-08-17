import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
} from "../../lib/connect4-utilities.ts"
import { GameState } from "./state/GameState.ts"
import { OverState } from "./state/OverState.ts"
import { Board } from "../../types.ts"
import { WaitingState } from "./state/WaitingState.ts"
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
        this.state = new WaitingState(this)

        this.roomID = roomID
        this.server = server

        //TODO:
        //think about starting with new player objects
        //instead of using null
        this.player1 = null
        this.player2 = null

        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)

        this.turnTimer = new Timer(TURN_TIMER_START_DUR, () => {
            this.changeState(new OverState(this))
            this.updateClients()
        })

        this.isPlayer1Turn = true
        this.isPlayer1First = true
    }

    changeState(newState: GameState) {
        this.state = newState
    }

    addPlayer(player: Player) {
        this.state.addPlayer(player)
    }

    removePlayer(player: Player) {
        this.state.removePlayer(player)
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        this.state.dropDisc(colIndex, isFirstPlayerDisc)
    }

    startNewGame() {
        console.log("STARTING NEW GAME")
        this.state.startNewGame()
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
