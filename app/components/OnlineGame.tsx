"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    getWinningSpaces,
    isBoardFull,
    getEmptyBoard,
    isWinner,
} from "@/lib/connect4-utilities"
import { getClientID } from "@/lib/clientID"
import { socket } from "@/lib/socket"
import logo from "@/public/logo.svg"
import Button from "./Button"
import { MenuButton } from "./MenuButton"
import Board from "./Board"
import ColumnSelectButton from "./ColumnSelectButton"
import OnlineResultDisplay from "./OnlineResultDisplay"
import Modal from "./Modal"
import TurnTimer from "./TurnTimer"

type GameState = "inactive" | "waiting" | "in_progress" | "over"

type PlayerSlots = {
    playerSlot1: {
        playerID: string
        isReady: boolean | null
    }
    playerSlot2: {
        playerID: string
        isReady: boolean | null
    }
}

type Props = {
    gameID: string
}

export default function OnlineGame({ gameID }: Props) {
    //specifies dimensions of board
    //not configurable as the board is visually represented by a static asset
    //would have to find a way to create visual board procedurally if different
    //sized boards are desired
    const BOARD_COLS = 7
    const BOARD_ROWS = 6

    //center colum is at index 3
    const CENTER_COL = 3

    const PLAYER_TURN_DURATION = 90 //in seconds
    //how much time to subtract from server time to account for latency
    //used on a reconnection to game
    const LATENCY_FORGIVENESS = 2 // in seconds

    //indication of which overall state the game is in
    const [state, setState] = useState<GameState>("inactive")

    //board states initializes with null for empty spaces
    //later, spaces filled with true will represent the discs of the first player
    //false will represent discs of the second player
    const [board, setBoard] = useState(() => {
        return getEmptyBoard(BOARD_ROWS, BOARD_COLS)
    })

    //this represents the index of the selected column on the board
    //tracked client side to avoid latency
    const [selectedCol, setSelectedCol] = useState(CENTER_COL)

    //indicates role of player in this instance of the client
    //initialized to true but may change depending on data from server
    const [isPlayer1, setIsPlayer1] = useState(true)

    //holds the playerIDs
    const [playerSlots, setPlayerSlots] = useState({
        playerSlot1: { playerID: "", isReady: null },
        playerSlot2: { playerID: "", isReady: null },
    })

    //keeps track of whose turn it is
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)

    //keeps track of which player made the first move this game
    //needed because the players alternate who goes first each game
    //regardless of who won the last game
    //TODO: reconsider if this is actually needed
    const [isPlayer1First, setIsPlayer1First] = useState(true)

    //remaining time for turn
    //refers to the remaining time as tracked by the server
    //client side timer should be more or less in sync but
    //the server time is the authority
    const [remainingTime, setRemainingTime] = useState(PLAYER_TURN_DURATION)

    //compute whether it's the player's turn or not
    const isPlayersTurn =
        (isPlayer1Turn && isPlayer1) || (!isPlayer1Turn && !isPlayer1)

    //compute whether current player is ready to start new game
    const isPlayerReady =
        (isPlayer1 && playerSlots.playerSlot1.isReady) ||
        (!isPlayer1 && playerSlots.playerSlot2.isReady)

    useEffect(() => {
        const clientID = getClientID()

        socket.on("game_updated", (data) => {
            const game = data

            setState(game.gameState)
            setRemainingTime(game.remainingTurnTime)
            setPlayerSlots({
                playerSlot1: game.player1,
                playerSlot2: game.player2,
            })
            if (game.player1.playerID === clientID) {
                setIsPlayer1(true)
            } else {
                setIsPlayer1(false)
            }
            setBoard(game.board)
            setIsPlayer1Turn(game.isPlayer1Turn)
            setIsPlayer1First(game.isPlayer1First)

            //reset selected col to center after game update
            setSelectedCol(CENTER_COL)

            console.log(game)
        })

        socket.emit("player_joined")

        return () => {
            socket.off("game_updated")
        }
    }, [])

    //handles the change of column by incrementing or decrementing the index
    //also prevents index from moving out of bounds
    //handled client side because latency to server might make this annoying
    function handleColSelect(isMoveToLeft: boolean) {
        isMoveToLeft
            ? setSelectedCol((prevCol) => (prevCol > 0 ? prevCol - 1 : 0))
            : setSelectedCol((prevCol) => (prevCol < 6 ? prevCol + 1 : 6))
    }

    function handleDrop(selectedColIndex: number, isFirstPlayerDisc: boolean) {
        socket.emit("disc_dropped", {
            selectedCol: selectedColIndex,
            isPlayer1: isFirstPlayerDisc,
        })

        //setSelectedCol(CENTER_COL)
    }

    function handlePlayerLeftGame(gameID: number, isPlayer1: boolean) {
        socket.emit("player_left_game", { gameID, isPlayer1 })
    }

    function handlePlayAgain() {
        socket.emit("play_again", { gameID, isPlayer1 })
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
                justify-center  
                px-2 
                pt-16
                ${getBGToUse(
                    state === "over"
                        ? getWinningSpaces(board).length !== 0
                        : false,
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
            <div className="relative mb-16 flex w-full items-center justify-between md:mb-16">
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
                    className="absolute left-1/2 -translate-x-1/2 sm:scale-50 md:scale-100"
                    src={logo}
                    alt="logo"
                />
                <Link href="/vs-player/lobby">
                    <Button
                        bgColor="bg-purple-500"
                        textColor="text-neutral-100"
                        paddingX="px-8"
                        handler={() =>
                            handlePlayerLeftGame(Number(gameID), isPlayer1)
                        }
                    >
                        Leave
                    </Button>
                </Link>
            </div>

            <TurnTimer
                gameState={state}
                paddingX="px-6"
                isPlayer1={isPlayer1}
                isPlayersTurn={isPlayersTurn}
                startTime={remainingTime - LATENCY_FORGIVENESS}
            />

            <Board
                numColumns={BOARD_COLS}
                selectedCol={selectedCol}
                board={board}
                isPlayer1Turn={isPlayer1Turn}
                isPlayersTurn={isPlayersTurn}
                winningSpaces={state === "over" ? getWinningSpaces(board) : []}
            />

            <div className="w-full flex-col items-center md:w-[90%] lg:w-[80%]">
                <>
                    <div className="mb-12 flex w-full items-center justify-between sm:mb-9 md:mb-8 lg:mb-6">
                        <ColumnSelectButton
                            isPlayersTurn={isPlayersTurn}
                            isPlayer1={isPlayer1}
                            isLeft={true}
                            isVisible={state !== "over"}
                            handleColSelect={
                                isPlayersTurn
                                    ? handleColSelect
                                    : () => {
                                          /* do nothing */
                                      }
                            }
                        />
                        <ColumnSelectButton
                            isPlayersTurn={isPlayersTurn}
                            isPlayer1={isPlayer1}
                            isLeft={false}
                            isVisible={state !== "over"}
                            handleColSelect={
                                isPlayersTurn
                                    ? handleColSelect
                                    : () => {
                                          /* do nothing */
                                      }
                            }
                        />
                    </div>
                    <div className={`${state !== "over" ? "" : "invisible"}`}>
                        <MenuButton
                            bgColor={
                                isPlayer1
                                    ? isPlayersTurn
                                        ? "bg-red-300"
                                        : "bg-neutral-300"
                                    : isPlayersTurn
                                    ? "bg-yellow-300"
                                    : "bg-neutral-300"
                            }
                            textColor={
                                isPlayer1Turn
                                    ? "text-neural-100"
                                    : "text-neutral-900"
                            }
                            textAlign="text-center"
                            handler={
                                isPlayersTurn
                                    ? () => handleDrop(selectedCol, isPlayer1)
                                    : () => {
                                          /* do nothing */
                                      }
                            }
                        >
                            {isPlayersTurn ? "Drop!" : "Other Player's Turn"}
                        </MenuButton>
                    </div>
                </>
            </div>

            {state === "waiting" && (
                <Modal
                    title={
                        isPlayerReady
                            ? "Waiting for other player..."
                            : "Other player ready"
                    }
                >
                    {!isPlayerReady && (
                        <Button
                            bgColor="bg-purple-500"
                            textColor="text-neutral-100"
                            paddingX="px-7"
                            handler={handlePlayAgain}
                        >
                            Play Again
                        </Button>
                    )}
                    <Link href="/vs-player/lobby">
                        <MenuButton
                            handler={() =>
                                handlePlayerLeftGame(Number(gameID), isPlayer1)
                            }
                            bgColor="bg-neutral-100"
                            textColor="text-neutral-900"
                            textAlign="text-center"
                        >
                            Back to Lobby
                        </MenuButton>
                    </Link>
                </Modal>
            )}

            {state === "over" && (
                <OnlineResultDisplay
                    isPlayersTurn={isPlayersTurn}
                    isWinner={getWinningSpaces(board).length > 0}
                    isPlayerWinner={isWinner(isPlayer1, board)}
                    isBoardFull={isBoardFull(board)}
                    isTimeLeft={remainingTime > 0}
                    handler={handlePlayAgain}
                />
            )}
        </div>
    )
}
