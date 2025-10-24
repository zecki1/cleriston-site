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

// --- LÓGICA DO FIREBASE ---
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
    // A verificação agora acontece antes de chamar esta função
    try {
        const docRef = doc(db, "clientes", clienteId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().siteData : null;
    } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
        return null;
    }
}

// --- O COMPONENTE DA PÁGINA ---
export default async function ModernHomePage() {
    // CORREÇÃO: Acessar a variável de ambiente de forma segura
    const CLIENT_ID = process.env.CLIENT_ID;

    // Verificação de segurança: Se CLIENT_ID não estiver no .env.local, mostre um erro claro.
    if (!CLIENT_ID || CLIENT_ID === "UID_DO_CLERISTON_NO_SEU_FIREBASE") {
        return (
            <main className="flex h-screen items-center justify-center">
                <div className="text-center p-4 bg-red-100 border border-red-400 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-800">Erro de Configuração</h1>
                    <p className="text-red-600 mt-2">A variável de ambiente `CLIENT_ID` não está definida no arquivo `.env.local`.</p>
                    <p className="text-red-600 mt-1">Por favor, defina o ID do cliente corretamente e reinicie o servidor.</p>
                </div>
            </main>
        );
    }

    const data = await getSiteData(CLIENT_ID);

    if (!data) {
        return (
            <main className="flex h-screen items-center justify-center">
                <div className="text-center p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                    <h1 className="text-2xl font-bold text-yellow-800">Dados não encontrados.</h1>
                    <p className="text-yellow-600 mt-2">Verifique se o CLIENT_ID (`{CLIENT_ID}`) está correto e se os dados existem no Firestore.</p>
                    <p className="text-yellow-600 mt-1">Você já rodou `npm run seed`?</p>
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