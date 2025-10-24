"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, MessageSquare } from 'lucide-react';
import { FaBehanceSquare } from "react-icons/fa";

type SocialData = {
    instagram: string;
    whatsapp: string;
    behance: string;
    linkedin: string;
};

export function Footer({ social }: { social: SocialData }) {
    const { i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const currentLanguage = isMounted ? (i18n.language as keyof typeof footerTexts.line1) : 'ptBR';

    const footerTexts = {
        line1: {
            ptBR: 'Representado por Lemonade Illustration Agency.',
            en: 'Represented by Lemonade Illustration Agency.',
            es: 'Representado por Lemonade Illustration Agency.'
        },
        line2: {
            ptBR: 'Todos os direitos de imagens são reservados aos seus autores e elaboradores de cada projeto, conforme contrato estabelecido.',
            en: 'All image rights are reserved to their authors and project developers, as per the established contract.',
            es: 'Todos los derechos de imagen están reservados a sus autores y desarrolladores de proyectos, según el contrato establecido.'
        },
        line3: {
            ptBR: 'Desenvolvido por',
            en: 'Developed by',
            es: 'Desarrollado por'
        }
    };

    return (
        <footer id="footer" className="bg-muted py-8 text-center text-muted-foreground">
            <div className="container mx-auto">
                <div className="flex justify-center gap-4 mb-6">
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Instagram size={24} />
                    </a>
                    <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <MessageSquare size={24} />
                    </a>
                    <a href={social.behance} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <FaBehanceSquare size={24} />
                    </a>
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Linkedin size={24} />
                    </a>
                </div>
                <div className="text-sm space-y-2">
                    <p>{footerTexts.line1[currentLanguage] || footerTexts.line1.ptBR}</p>
                    <p>{footerTexts.line2[currentLanguage] || footerTexts.line2.ptBR} &copy; {new Date().getFullYear()}</p>
                    <p>
                        {footerTexts.line3[currentLanguage] || footerTexts.line3.ptBR}{' '}
                        <a href="https://zecki1.com.br" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                            zecki1
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}