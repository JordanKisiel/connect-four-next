import Game from "../../../components/Game"

type Params = {
    params: {
        difficulty: string
    }
}

export default function Page({ params }: Params) {
    return (
        <>
            <Game difficulty={params.difficulty}></Game>
        </>
    )
}
