"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu, Home, User, Book, Mail } from 'lucide-react';

const navLinksData = [
    { id: 'hero', title: { ptBR: 'Início', en: 'Home', es: 'Inicio' }, icon: <Home className="mr-2 h-4 w-4" /> },
    { id: 'sobre', title: { ptBR: 'Sobre', en: 'About', es: 'Sobre Mí' }, icon: <User className="mr-2 h-4 w-4" /> },
    { id: 'portfolio', title: { ptBR: 'Portfólio', en: 'Portfolio', es: 'Portafolio' }, icon: <Book className="mr-2 h-4 w-4" /> },
    { id: 'contact', title: { ptBR: 'Contato', en: 'Contact', es: 'Contacto' }, icon: <Mail className="mr-2 h-4 w-4" /> },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof typeof navLinksData[0]['title'];

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId) {
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <div className="lg:hidden fixed top-4 left-4 z-50 ml-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm w-10 h-10">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="flex flex-col gap-4 mt-8 pl-4">
                        {navLinksData.map(link => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={handleLinkClick}
                                className="flex items-center text-lg font-medium text-muted-foreground hover:text-foreground"
                            >
                                {link.icon}
                                {link.title[currentLanguage] || link.title.ptBR}
                            </a>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}