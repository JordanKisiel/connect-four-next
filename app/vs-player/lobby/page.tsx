"use client"

import { socket } from "@/lib/socket"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { type Lobby } from "@/types"
import { Room } from "@/app/components/Room"
import { Button } from "@/app/components/Button"
import logo from "@/public/logo.svg"
import { gsap } from "gsap"

export default function Lobby() {
    const [lobby, setLobby] = useState([{ playerSlot1: "", playerSlot2: "" }])
    const [loading, setLoading] = useState(true)
    //get refs for animation
    const roomRefs = useRef<HTMLDivElement[] | null>(null)
    const logoRef = useRef<HTMLImageElement | null>(null)
    const headerRef = useRef<HTMLHeadingElement | null>(null)
    const backRef = useRef<HTMLButtonElement | null>(null)

    function getRoomRefs() {
        if (!roomRefs.current) {
            //initialize roomRefs array on first usage
            roomRefs.current = []
        }

        return roomRefs.current
    }

    const roomsArray = Array(lobby.length).fill("")
    const rooms = roomsArray.map((room, index) => {
        if (index > 0) {
            //roomID is indexed from 1 on the server side
            return (
                <Room
                    ref={(node) => {
                        const arr = getRoomRefs()
                        if (node) {
                            arr[index] = node
                        }
                    }}
                    key={index}
                    gameID={index}
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
            setLoading(false)
        })

        socket.emit("start_lobby")

        return () => {
            socket.off("lobby_updated")
        }
    }, [])

    useLayoutEffect(() => {
        //animations here
        if (!loading) {
            let context = gsap.context(() => {
                const pageTimeline = gsap.timeline()

                //remove first empty index
                if (roomRefs.current !== null) {
                    roomRefs.current.shift()
                }

                pageTimeline.from(logoRef.current, {
                    rotate: -180,
                    opacity: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                })

                pageTimeline.from(
                    headerRef.current,
                    {
                        y: -100,
                        opacity: 0,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                    },
                    ">-0.55"
                )

                pageTimeline.from(
                    roomRefs.current,
                    {
                        y: -100,
                        opacity: 0,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                        stagger: 0.05,
                    },
                    ">-0.45"
                )

                pageTimeline.from(
                    backRef.current,
                    {
                        y: -50,
                        opacity: 0,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                    },
                    ">-0.35"
                )
            })
            //clean up function
            return () => context.revert()
        }
    }, [loading])

    return (
        <div className="mx-auto flex w-[95%] flex-col items-center justify-center md:w-[75%] lg:max-w-[30rem]">
            <Image
                ref={logoRef}
                className="mb-8 mt-4 sm:hidden md:block lg:mb-0 lg:scale-75"
                src={logo}
                alt="logo"
            />
            <h2
                ref={headerRef}
                className="mb-10 text-center text-3xl font-bold uppercase text-neutral-100 sm:my-3 sm:text-2xl md:my-8 md:text-3xl lg:my-4 lg:text-2xl"
            >
                Select Room
            </h2>
            <div className="w-full space-y-6">{rooms}</div>
            <Link
                className="mt-16 block sm:mt-10"
                href="/"
            >
                <Button
                    ref={backRef}
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
