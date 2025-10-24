import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Exemplo de pasta privada que você não quer indexar
        },
        sitemap: 'https://cleristonribeiro.com.br/sitemap.xml', // Use o domínio final
    }
}