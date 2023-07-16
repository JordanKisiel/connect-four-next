import {
    getEmptyBoard,
    getWinningSpaces,
    isBoardFull,
} from "../lib/connect4-utilities.ts"
import { Board } from "../types.ts"

const BOARD_ROWS = 6
const BOARD_COLS = 7
const CENTER_COL = 3

export class Game {
    player1: string
    player2: string
    board: Board
    selectedCol: number
    isPlayer1Turn: boolean
    isPlayer1First: boolean
    isGameOver: boolean

    constructor(player1: string, player2: string) {
        this.player1 = player1
        this.player2 = player2

        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        this.selectedCol = CENTER_COL

        this.isPlayer1Turn = true
        //who goes first alternates with each game
        this.isPlayer1First = true

        this.isGameOver = false
    }

    //increment or decrement selectedCol index
    //based on direction
    selectNewCol(isMoveToLeft: boolean) {
        const prevCol = this.selectedCol
        if (isMoveToLeft) {
            this.selectedCol = prevCol > 0 ? prevCol - 1 : 0
        } else {
            this.selectedCol = prevCol < BOARD_COLS - 1 ? prevCol + 1 : 6
        }
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
            this.isGameOver = true
        } else {
            //otherwise play continues so change player turn
            this.isPlayer1Turn = !this.isPlayer1Turn
        }

        //reset selected col to center col after move
        this.selectedCol = CENTER_COL
    }

    //sets up a new game if the players choose to play again
    startNewGame() {
        this.board = getEmptyBoard(BOARD_ROWS, BOARD_COLS)
        this.selectedCol = CENTER_COL
        //player that makes the first move of the new
        //game is the player who went second in the previous
        this.isPlayer1First = !this.isPlayer1First
        this.isPlayer1Turn = this.isPlayer1First

        this.isGameOver = false
    }
}
