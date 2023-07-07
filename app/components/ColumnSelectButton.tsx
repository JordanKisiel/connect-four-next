import Image from "next/image"
import redLeftButton from "@/public/arrow-left-red.svg"
import redRightButton from "@/public/arrow-right-red.svg"
import yellowLeftButton from "@/public/arrow-left-yellow.svg"
import yellowRightButton from "@/public/arrow-right-yellow.svg"

type Props = {
    isPlayer1Turn: boolean
    isLeft: boolean
    handleColSelect: Function
}

export default function ColumnSelectButton({
    isPlayer1Turn,
    isLeft,
    handleColSelect,
}: Props) {
    let leftOption = ""
    let rightOption = ""

    if (isPlayer1Turn) {
        leftOption = redLeftButton
        rightOption = redRightButton
    } else {
        leftOption = yellowLeftButton
        rightOption = yellowRightButton
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
