"use client";

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
    interface Window {
        VLibras: any;
    }
}

export function VLibrasWidget() {
    useEffect(() => {
        if (document.getElementById('vlibras-widget-script')) {
            return;
        }

        const vwDiv = document.createElement('div');
        vwDiv.setAttribute('vw', ''); 
        vwDiv.classList.add('enabled');
        const vwAccessButtonDiv = document.createElement('div');
        vwAccessButtonDiv.setAttribute('vw-access-button', '');
        vwAccessButtonDiv.classList.add('active');

        const vwPluginWrapperDiv = document.createElement('div');
        vwPluginWrapperDiv.setAttribute('vw-plugin-wrapper', '');

        const vwPluginTopWrapperDiv = document.createElement('div');
        vwPluginTopWrapperDiv.classList.add('vw-plugin-top-wrapper');

        vwPluginWrapperDiv.appendChild(vwPluginTopWrapperDiv);
        vwDiv.appendChild(vwAccessButtonDiv);
        vwDiv.appendChild(vwPluginWrapperDiv);

        document.body.appendChild(vwDiv);

        const script = document.createElement('script');
        script.id = 'vlibras-widget-script';
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.async = true;
        script.onload = () => {
            if (window.VLibras) {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            }
        };

        document.body.appendChild(script);

        return () => {
            const existingVwDiv = document.querySelector('div[vw]');
            const existingScript = document.getElementById('vlibras-widget-script');
            if (existingVwDiv) {
                document.body.removeChild(existingVwDiv);
            }
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    return null;
}