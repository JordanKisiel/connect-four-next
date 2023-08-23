import Space from "./Space"
import ColumnIndicator from "./ColumnIndicator"
import { Board } from "@/types"
import { useEffect, useRef } from "react"

type Props = {
    board: Board
    rowIndex: number
    winningSpaces: number[][]
    isPlayer1Turn: boolean
    isPlayersTurn?: boolean
    selectedCol: number
}

export default function Column({
    board,
    rowIndex,
    winningSpaces,
    isPlayer1Turn,
    isPlayersTurn,
    selectedCol,
}: Props) {
    //get ref to column div to access position
    const columnRef = useRef<HTMLDivElement | null>(null)
    const columnTop = columnRef?.current?.getBoundingClientRect().top || 0
    const columnBottom = columnRef?.current?.getBoundingClientRect().bottom || 0

    const spaces = board[rowIndex]
        .map((value, index) => {
            return (
                <Space
                    key={index}
                    value={value}
                    board={board}
                    rowIndex={rowIndex}
                    colIndex={index}
                    winningSpaces={winningSpaces}
                    columnTop={columnTop}
                    columnBottom={columnBottom}
                />
            )
        })
        .reverse() //reverse so that column renders bottom up

    return (
        <div
            ref={columnRef}
            className="mt-[8%] h-[85%]"
        >
            {
                <ColumnIndicator
                    isPlayer1Turn={isPlayer1Turn}
                    isPlayersTurn={isPlayersTurn}
                    rowIndex={rowIndex}
                    selectedCol={selectedCol}
                />
            }
            <div
                id="SPACES_CONTAINER"
                className="mt-[30%] grid grid-rows-6"
            >
                {spaces}
            </div>
        </div>
    )
}
