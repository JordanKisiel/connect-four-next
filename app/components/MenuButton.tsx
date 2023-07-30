"use client"

import Link from "next/link"

type Props = {
    bgColor: string
    textColor: string
    textSize?: string
    bgImage?: string
    textAlign: string
    padding?: string
    handler?: Function
    children: React.ReactNode
}

export default function MenuButton({
    bgColor,
    textColor,
    textSize,
    bgImage,
    textAlign,
    padding,
    handler,
    children,
}: Props) {
    return (
        <button
            className={`
                ${bgColor} 
                ${textColor}
                ${textSize || "text-2xl"}  
                ${bgImage} 
                ${textAlign} 
                ${padding || "p-5"}
                w-full
                rounded-3xl
                border-[3px]
                border-neutral-900
                bg-[center_right_1rem]
                bg-no-repeat
                text-2xl
                font-bold
                uppercase
                shadow-2xl
                sm:bg-none
                `}
            onClick={
                handler
                    ? () => handler()
                    : () => {
                          /* do nothing */
                      }
            }
        >
            {children}
        </button>
    )
}
