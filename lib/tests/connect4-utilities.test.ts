import { expect, test } from "vitest"
import { isBoardFull } from "@/lib/connect4-utilities"

const NUM_ROWS = 6
const NUM_COLS = 7

function createAndFillBoard(rows: number, cols: number, value: boolean | null) {
    const a: (boolean | null)[][] = []
    for (let i = 0; i < rows; i += 1) {
        a[i] = []
        for (let j = 0; j < cols; j += 1) {
            a[i][j] = value
        }
    }

    return a
}

test("isBoardFull: All spaces empty", () => {
    const emptyBoard = createAndFillBoard(NUM_ROWS, NUM_COLS, null)

    expect(isBoardFull(emptyBoard)).toBe(false)
})
