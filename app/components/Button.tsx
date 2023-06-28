"use client"

type Props = {
    textColor: string
    bgColor: string
    paddingX: string
    handler?: Function
    children: React.ReactNode
}

export default function Button({
    textColor,
    bgColor,
    paddingX,
    handler,
    children,
}: Props) {
    return (
        <button
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
}
