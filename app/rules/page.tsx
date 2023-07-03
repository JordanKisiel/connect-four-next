import checkIcon from "@/public/icon-check.svg"
import Link from "next/link"
import Image from "next/image"

const ONE_DAY = 86400 //seconds in a day

async function getRulesData() {
    const res = await fetch("http://localhost:3000/api/rules", {
        next: {
            revalidate: ONE_DAY,
        },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json()
}

export default async function Rules() {
    const rules = await getRulesData()

    if (rules === undefined) {
        throw new Error("Did not fetch rules data")
    }

    const procedureList: React.ReactNode[] = rules.content.howTo.procedure.map(
        (step: string) => (
            <li key={step} className="pl-3">
                {step}
            </li>
        )
    )

    return (
        <div className="relative 
                        flex 
                        flex-col 
                        mt-20 
                        items-center 
                        mx-4 
                        space-y-10 
                        rounded-[40px] 
                        border-[3px] 
                        border-neutral-900 
                        bg-neutral-100 
                        px-6 
                        pb-16 
                        pt-12 
                        shadow-2xl
                        lg:mt-32
                        lg:max-w-[30rem] 
                        short:space-y-5 
                        short:pt-6">
            <h2 className="text-6xl font-bold uppercase short:text-5xl">
                {rules.title}
            </h2>
            <div className="space-y-4 short:space-y-2">
                <h3 className="text-xl font-bold uppercase text-purple-400">
                    {rules.content.objective.header}
                </h3>
                <p className="leading-5">
                    {rules.content.objective.description}
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase text-purple-400">
                    {rules.content.howTo.header}
                </h3>
                <ol className="ml-3 space-y-3 leading-5">{procedureList}</ol>
            </div>
            <Link href="/" className="absolute -bottom-10 flex aspect-square">
                <button>
                    <Image src={checkIcon} alt="Check icon" />
                </button>
            </Link>
        </div>
    )
}
