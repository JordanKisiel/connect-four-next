"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "../public/logo.svg"
import { MenuButton } from "./components/MenuButton"
import Modal from "./components/Modal"
import { socket } from "@/lib/socket"
import { getClientID } from "@/lib/clientID"
import { gsap } from "gsap"

export default function Home() {
    const [rejoinModal, setRejoinModal] = useState({
        show: false,
        gameID: "",
    })

    const [isInitialRender, setIsInitialRender] = useState(true)

    //get ref to three menu buttons for animation
    const vsCpuRef = useRef<HTMLButtonElement | null>(null)
    const vsPlayerRef = useRef<HTMLButtonElement | null>(null)
    const rulesRef = useRef<HTMLButtonElement | null>(null)

    //get ref to logo for animation
    const logoRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        //get client id or generate it for the first time
        const id = getClientID()

        //provide id to socket auth property so it can
        //be accessed in handshake
        socket.auth = { id }

        function onConnect() {
            console.log("user connected")
        }

        function onDisconnect() {
            console.log("user disconnected")
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)

        //if the player lost connection and can rejoin a game
        //show modal allowing them to choose to do so
        socket.on("player_rejoining", ({ gameID }) => {
            console.log("added player rejoin listener")
            setRejoinModal({
                show: true,
                gameID,
            })
        })

        socket.connect()
        //used when user nagivates back to home page from the lobby page
        socket.emit("leave_lobby")

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
        }
    }, [])

    useLayoutEffect(() => {
        setIsInitialRender(false)

        const buttonRefs = [
            rulesRef.current,
            vsPlayerRef.current,
            vsCpuRef.current,
        ]

        let context = gsap.context(
            () => {
                //animations here
                const pageTimeline = gsap.timeline()

                if (!buttonRefs.includes(null)) {
                    //probably not necessary
                    pageTimeline.from(buttonRefs, {
                        y: -100,
                        opacity: 0,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                        stagger: 0.1,
                    })
                }
                pageTimeline.from(
                    logoRef.current,
                    {
                        y: 75,
                        opacity: 0,
                        scale: 0.25,
                        duration: 0.25,
                        ease: "back.out(1.7)",
                    },
                    ">-0.2"
                )
            } /* optional scoping ref - probably not useful here */
        )

        //clean up function
        return () => context.revert()
    }, [])

    function handleCancelRejoin() {
        socket.emit("cancelled_rejoin", {
            gameID: rejoinModal.gameID,
            playerID: getClientID(),
        })

        setRejoinModal({
            show: false,
            gameID: "",
        })
    }

    return (
        <div
            className={`mt-[-5rem] flex w-full flex-col items-center md:max-w-[30rem] ${
                isInitialRender ? "invisible" : ""
            }`}
        >
            <Image
                className="mb-16 md:mb-20"
                src={logo}
                alt="logo"
                ref={logoRef}
            />
            <div className="flex w-full flex-col space-y-6 px-2 lg:max-w-[35rem]">
                <Link href="/vs-computer/select-difficulty">
                    <MenuButton
                        bgColor="bg-red-300"
                        textColor="text-neutral-100"
                        textAlign="text-left"
                        bgImage="md:bg-[url(../public/player-vs-cpu.svg)]"
                        ref={vsCpuRef}
                    >
                        Play vs CPU
                    </MenuButton>
                </Link>
                <Link href="/vs-player/lobby">
                    <MenuButton
                        bgColor="bg-yellow-300"
                        textColor="text-neutral-900"
                        textAlign="text-left"
                        bgImage="md:bg-[url(../public/player-vs-player.svg)]"
                        ref={vsPlayerRef}
                    >
                        Player vs Player
                    </MenuButton>
                </Link>
                <Link href="/rules">
                    <MenuButton
                        bgColor="bg-neutral-100"
                        textColor="text-neutral-900"
                        textAlign="text-left"
                        ref={rulesRef}
                    >
                        Game Rules
                    </MenuButton>
                </Link>
            </div>

            {rejoinModal.show && (
                <Modal title="Found Game in Progress...">
                    <Link
                        href={`/vs-player/game/${rejoinModal.gameID}`}
                        className="w-full"
                    >
                        <MenuButton
                            bgColor="bg-neutral-100"
                            textColor="text-neutral-900"
                            textAlign="text-center"
                        >
                            Rejoin
                        </MenuButton>
                    </Link>
                    <Link
                        href="/"
                        className="w-full"
                    >
                        <MenuButton
                            bgColor="bg-red-300"
                            textColor="text-neutral-900"
                            textAlign="text-center"
                            handler={handleCancelRejoin}
                        >
                            Cancel
                        </MenuButton>
                    </Link>
                </Modal>
            )}
        </div>
    )
}
