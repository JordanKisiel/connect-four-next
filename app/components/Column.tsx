import Space from "./Space"
import ColumnIndicator from "./ColumnIndicator"
import { Board } from "@/types"

type Props = {
    board: Board
    rowIndex: number
    winningSpaces: number[][]
    isPlayer1Turn: boolean
    selectedCol: number
}

export default function Column({
    board,
    rowIndex,
    winningSpaces,
    isPlayer1Turn,
    selectedCol,
}: Props) {
    const spaces = board[rowIndex]
        .map((value, index) => {
            return (
                <Space
                    key={index}
                    value={value}
                    rowIndex={rowIndex}
                    colIndex={index}
                    winningSpaces={winningSpaces}
                />
            )
        })
        .reverse() //reverse so that column renders bottom up

    return (
        <div className="mt-[8%] h-[85%]">
            <ColumnIndicator
                isPlayer1Turn={isPlayer1Turn}
                rowIndex={rowIndex}
                selectedCol={selectedCol}
            />
            <div
                id="SPACES_CONTAINER"
                className="mt-[30%] grid grid-rows-6"
            >
                {spaces}
            </div>
        </div>
    )
}
