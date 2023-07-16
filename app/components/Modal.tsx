import MenuButton from "./MenuButton"

type Props = {
    title: string
}

export default function Modal(props: Props) {
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
            "
        >
            <span className="text-center text-base font-bold uppercase md:text-2xl">
                {props.title}
            </span>
            <MenuButton
                handler={() => {}}
                bgColor="bg-neutral-100"
                textColor="text-neutral-900"
                textAlign="text-center"
            >
                Text
            </MenuButton>
            <MenuButton
                handler={() => {}}
                bgColor="bg-red-300"
                textColor="text-neutral-100"
                textAlign="text-center"
            >
                Text
            </MenuButton>
        </div>
    )
}
