"use client";

import Script from 'next/script';
import { useEffect } from 'react';

// Declara a variável global do VLibras para o TypeScript
declare global {
    interface Window {
        VLibras: any;
    }
}

export function VLibrasWidget() {
    useEffect(() => {
        // Este efeito garante que o widget seja inicializado após o script ser carregado
        const checkVlibras = setInterval(() => {
            if (window.VLibras) {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
                clearInterval(checkVlibras);
            }
        }, 100); // Verifica a cada 100ms

        return () => clearInterval(checkVlibras);
    }, []);

    return (
        <>
            <div vw="true" className="enabled">
                <div vw-access-button="true" className="active"></div>
                <div vw-plugin-wrapper="true">
                    <div className="vw-plugin-top-wrapper"></div>
                </div>
            </div>
            <Script
                src="https://vlibras.gov.br/app/vlibras-plugin.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // O script foi carregado, mas a inicialização é feita no useEffect para garantir
                }}
            />
        </>
    );
}