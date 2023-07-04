import Image from 'next/image'
import Link from 'next/link'
import Room from '@/app/components/Room'
import Button from '@/app/components/Button'
import logo from '@/public/logo.svg'

export default function Lobby() {

    //small number of multiplayer rooms just to keep project simple
    const NUM_OF_ROOMS = 3

    const roomsArray = Array(NUM_OF_ROOMS).fill('')
    const rooms = roomsArray.map((room, index) => {
        return (
            <Room key={index} roomID={index + 1} />
        )
    })

    return (
        <div className="mx-auto flex h-[100vh] w-[90%] flex-col items-center justify-center p-4 sm:w-[90%] lg:w-[60%]">
            <Image className="mb-16" src={logo} alt="logo" />
            <h2 className="text-center text-3xl font-bold uppercase text-neutral-100  mb-10">
                Select Room
            </h2>
            <div className="space-y-6 w-full">
            {rooms}
            </div>
            <Link className="block mt-16" href="/">
                <Button
                    textColor="text-neutral-100"
                    bgColor="bg-purple-500"
                    paddingX="px-6"
                >
                    Back to Main Menu
                </Button>
            </Link>
        </div>
    )
}