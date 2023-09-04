"use client"

import { forwardRef } from "react"

type Props = {
    textColor: string
    bgColor: string
    paddingX: string
    handler?: Function
    children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
    { textColor, bgColor, paddingX, handler, children },
    ref
) {
    return (
        <button
            ref={ref}
            className={`${bgColor} 
                ${textColor} 
                rounded-full 
                ${paddingX} 
                py-2 
                uppercase`}
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
})
