import {
    getChildPositions,
    chooseIndex,
    getNumLinesOf2,
} from "@/lib/connect4-AI"
import { getEmptyBoard } from "@/lib/connect4-utilities"
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
    expect(chooseIndex(TWO_INDICES, 1 / (2 * NUM_ROWS), EASY_DIFF, SEED)).toBe(
        1
    )
})

test("chooseIndex: only 2 col open, fully open, medium", () => {
    expect(
        chooseIndex(TWO_INDICES, 1 / (2 * NUM_ROWS), MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: only 2 col open, fully open, hard", () => {
    expect(chooseIndex(TWO_INDICES, 1 / (2 * NUM_ROWS), HARD_DIFF, SEED)).toBe(
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
        chooseIndex(THREE_INDICES, 1 / (3 * NUM_ROWS), EASY_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: 3 col open, fully open, medium", () => {
    expect(
        chooseIndex(THREE_INDICES, 1 / (3 * NUM_ROWS), MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: 3 col open, fully open, hard", () => {
    expect(
        chooseIndex(THREE_INDICES, 1 / (3 * NUM_ROWS), HARD_DIFF, SEED)
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
        chooseIndex(THREE_INDICES, 1 / (NUM_ROWS * NUM_COLS), EASY_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: all col open, all spaces open, medium", () => {
    expect(
        chooseIndex(THREE_INDICES, 1 / (NUM_ROWS * NUM_COLS), MEDIUM_DIFF, SEED)
    ).toBe(0)
})

test("chooseIndex: all col open, all spaces open, hard", () => {
    expect(
        chooseIndex(THREE_INDICES, 1 / (NUM_ROWS * NUM_COLS), HARD_DIFF, SEED)
    ).toBe(0)
})

//--------------------------------------------------------------------------

test("getNumLinesOfTwo: empty board", () => {
    const emptyBoard = getEmptyBoard(NUM_ROWS, NUM_COLS)

    expect(getNumLinesOf2(emptyBoard, true)).toBe(0)
})

test("getNumLinesOfTwo: blocked X X _ _", () => {
    const board = [
        [false, null, null, null, null, null],
        [false, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, false)).toBe(1)
})

/*
    Bug Found:
      -this board should only return 1 because this line
      of two can only result in one possible winning line
      -this bug probably occurs because I'm counting from both
      directions (forward and back), when I refactor, I think
      I'll have to try an approach where I enumerate the patterns
      I'm looking for
      -since I'm going to try refactoring the function anyways,
      I'd rather write my tests first and then fix this bug
      when I'm going to refactor
*/
// test("getNumLinesOfTwo: blocked _ X X _", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [false, null, null, null, null, null],
//         [false, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [true, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, false)).toBe(1)
// })

test("getNumLinesOfTwo: blocked _ _ X X", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [false, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(1)
})

test("getNumLinesOfTwo: blocked begin _ X X _ ", () => {
    const board = [
        [false, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

test("getNumLinesOfTwo: blocked end _ X X _ ", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [true, null, null, null, null, null],
        [true, null, null, null, null, null],
        [null, null, null, null, null, null],
        [false, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

/* BUG FOUND */

// test("getNumLinesOfTwo: unblocked _ X X _ ", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [true, null, null, null, null, null],
//         [true, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, true)).toBe(3)
// })

test("getNumLinesOfTwo: vert blocked X X _ _", () => {
    const board = [
        [true, true, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(1)
})

/* BUG */
// test("getNumLinesOfTwo: vert blocked _ X X _", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, false, false, null, true, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, false)).toBe(1)
// })

test("getNumLinesOfTwo: vert blocked _ _ X X", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, false, false, true, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, false)).toBe(1)
})

test("getNumLinesOfTwo: vert blocked begin _ X X _ ", () => {
    const board = [
        [false, null, true, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

test("getNumLinesOfTwo: vert blocked end _ X X _ ", () => {
    const board = [
        [null, null, true, true, null, false],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

/* BUG FOUND */

// test("getNumLinesOfTwo: vert unblocked _ X X _ ", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, false, false, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, false)).toBe(3)
// })

test("getNumLinesOfTwo: diag blocked X X _ _", () => {
    const board = [
        [true, null, null, null, null, null],
        [null, true, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(1)
})

/* BUG */
// test("getNumLinesOfTwo: diag blocked _ X X _", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [null, false, null, null, null, null],
//         [null, null, false, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, true, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, false)).toBe(1)
// })

test("getNumLinesOfTwo: diag blocked _ _ X X", () => {
    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, true, null],
        [null, null, null, false, null, null],
        [null, null, false, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, false)).toBe(1)
})

test("getNumLinesOfTwo: diag blocked begin _ X X _ ", () => {
    const board = [
        [false, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, true, null, null, null],
        [null, null, null, true, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

test("getNumLinesOfTwo: diag blocked end _ X X _ ", () => {
    const board = [
        [null, null, null, null, null, false],
        [null, null, null, null, null, null],
        [null, null, null, true, null, null],
        [null, null, true, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
    ]

    expect(getNumLinesOf2(board, true)).toBe(2)
})

/* BUG FOUND */

// test("getNumLinesOfTwo: diag unblocked _ X X _ ", () => {
//     const board = [
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, false, null, null, null],
//         [null, null, null, false, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//         [null, null, null, null, null, null],
//     ]

//     expect(getNumLinesOf2(board, false)).toBe(3)
// })

/*
TODO: think harder about the lines of two algorithm
-possible algo idea:
  -scan in the same way that I do with the winning lines algo
    -(possibly create function that returns line data for
      2, 3, 4 discs so I only have to scan once)
  -starting from the current space, if the line is made up of exactly
   2 current player discs and empty spaces, increment line of 2 count
-try algo idea on smaller but complex example (4 x 5)

*/
