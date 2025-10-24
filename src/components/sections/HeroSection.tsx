"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Instagram, Linkedin, MessageSquare } from 'lucide-react';
import { FaBehanceSquare } from "react-icons/fa";

type TypedItemsMultiLang = { ptBR: string[]; en: string[]; es: string[];[key: string]: string[]; };
type HeroData = { title: string; typedItems: TypedItemsMultiLang; backgroundImage?: string };
type SocialData = { instagram: string; whatsapp: string; behance: string; linkedin: string; };

export function HeroSection({ hero, social }: { hero: HeroData, social: SocialData }) {
  const { i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const currentLanguage = isMounted ? i18n.language : 'ptBR';
  const itemsToDisplay = hero.typedItems[currentLanguage] || hero.typedItems.ptBR;
  const bgImage = hero.backgroundImage || "/assets/img/hero-bg.jpg";

  const heroTexts = {
    iAm: { ptBR: 'Eu sou', en: 'I am', es: 'Yo soy' }
  }

  return (
    <section id="hero" className="relative flex h-screen w-full flex-col items-center justify-center text-center text-foreground">
      <Image src={bgImage} alt="Background" fill className="object-cover z-0" priority />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="container relative z-20">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{hero.title}</h1>
        <div className="mt-4 text-xl md:text-3xl">
          <span>{isMounted ? heroTexts.iAm[currentLanguage] : heroTexts.iAm.ptBR} </span>
          {isMounted && (
            <TypeAnimation sequence={itemsToDisplay.flatMap(item => [item, 2000])} wrapper="span" speed={50} className="font-semibold text-primary" repeat={Infinity} />
          )}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 flex justify-center gap-4">
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={28} /></a>
          <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare size={28} /></a>
          <a href={social.behance} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaBehanceSquare size={28} /></a>
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={28} /></a>
        </motion.div>
      </motion.div>
    </section>
  );
}