import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.svg"
import MenuButton from "@/app/components/MenuButton"
import Button from "@/app/components/Button"

export default function Home() {
    return (
        <>
            <Image className="mb-16" src={logo} alt="logo" />
            <div className="flex w-full flex-1 flex-col space-y-6">
                <h2 className="text-center text-4xl font-bold uppercase text-neutral-100">
                    Select Difficulty
                </h2>
                <MenuButton
                    bgColor="bg-purple-500"
                    textColor="text-neutral-100"
                    textAlign="text-center"
                    padding="p-3"
                    path="/vs-computer/game/easy"
                >
                    Easy
                </MenuButton>
                <MenuButton
                    bgColor="bg-purple-500"
                    textColor="text-neutral-100"
                    textAlign="text-center"
                    padding="p-3"
                    path="/vs-computer/game/medium"
                >
                    Medium
                </MenuButton>
                <MenuButton
                    bgColor="bg-purple-500"
                    textColor="text-neutral-100"
                    textAlign="text-center"
                    padding="p-3"
                    path="/vs-computer/game/hard"
                >
                    Hard
                </MenuButton>
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
        </>
    )
}
