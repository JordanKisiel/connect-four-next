import Image from "next/image"
import boardFG from "@/public/board.svg"
import boardBG from "@/public/board-bg.svg"
import Column from "./Column"

type Props = {
    numColumns: number
    selectedCol: number
    board: Board
    isPlayer1Turn: boolean
    winningSpaces: number[][]
}

export default function Board({
    numColumns,
    selectedCol,
    board,
    isPlayer1Turn,
    winningSpaces,
}: Props) {
    const columnArray = Array(numColumns).fill("")

    const columns = columnArray.map((col, index) => {
        return (
            <Column
                key={index}
                rowIndex={index}
                selectedCol={selectedCol}
                board={board}
                isPlayer1Turn={isPlayer1Turn}
                winningSpaces={winningSpaces}
            />
        )
    })

    return (
        <div className="relative aspect-square w-full md:w-[95%] lg:w-[80%]">
            <Image
                className="absolute top-1 rounded-3xl"
                src={boardBG}
                alt="board background"
                priority={true}
            />
            <div className="absolute left-[50%] grid aspect-square w-[98%] -translate-x-[50%] grid-cols-7">
                {columns}
            </div>
            <Image
                className="absolute top-0 rounded-3xl shadow-2xl"
                src={boardFG}
                alt="board foreground"
                priority={true}
            />
        </div>
    )
}
