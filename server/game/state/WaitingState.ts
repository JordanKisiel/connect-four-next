import { Player } from "@/player.ts"
import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
    isColOpen,
} from "../../lib/connect4-utilities.ts"
import { GameContext } from "../GameContext.ts"
import { GameState } from "./GameState.ts"
import { InProgressState } from "./InProgressState.ts"
import { InactiveState } from "./InactiveState.ts"
import { OverState } from "./OverState.ts"

export class WaitingState implements GameState {
    gameContext: GameContext

    constructor(gameContext: GameContext) {
        this.gameContext = gameContext
    }

    addPlayer(player: Player): void {
        this.gameContext.startNewGame(false)
    }

    removePlayer(player: Player): void {
        if (player.isPlayer1) {
            this.gameContext.player1 = null
        } else {
            this.gameContext.player2 = null
        }

        console.log(`player1: ${this.gameContext.player1}`)
        console.log(`player2: ${this.gameContext.player2}`)

        player.playerSocket.leave(this.gameContext.roomID)
        player.playerSocket.removeAllListeners("player_joined")
        player.playerSocket.removeAllListeners("disc_dropped")
        player.playerSocket.removeAllListeners("player_left_game")

        if (
            this.gameContext.player1 === null &&
            this.gameContext.player2 === null
        ) {
            this.gameContext.changeState(new InactiveState(this.gameContext))
            this.gameContext.startNewGame(false)
        }

        this.gameContext.updateClients()
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //Do nothing
    }

    startNewGame(isSeries: boolean): void {
        this.gameContext.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        //alternate who goes first if in a series of games
        if (isSeries) {
            this.gameContext.isPlayer1First = !this.gameContext.isPlayer1First
        }
        this.gameContext.isPlayer1Turn = this.gameContext.isPlayer1First

        if (
            this.gameContext.player1?.isReady &&
            this.gameContext.player2?.isReady
        ) {
            this.gameContext.changeState(new InProgressState(this.gameContext))
            this.gameContext.turnTimer.start()
        }
    }

    toString(): string {
        return "waiting"
    }
}
