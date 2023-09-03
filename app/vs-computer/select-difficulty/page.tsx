import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.svg"
import { MenuButton } from "@/app/components/MenuButton"
import Button from "@/app/components/Button"

export default function Home() {
    return (
        <>
            <div className="flex w-full flex-col items-center md:max-w-[30rem] lg:max-w-[35rem]">
                <Image
                    className="mb-16"
                    src={logo}
                    alt="logo"
                />
                <h2 className="mb-10 text-center text-3xl font-bold uppercase  text-neutral-100">
                    Select Difficulty
                </h2>
                <div className="mb-10 flex w-full flex-col space-y-6 px-2 md:mb-20">
                    <Link href="/vs-computer/game/easy">
                        <MenuButton
                            bgColor="bg-purple-500"
                            textColor="text-neutral-100"
                            textAlign="text-center"
                            padding="p-3"
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
                    >
                        Back to Main Menu
                    </Button>
                </Link>
            </div>
        </>
    )
}
