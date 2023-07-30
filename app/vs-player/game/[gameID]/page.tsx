"use client"

import { useParams } from "next/navigation"
import OnlineGame from "@/app/components/OnlineGame"

export default function Page() {
    const params = useParams()

    return (
        <>
            <OnlineGame gameID={params.gameID} />
        </>
    )
}
