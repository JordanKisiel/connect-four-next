"use client"

import rules from "../api/rules/rules.json"
import { useRef, useLayoutEffect } from "react"
import checkIcon from "@/public/icon-check.svg"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"

export default async function Rules() {
    //get ref to container div & button for animation
    const rulesRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useLayoutEffect(() => {
        let context = gsap.context(() => {
            //animations here
            const pageTimeline = gsap.timeline()

            pageTimeline.from(rulesRef.current, {
                y: -100,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)",
            })

            pageTimeline.from(
                buttonRef.current,
                {
                    scale: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                },
                ">-0.2"
            )
        })

        //clean up function
        return () => context.revert()
    }, [])

    const procedureList: React.ReactNode[] = rules.content.howTo.procedure.map(
        (step: string) => (
            <li
                key={step}
                className="pl-3"
            >
                {step}
            </li>
        )
    )

    return (
        <div
            ref={rulesRef}
            className="
                        relative 
                        flex 
                        flex-col 
                        items-center 
                        rounded-[40px] 
                        border-[3px] 
                        border-neutral-900 
                        bg-neutral-100 
                        px-6 
                        shadow-2xl
                        sm:mx-0
                        sm:space-y-4
                        sm:pb-11
                        sm:pt-6
                        md:mx-20
                        md:space-y-6
                        md:pb-16
                        md:pt-12
                        lg:mx-0
                        lg:max-w-[30rem]
                        lg:space-y-4
                        lg:pb-12
                        lg:pt-8
                        "
        >
            <h2 className="font-bold uppercase sm:text-3xl md:text-5xl lg:text-4xl">
                {rules.title}
            </h2>
            <div className="sm:space-y-2 md:space-y-4 lg:space-y-3">
                <h3 className="font-bold uppercase text-purple-400 sm:text-lg md:text-2xl lg:text-xl">
                    {rules.content.objective.header}
                </h3>
                <p className="leading-5 sm:text-sm md:text-lg">
                    {rules.content.objective.description}
                </p>
            </div>
            <div className="sm:space-y-2 md:space-y-4 lg:space-y-3">
                <h3 className="font-bold uppercase text-purple-400 sm:text-lg md:text-2xl lg:text-xl">
                    {rules.content.howTo.header}
                </h3>
                <ol className="ml-3 space-y-3 leading-5 sm:text-sm md:text-lg lg:space-y-2">
                    {procedureList}
                </ol>
            </div>
            <Link
                href="/"
                className="absolute -bottom-10 flex aspect-square"
            >
                <button ref={buttonRef}>
                    <Image
                        src={checkIcon}
                        alt="Check icon"
                    />
                </button>
            </Link>
        </div>
    )
}
