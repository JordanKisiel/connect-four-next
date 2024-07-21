import { getChildPositions, chooseIndex } from "@/lib/connect4-AI"
import { test, expect } from "vitest"

//seed for testing random functionality
const SEED = "1234"

//difficulty velocities
const EASY_DIFF = 24
const MEDIUM_DIFF = 18
const HARD_DIFF = 15

//board dimensions
const NUM_ROWS = 6
const NUM_COLS = 7

//index weights
const ONE_INDEX = [1]
const TWO_INDICES = [0.5, 0.5]
const THREE_INDICES = [0.5, 0.4, 0.1]

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

//expected arguments based on use within code:
//  -weights: [0.5, 0.4, 0.1], [0.5, 0.5], [1]
//  -boardComplexity: 1/range(1 - 42 -> open spaces)
//  -difficultyAdjustment: 24, 18, 15 (easy, med, hard)
//using "1234" as optional seed

test("chooseIndex: only 1 col open, fully open, easy", () => {
    expect(chooseIndex(ONE_INDEX, 1 / NUM_ROWS, EASY_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 1 col open, fully open, medium", () => {
    expect(chooseIndex(ONE_INDEX, 1 / NUM_ROWS, MEDIUM_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 1 col open, fully open, hard", () => {
    expect(chooseIndex(ONE_INDEX, 1 / NUM_ROWS, HARD_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, easy", () => {
    expect(chooseIndex(ONE_INDEX, 1 / 1, EASY_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, medium", () => {
    expect(chooseIndex(ONE_INDEX, 1 / 1, MEDIUM_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, hard", () => {
    expect(chooseIndex(ONE_INDEX, 1 / 1, HARD_DIFF, SEED)).toBe(0)
})

test("chooseIndex: only 2 col open, fully open, easy", () => {
    expect(chooseIndex(TWO_INDICES, (1 / 2) * NUM_ROWS, EASY_DIFF, SEED)).toBe(
        1
    )
})

test("chooseIndex: only 2 col open, fully open, medium", () => {
    expect(
        chooseIndex(TWO_INDICES, (1 / 2) * NUM_ROWS, MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: only 2 col open, fully open, hard", () => {
    expect(chooseIndex(TWO_INDICES, (1 / 2) * NUM_ROWS, HARD_DIFF, SEED)).toBe(
        0
    )
})

test("chooseIndex: only 2 col open, 1 space open, easy", () => {
    expect(chooseIndex(TWO_INDICES, 1 / 2, EASY_DIFF, SEED)).toBe(1)
})

test("chooseIndex: only 2 col open, 1 space open, medium", () => {
    expect(chooseIndex(TWO_INDICES, 1 / 2, MEDIUM_DIFF, SEED)).toBe(1)
})

test("chooseIndex: only 2 col open, 1 space open, hard", () => {
    expect(chooseIndex(TWO_INDICES, 1 / 2, HARD_DIFF, SEED)).toBe(1)
})

test("chooseIndex: 3 col open, fully open, easy", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / 3) * NUM_ROWS, EASY_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: 3 col open, fully open, medium", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / 3) * NUM_ROWS, MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: 3 col open, fully open, hard", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / 3) * NUM_ROWS, HARD_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: 3 col open, 1 space open, easy", () => {
    expect(chooseIndex(THREE_INDICES, 1 / 3, EASY_DIFF, SEED)).toBe(2)
})

test("chooseIndex: 3 col open, 1 space open, medium", () => {
    expect(chooseIndex(THREE_INDICES, 1 / 3, MEDIUM_DIFF, SEED)).toBe(2)
})

test("chooseIndex: 3 col open, 1 space open, hard", () => {
    expect(chooseIndex(THREE_INDICES, 1 / 3, HARD_DIFF, SEED)).toBe(2)
})

test("chooseIndex: all col open, 1 space open, easy", () => {
    expect(chooseIndex(THREE_INDICES, 1 / NUM_COLS, EASY_DIFF, SEED)).toBe(2)
})

test("chooseIndex: all col open, 1 space open, medium", () => {
    expect(chooseIndex(THREE_INDICES, 1 / NUM_COLS, MEDIUM_DIFF, SEED)).toBe(1)
})

test("chooseIndex: all col open, 1 space open, hard", () => {
    expect(chooseIndex(THREE_INDICES, 1 / NUM_COLS, HARD_DIFF, SEED)).toBe(1)
})

test("chooseIndex: all col open, all spaces open, easy", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / NUM_ROWS) * NUM_COLS, EASY_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: all col open, all spaces open, medium", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / NUM_ROWS) * NUM_COLS, MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: all col open, all spaces open, hard", () => {
    expect(
        chooseIndex(THREE_INDICES, (1 / NUM_ROWS) * NUM_COLS, HARD_DIFF, SEED)
    ).toBe(0)
})
