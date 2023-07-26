"use client"

import { socket } from "@/lib/socket"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lobby } from "@/types"
import Room from "@/app/components/Room"
import Button from "@/app/components/Button"
import logo from "@/public/logo.svg"

export default function Lobby() {
    const [lobby, setLobby] = useState([{ playerSlot1: "", playerSlot2: "" }])

    const roomsArray = Array(lobby.length).fill("")
    const rooms = roomsArray.map((room, index) => {
        if (index > 0) {
            //roomID is indexed from 1 on the server side
            return (
                <Room
                    key={index}
                    roomID={`Room ${index}`}
                    isSlot1Filled={lobby[index].playerSlot1 !== ""}
                    isSlot2Filled={lobby[index].playerSlot2 !== ""}
                />
            )
        }
    })

    useEffect(() => {
        socket.on("lobby_updated", (data) => {
            const lobby = data
            setLobby(lobby)
        })

        socket.emit("start_lobby")

        return () => {
            socket.off("lobby_updated")
        }
    }, [])

    return (
        <div className="mx-auto flex w-[95%] flex-col items-center justify-center md:w-[75%] lg:max-w-[30rem]">
            <Image
                className="mb-8 mt-4 sm:hidden md:block lg:mb-0 lg:scale-75"
                src={logo}
                alt="logo"
            />
            <h2 className="mb-10 text-center text-3xl font-bold uppercase text-neutral-100 sm:my-3 sm:text-2xl md:my-8 md:text-3xl lg:my-4 lg:text-2xl">
                Select Room
            </h2>
            <div className="w-full space-y-6">{rooms}</div>
            <Link
                className="mt-16 block sm:mt-10"
                href="/"
            >
                <Button
                    textColor="text-neutral-100"
                    bgColor="bg-purple-500"
                    paddingX="px-6"
                >
                    Back to Main Menu
                </Button>
            </Link>
        </div>
    )
}
