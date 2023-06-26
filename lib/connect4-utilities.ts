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
