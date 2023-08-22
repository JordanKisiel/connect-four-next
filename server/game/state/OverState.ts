import { GameContext } from "../GameContext.ts"
import { GameState } from "./GameState.ts"
import { InactiveState } from "./InactiveState.ts"
import { WaitingState } from "./WaitingState.ts"
import { Player } from "@/player.ts"

export class OverState implements GameState {
    gameContext: GameContext

    constructor(gameContext: GameContext) {
        this.gameContext = gameContext
    }

    addPlayer(player: Player): void {
        //Do nothing
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

        if (
            this.gameContext.player1 === null &&
            this.gameContext.player2 === null
        ) {
            this.gameContext.changeState(new InactiveState(this.gameContext))
        }

        this.gameContext.updateClients()
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //Do nothing
    }

    startNewGame(isSeries: boolean): void {
        //Do nothing
    }

    toString(): string {
        return "over"
    }
}
