import { Player } from "@/player.ts"
import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
    isColOpen,
} from "../../../lib/connect4-utilities.ts"
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
        console.log(`${player.playerID} joining game`)
        player.playerSocket.join(this.gameContext.roomID)

        //playerSlot of true denotes player1 slot
        if (player.isPlayer1) {
            this.gameContext.player1 = player
        } else {
            this.gameContext.player2 = player
        }

        player.playerSocket.on("player_joined", () => {
            console.log("player joined")
            this.gameContext.updateClients()
        })

        player.playerSocket.on("disc_dropped", ({ selectedCol, isPlayer1 }) => {
            //only drop disc if there's an empty space in the column
            if (isColOpen(this.gameContext.board, selectedCol)) {
                console.log("dropping disc")
                this.gameContext.dropDisc(selectedCol, isPlayer1)
            }
        })

        player.playerSocket.on("player_left_game", () => {
            this.gameContext.removePlayer(player)

            if (
                this.gameContext.player1 === null &&
                this.gameContext.player2 === null
            ) {
                this.gameContext.changeState(
                    new InactiveState(this.gameContext)
                )
                this.gameContext.startNewGame()
            } else {
                this.gameContext.changeState(new OverState(this.gameContext))

                //remaining player gets put into unready state
                if (this.gameContext.player1) {
                    this.gameContext.player1.isReady = false
                } else if (this.gameContext.player2) {
                    this.gameContext.player2.isReady = false
                }
            }

            this.gameContext.turnTimer.reset()

            this.gameContext.updateClients()
        })

        const bothPlayersReady =
            this.gameContext.player1?.isReady &&
            this.gameContext.player2?.isReady

        if (bothPlayersReady) {
            this.gameContext.changeState(new InProgressState(this.gameContext))
            this.gameContext.turnTimer.start()
        } else {
            this.gameContext.turnTimer.reset()
        }

        this.gameContext.changeState(new InProgressState(this.gameContext))
        this.gameContext.updateClients()
    }

    removePlayer(player: Player): void {
        this.gameContext.player1 = null
        this.gameContext.player2 = null

        player.playerSocket.leave(this.gameContext.roomID)
        player.playerSocket.removeAllListeners("player_joined")
        player.playerSocket.removeAllListeners("disc_dropped")
        player.playerSocket.removeAllListeners("player_left_game")

        this.gameContext.changeState(new InactiveState(this.gameContext))
        this.gameContext.startNewGame()

        this.gameContext.updateClients()
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //Do nothing
    }

    startNewGame(): void {
        this.gameContext.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        //alternate who goes first if starting from a waiting state
        this.gameContext.isPlayer1First = !this.gameContext.isPlayer1First
        this.gameContext.isPlayer1Turn = this.gameContext.isPlayer1First

        this.gameContext.changeState(new InProgressState(this.gameContext))
        this.gameContext.turnTimer.start()
    }

    toString(): string {
        return "waiting"
    }
}
