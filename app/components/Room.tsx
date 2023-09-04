"use client"

import { forwardRef } from "react"
import Link from "next/link"
import { socket } from "@/lib/socket"
import { MenuButton } from "./MenuButton"

type Props = {
    gameID: number
    roomID: string
    isSlot1Filled: boolean
    isSlot2Filled: boolean
}

export const Room = forwardRef<HTMLDivElement, Props>(function Room(
    { gameID, roomID, isSlot1Filled, isSlot2Filled },
    ref
) {
    function selectSlot(isPlayer1: boolean) {
        socket.emit("select_slot", {
            roomID,
            isPlayer1,
        })
    }

    return (
        <div
            ref={ref}
            className="
                relative 
                flex 
                w-full 
                flex-col 
                items-center 
                rounded-[40px] 
                border-[3px] 
                border-neutral-900 
                bg-neutral-100 
                px-6 
                pb-6 
                pt-3 
                shadow-2xl
                lg:px-4
                lg:pb-4
                lg:pt-2
                "
        >
            <h2 className="mb-3 text-2xl font-bold uppercase sm:text-xl lg:mb-2">{`${roomID}`}</h2>
            <div className="flex w-full justify-between gap-6 lg:justify-around lg:gap-8">
                <Link
                    className="w-full"
                    href={`/vs-player/game/${gameID}`}
                >
                    <MenuButton
                        bgColor={
                            isSlot1Filled ? "bg-neutral-300" : "bg-red-300"
                        }
                        textColor={
                            isSlot1Filled
                                ? "text-neutral-600"
                                : "text-neutral-100"
                        }
                        textSize="sm:text-sm md:text-2xl lg:text-lg"
                        textAlign="text-center"
                        padding="p-3"
                        handler={
                            isSlot1Filled
                                ? () => {
                                      /* do nothing */
                                  }
                                : () => selectSlot(true)
                        }
                    >
                        {isSlot1Filled ? "Filled" : "Player 1"}
                    </MenuButton>
                </Link>
                <Link
                    className="w-full"
                    href={`/vs-player/game/${gameID}`}
                >
                    <MenuButton
                        bgColor={
                            isSlot2Filled ? "bg-neutral-300" : "bg-yellow-300"
                        }
                        textColor={
                            isSlot2Filled
                                ? "text-neutral-600"
                                : "text-neutral-900"
                        }
                        textSize="sm:text-sm md:text-2xl lg:text-lg"
                        textAlign="text-center"
                        padding="p-3"
                        handler={
                            isSlot2Filled
                                ? () => {
                                      /* do nothing */
                                  }
                                : () => selectSlot(false)
                        }
                    >
                        {isSlot2Filled ? "Filled" : "Player 2"}
                    </MenuButton>
                </Link>
            </div>
        </div>
    )
})
