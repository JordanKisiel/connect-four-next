import Button from "./Button"

type Props = {
    isWinner: boolean
    isPlayerWinner: boolean
    isBoardFull: boolean
    isPlayersTurn: boolean
    isTimeLeft: boolean
    handler: Function
}

export default function ResultDisplay({
    isWinner,
    isPlayerWinner,
    isBoardFull,
    isPlayersTurn,
    isTimeLeft,
    handler,
}: Props) {
    let player = "You"
    let resultText = ""

    //cases to account for:
    // player1 wins game - player2 loses game
    // player2 wins game - player1 loses game
    // draw
    // player1 wins by forfeit
    // player2 wins by forfeit
    // player1 wins by timeout
    // player2 wins by timeout

    if (isWinner) {
        if (isPlayerWinner) {
            resultText = "Win"
        } else {
            resultText = "Lose"
        }
    } else if (isBoardFull) {
        player = ""
        resultText = "Draw"
    } else if (!isTimeLeft) {
        //time expired
        if (isPlayersTurn) {
            resultText = "Lost on time"
        } else {
            resultText = "Win on Time"
        }
    } else {
        resultText = "Win By Forfeit"
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
            md:top-[47%]
            md:w-[70%]
            lg:top-[67%]
            lg:w-[75%]
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
