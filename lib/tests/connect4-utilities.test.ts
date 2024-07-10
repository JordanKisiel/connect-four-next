import { expect, test } from "vitest"
import {
    isBoardFull,
    isBoardEmpty,
    getEmptyBoard,
    getTotalDiscs,
    getNumOpenCols,
    isColOpen,
    getDiscsInColumn,
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
