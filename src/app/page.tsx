
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MobileNav } from "@/components/layout/MobileNav";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { SideNav } from "@/components/layout/SideNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function getSiteData(clienteId: string) {
    try {
        const docRef = doc(db, "clientes", clienteId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().siteData : null;
    } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
        return null;
    }
}

export default async function ModernHomePage() {
    const CLIENT_ID = process.env.CLIENT_ID;

    if (!CLIENT_ID) {
        return (
            <main className="flex h-screen items-center justify-center">
                <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                    <h1 className="text-2xl font-bold text-destructive">Erro de Configuração</h1>
                    {/* CORREÇÃO: Usando &apos; no lugar de ' */}
                    <p className="text-destructive/80 mt-2">A variável de ambiente &apos;CLIENT_ID&apos; não está configurada no servidor.</p>
                    <p className="text-destructive/80 mt-1">Por favor, adicione a variável no painel da Vercel e faça o redeploy.</p>
                </div>
            </main>
        );
    }

    const data = await getSiteData(CLIENT_ID);

    if (!data) {
        return (
            <main className="flex h-screen items-center justify-center">
                <div className="text-center p-6 bg-yellow-400/10 border border-yellow-500 rounded-lg">
                    <h1 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">Dados não Encontrados</h1>
                    <p className="text-yellow-700 dark:text-yellow-400 mt-2">Verifique se o CLIENT_ID (`{CLIENT_ID}`) está correto e se os dados existem no Firestore.</p>
                    {/* CORREÇÃO: Usando &apos; no lugar de ' */}
                    <p className="text-yellow-700 dark:text-yellow-400 mt-1">Pode ser necessário rodar o script &apos;npm run seed&apos; no projeto do painel.</p>
                </div>
            </main>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <FloatingHeader />
            <SideNav />
            <MobileNav />
            <main className="flex-grow">
                <HeroSection hero={data.hero} social={data.social} />
                <AboutSection data={data.sobre} />
                <PortfolioSection data={data.portfolio} />
                <ContactSection data={data.contato} />
            </main>
            <Footer social={data.social} />
        </div>
    );
}