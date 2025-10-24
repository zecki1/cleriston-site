"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

type MultiLangText = { ptBR: string; en: string; es: string;[key: string]: string; };
type AboutData = { titulo: MultiLangText; subtitulo: MultiLangText; texto: MultiLangText; imagemPerfilUrl: string; };

export function AboutSection({ data }: { data: AboutData }) {
    const { i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    useEffect(() => { AOS.init({ duration: 1000, easing: 'ease-in-out', once: true, mirror: false }); }, []);

    const currentLanguage = isMounted ? (i18n.language as keyof MultiLangText) : 'ptBR';
    const titulo = data.titulo[currentLanguage] || data.titulo.ptBR;
    const subtitulo = data.subtitulo[currentLanguage] || data.subtitulo.ptBR;
    const texto = data.texto[currentLanguage] || data.texto.ptBR;

    return (
        <section id="sobre" className="w-full py-16 md:py-24 bg-muted/50 dark:bg-muted/20">
            <div className="container mx-auto px-4">
                <div data-aos="fade-up">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-wide text-foreground/80 relative pb-5 mb-5 after:content-[''] after:absolute after:w-10 after:h-1 after:bg-primary after:bottom-0 after:left-1/2 after:-translate-x-1/2 before:content-[''] before:absolute before:w-32 before:h-px before:bg-gray-300 dark:before:bg-gray-700 before:bottom-px before:left-1/2 before:-translate-x-1/2">
                            {titulo}
                        </h2>
                        <p className="text-muted-foreground">{subtitulo}</p>
                    </div>
                    <div className="grid grid-cols-12 gap-8 items-start">
                        <div className="col-span-12 lg:col-span-9 space-y-4 text-foreground/70" data-aos="fade-up" data-aos-delay="100">
                            {texto.split('\n\n').map((paragrafo, index) => (
                                paragrafo && <p key={index} className="leading-relaxed">{paragrafo}</p>
                            ))}
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex justify-center" data-aos="fade-up" data-aos-delay="100">
                            <Image src={data.imagemPerfilUrl} alt="Foto de Perfil de Cleriston Ribeiro" width={250} height={250} className="rounded-lg object-cover shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}