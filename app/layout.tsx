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
        <html lang="en" className={space_grotesk.className}>
            <body className="bg-purple-400">
                <main className="mx-auto flex h-[100vh] flex-col items-center justify-center p-4 sm:max-w-xl md:justify-start md:pt-[13rem]">
                    {children}
                </main>
            </body>
        </html>
    )
}