// src/lib/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // Detecta o idioma do usuário no navegador
    .use(LanguageDetector)
    // Passa a instância do i18n para a react-i18next
    .use(initReactI18next)
    // Inicializa o i18next
    .init({
        // Idioma padrão caso a detecção falhe
        fallbackLng: 'ptBR',
        // Idiomas disponíveis
        supportedLngs: ['ptBR', 'en', 'es'],
        // Desativa logs de debug no console
        debug: false,
        interpolation: {
            escapeValue: false, // O React já faz o escape de XSS
        },
        // Configurações do detector de idioma
        detection: {
            // Ordem de detecção: 1º localStorage, 2º navegador
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;