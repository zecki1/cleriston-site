import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                border: "var(--border)",
            },
            textShadow: {
                sm: "0 0 2px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [animate],
} satisfies Config;