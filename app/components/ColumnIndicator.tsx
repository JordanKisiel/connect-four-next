import Image from "next/image"
import redIndicator from "@/public/column-indicator-red.svg"
import yellowIndicator from "@/public/column-indicator-yellow.svg"
import invisibleIndicator from "@/public/column-indicator-invisible.svg"

type Props = {
    rowIndex: number
    selectedCol: number
    isPlayer1Turn: boolean
}

export default function ColumnIndicator({
    rowIndex,
    selectedCol,
    isPlayer1Turn,
}: Props) {
    let imageSrc = invisibleIndicator
    let altText = ""

    if (rowIndex === selectedCol) {
        if (isPlayer1Turn) {
            imageSrc = redIndicator
            altText = "player 1 column indicator"
        } else {
            imageSrc = yellowIndicator
            altText = "player 2 column indicator"
        }
    }

    return (
        <div className="z-10 mx-auto -mt-[90%] w-[70%]">
            <Image className="w-full" src={imageSrc} alt={altText} />
        </div>
    )
}
