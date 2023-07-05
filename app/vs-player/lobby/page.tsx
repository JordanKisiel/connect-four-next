"use client"

import { socket } from "@/lib/socket"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Room from "@/app/components/Room"
import Button from "@/app/components/Button"
import logo from "@/public/logo.svg"

export default function Lobby() {
    const [lobby, setLobby] = useState({
        rooms: [{ isSlot1Filled: false, isSlot2Filled: false }],
    })

    const roomsArray = Array(lobby.rooms.length).fill("")
    const rooms = roomsArray.map((room, index) => {
        return (
            <Room
                key={index}
                roomID={index + 1} //don't want to start from room 0
                isSlot1Filled={lobby.rooms[index].isSlot1Filled}
                isSlot2Filled={lobby.rooms[index].isSlot2Filled}
            />
        )
    })

    useEffect(() => {
        function onConnect() {
            console.log("user connected")
        }

        function onDisconnect() {
            console.log("user disconnected")
        }

        //force connection after manually disconnecting by navigating back
        socket.connect()
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            //manually disconnect when navigating away from lobby
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        function startLobby(lobby: any) {
            console.log(`lobby started with: ${lobby.rooms.length} rooms`)

            setLobby(lobby)
        }

        socket.on("start_lobby", (data) => {
            const lobby = data

            startLobby(lobby)
        })

        socket.on("slot_filled", (data) => {
            const lobby = data

            setLobby(lobby)
        })
    }, [])

    return (
        <div className="mx-auto flex h-[100vh] w-[90%] flex-col items-center justify-center p-4 sm:w-[90%] lg:w-[60%]">
            <Image
                className="mb-16"
                src={logo}
                alt="logo"
            />
            <h2 className="mb-10 text-center text-3xl font-bold uppercase  text-neutral-100">
                Select Room
            </h2>
            <div className="w-full space-y-6">{rooms}</div>
            <Link
                className="mt-16 block"
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
