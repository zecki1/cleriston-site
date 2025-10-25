import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/i18n-provider";
import { VLibrasWidget } from "@/components/layout/VLibrasWidget";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  verification: {
    google: "vQW2AMmW_PNKbl194KzVXMG0Sc-qm-ETPWolHde-5wQ",
  },
  title: "Cleriston Ribeiro - Ilustrador e Concept Artist 2D",
  description: "Olá, sou o Cleriston Ribeiro - Ilustrador, amante da arte e bem humorado. Explore meu portfólio de ilustrações, caricaturas e concept art 2D.",
  keywords: "Ilustração, ilustrador, vetor, vetorização, logo, flat, ilustrador cleriston, cleris ilustra, ilustrações, animações, vetores, Editorial, ilustração vetorial, ilustração didatica, caricaturas animadas, caricaturista, concept artist 2d, artista 2d",
  openGraph: {
    title: "Cleriston Ribeiro - Ilustrador e Concept Artist 2D",
    description: "Olá, sou o Cleriston Ribeiro - Ilustrador, amante da arte e bem humorado. Desenhos humorizados.",
    url: "https://cleristonribeiro.com.br",
    siteName: "Cleriston Ribeiro - Ilustrador",
    images: [{ url: "/assets/img/perfil.jpg", width: 800, height: 600, alt: "Foto de Cleriston Ribeiro" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleriston Ribeiro - Ilustrador e Concept Artist 2D",
    description: "Olá, sou o Cleriston Ribeiro - Ilustrador, amante da arte e bem humorado. Desenhos humorizados.",
    images: ["/assets/img/perfil.jpg"],
  },
  icons: {
    icon: [
      { url: '/assets/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/assets/favicons/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <I18nProvider>
            {children}
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
        <VLibrasWidget />
      </body>
    </html>
  );
}