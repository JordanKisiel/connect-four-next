import Button from "./Button"

type Props = {
    isWinner: boolean
    isBoardFull: boolean
    isPlayer1Turn: boolean
    handleNewGame: Function
}

export default function ResultDisplay({
    isWinner,
    isBoardFull,
    isPlayer1Turn,
    handleNewGame,
}: Props) {
    let player = ""
    let resultText = ""

    if (isWinner) {
        player = isPlayer1Turn ? "Player 1" : "Player 2"
        resultText = "Wins"
    } else if (isBoardFull) {
        resultText = "Draw"
    }

    return (
        <div
            className="
            absolute
            top-[65%]
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
            md:top-[65%]
            md:w-[65%]
            lg:top-[65%]
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
                handler={() => handleNewGame()}
            >
                Play Again
            </Button>
        </div>
    )
}
