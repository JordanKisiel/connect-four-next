import { Player } from "@/player.ts"
import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
    isColOpen,
} from "../../../lib/connect4-utilities.ts"
import { GameContext } from "../GameContext.ts"
import { GameState } from "./GameState.ts"
import { WaitingState } from "./WaitingState.ts"
import { OverState } from "./OverState.ts"

export class InactiveState implements GameState {
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

        this.gameContext.changeState(new WaitingState(this.gameContext))
        this.gameContext.updateClients()
    }

    removePlayer(player: Player): void {
        //Do nothing
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //Do nothing
    }

    startNewGame(): void {
        this.gameContext.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        //player1 goes first if starting from an inactive state
        this.gameContext.isPlayer1First = true
        this.gameContext.isPlayer1Turn = true

        this.gameContext.changeState(new WaitingState(this.gameContext))
        this.gameContext.turnTimer.start()
    }

    toString(): string {
        return "inactive"
    }
}
