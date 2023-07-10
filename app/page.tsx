"use client"

import { useEffect } from "react"
import Image from "next/image"
import logo from "../public/logo.svg"
import MenuButton from "./components/MenuButton"
import { socket } from "@/lib/socket"

export default function Home() {
    useEffect(() => {
        //get the session id if it exists
        const sessionID = localStorage.getItem("sessionID")

        if (sessionID) {
            socket.auth = { sessionID }
            socket.connect()
        }

        function onConnect() {
            console.log("user connected")
        }

        function onDisconnect() {
            console.log("user disconnected")
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("session", ({ sessionID }) => {
            //attach the session ID to the next reconnection attempts
            socket.auth = { sessionID }
            //store it in local storage
            localStorage.setItem("sessionID", sessionID)
        })

        socket.connect()

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
        }
    }, [])

    return (
        <>
            <Image
                className="mb-16 md:mb-20 md:mt-20 lg:mt-32"
                src={logo}
                alt="logo"
            />
            <div className="flex w-full flex-col space-y-6 px-2 lg:max-w-[35rem]">
                <MenuButton
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textAlign="text-left"
                    bgImage="bg-[url(../public/player-vs-cpu.svg)]"
                    path="/vs-computer/select-difficulty"
                >
                    Play vs CPU
                </MenuButton>
                <MenuButton
                    bgColor="bg-yellow-300"
                    textColor="text-neutral-900"
                    textAlign="text-left"
                    bgImage="bg-[url(../public/player-vs-player.svg)]"
                    path="/vs-player/lobby"
                >
                    Player vs Player
                </MenuButton>
                <MenuButton
                    bgColor="bg-neutral-100"
                    textColor="text-neutral-900"
                    textAlign="text-left"
                    path="/rules"
                >
                    Game Rules
                </MenuButton>
            </div>
        </>
    )
}
