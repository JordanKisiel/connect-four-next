type Props = {
    title: string
    children: React.ReactNode
}

export default function Modal({ title, children }: Props) {
    return (
        <div
            className="
            absolute
            top-[35%]
            flex
            w-5/6
            flex-col
            items-center
            gap-6
            rounded-3xl
            border-[3px]
            border-neutral-900
            bg-purple-400
            bg-[center_right_1rem]
            bg-no-repeat
            px-5
            py-12
            text-neutral-100
            shadow-2xl
            md:w-[65%]
            md:max-w-[30rem]
            "
        >
            <span className="text-center text-base font-bold uppercase md:text-2xl">
                {title}
            </span>
            {children}
        </div>
    )
}
