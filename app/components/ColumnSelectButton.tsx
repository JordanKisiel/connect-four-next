import Image from "next/image"
import redLeftButton from "@/public/arrow-left-red.svg"
import redRightButton from "@/public/arrow-right-red.svg"
import yellowLeftButton from "@/public/arrow-left-yellow.svg"
import yellowRightButton from "@/public/arrow-right-yellow.svg"
import grayLeftButton from "@/public/arrow-left-gray.svg"
import grayRightButton from "@/public/arrow-right-gray.svg"

type Props = {
    isPlayersTurn: boolean
    isPlayer1: boolean
    isLeft: boolean
    handleColSelect: Function
}

export default function ColumnSelectButton({
    isPlayersTurn,
    isPlayer1,
    isLeft,
    handleColSelect,
}: Props) {
    let leftOption = ""
    let rightOption = ""

    if (isPlayersTurn) {
        if (isPlayer1) {
            leftOption = redLeftButton
            rightOption = redRightButton
        } else {
            leftOption = yellowLeftButton
            rightOption = yellowRightButton
        }
    } else {
        leftOption = grayLeftButton
        rightOption = grayRightButton
    }

    return (
        <button
            className="flex justify-center"
            onClick={() => handleColSelect(isLeft)}
        >
            <Image
                className="md:w-[150%]"
                src={isLeft ? leftOption : rightOption}
                alt={isLeft ? "move left" : "move right"}
            />
        </button>
    )
}
