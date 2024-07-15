import { expect, test } from "vitest"
import {
    isBoardFull,
    isBoardEmpty,
    getEmptyBoard,
    getTotalDiscs,
    getNumOpenCols,
    isColOpen,
    getDiscsInColumn,
    isConsecutivePositions,
    getLastMove,
    getWinningSpaces,
    isWinner,
} from "@/lib/connect4-utilities"

const NUM_ROWS = 6
const NUM_COLS = 7

function createAndFillBoard(rows: number, cols: number, value: boolean | null) {
    const a: (boolean | null)[][] = []
    for (let i = 0; i < cols; i += 1) {
        a[i] = []
        for (let j = 0; j < rows; j += 1) {
            a[i][j] = value
        }
    }

    return a
}

//----------------------------------------------------------------

test("isBoardFull: All spaces empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(isBoardFull(board)).toBe(false)
})

test("isBoardFull: All spaces true", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    expect(isBoardFull(board)).toBe(true)
})

test("isBoardFull: All spaces false", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, false)

    expect(isBoardFull(board)).toBe(true)
})

test("isBoardFull: Only first space empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)
    board[0][0] = null

    expect(isBoardFull(board)).toBe(false)
})

test("isBoardFull: Only last space empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, false)
    board[board.length - 1][board[0].length - 1] = null

    expect(isBoardFull(board)).toBe(false)
})

//---------------------------------------------------------------------

test("isBoardEmpty: All spaces empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(isBoardEmpty(board)).toBe(true)
})

test("isBoardEmpty: All spaces true", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    expect(isBoardEmpty(board)).toBe(false)
})

test("isBoardEmpty: All spaces false", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, false)

    expect(isBoardEmpty(board)).toBe(false)
})

test("isBoardEmpty: First space only filled", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    board[0][0] = true

    expect(isBoardEmpty(board)).toBe(false)
})

test("isBoardEmpty: Last space only filled", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    board[board.length - 1][board[0].length - 1] = false

    expect(isBoardEmpty(board)).toBe(false)
})

//-----------------------------------------------------------

test("getEmptyBoard: board is empty", () => {
    const board = getEmptyBoard(NUM_ROWS, NUM_COLS)

    expect(isBoardEmpty(board)).toBe(true)
})

test("getEmptyBoard: board is correct num of spaces", () => {
    const board = getEmptyBoard(NUM_ROWS, NUM_COLS)
    const numSpaces = NUM_ROWS * NUM_COLS

    let count = 0
    for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board[i].length; j += 1) {
            count += 1
        }
    }

    expect(count === numSpaces).toBe(true)
})

//----------------------------------------------------------------

test("getTotalDiscs: 0 discs", () => {
    const board = getEmptyBoard(NUM_ROWS, NUM_COLS)

    expect(getTotalDiscs(board)).toBe(0)
})

test("getTotalDiscs: full board", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)
    const numSpaces = NUM_ROWS * NUM_COLS

    expect(getTotalDiscs(board)).toBe(numSpaces)
})

test("getTotalDiscs: 1 disc", () => {
    const board = getEmptyBoard(NUM_ROWS, NUM_COLS)

    board[0][0] = false

    expect(getTotalDiscs(board)).toBe(1)
})

test("getTotalDiscs: full board minus one", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)
    const numSpaces = NUM_ROWS * NUM_COLS

    board[board.length - 1][board[0].length - 1] = null

    expect(getTotalDiscs(board)).toBe(numSpaces - 1)
})

//-------------------------------------------------------------------

test("getNumOpenCols: all cols open", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(getNumOpenCols(board)).toBe(NUM_COLS)
})

test("getNumOpenCols: no cols open", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    expect(getNumOpenCols(board)).toBe(0)
})

test("getNumOpenCols: one col open", () => {
    let board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    board = board.map((col, index) => {
        if (index === 3) {
            return Array(NUM_ROWS).fill(null)
        }
        return col
    })

    expect(getNumOpenCols(board)).toBe(1)
})

//----------------------------------------------------------------

test("isColOpen: all spaces full", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    expect(isColOpen(board, 0)).toBe(false)
})

test("isColOpen: all spaces empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(isColOpen(board, NUM_COLS - 1)).toBe(true)
})

test("isColOpen: one empty space", () => {
    let board = createAndFillBoard(NUM_ROWS, NUM_COLS, false)

    board = board.map((col, index) => {
        if (index === 3) {
            return col.map((row, index) => {
                if (index === NUM_ROWS - 1) {
                    return null
                }
                return row
            })
        }
        return col
    })

    expect(isColOpen(board, 3)).toBe(true)
})

//----------------------------------------------------------------

test("getDiscsInColumn: all spaces full", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, true)

    expect(getDiscsInColumn(board, 0)).toBe(NUM_ROWS)
})

test("getDiscsInColumn: all spaces empty", () => {
    const board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(getDiscsInColumn(board, NUM_COLS - 1)).toBe(0)
})

test("getDiscsInColumn: one filled space", () => {
    let board = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    board = board.map((col, index) => {
        if (index === 3) {
            return col.map((row, index) => {
                if (index === 0) {
                    return true
                }
                return row
            })
        }
        return col
    })

    expect(getDiscsInColumn(board, 3)).toBe(1)
})

//----------------------------------------------------------------

test("isConsecutivePositions: two consecutive boards - zero and one disc", () => {
    const prevBoard = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    const currBoard = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isConsecutivePositions(prevBoard, currBoard)).toBe(true)
})

test("isConsecutivePositions: two consecutive boards - almost full and full", () => {
    const prevBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    const currBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
    ]

    expect(isConsecutivePositions(prevBoard, currBoard)).toBe(true)
})

test("isConsecutivePositions: non-consecutive - more than one difference", () => {
    const prevBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    const currBoard = [
        [false, false, false, false, true, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
    ]

    expect(isConsecutivePositions(prevBoard, currBoard)).toBe(false)
})

test("isConsecutivePositions: non-consecutive - same board positions", () => {
    const prevBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    const currBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    expect(isConsecutivePositions(prevBoard, currBoard)).toBe(false)
})

test("isConsecutivePositions: non-consecutive - one difference, equal discs", () => {
    const prevBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [true, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    const currBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    expect(isConsecutivePositions(prevBoard, currBoard)).toBe(false)
})

//----------------------------------------------------------------

test("getLastMove: last index", () => {
    const prevBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, null, null],
    ]

    const currBoard = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    expect(getLastMove(prevBoard, currBoard)).toBe(6)
})

test("getLastMove: first index", () => {
    const prevBoard = [
        [false, false, false, false, null, null],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    const currBoard = [
        [false, false, false, false, false, null],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, null],
    ]

    expect(getLastMove(prevBoard, currBoard)).toBe(0)
})

test("getLastMove: first move", () => {
    const prevBoard = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    const currBoard = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getLastMove(prevBoard, currBoard)).toBe(3)
})

test("getLastMove: last possible move", () => {
    const prevBoard = [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, null],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
    ]

    const currBoard = [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
    ]

    expect(getLastMove(prevBoard, currBoard)).toBe(3)
})

//----------------------------------------------------------------

test("getWinningSpaces: empty board", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([])
})

test("getWinningSpaces: diagonal winner - top left", () => {
    const board = [
        [true, null, null, null, null, null],
        [null, true, null, null, null, null],
        [null, null, true, null, null, null],
        [null, null, null, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
    ])
})

test("getWinningSpaces: diagonal winner - top right", () => {
    const board = [
        [true, null, null, null, null, false],
        [null, true, null, null, false, null],
        [null, null, true, false, null, null],
        [null, null, false, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 5],
        [1, 4],
        [2, 3],
        [3, 2],
    ])
})

test("getWinningSpaces: diagonal winner - bottom left", () => {
    const board = [
        [true, null, null, null, null, false],
        [null, true, null, null, false, null],
        [null, null, null, false, null, null],
        [null, null, null, true, null, null],
        [null, null, true, null, null, null],
        [null, true, null, null, null, null],
        [true, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [3, 3],
        [4, 2],
        [5, 1],
        [6, 0],
    ])
})

test("getWinningSpaces: diagonal winner - bottom right", () => {
    const board = [
        [true, null, null, null, null, false],
        [null, true, null, null, false, null],
        [null, null, null, true, null, null],
        [null, null, false, false, null, null],
        [null, null, true, false, null, null],
        [null, true, null, null, false, null],
        [true, null, null, null, null, false],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [3, 2],
        [4, 3],
        [5, 4],
        [6, 5],
    ])
})

test("getWinningSpaces: horizontal winner - top left", () => {
    const board = [
        [true, true, true, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
    ])
})

test("getWinningSpaces: horizontal winner - top right", () => {
    const board = [
        [false, false, true, true, true, true],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
    ])
})

test("getWinningSpaces: horizontal winner - bottom left", () => {
    const board = [
        [false, false, true, true, true, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, true, true, true, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
    ])
})

test("getWinningSpaces: horizontal winner - bottom right", () => {
    const board = [
        [false, false, true, true, true, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, true, false, false, false, false],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 5],
    ])
})

test("getWinningSpaces: vertical winner - top left", () => {
    const board = [
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
    ])
})

test("getWinningSpaces: vertical winner - top right", () => {
    const board = [
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [null, null, null, null, null, false],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
    ])
})

test("getWinningSpaces: vertical winner - bottom left", () => {
    const board = [
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [false, null, null, null, null, null],
        [false, null, null, null, null, null],
        [false, null, null, null, null, null],
        [false, null, null, null, null, null],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
    ])
})

test("getWinningSpaces: vertical winner - bottom right", () => {
    const board = [
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [true, null, null, null, null, false],
        [null, null, null, null, null, true],
        [false, null, null, null, null, true],
        [false, null, null, null, null, true],
        [false, null, null, null, null, true],
    ]

    expect(getWinningSpaces(board)).toStrictEqual([
        [3, 5],
        [4, 5],
        [5, 5],
        [6, 5],
    ])
})

//----------------------------------------------------------------

test("isWinner: isPlayer1 & empty board", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(true, board)).toBe(false)
})

test("isWinner: !isPlayer1 & empty board", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(false, board)).toBe(false)
})

test("isWinner: isPlayer1 & player1 wins", () => {
    const board = [
        [true, null, null, null, null, null],
        [null, true, null, null, null, null],
        [null, null, true, null, null, null],
        [null, null, null, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(true, board)).toBe(true)
})

test("isWinner: isPlayer1 & player2 wins", () => {
    const board = [
        [false, null, null, null, null, null],
        [false, true, null, null, null, null],
        [false, null, true, null, null, null],
        [false, null, null, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(true, board)).toBe(false)
})

test("isWinner: !isPlayer1 & player2 wins", () => {
    const board = [
        [false, null, null, null, null, null],
        [false, true, null, null, null, null],
        [false, null, true, null, null, null],
        [false, null, null, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(false, board)).toBe(true)
})

test("isWinner: !isPlayer1 & player1 wins", () => {
    const board = [
        [false, null, null, null, null, null],
        [false, true, null, null, null, null],
        [false, null, true, null, null, null],
        [null, null, null, true, null, null],
        [null, null, null, null, true, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(isWinner(false, board)).toBe(false)
})
