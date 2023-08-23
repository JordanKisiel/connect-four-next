"use client"

import Image from "next/image"
import redDisc from "@/public/counter-red-small.svg"
import yellowDisc from "@/public/counter-yellow-small.svg"
import invisibleDisc from "@/public/counter-invisible-small.svg"
import testDisc from "@/public/counter-blue-small.svg"
import winningMark from "@/public/winning-mark.svg"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { getDiscsInColumn } from "@/lib/connect4-utilities"
import { Board } from "@/types"

gsap.registerPlugin(CustomEase)

type Props = {
    value: boolean | null
    winningSpaces: number[][]
    board: Board
    rowIndex: number
    colIndex: number
    columnTop: number
    columnBottom: number
}

export default function Space({
    value,
    winningSpaces,
    board,
    rowIndex,
    colIndex,
    columnTop,
    columnBottom,
}: Props) {
    //empty spaces are represented by transparent image files
    //so that the transition from default image to disc image is not seen
    let disc = invisibleDisc
    let altText = "empty space"

    //get ref to div holding disc for animation
    const discRef = useRef<HTMLDivElement | null>(null)

    //adjustment used for calculating the height to drop a disc from
    //determined visually through trial and error
    const DROP_HEIGHT_VISUAL_ADJUSTMENT = 5

    //custom drop ease path information
    const CUSTOM_DROP_EASE = `M0,0 C0.456,0 0.506,0.963 0.514,1 0.522,
        0.985 0.556,0.878 0.694,0.878 0.83,0.878 0.849,
        0.983 0.856,1 0.88,0.966 0.906,0.966 0.926,0.966 0.946,
        0.966 1,1 1,1 `

    useEffect(() => {
        const discs = getDiscsInColumn(board, rowIndex)
        const height = discRef.current?.clientHeight || 0
        const dropPoint =
            columnTop -
            columnBottom +
            discs * height -
            DROP_HEIGHT_VISUAL_ADJUSTMENT

        console.log(`Drop point: ${dropPoint}`)

        if (value !== null) {
            gsap.from(discRef.current, {
                y: dropPoint,
                duration: 0.6,
                ease: CustomEase.create("custom", CUSTOM_DROP_EASE),
            })
        }
    }, [value])

    if (value === true) {
        disc = redDisc
        altText = "player 1 space"
    } else if (value === false) {
        disc = yellowDisc
        altText = "player 2 space"
    }

    const isWinningSpace = winningSpaces.some((coord) => {
        return coord[0] === rowIndex && coord[1] === colIndex
    })

    return (
        <div
            className="relative flex aspect-square items-center justify-center"
            ref={discRef}
        >
            {isWinningSpace && (
                <Image
                    className="absolute left-[50%] top-[27%] w-[40%] -translate-x-[50%]"
                    src={winningMark}
                    alt="winning mark"
                />
            )}
            <Image
                className="w-[80%]"
                src={disc}
                alt={altText}
            />
        </div>
    )
}
