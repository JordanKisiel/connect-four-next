import Image from "next/image"
import redDisc from "@/public/counter-red-small.svg"
import yellowDisc from "@/public/counter-yellow-small.svg"
import invisibleDisc from "@/public/counter-invisible-small.svg"
import winningMark from "@/public/winning-mark.svg"

type Props = {
    value: boolean | null
    winningSpaces: number[][]
    rowIndex: number
    colIndex: number
}

export default function Space({
    value,
    winningSpaces,
    rowIndex,
    colIndex,
}: Props) {
    //empty spaces are represented by transparent image files
    //so that the transition from default image to disc image is not seen
    let disc = invisibleDisc
    let altText = "empty space"

    if (value === true) {
        disc = redDisc
        altText = "player 1 space"
    } else if (value === false) {
        disc = yellowDisc
        altText = "player 2 space"
    }

    const isWinningSpace = winningSpaces.some((coord) => {
        return coord[0] === rowIndex && coord[1] === colIndex
    })

    return (
        <div className="relative flex aspect-square items-center justify-center">
            {isWinningSpace && (
                <Image
                    className="absolute left-[50%] top-[27%] w-[40%] -translate-x-[50%]"
                    src={winningMark}
                    alt="winning mark"
                />
            )}
            <Image className="w-[80%]" src={disc} alt={altText} />
        </div>
    )
}
