/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            sm: "375px",
            md: "750px",
            lg: "1000px",
            short: { raw: "(max-height:800px)" },
        },
        extend: {
            colors: {
                neutral: {
                    100: "#ffffff",
                    300: "#cccccc",
                    600: "#666666",
                    900: "#000000",
                },
                purple: {
                    400: "#7945FF",
                    500: "#5C2DD5",
                },
                red: {
                    300: "#FD6687",
                },
                yellow: {
                    300: "#FFCE57",
                },
            },
            boxShadow: {
                "2xl": "0px 10px 0px #000000",
            },
        },
    },
    plugins: [],
}
