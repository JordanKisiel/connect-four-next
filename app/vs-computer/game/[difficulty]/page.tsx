import { Difficulty } from "@/types"

import Game from "@/app/components/Game"

type Params = {
    params: {
        difficulty: Difficulty
    }
}

export default function Page({ params }: Params) {
    return (
        <>
            <Game difficulty={params.difficulty} />
        </>
    )
}
