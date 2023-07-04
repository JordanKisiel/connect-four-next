import Image from 'next/image'
import Room from '@/app/components/Room'
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
    <div className="mx-auto flex h-[100vh] w-[90%] flex-col items-center justify-center p-4 space-y-6 sm:w-[90%] lg:w-[60%]">
        <Image className="mb-16" src={logo} alt="logo" />
        <h2 className="text-center text-3xl font-bold uppercase text-neutral-100  mb-10">
            Select Room
        </h2>
        {rooms}
    </div>
  )
}