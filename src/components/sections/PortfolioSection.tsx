"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from './SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type MultiLangText = { ptBR: string; en?: string; es?: string;[key: string]: string | undefined; };
type PortfolioItem = { id: string; titulo: MultiLangText; descricao: MultiLangText; categoria: string; imagemUrl: string; };
type PortfolioData = { titulo: MultiLangText; subtitulo: MultiLangText; items: PortfolioItem[]; };

export function PortfolioSection({ data }: { data: PortfolioData }) {
    const { i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const currentLanguage = isMounted ? (i18n.language as keyof MultiLangText) : 'ptBR';
    const titulo = data.titulo[currentLanguage] || data.titulo.ptBR;
    const subtitulo = data.subtitulo[currentLanguage] || data.subtitulo.ptBR;

    const [filter, setFilter] = useState('*');
    const categories = ['*', ...Array.from(new Set(data.items.map(item => item.categoria)))];
    const filteredItems = filter === '*' ? data.items : data.items.filter(item => item.categoria === filter);

    const categoryTranslations = { all: { ptBR: 'Todos', en: 'All', es: 'Todos' }, characterDesign: { ptBR: 'Character Design', en: 'Character Design', es: 'Diseño de Personajes' }, caricatura: { ptBR: 'Caricaturas', en: 'Caricatures', es: 'Caricaturas' }, publi: { ptBR: 'Publicidade', en: 'Advertising', es: 'Publicidad' }, editorial: { ptBR: 'Editorial', en: 'Editorial', es: 'Editorial' }, };
    const getCategoryTranslation = (category: string) => {
        const key = category.replace('-', '') as keyof typeof categoryTranslations;
        const langKey = currentLanguage as keyof typeof categoryTranslations.all;
        return categoryTranslations[key]?.[langKey] || category;
    };

    const handleCardClick = (index: number) => {
        setStartIndex(index);
        setOpen(true);
    };

    return (
        <SectionWrapper id="portfolio" title={titulo} subtitle={subtitulo}>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
                {categories.map(cat => (<Button key={cat} variant={filter === cat ? "default" : "outline"} onClick={() => setFilter(cat)} className="capitalize"> {cat === '*' ? (categoryTranslations.all[currentLanguage] || categoryTranslations.all.ptBR) : getCategoryTranslation(cat)} </Button>))}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {filteredItems.map((item, index) => {
                            const itemTitle = item.titulo[currentLanguage] || item.titulo.ptBR;
                            return (
                                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                                    <Card onClick={() => handleCardClick(index)} className="overflow-hidden group cursor-pointer">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square">
                                                <Image src={item.imagemUrl} alt={itemTitle!} fill className="object-cover transition-transform duration-300 group-hover:scale-105" onContextMenu={(e) => e.preventDefault()} />
                                                <div className="absolute inset-0 bg-black/20 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"><h3 className="text-white font-bold text-lg">{itemTitle}</h3></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
                <DialogContent className="sm:max-w-none w-screen h-screen max-h-screen bg-black/90 backdrop-blur-lg border-none flex flex-col items-center justify-center p-0">
                    <VisuallyHidden><DialogTitle>Visualizador de Imagem do Portfólio</DialogTitle></VisuallyHidden>
                    <Carousel setApi={setApi} opts={{ loop: true, startIndex: startIndex }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]} className="w-full h-full max-w-7xl flex items-center justify-center">
                        <CarouselContent className="h-full">
                            {filteredItems.map((item) => {
                                const itemTitle = item.titulo[currentLanguage] || item.titulo.ptBR;
                                const itemDesc = item.descricao[currentLanguage] || item.descricao.ptBR;
                                return (
                                    <CarouselItem key={item.id} className="h-full flex flex-col items-center justify-center">
                                        <div className="w-full h-[75vh] relative mb-4">
                                            <Image src={item.imagemUrl} alt={itemTitle!} fill className="object-contain pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
                                        </div>
                                        <div className="text-center text-white px-4">
                                            <h3 className="text-2xl font-bold">{itemTitle}</h3>
                                            <p className="text-white/80 mt-2 max-w-xl mx-auto">{itemDesc}</p>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20" />
                        <CarouselNext className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20" />
                    </Carousel>
                    <div className="absolute bottom-4 text-sm text-white/50">{current} de {filteredItems.length}</div>
                </DialogContent>
            </Dialog>
        </SectionWrapper>
    );
}