import "./globals.css"

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
        <html lang="en">
            <body className="bg-purple-400">{children}</body>
        </html>
    )
}
