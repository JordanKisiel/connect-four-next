"use client"

import { useEffect } from "react"
import Image from "next/image"
import logo from "../public/logo.svg"
import MenuButton from "./components/MenuButton"
import { socket } from "@/lib/socket"

type SessionData = {
    sessionID: string
}

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

        function onSession(data: SessionData) {
            console.log("session established")
            const { sessionID } = data
            //attach the session ID to the next reconnection attempts
            socket.auth = { sessionID }
            //store it in local storage
            localStorage.setItem("sessionID", sessionID)
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("session", ({ sessionID }) => {})

        socket.connect()
        //used when user nagivates back to home page from the lobby page
        socket.emit("leave_lobby")

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("session", onSession)
        }
    }, [])

    return (
        <div className="mt-[-5rem] flex w-full flex-col items-center">
            <Image
                className="mb-16 md:mb-20"
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
        </div>
    )
}
