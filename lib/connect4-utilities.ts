import { Board } from "../types.ts"

export const BOARD_ROWS = 6
export const BOARD_COLS = 7

//if a winning line is found
//returns array of coordinates of the 4 winning spaces
//otherwise returns an empty array
//this can also be used to detect if there's a win by using the length of the resulting array
//basic algoritm from:
//https://codereview.stackexchange.com/a/127105

export function getWinningSpaces(board: Board): number[][] | [] {
    const height = board[0].length
    const width = board.length
    const emptySpace = null

    for (let row = 0; row < width; row += 1) {
        for (let col = 0; col < height; col += 1) {
            let space = board[row][col]

            //skip this loop iteration to
            //avoid starting a check from an empty space
            if (space === emptySpace) {
                continue
            }

            //from each non-empty space
            //check right, up, up & right, up & left for winning lines
            //only have to check 4 directions because we're starting from the bottom left
            //and going to upper right (checking the other 4 directions would be redundant)
            //also do bounds checking
            if (
                col + 3 < height &&
                space === board[row][col + 1] && //look right
                space === board[row][col + 2] &&
                space === board[row][col + 3]
            ) {
                return [
                    [row, col],
                    [row, col + 1],
                    [row, col + 2],
                    [row, col + 3],
                ]
            }

            //bounds check for up
            if (row + 3 < width) {
                if (
                    space === board[row + 1][col] && //look up
                    space === board[row + 2][col] &&
                    space === board[row + 3][col]
                ) {
                    return [
                        [row, col],
                        [row + 1, col],
                        [row + 2, col],
                        [row + 3, col],
                    ]
                }

                if (
                    col + 3 < height &&
                    space === board[row + 1][col + 1] && //look up & right
                    space === board[row + 2][col + 2] &&
                    space === board[row + 3][col + 3]
                ) {
                    return [
                        [row, col],
                        [row + 1, col + 1],
                        [row + 2, col + 2],
                        [row + 3, col + 3],
                    ]
                }

                if (
                    col - 3 >= 0 &&
                    space === board[row + 1][col - 1] && //look up & left
                    space === board[row + 2][col - 2] &&
                    space === board[row + 3][col - 3]
                ) {
                    return [
                        [row, col],
                        [row + 1, col - 1],
                        [row + 2, col - 2],
                        [row + 3, col - 3],
                    ]
                }
            }
        }
    }

    return [] //if no winning line, return empty array
}

//returns boolean indicating whether the given player has won the game
//given the board position
//player is specified by boolean indicating status as player 1 or not
export function isWinner(isPlayer1: boolean, board: Board) {
    const winningSpaces = getWinningSpaces(board)

    if (winningSpaces.length > 0) {
        const [xCoord, yCoord] = winningSpaces[0]
        if (isPlayer1 && board[xCoord][yCoord]) {
            return true
        } else if (!isPlayer1 && !board[xCoord][yCoord]) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

//iterate through each space on the board
//if any are null (representing an empty space)
//then board is not full
export function isBoardFull(board: Board): boolean {
    for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === null) {
                return false
            }
        }
    }

    return true
}

//check every space and return true only if there are only empty spaces
export function isBoardEmpty(board: Board): boolean {
    let isEmpty = true
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] !== null) {
                isEmpty = false
            }
        }
    }

    return isEmpty
}

//compares two consecutive board positions after a move
//the column with non-equal number of discs is the last move that occured
//will NOT work properly with two non-consecutive positons
//TODO: guard against non-consecutive positions
export function getLastMove(prevBoard: Board, currBoard: Board) {
    let lastMove = 0
    for (let i = 0; i < prevBoard.length; i++) {
        const prevNumOfDiscs = prevBoard[i].reduce((accum, curr) => {
            return curr !== null ? accum + 1 : accum + 0
        }, 0)

        const currNumOfDiscs = currBoard[i].reduce((accum, curr) => {
            return curr !== null ? accum + 1 : accum + 0
        }, 0)

        if (prevNumOfDiscs !== currNumOfDiscs) {
            lastMove = i
        }
    }

    return lastMove
}

export function getEmptyBoard(rows: number, cols: number): Board {
    return Array(cols).fill(Array(rows).fill(null))
}

//gets sum of discs played by both players so far
export function getTotalDiscs(board: Board): number {
    let totalDiscs = 0

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] !== null) {
                totalDiscs += 1
            }
        }
    }

    return totalDiscs
}

export function getNumOpenCols(board: Board): number {
    let openCols = 0

    for (let row = 0; row < board.length; row += 1) {
        const lastIndex = board[row].length - 1
        if (board[row][lastIndex] === null) {
            openCols += 1
        }
    }

    return openCols
}

//return a boolean indicating if the given column has
//an empty space availabe in the given board position
export function isColOpen(board: Board, selectedCol: number) {
    return board[selectedCol].some((slot) => slot === null)
}

//return the number of discs already played in a given column
export function getDiscsInColumn(board: Board, colIndex: number) {
    let numDiscs = 0

    for (let i = 0; i < board[colIndex].length; i += 1) {
        if (board[colIndex][i] !== null) {
            numDiscs += 1
        }
    }

    return numDiscs
}
