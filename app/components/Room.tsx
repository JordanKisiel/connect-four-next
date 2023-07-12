"use client"

import { socket } from "@/lib/socket"
import MenuButton from "./MenuButton"

type Props = {
    roomID: number
    isSlot1Filled: boolean
    isSlot2Filled: boolean
}

export default function Room({ roomID, isSlot1Filled, isSlot2Filled }: Props) {
    function selectSlot(player: string) {
        socket.emit("select_slot", {
            roomID,
            playerSlot: player,
        })
    }

    return (
        <div
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
                "
        >
            <h2 className="mb-3 text-2xl font-bold uppercase sm:text-xl">{`Room ${roomID}`}</h2>
            <div className="flex w-full justify-between gap-6 lg:justify-around lg:gap-12">
                <MenuButton
                    bgColor={isSlot1Filled ? "bg-neutral-300" : "bg-red-300"}
                    textColor={
                        isSlot1Filled ? "text-neutral-600" : "text-neutral-100"
                    }
                    textSize="sm:text-lg md:text-2xl"
                    textAlign="text-center"
                    padding="p-3"
                    handler={
                        isSlot1Filled
                            ? () => {
                                  /* do nothing */
                              }
                            : () => selectSlot("player1")
                    }
                >
                    {isSlot1Filled ? "Filled" : "Player 1"}
                </MenuButton>
                <MenuButton
                    bgColor={isSlot2Filled ? "bg-neutral-300" : "bg-yellow-300"}
                    textColor={
                        isSlot2Filled ? "text-neutral-600" : "text-neutral-900"
                    }
                    textSize="sm:text-lg md:text-2xl"
                    textAlign="text-center"
                    padding="p-3"
                    handler={
                        isSlot2Filled
                            ? () => {
                                  /* do nothing */
                              }
                            : () => selectSlot("player2")
                    }
                >
                    {isSlot2Filled ? "Filled" : "Player 2"}
                </MenuButton>
            </div>
        </div>
    )
}
