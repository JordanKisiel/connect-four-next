import MenuButton from "./MenuButton"

type Props = {
    roomID: number
}

export default function Room({roomID} : Props){

    return (
        <div 
            className="
                relative 
                flex w-full 
                flex-col 
                items-center 
                rounded-[40px] 
                border-[3px] 
                border-neutral-900 
                bg-neutral-100 
                px-6 
                pt-3 
                pb-6 
                shadow-2xl 
                short:space-y-5 
                short:pt-6"
            >
            <h2 className="text-2xl font-bold uppercase mb-3 short:text-2xl">{`Room ${roomID}`}</h2>
            <div className="flex w-full justify-between gap-6 lg:justify-around lg:gap-12">
                <MenuButton
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textAlign="text-center"
                    padding="p-3"
                >
                    Player 1
                </MenuButton>
                <MenuButton
                    bgColor="bg-yellow-300"
                    textColor="text-neutral-900"
                    textAlign="text-center"
                    padding="p-3"
                >
                    Player 2
                </MenuButton>
            </div>
        </div>
    )
}



