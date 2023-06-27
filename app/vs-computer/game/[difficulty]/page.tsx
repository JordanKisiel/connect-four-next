import Game from "@/app/components/Game"

type Difficulty = "easy" | "medium" | "hard"

type Params = {
    params: {
        difficulty: Difficulty
    }
}

export default function Page({ params }: Params) {
    return (
        <>
            <Game difficulty={params.difficulty}></Game>
        </>
    )
}
