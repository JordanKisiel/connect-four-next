import Image from "next/image"
import logo from "../public/logo.svg"
import MenuButton from "./components/MenuButton"

export default function Home() {
    return (
        <>
            <Image className="mb-16 md:mt-20 md:mb-20" src={logo} alt="logo" />
            <div className="w-full space-y-6 px-2 flex flex-col">
                <MenuButton
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textAlign="text-left"
                    bgImage="bg-[url(../public/player-vs-cpu.svg)]"
                    path="/vs-computer/select-difficulty"
                >
                    Play vs CPU
                </MenuButton>
                <MenuButton
                    bgColor="bg-yellow-300"
                    textColor="text-neutral-900"
                    textAlign="text-left"
                    bgImage="bg-[url(../public/player-vs-player.svg)]"
                    path="/vs-player/lobby"
                >
                    Player vs Player
                </MenuButton>
                <MenuButton
                    bgColor="bg-neutral-100"
                    textColor="text-neutral-900"
                    textAlign="text-left"
                    path="/rules"
                >
                    Game Rules
                </MenuButton>
            </div>
        </>
    )
}
