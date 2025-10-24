"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string>("light");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "system";
        const resolvedTheme =
            savedTheme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : savedTheme;
        setTheme(resolvedTheme);
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");

        const savedLanguage = localStorage.getItem("i18nLng") || "ptBR";
        i18n.changeLanguage(savedLanguage);

        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const root = document.documentElement;
        const resolvedTheme =
            theme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : theme;
        root.classList.toggle("dark", resolvedTheme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme, isMounted]);

    useEffect(() => {
        if (!isMounted || theme !== "system") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const systemTheme = mediaQuery.matches ? "dark" : "light";
            document.documentElement.classList.toggle("dark", systemTheme === "dark");
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, isMounted]);

    if (!isMounted) {
        return null; // Não renderiza nada até o tema e idioma serem ajustados
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
    }
    return context;
}