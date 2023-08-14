import Button from "./Button"

type Props = {
    isWinner: boolean
    isBoardFull: boolean
    isPlayer1: boolean
    handler: Function
}

export default function ResultDisplay({
    isWinner,
    isBoardFull,
    isPlayer1,
    handler,
}: Props) {
    let player = ""
    let resultText = ""

    if (isWinner) {
        player = isPlayer1 ? "You" : "CPU"
        resultText = isPlayer1 ? "Win!" : "Wins"
    } else if (isBoardFull) {
        resultText = "Draw"
    }

    return (
        <div
            className="
            absolute
            top-[62%]
            flex
            w-5/6
            flex-col
            items-center
            rounded-3xl
            border-[3px]
            border-neutral-900
            bg-neutral-100
            bg-[center_right_1rem]
            bg-no-repeat
            px-5
            py-5
            text-neutral-900
            shadow-2xl
            md:top-[68%]
            md:w-[60%]
            lg:top-[64%]
            lg:w-[70%]
            "
        >
            <span className="text-center text-base font-bold uppercase md:text-2xl">
                {player}
            </span>
            <span className="mb-1.5 text-center text-6xl font-bold uppercase md:mb-5 md:text-7xl">
                {resultText}
            </span>
            <Button
                bgColor="bg-purple-500"
                textColor="text-neutral-100"
                paddingX="px-7"
                handler={() => handler()}
            >
                Play Again
            </Button>
        </div>
    )
}
