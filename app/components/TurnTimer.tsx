"use client"

import { useState, useEffect } from "react"

type Props = {
    gameStage: "in_progress" | "waiting" | "over"
    paddingX: string
    isPlayer1: boolean
    isPlayersTurn: boolean
    startTime: number
}

export default function TurnTimer({
    gameStage,
    paddingX,
    isPlayer1,
    isPlayersTurn,
    startTime,
}: Props) {
    const [remainingTime, setRemainingTime] = useState(startTime)
    const leadingZero = remainingTime < 10 ? "0" : ""

    let playerTextColor: string
    let playerBGColor: string
    let oppTextColor: string
    let oppBGColor: string

    if (isPlayer1) {
        playerTextColor = "text-neutral-100"
        oppTextColor = "text-neutral-900"
        playerBGColor = "bg-red-300"
        oppBGColor = "bg-yellow-300"
    } else {
        playerTextColor = "text-neutral-900"
        oppTextColor = "text-neutral-100"
        playerBGColor = "bg-yellow-300"
        oppBGColor = "bg-red-300"
    }

    const player = isPlayersTurn ? "Your" : "Opponent's"
    const textColor = isPlayersTurn ? playerTextColor : oppTextColor
    const bgColor = isPlayersTurn ? playerBGColor : oppBGColor

    useEffect(() => {
        setRemainingTime(startTime)

        let interval: NodeJS.Timer

        if (gameStage === "in_progress") {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => {
                    return prevTime > 0 ? prevTime - 1 : 0
                })
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isPlayersTurn, gameStage])

    return (
        <div
            className={`
                ${gameStage !== "in_progress" ? "invisible" : ""}
                ${bgColor} 
                ${textColor} 
                rounded-full 
                ${paddingX} 
                py-2 
                uppercase
                mb-16
                `}
        >
            {`${player} turn - ${leadingZero}${remainingTime} s`}
        </div>
    )
}
