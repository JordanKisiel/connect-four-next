type Props = {
    textColor: string
    bgColor: string
    paddingX: string
    children: React.ReactNode
}

export default function Button({
    textColor,
    bgColor,
    paddingX,
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
        >
            {children}
        </button>
    )
}
