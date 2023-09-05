import { Player } from "@/player.ts"
import {
    getEmptyBoard,
    BOARD_ROWS,
    BOARD_COLS,
    isColOpen,
} from "../../lib/connect4-utilities.ts"
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
        this.gameContext.changeState(new WaitingState(this.gameContext))
    }

    removePlayer(player: Player): void {
        //Do nothing
    }

    dropDisc(colIndex: number, isFirstPlayerDisc: boolean) {
        //Do nothing
    }

    startNewGame(isSeries: boolean): void {
        this.gameContext.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        //player1 goes first if starting from an inactive state
        this.gameContext.isPlayer1First = true
        this.gameContext.isPlayer1Turn = true
        this.gameContext.turnTimer.reset()
    }

    toString(): string {
        return "inactive"
    }
}
