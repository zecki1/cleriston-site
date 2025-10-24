"use client"

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import emailjs from '@emailjs/browser';
import { SectionWrapper } from "./SectionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type MultiLangText = { ptBR: string; en: string; es: string;[key: string]: string; };
type ContactData = { titulo: MultiLangText; localizacao: string; email: string; telefone: string; };

export function ContactSection({ data }: { data: ContactData }) {
    const { i18n } = useTranslation();
    const form = useRef<HTMLFormElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const currentLanguage = isMounted ? (i18n.language as keyof MultiLangText) : 'ptBR';
    const titulo = data.titulo[currentLanguage] || data.titulo.ptBR;

    const formTexts = {
        location: { ptBR: 'Localização', en: 'Location', es: 'Ubicación' },
        email: { ptBR: 'Email', en: 'Email', es: 'Correo Electrónico' },
        phone: { ptBR: 'Telefone', en: 'Phone', es: 'Teléfono' },
        nameLabel: { ptBR: 'Seu Nome', en: 'Your Name', es: 'Tu Nombre' },
        emailLabel: { ptBR: 'Seu Email', en: 'Your Email', es: 'Tu Email' },
        subjectLabel: { ptBR: 'Assunto', en: 'Subject', es: 'Asunto' },
        messageLabel: { ptBR: 'Mensagem', en: 'Message', es: 'Mensaje' },
        buttonText: { ptBR: 'Enviar Mensagem', en: 'Send Message', es: 'Enviar Mensaje' },
        submittingText: { ptBR: 'Enviando...', en: 'Sending...', es: 'Enviando...' },
        successTitle: { ptBR: "Sucesso!", en: "Success!", es: "¡Éxito!" },
        successDescription: { ptBR: "Mensagem enviada. Obrigado!", en: "Message sent. Thank you!", es: "¡Mensaje enviado. Gracias!" },
        errorTitle: { ptBR: "Erro!", en: "Error!", es: "¡Error!" },
        errorDescription: { ptBR: "Falha ao enviar a mensagem.", en: "Failed to send the message.", es: "Error al enviar el mensaje." },
    };

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.current) return;
        setIsSubmitting(true);

        emailjs.sendForm(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            form.current,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        ).then(() => {
            toast.success(formTexts.successTitle[currentLanguage], {
                description: formTexts.successDescription[currentLanguage],
            });
            form.current?.reset();
        }, (error) => {
            toast.error(formTexts.errorTitle[currentLanguage], {
                description: `${formTexts.errorDescription[currentLanguage]} ${error.text}`,
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <SectionWrapper id="contact" title={titulo}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CORREÇÃO DO ALINHAMENTO ABAIXO */}
                <div className="lg:col-span-1 flex flex-col justify-center space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full"><MapPin /></div>
                        <div><h3 className="font-semibold text-lg">{formTexts.location[currentLanguage]}</h3><p className="text-muted-foreground">{data.localizacao}</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full"><Mail /></div>
                        <div><h3 className="font-semibold text-lg">{formTexts.email[currentLanguage]}</h3><a href={`mailto:${data.email}`} className="text-muted-foreground hover:text-primary">{data.email}</a></div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full"><Phone /></div>
                        <div><h3 className="font-semibold text-lg">{formTexts.phone[currentLanguage]}</h3><a href={`https://wa.me/${data.telefone.replace(/\D/g, '')}`} className="text-muted-foreground hover:text-primary">{data.telefone}</a></div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <Card><CardContent className="p-6"><form ref={form} onSubmit={sendEmail} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><Label htmlFor="name">{formTexts.nameLabel[currentLanguage]}</Label><Input id="name" name="name" required /></div>
                            <div><Label htmlFor="email">{formTexts.emailLabel[currentLanguage]}</Label><Input id="email" name="email" type="email" required /></div>
                        </div>
                        <div><Label htmlFor="subject">{formTexts.subjectLabel[currentLanguage]}</Label><Input id="subject" name="subject" required /></div>
                        <div><Label htmlFor="message">{formTexts.messageLabel[currentLanguage]}</Label><Textarea id="message" name="message" required /></div>
                        <div className="text-center"><Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? formTexts.submittingText[currentLanguage] : formTexts.buttonText[currentLanguage]}
                        </Button></div>
                    </form></CardContent></Card>
                </div>
            </div>
        </SectionWrapper>
    );
}