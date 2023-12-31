import "./globals.css"
import { Space_Grotesk } from "next/font/google"

const space_grotesk = Space_Grotesk({
    subsets: ["latin"],
})

export const metadata = {
    title: "Connect Four - Frontend Mentor Challenge",
    description:
        "Connect Four featuring play againt CPU with 3 difficulties and 2-player online. Done as a Frontend Mentor Challenge. Authored by Jordan Kisiel",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className={space_grotesk.className}
        >
            <body className="bg-purple-400">
                <main
                    className="mx-auto 
                                 flex 
                                 h-[100vh] 
                                 flex-row 
                                 items-center 
                                 justify-center 
                                 px-2 
                                 sm:aspect-[45/100] 
                                 md:aspect-[60/100]
                                 md:pt-[5%] 
                                 lg:aspect-[70/100]
                                 lg:pt-0
                                 "
                >
                    {children}
                </main>
            </body>
        </html>
    )
}
