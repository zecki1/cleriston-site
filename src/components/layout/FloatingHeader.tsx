"use client"

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

// Mapeamento dos idiomas e suas siglas
const languages = [
    { code: 'ptBR', label: 'BR' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
];

export function FloatingHeader() {
    const { theme, setTheme } = useTheme();
    const { i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    // Efeito para evitar erro de hidratação (hydration mismatch)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cicla para o próximo idioma na lista
    const handleLanguageChange = () => {
        const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
        const nextIndex = (currentIndex + 1) % languages.length;
        i18n.changeLanguage(languages[nextIndex].code);
    };

    // Alterna entre tema claro e escuro
    const handleThemeChange = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Renderiza o botão apenas quando o componente estiver montado no cliente
    if (!isMounted) {
        return null;
    }

    const currentLangLabel = languages.find(lang => lang.code === i18n.language)?.label || 'BR';

    return (
        <header className="fixed top-4 right-4 z-50">
            <div className="flex items-center gap-2 rounded-full bg-background/80 p-1 backdrop-blur-sm border">

                {/* Botão de idioma com ação direta */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 font-semibold text-sm"
                    onClick={handleLanguageChange}
                    aria-label="Mudar idioma"
                >
                    {currentLangLabel}
                </Button>

                {/* Botão de tema com ação Direta e Animação */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={handleThemeChange}
                    aria-label="Mudar tema"
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={theme === 'dark' ? 'moon' : 'sun'}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                        </motion.div>
                    </AnimatePresence>
                </Button>

            </div>
        </header>
    );
}