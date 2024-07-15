import { getChildPositions } from "@/lib/connect4-AI"
import { test, expect } from "vitest"

test("getChildPositions: all cols open", () => {
    const board = [
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
        [true, true, true, true, true, null],
    ]

    const childPositions = [
        [
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, null],
        ],
        [
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, null],
            [true, true, true, true, true, true],
        ],
    ]

    expect(getChildPositions(board, true)).toStrictEqual(childPositions)
})

test("getChildPositions: 0 cols open", () => {
    const board = [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
    ]

    expect(getChildPositions(board, true)).toStrictEqual([])
})

test("getChildPositions: 1 col open, multiple spaces", () => {
    const board = [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [null, null, null, null, null, null],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
    ]

    const childPositions = [
        [
            [true, true, true, true, true, true],
            [true, true, true, true, true, true],
            [true, true, true, true, true, true],
            [true, true, true, true, true, true],
            [false, null, null, null, null, null],
            [true, true, true, true, true, true],
            [true, true, true, true, true, true],
        ],
    ]

    expect(getChildPositions(board, false)).toStrictEqual(childPositions)
})

//--------------------------------------------------------------------------
