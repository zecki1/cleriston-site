"use client";

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, User, Book, Mail } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

// Dados dos links com traduções
const navLinksData = [
    { id: 'hero', title: { ptBR: 'Início', en: 'Home', es: 'Inicio' }, icon: <Home className="h-6 w-6" /> },
    { id: 'sobre', title: { ptBR: 'Sobre', en: 'About', es: 'Sobre Mí' }, icon: <User className="h-6 w-6" /> },
    { id: 'portfolio', title: { ptBR: 'Portfólio', en: 'Portfolio', es: 'Portafolio' }, icon: <Book className="h-6 w-6" /> },
    { id: 'contact', title: { ptBR: 'Contato', en: 'Contact', es: 'Contacto' }, icon: <Mail className="h-6 w-6" /> },
];

export function SideNav() {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof typeof navLinksData[0]['title'];

    useEffect(() => {
        const sections = navLinksData.map(link => document.getElementById(link.id));
        const navLinksElements = document.querySelectorAll('a.nav-link');

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach(section => {
                if (section) {
                    const link = document.querySelector(`a.nav-link[href="#${section.id}"]`);
                    if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                        navLinksElements.forEach(l => l.classList.remove('active'));
                        link?.classList.add('active');
                    }
                }
            });
        };

        const smoothScroll = (e: MouseEvent) => {
            e.preventDefault();
            const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (targetId) {
                document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }
        };

        navLinksElements.forEach(link => link.addEventListener('click', smoothScroll as EventListener));
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            navLinksElements.forEach(link => link.removeEventListener('click', smoothScroll as EventListener));
        };
    }, []);

    return (
        <nav className="fixed top-1/2 left-0 -translate-y-1/2 z-40 hidden lg:block ml-4">
            <style jsx global>{`
                .nav-link.active {
                    background-color: hsl(var(--primary));
                    transform: scale(1.1);
                }
                .nav-link.active .icon-container {
                    color: hsl(var(--primary-foreground));
                }
            `}</style>
            <TooltipProvider delayDuration={0}>
                <ul className="flex flex-col gap-2 p-2 bg-background/50 border rounded-full backdrop-blur-sm ">
                    {navLinksData.map(link => (
                        <li key={link.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={`#${link.id}`}
                                        className={cn('nav-link flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group', 'bg-muted/50 hover:bg-primary ')}
                                    >
                                        <div className="icon-container text-muted-foreground group-hover:text-primary-foreground transition-colors">
                                            {link.icon}
                                        </div>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{link.title[currentLanguage] || link.title.ptBR}</p>
                                </TooltipContent>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </TooltipProvider>
        </nav>
    );
}