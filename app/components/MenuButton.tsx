import Link from "next/link"

type Props = {
    bgColor: string
    textColor: string
    bgImage?: string
    textAlign: string
    padding?: string
    path: string
    children: React.ReactNode
}

export default function MenuButton({
    bgColor,
    textColor,
    bgImage,
    textAlign,
    padding,
    path,
    children,
}: Props) {
    return (
        <Link className="block" href={path}>
            <button
                className={`
                ${bgColor} 
                ${textColor} 
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
                `}
            >
                {children}
            </button>
        </Link>
    )
}
