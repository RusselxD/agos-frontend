/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    darkMode: "class",
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
                background: "#F0F4F8",
                "background-dark": "#050B14",
                neutral: "#2C3E50",
                clear: "#2ECC71",
                partial: "#F39C12",
                blocked: "#E74C3C",
            },
            backgroundImage: {
                'dark-gradient': 'radial-gradient(circle at top, #111828 0%, #050B14 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
            },
            keyframes: {
                "slide-in-right": {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                "dropdown-in": {
                    "0%": { opacity: "0", transform: "translateY(-8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-15px)" },
                },
                "pulse-slow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
            },
            animation: {
                "slide-in-right": "slide-in-right 0.3s ease-out",
                "dropdown-in": "dropdown-in 0.15s ease-out",
                float: "float 3s ease-in-out infinite",
                "bounce-slow": "bounce-slow 4s ease-in-out infinite",
                "pulse-slow": "pulse-slow 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
