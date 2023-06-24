"use client"

import { useState } from "react"

type Props = {
    difficulty: string
}

export default function Game({ difficulty }: Props) {
    const [isOn, setIsOn] = useState(true)

    function clickHandler() {
        setIsOn((prevValue) => !prevValue)
    }

    return (
        <>
            <h1>{difficulty}</h1>
            <button onClick={clickHandler}>{isOn ? "YEP" : "NOPE"}</button>
        </>
    )
}
