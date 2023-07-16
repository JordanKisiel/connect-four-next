"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    getWinningSpaces,
    isBoardFull,
    getEmptyBoard,
    isBoardEmpty,
} from "@/lib/connect4-utilities"
import logo from "@/public/logo.svg"
import Button from "./Button"
import MenuButton from "./MenuButton"
import Board from "./Board"
import ColumnSelectButton from "./ColumnSelectButton"
import ResultDisplay from "./ResultDisplay"

export default function Game() {
    //specifies dimensions of board
    //not configurable as the board is visually represented by a static asset
    //would have to find a way to create visual board procedurally if different
    //sized boards are desired
    const BOARD_COLS = 7
    const BOARD_ROWS = 6

    //center colum is at index 3
    const CENTER_COL = 3

    //board states initializes with null for empty spaces
    //later, spaces filled with true will represent the discs of the first player
    //false will represent discs of the second player
    const [board, setBoard] = useState(() => {
        return getEmptyBoard(BOARD_ROWS, BOARD_COLS)
    })

    //this represents the index of the selected column on the board
    const [selectedCol, setSelectedCol] = useState(CENTER_COL)

    //keeps track of whose turn it is
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)

    //keeps track of which player made the first move this game
    //needed because the players alternate who goes first each game
    //regardless of who won the last game
    const [isPlayer1First, setIsPlayer1First] = useState(true)

    //keeps track of whether the current game has ended
    //this could be due to a win or a draw
    const [isGameOver, setIsGameOver] = useState(false)

    useEffect(() => {
        //detect win by trying to get winning slots array
        //if array is empty then no win, otherwise there's a win
        const isWin = getWinningSpaces(board).length !== 0

        //if there is a win or draw, the game is over
        if (isWin || isBoardFull(board)) {
            setIsGameOver(true)
        }
        //otherwise game continues so change player turn
        else {
            //don't change turns if board is empty as no moves have been made to change the turn
            if (!isBoardEmpty(board)) {
                setIsPlayer1Turn((prevValue) => !prevValue)
            }
        }
    }, [board])

    //handles the change of column by incrementing or decrementing the index
    //also prevents index from moving out of bounds
    function handleColSelect(isMoveToLeft: boolean) {
        isMoveToLeft
            ? setSelectedCol((prevCol) => (prevCol > 0 ? prevCol - 1 : 0))
            : setSelectedCol((prevCol) => (prevCol < 6 ? prevCol + 1 : 6))
    }

    //takes selected column as an index
    //and updates the board state to represent a disc being
    //dropped in that column
    //true = first player disc
    //false = second player disc
    function handleDrop(selectedColIndex: number, isFirstPlayerDisc: boolean) {
        //only drop in that column if there's an open slot
        if (board[selectedColIndex].some((slot) => slot === null)) {
            setBoard((prevBoard) => {
                return prevBoard.map((col, index) => {
                    const isNull = (element: boolean | null) => element === null
                    const firstNullIndex = col.findIndex(isNull)
                    return index === selectedColIndex
                        ? col.map((space, index) => {
                              return index === firstNullIndex
                                  ? isFirstPlayerDisc
                                  : space
                          })
                        : col
                })
            })

            //reset selected column back to middle after move is made
            setSelectedCol(CENTER_COL)
        }
    }

    function handleNewGame() {
        //empty board
        setBoard(Array(7).fill(Array(6).fill(null)))

        //return selected column to middle
        setSelectedCol(3)

        //player that makes the first move of the new game is the opposite of who made it last game
        setIsPlayer1Turn(!isPlayer1First)

        //reflect the fact that this game started with the opposite player
        setIsPlayer1First((prevValue) => !prevValue)

        //reset game over state
        setIsGameOver(false)
    }

    function getBGToUse(isWinner: boolean, isPlayer1Turn: boolean): string {
        //3 possible backgrounds to use based upon state of game
        const playBG = "bg-[url(../public/bg-shape-mobile.svg)]"
        const player1WinsBG = "bg-[url(../public/bg-shape-mobile-red.svg)]"
        const player2WinsBG = "bg-[url(../public/bg-shape-mobile-yellow.svg)]"

        if (isWinner && isPlayer1Turn) {
            return player1WinsBG
        } else if (isWinner && !isPlayer1Turn) {
            return player2WinsBG
        } else {
            return playBG
        }
    }

    return (
        <div
            className={`relative
                flex
                h-full 
                flex-col 
                items-center  
                px-2 
                pt-16
                ${getBGToUse(
                    isGameOver ? getWinningSpaces(board).length !== 0 : false,
                    isPlayer1Turn
                )}
                mx-auto
                w-[95%] 
                bg-[length:100%_30%]
                bg-bottom
                bg-no-repeat
                sm:max-w-[27rem]
                md:w-[90%]
                md:bg-[length:100%_40%]
                md:pt-0
                lg:max-w-[34rem]
                lg:bg-[length:100%_35%]
                lg:pt-[8%]
                `}
        >
            <div className="relative mb-24 flex w-full items-center justify-between md:mb-24">
                <Link href="/">
                    <Button
                        bgColor="bg-purple-500"
                        textColor="text-neutral-100"
                        paddingX="px-8"
                    >
                        Menu
                    </Button>
                </Link>
                <Image
                    className="absolute left-1/2 -translate-x-1/2"
                    src={logo}
                    alt="logo"
                />
            </div>

            <Board
                numColumns={BOARD_COLS}
                selectedCol={selectedCol}
                board={board}
                isPlayer1Turn={isPlayer1Turn}
                winningSpaces={isGameOver ? getWinningSpaces(board) : []}
            />

            <div className="w-full flex-col items-center md:w-[90%] lg:w-[80%]">
                {!isGameOver && (
                    <>
                        <div className="mb-12 flex w-full items-center justify-between sm:mb-9 md:mb-8 lg:mb-6">
                            <ColumnSelectButton
                                isPlayer1Turn={isPlayer1Turn}
                                isLeft={true}
                                handleColSelect={
                                    isPlayer1Turn
                                        ? handleColSelect
                                        : () => {
                                              /* do nothing */
                                          }
                                }
                            />
                            <ColumnSelectButton
                                isPlayer1Turn={isPlayer1Turn}
                                isLeft={false}
                                handleColSelect={
                                    isPlayer1Turn
                                        ? handleColSelect
                                        : () => {
                                              /* do nothing */
                                          }
                                }
                            />
                        </div>
                        <MenuButton
                            bgColor={
                                isPlayer1Turn ? "bg-red-300" : "bg-yellow-300"
                            }
                            textColor={
                                isPlayer1Turn
                                    ? "text-neural-100"
                                    : "text-neutral-900"
                            }
                            textAlign="text-center"
                            handler={
                                isPlayer1Turn
                                    ? () =>
                                          handleDrop(selectedCol, isPlayer1Turn)
                                    : () => {
                                          /* do nothing */
                                      }
                            }
                        >
                            Drop!
                        </MenuButton>
                    </>
                )}
            </div>

            {isGameOver && (
                <ResultDisplay
                    isPlayer1Turn={isPlayer1Turn}
                    isWinner={getWinningSpaces(board).length !== 0}
                    isBoardFull={isBoardFull(board)}
                    handler={handleNewGame}
                />
            )}
        </div>
    )
}
