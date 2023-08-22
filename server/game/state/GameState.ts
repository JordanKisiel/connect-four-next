import { GameContext } from "../GameContext.ts"
import { Player } from "@/player.ts"

export interface GameState {
    gameContext: GameContext
    addPlayer(player: Player): void
    removePlayer(player: Player): void
    dropDisc(colIndex: number, isFirstPlayerDisc: boolean): void
    startNewGame(isSeries: boolean): void
    toString(): string
}
