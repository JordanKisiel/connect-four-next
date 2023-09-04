"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.svg"
import { MenuButton } from "@/app/components/MenuButton"
import { Button } from "@/app/components/Button"
import { gsap } from "gsap"

export default function Home() {
    //get refs for animation
    const easyRef = useRef<HTMLButtonElement | null>(null)
    const mediumRef = useRef<HTMLButtonElement | null>(null)
    const hardRef = useRef<HTMLButtonElement | null>(null)
    const backRef = useRef<HTMLButtonElement | null>(null)
    const logoRef = useRef<HTMLImageElement | null>(null)
    const headerRef = useRef<HTMLHeadingElement | null>(null)

    useLayoutEffect(() => {
        const buttonRefs = [easyRef.current, mediumRef.current, hardRef.current]

        let context = gsap.context(() => {
            //animations here
            const pageTimeline = gsap.timeline()

            pageTimeline.from(logoRef.current, {
                rotate: -180,
                opacity: 0,
                duration: 0.5,
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
                ">-0.45"
            )

            pageTimeline.from(
                buttonRefs,
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
    }, [])

    return (
        <>
            <div className="flex w-full flex-col items-center md:max-w-[30rem] lg:max-w-[35rem]">
                <Image
                    ref={logoRef}
                    className="mb-16"
                    src={logo}
                    alt="logo"
                />
                <h2
                    ref={headerRef}
                    className="mb-10 text-center text-3xl font-bold uppercase  text-neutral-100"
                >
                    Select Difficulty
                </h2>
                <div className="mb-10 flex w-full flex-col space-y-6 px-2 md:mb-20">
                    <Link href="/vs-computer/game/easy">
                        <MenuButton
                            bgColor="bg-purple-500"
                            textColor="text-neutral-100"
                            textAlign="text-center"
                            padding="p-3"
                            ref={easyRef}
                        >
                            Easy
                        </MenuButton>
                    </Link>
                    <Link href="/vs-computer/game/medium">
                        <MenuButton
                            bgColor="bg-purple-500"
                            textColor="text-neutral-100"
                            textAlign="text-center"
                            padding="p-3"
                            ref={mediumRef}
                        >
                            Medium
                        </MenuButton>
                    </Link>
                    <Link href="/vs-computer/game/hard">
                        <MenuButton
                            bgColor="bg-purple-500"
                            textColor="text-neutral-100"
                            textAlign="text-center"
                            padding="p-3"
                            ref={hardRef}
                        >
                            Hard
                        </MenuButton>
                    </Link>
                </div>
                <Link href="/">
                    <Button
                        textColor="text-neutral-100"
                        bgColor="bg-purple-500"
                        paddingX="px-6"
                        ref={backRef}
                    >
                        Back to Main Menu
                    </Button>
                </Link>
            </div>
        </>
    )
}
