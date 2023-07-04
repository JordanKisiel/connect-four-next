"use client"

import { socket } from "@/lib/socket"
import MenuButton from "./MenuButton"

type Props = {
    roomID: number
}

export default function Room({ roomID }: Props) {
    function selectPlayer(player: string) {
        socket.emit("select_player", {
            message: `${player} from room ${roomID} sent some test data`,
        })
    }

    return (
        <div
            className="
                relative 
                flex w-full 
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
                short:space-y-5 
                short:pt-6"
        >
            <h2 className="mb-3 text-2xl font-bold uppercase short:text-2xl">{`Room ${roomID}`}</h2>
            <div className="flex w-full justify-between gap-6 lg:justify-around lg:gap-12">
                <MenuButton
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textAlign="text-center"
                    padding="p-3"
                    handler={() => selectPlayer("player1")}
                >
                    Player 1
                </MenuButton>
                <MenuButton
                    bgColor="bg-yellow-300"
                    textColor="text-neutral-900"
                    textAlign="text-center"
                    padding="p-3"
                    handler={() => selectPlayer("player2")}
                >
                    Player 2
                </MenuButton>
            </div>
        </div>
    )
}
