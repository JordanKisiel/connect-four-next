import { getChildPositions, chooseIndex } from "@/lib/connect4-AI"
import { l } from "vite/dist/node/types.d-aGj9QkWt"
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

//expected arguments based on use within code:
//  -weights: [0.5, 0.4, 0.1], [0.5, 0.5], [1]
//  -boardComplexity: 1/range(1 - 42 -> open spaces)
//  -difficultyAdjustment: 24, 18, 15 (easy, med, hard)
//using "1234" as optional seed

test("chooseIndex: only 1 col open, fully open, easy", () => {
    expect(chooseIndex([1], 1 / 6, 24, "1234")).toBe(0)
})

test("chooseIndex: only 1 col open, fully open, medium", () => {
    expect(chooseIndex([1], 1 / 6, 18, "1234")).toBe(0)
})

test("chooseIndex: only 1 col open, fully open, hard", () => {
    expect(chooseIndex([1], 1 / 6, 15, "1234")).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, easy", () => {
    expect(chooseIndex([1], 1 / 1, 24, "1234")).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, medium", () => {
    expect(chooseIndex([1], 1 / 1, 18, "1234")).toBe(0)
})

test("chooseIndex: only 1 col open, 1 space open, hard", () => {
    expect(chooseIndex([1], 1 / 1, 15, "1234")).toBe(0)
})

test("chooseIndex: only 2 col open, fully open, easy", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 12, 24, "1234")).toBe(1)
})

test("chooseIndex: only 2 col open, fully open, medium", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 12, 18, "1234")).toBe(0)
})

test("chooseIndex: only 2 col open, fully open, hard", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 12, 15, "1234")).toBe(0)
})

test("chooseIndex: only 2 col open, 1 space open, easy", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 2, 24, "1234")).toBe(1)
})

test("chooseIndex: only 2 col open, 1 space open, medium", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 2, 18, "1234")).toBe(1)
})

test("chooseIndex: only 2 col open, 1 space open, hard", () => {
    expect(chooseIndex([0.5, 0.5], 1 / 2, 15, "1234")).toBe(1)
})

test("chooseIndex: 3 col open, fully open, easy", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 18, 24, "1234")).toBe(0)
})

test("chooseIndex: 3 col open, fully open, medium", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 18, 18, "1234")).toBe(0)
})

test("chooseIndex: 3 col open, fully open, hard", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 18, 15, "1234")).toBe(0)
})

test("chooseIndex: 3 col open, 1 space open, easy", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 3, 24, "1234")).toBe(2)
})

test("chooseIndex: 3 col open, 1 space open, medium", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 3, 18, "1234")).toBe(2)
})

test("chooseIndex: 3 col open, 1 space open, hard", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 3, 15, "1234")).toBe(2)
})

test("chooseIndex: all col open, 1 space open, easy", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 7, 24, "1234")).toBe(2)
})

test("chooseIndex: all col open, 1 space open, medium", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 7, 18, "1234")).toBe(1)
})

test("chooseIndex: all col open, 1 space open, hard", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 7, 15, "1234")).toBe(1)
})

test("chooseIndex: all col open, all spaces open, easy", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 42, 24, "1234")).toBe(0)
})

test("chooseIndex: all col open, all spaces open, medium", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 42, 18, "1234")).toBe(0)
})

test("chooseIndex: all col open, all spaces open, hard", () => {
    expect(chooseIndex([0.5, 0.4, 0.1], 1 / 42, 15, "1234")).toBe(0)
})
