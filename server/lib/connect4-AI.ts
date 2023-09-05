import { Board, Difficulty } from "@/types"
import {
    getLastMove,
    getWinningSpaces,
    isBoardFull,
    getEmptyBoard,
    getTotalDiscs,
    getNumOpenCols,
} from "@/lib/connect4-utilities"

//consective spaces on board
//adds string type to check for out of bounds spaces
type Line = (boolean | null | string)[]

type Move = [Board, number]

//AI accepts 3 difficulty settings and chooses from
//the top ranked moves given by a minimax algorithm (up to top 3)
//the frequecy of sub-optimal moves increases as more moves are made
//which replicates the feeling of a human making more mistakes
//in more complex situations
//difficulty should be 'easy', 'medium', or 'hard'
export function getAIMove(board: Board, difficulty: Difficulty): number {
    //search depth greater than 4 leads to noticeable performance drops
    //but depth of 4 is an adequate challenge for the average human player
    const DEPTH = 4
    const TOTAL_SPACES = 42
    //adjusts how quickly the AI will start to choose worse moves
    const EASY_SUB_OPTIMAL_CHOICE_VELOCITY = 24
    const MEDIUM_SUB_OPTIMAL_CHOICE_VELOCITY = 18
    const HARD_SUB_OPTIMAL_CHOICE_VELOCITY = 15

    //limited to either the number of valid moves or 3
    //whichever is less
    const numMovesToChooseFrom =
        getNumOpenCols(board) < 3 ? getNumOpenCols(board) : 3

    let bestMoves: Move[] = []

    let chosenMove = undefined

    let weights: number[] = []

    //array of child positions and their associated eval scores
    //limited to best positions by score
    for (let i = 0; i < numMovesToChooseFrom; i += 1) {
        const move: Move = [getEmptyBoard(6, 7), Number.POSITIVE_INFINITY]
        bestMoves.push(move)
    }

    //use different weights array based upon number of best moves
    if (bestMoves.length === 3) {
        weights = [0.5, 0.4, 0.1]
    } else if (bestMoves.length === 2) {
        weights = [0.5, 0.5]
    } else {
        weights = [1]
    }

    //add best moves to array by analyzing child positions
    getChildPositions(board, false).forEach((childPos) => {
        let score = minimax(childPos, DEPTH, true)

        //compare score to scores of best positions so far
        for (let i = 0; i < bestMoves.length; i++) {
            if (score < bestMoves[i][1]) {
                bestMoves.splice(i, 0, [childPos, score]) //add position to best 3 moves
                bestMoves.pop() //get rid of the extraneous position
                break //only want to replace one score
            }
        }
    })

    let remainingOpenSpaces = TOTAL_SPACES - getTotalDiscs(board)
    //check for 0 in case board is full, don't want to divide by 0
    remainingOpenSpaces = remainingOpenSpaces === 0 ? 1 : remainingOpenSpaces
    const boardComplexity = 1 / remainingOpenSpaces

    //select constant based upon difficulty
    let difficultyAdjustment = EASY_SUB_OPTIMAL_CHOICE_VELOCITY
    if (difficulty === "medium")
        difficultyAdjustment = MEDIUM_SUB_OPTIMAL_CHOICE_VELOCITY
    if (difficulty === "hard")
        difficultyAdjustment = HARD_SUB_OPTIMAL_CHOICE_VELOCITY

    const randIndex = chooseIndex(
        weights,
        boardComplexity,
        difficultyAdjustment
    )

    chosenMove = getLastMove(board, bestMoves[randIndex][0])

    return chosenMove
}

//picks a random index from array of weights
//also takes into account the board complexity,
//which increases as the game goes along,
//and a constant adjusting how quickly sub optimal moves
//will tend to be chosen
//index ranges from 0 inclusive to weights.length exclusive
//basic algorithm from:
//https://stackoverflow.com/a/8435261/20048656
function chooseIndex(
    weights: number[],
    boardComplexity: number,
    subOptimalAdj: number
) {
    let sum = 0
    let adjustedRandNum = Math.random() * boardComplexity * subOptimalAdj
    adjustedRandNum = adjustedRandNum > 1 ? 1 : adjustedRandNum

    for (let i = 0; i < weights.length; i += 1) {
        sum += weights[i]
        if (adjustedRandNum <= sum) {
            return i
        }
    }

    return 0
}

//function returns max score it can find assuming other player is also
//playing perfectly
function minimax(
    board: Board,
    depth: number,
    isMaximizingPlayer: boolean
): number {
    //base case
    const gameOver = getWinningSpaces(board).length !== 0 || isBoardFull(board)
    if (depth === 0 || gameOver) {
        const finalEval = getEvaluation(board)
        //console.log('final eval: ', finalEval)
        return finalEval
    }

    if (isMaximizingPlayer) {
        let maxEval = Number.NEGATIVE_INFINITY
        getChildPositions(board, true).forEach((childPos) => {
            const currEval = minimax(childPos, depth - 1, false)
            maxEval = Math.max(maxEval, currEval)
        })
        return maxEval
    } else {
        let minEval = Number.POSITIVE_INFINITY
        //console.log('board pre-child position: ', board)
        getChildPositions(board, false).forEach((childPos) => {
            //console.log('child pos: ', childPos)
            const currEval = minimax(childPos, depth - 1, true)
            minEval = Math.min(minEval, currEval)
        })
        return minEval
    }
}

//returns an evaluation score total based upon board position
//evaluates positive for player that goes first and negative for second
function getEvaluation(board: Board): number {
    //score settings
    const centerColScore = 4
    const lineOf2Score = 2
    const lineOf3Score = 5
    const winScore = 100000 //arbitrarily large to make other scoring irrelevant
    const oppCenterColScore = -4
    const oppLineOf2Score = -6
    const oppLineOf3Score = -100
    const oppWinScore = -100000

    let evalScore = 0

    //Win?
    const winningSpaces = getWinningSpaces(board)
    //use indices from winning slots
    const winningPlayer =
        winningSpaces.length > 0
            ? board[winningSpaces[0][0]][winningSpaces[0][1]]
            : null
    //update score and return immediately (no need to do anymore evaluation)
    if (winningSpaces.length !== 0) {
        if (winningPlayer) {
            evalScore += winScore
        } else {
            evalScore += oppWinScore
        }
        return evalScore
    }

    //check center column for player 1 discs
    const player1DiscsInCenter = board[3].reduce((occurences, curr) => {
        return curr ? occurences + 1 : occurences + 0
    }, 0)

    //check center column for player 2 discs
    const player2DiscsInCenter = board[3].reduce((occurences, curr) => {
        return curr === false ? occurences + 1 : occurences + 0
    }, 0)

    //discs in center column?
    evalScore += player1DiscsInCenter * centerColScore

    //lines of 2?
    evalScore += getNumLinesOf2(board, true) * lineOf2Score

    //lines of 3?
    evalScore += getNumLinesOf3(board, true) * lineOf3Score

    //opp disc in center column?
    evalScore += player2DiscsInCenter * oppCenterColScore

    //opp line of two?
    evalScore += getNumLinesOf2(board, false) * oppLineOf2Score

    //opp line of three?
    evalScore += getNumLinesOf3(board, false) * oppLineOf3Score

    //return final eval score
    return evalScore
}

//returns the number of lines of 2 (used for position evaluation)
//TODO: it's possible that I made this function more complex than it needs to be, review it
//internal canMakeWinningLine function also has side effect (duplicatedLinesCount)
//which is pretty ugly
function getNumLinesOf2(board: Board, player: boolean) {
    let linesOf2 = []
    const width = board.length
    const height = board[0].length
    let duplicatedLinesCount = 0 //see canMakeWiningLine function

    //testing functions
    const isExactly2PlayerDiscs = (line: Line) => {
        const numOfMatchingDiscs = line.reduce((accum, curr) => {
            return curr === player ? accum + 1 : accum + 0
        }, 0)

        return numOfMatchingDiscs === 2
    }

    const isOnlyEmptyBetweenDiscs = (line: Line) => {
        for (let i = 1; i < line.length; i++) {
            if (line[i] === player) {
                return true
            } else if (line[i] === !player) {
                return false
            }
        }
        return false //shouldn't get here because 2 discs should be guaranteed
    }

    const isNotLineOf3 = (line: Line, contextSlots: Line) => {
        if (line[3] === player) {
            return true
        } else if (line[2] === player) {
            return contextSlots[0] !== player //if first context slot is anything but the player return true
        } else if (line[1] === player) {
            return contextSlots[0] !== player && contextSlots[1] !== player //same but with both context slots
        }

        return false //shouldn't get here
    }

    const canMakeWinningLine = (line: Line, contextSlots: Line) => {
        if (line[3] === player) {
            //this is used later to account for lines that follow the [t, _, _, t] pattern
            //these lines should only be counted once so this number will be divided by two
            //and subtracted from the total
            //not elegant but would probably have to change the whole algoritm to be able to identify unique
            //lines based on indices and prevent double counting that way
            duplicatedLinesCount += 1
            return true //because in between slots are guaranteed to be empty
        } else if (line[2] === player) {
            return line[3] === null || contextSlots[0] === null //only need one of these slots to be empty
        } else if (line[1] === player) {
            //only need to test following slots and not preceding because lines are generated in all directions and I don't want the
            //same line counted twice unless it can make two distinct lines of 4
            const isBothFollowingEmpty = line[2] === null && line[3] === null
            const isOneLeftAndOneRightEmpty =
                line[2] === null && contextSlots[0] === null

            return isBothFollowingEmpty || isOneLeftAndOneRightEmpty
        }

        return false //shouldn't make it here
    }

    //verification function that combines all the testing functions
    const isLineOf2 = (line: Line, contextSlots: Line) => {
        return (
            isExactly2PlayerDiscs(line) &&
            isOnlyEmptyBetweenDiscs(line) &&
            isNotLineOf3(line, contextSlots) &&
            canMakeWinningLine(line, contextSlots)
        )
    }

    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {
            const slot = board[row][col]

            if (slot === player) {
                //look right
                let lineToCheck = [
                    slot,
                    row + 1 < 7 ? board[row + 1][col] : "out of bounds",
                    row + 2 < 7 ? board[row + 2][col] : "out of bounds",
                    row + 3 < 7 ? board[row + 3][col] : "out of bounds",
                ]

                let contextSlots = [
                    row - 1 >= 0 ? board[row - 1][col] : "out of bounds",
                    row - 2 >= 0 ? board[row - 2][col] : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look up
                lineToCheck = [
                    slot,
                    col + 1 < 6 ? board[row][col + 1] : "out of bounds",
                    col + 2 < 6 ? board[row][col + 2] : "out of bounds",
                    col + 3 < 6 ? board[row][col + 3] : "out of bounds",
                ]

                contextSlots = [
                    col - 1 >= 0 ? board[row][col - 1] : "out of bounds",
                    col - 2 >= 0 ? board[row][col - 2] : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 ? board[row - 1][col] : "out of bounds",
                    row - 2 >= 0 ? board[row - 2][col] : "out of bounds",
                    row - 3 >= 0 ? board[row - 3][col] : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 ? board[row + 1][col] : "out of bounds",
                    row + 2 < 7 ? board[row + 2][col] : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look down
                lineToCheck = [
                    slot,
                    col - 1 >= 0 ? board[row][col - 1] : "out of bounds",
                    col - 2 >= 0 ? board[row][col - 2] : "out of bounds",
                    col - 3 >= 0 ? board[row][col - 3] : "out of bounds",
                ]

                contextSlots = [
                    col + 1 < 6 ? board[row][col + 1] : "out of bounds",
                    col + 2 < 6 ? board[row][col + 2] : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look up & right
                lineToCheck = [
                    slot,
                    row + 1 < 7 && col + 1 < 6
                        ? board[row + 1][col + 1]
                        : "out of bounds",
                    row + 2 < 7 && col + 2 < 6
                        ? board[row + 2][col + 2]
                        : "out of bounds",
                    row + 3 < 7 && col + 3 < 6
                        ? board[row + 3][col + 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row - 1 >= 0 && col - 1 >= 0
                        ? board[row - 1][col - 1]
                        : "out of bounds",
                    row - 2 >= 0 && col - 2 >= 0
                        ? board[row - 2][col - 2]
                        : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look up & left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 && col + 1 < 6
                        ? board[row - 1][col + 1]
                        : "out of bounds",
                    row - 2 >= 0 && col + 2 < 6
                        ? board[row - 2][col + 2]
                        : "out of bounds",
                    row - 3 >= 0 && col + 3 < 6
                        ? board[row - 3][col + 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 && col - 1 >= 0
                        ? board[row + 1][col - 1]
                        : "out of bounds",
                    row + 2 < 7 && col - 2 >= 0
                        ? board[row + 2][col - 2]
                        : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look down & left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 && col - 1 >= 0
                        ? board[row - 1][col - 1]
                        : "out of bounds",
                    row - 2 >= 0 && col - 2 >= 0
                        ? board[row - 2][col - 2]
                        : "out of bounds",
                    row - 3 >= 0 && col - 3 >= 0
                        ? board[row - 3][col - 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 && col + 1 < 6
                        ? board[row + 1][col + 1]
                        : "out of bounds",
                    row + 2 < 7 && col + 2 < 6
                        ? board[row + 2][col + 2]
                        : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }

                //look down & right
                lineToCheck = [
                    slot,
                    row + 1 < 7 && col - 1 >= 0
                        ? board[row + 1][col - 1]
                        : "out of bounds",
                    row + 2 < 7 && col - 2 >= 0
                        ? board[row + 2][col - 2]
                        : "out of bounds",
                    row + 3 < 7 && col - 3 >= 0
                        ? board[row + 3][col - 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row - 1 >= 0 && col + 1 < 6
                        ? board[row - 1][col + 1]
                        : "out of bounds",
                    row - 2 >= 0 && col + 2 < 6
                        ? board[row - 2][col + 2]
                        : "out of bounds",
                ]

                if (isLineOf2(lineToCheck, contextSlots)) {
                    linesOf2.push(lineToCheck)
                }
            }
        }
    }

    return linesOf2.length - duplicatedLinesCount / 2
}

//return the number of lines of 3
//(used for position evaluation)
function getNumLinesOf3(board: Board, player: boolean) {
    let linesOf3 = []
    const width = board.length
    const height = board[0].length
    let duplicatedLinesCount = 0

    //testing functions
    const isExactly3PlayerDiscs = (line: Line) => {
        const numOfMatchingDiscs = line.reduce((accum, curr) => {
            return curr === player ? accum + 1 : accum + 0
        }, 0)

        return numOfMatchingDiscs === 3
    }

    const isEmptySpaceInLine = (line: Line) => {
        //verified if at least 1 space is a null (empty)
        return line.some((space) => space === null)
    }

    //function that combines testing functions
    const isLineOf3 = (line: Line) => {
        return isExactly3PlayerDiscs(line) && isEmptySpaceInLine(line)
    }

    //looks for two specific patterns that get double counted and need to be only single counted
    const isDuplicatedLine = (line: Line) => {
        return line[1] === null || line[2] === null
    }

    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {
            let slot = board[row][col]

            if (slot === player) {
                //look right
                let lineToCheck = [
                    slot,
                    row + 1 < 7 ? board[row + 1][col] : "out of bounds",
                    row + 2 < 7 ? board[row + 2][col] : "out of bounds",
                    row + 3 < 7 ? board[row + 3][col] : "out of bounds",
                ]

                let contextSlots = [
                    row - 1 >= 0 ? board[row - 1][col] : "out of bounds",
                    row - 2 >= 0 ? board[row - 2][col] : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look up
                lineToCheck = [
                    slot,
                    col + 1 < 6 ? board[row][col + 1] : "out of bounds",
                    col + 2 < 6 ? board[row][col + 2] : "out of bounds",
                    col + 3 < 6 ? board[row][col + 3] : "out of bounds",
                ]

                contextSlots = [
                    col - 1 >= 0 ? board[row][col - 1] : "out of bounds",
                    col - 2 >= 0 ? board[row][col - 2] : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 ? board[row - 1][col] : "out of bounds",
                    row - 2 >= 0 ? board[row - 2][col] : "out of bounds",
                    row - 3 >= 0 ? board[row - 3][col] : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 ? board[row + 1][col] : "out of bounds",
                    row + 2 < 7 ? board[row + 2][col] : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look down
                lineToCheck = [
                    slot,
                    col - 1 >= 0 ? board[row][col - 1] : "out of bounds",
                    col - 2 >= 0 ? board[row][col - 2] : "out of bounds",
                    col - 3 >= 0 ? board[row][col - 3] : "out of bounds",
                ]

                contextSlots = [
                    col + 1 < 6 ? board[row][col + 1] : "out of bounds",
                    col + 2 < 6 ? board[row][col + 2] : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look up & right
                lineToCheck = [
                    slot,
                    row + 1 < 7 && col + 1 < 6
                        ? board[row + 1][col + 1]
                        : "out of bounds",
                    row + 2 < 7 && col + 2 < 6
                        ? board[row + 2][col + 2]
                        : "out of bounds",
                    row + 3 < 7 && col + 3 < 6
                        ? board[row + 3][col + 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row - 1 >= 0 && col - 1 >= 0
                        ? board[row - 1][col - 1]
                        : "out of bounds",
                    row - 2 >= 0 && col - 2 >= 0
                        ? board[row - 2][col - 2]
                        : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look up & left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 && col + 1 < 6
                        ? board[row - 1][col + 1]
                        : "out of bounds",
                    row - 2 >= 0 && col + 2 < 6
                        ? board[row - 2][col + 2]
                        : "out of bounds",
                    row - 3 >= 0 && col + 3 < 6
                        ? board[row - 3][col + 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 && col - 1 >= 0
                        ? board[row + 1][col - 1]
                        : "out of bounds",
                    row + 2 < 7 && col - 2 >= 0
                        ? board[row + 2][col - 2]
                        : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look down & left
                lineToCheck = [
                    slot,
                    row - 1 >= 0 && col - 1 >= 0
                        ? board[row - 1][col - 1]
                        : "out of bounds",
                    row - 2 >= 0 && col - 2 >= 0
                        ? board[row - 2][col - 2]
                        : "out of bounds",
                    row - 3 >= 0 && col - 3 >= 0
                        ? board[row - 3][col - 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row + 1 < 7 && col + 1 < 6
                        ? board[row + 1][col + 1]
                        : "out of bounds",
                    row + 2 < 7 && col + 2 < 6
                        ? board[row + 2][col + 2]
                        : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }

                //look down & right
                lineToCheck = [
                    slot,
                    row + 1 < 7 && col - 1 >= 0
                        ? board[row + 1][col - 1]
                        : "out of bounds",
                    row + 2 < 7 && col - 2 >= 0
                        ? board[row + 2][col - 2]
                        : "out of bounds",
                    row + 3 < 7 && col - 3 >= 0
                        ? board[row + 3][col - 3]
                        : "out of bounds",
                ]

                contextSlots = [
                    row - 1 >= 0 && col + 1 < 6
                        ? board[row - 1][col + 1]
                        : "out of bounds",
                    row - 2 >= 0 && col + 2 < 6
                        ? board[row - 2][col + 2]
                        : "out of bounds",
                ]

                if (isLineOf3(lineToCheck)) {
                    linesOf3.push(lineToCheck)
                    duplicatedLinesCount = isDuplicatedLine(lineToCheck)
                        ? duplicatedLinesCount + 1
                        : duplicatedLinesCount
                }
            }
        }
    }

    return linesOf3.length - duplicatedLinesCount / 2
}

//returns every single possible next board from the current board position
function getChildPositions(board: Board, isMaximizingPlayer: boolean) {
    let childPositions = []

    //for each column
    for (let i = 0; i < board.length; i += 1) {
        //if column isn't full
        if (board[i][board[i].length - 1] === null) {
            //update board with disc in that column
            const childBoard = board.map((col, colIndex) => {
                //find first space in that column that is empty
                const isNull = (element: boolean | null) => element === null
                const firstNullIndex = col.findIndex(isNull)

                return colIndex === i
                    ? col.map((space, spaceIndex) => {
                          return spaceIndex === firstNullIndex
                              ? isMaximizingPlayer
                              : space
                      })
                    : col
            })

            //add new board into child positions
            childPositions.push(childBoard)
        }
    }

    return childPositions
}
