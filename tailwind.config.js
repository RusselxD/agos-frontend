/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Poppins",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "Noto Sans",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
            },
            colors: {
                primary: "#0A3D62",
                accent: "#1ABC9C",
                background: "#F2F2F2",
                neutral: "#2C3E50",
                clear: "#2ECC71",
                partial: "#F39C12",
                blocked: "#E74C3C",
            },
        },
    },
    plugins: [],
};
