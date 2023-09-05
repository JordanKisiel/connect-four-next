import { GameContext } from "../GameContext.ts"
import { GameState } from "./GameState.ts"
import { getWinningSpaces, isBoardFull } from "../../lib/connect4-utilities.ts"
import { OverState } from "./OverState.ts"
import { Player } from "@/player.ts"
import { WaitingState } from "./WaitingState.ts"

export class InProgressState implements GameState {
    gameContext: GameContext

    constructor(gameContext: GameContext) {
        this.gameContext = gameContext
    }

    addPlayer(player: Player): void {
        //do nothing
    }

    removePlayer(player: Player): void {
        if (player.isPlayer1) {
            this.gameContext.player1 = null
        } else {
            this.gameContext.player2 = null
        }

        player.playerSocket.leave(this.gameContext.roomID)
        player.playerSocket.removeAllListeners("player_joined")
        player.playerSocket.removeAllListeners("disc_dropped")
        player.playerSocket.removeAllListeners("player_left_game")

        this.gameContext.turnTimer.reset()
        this.gameContext.changeState(new OverState(this.gameContext))

        this.gameContext.updateClients()
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        const board = this.gameContext.board
        //only drop in col if there's an open slot
        if (board[colIndex].some((slot) => slot === null)) {
            const isNull = (element: boolean | null) => element === null
            this.gameContext.board = board.map((col, index) => {
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
        const isWin = getWinningSpaces(this.gameContext.board).length !== 0
        //if there is a win or draw, the game is over
        if (isWin || isBoardFull(this.gameContext.board)) {
            //unready players
            if (this.gameContext.player1) {
                this.gameContext.player1.isReady = false
            }
            if (this.gameContext.player2) {
                this.gameContext.player2.isReady = false
            }
            this.gameContext.changeState(new OverState(this.gameContext))
            this.gameContext.turnTimer.reset()
        } else {
            //otherwise play continues so change player turn
            this.gameContext.isPlayer1Turn = !this.gameContext.isPlayer1Turn
            //and restart turn timer
            this.gameContext.turnTimer.start()
        }

        this.gameContext.updateClients()
    }

    startNewGame(isSeries: boolean): void {
        //Do nothing
    }

    toString(): string {
        return "in_progress"
    }
}
