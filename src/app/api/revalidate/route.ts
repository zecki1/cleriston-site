import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Lista de origens permitidas (URLs completas e exatas)
const allowedOrigins = [
    // 1. Para desenvolvimento local do admin
    'http://localhost:3000',

    // 2. Para produção (com e sem www)
    'https://zecki1.com.br',
    'https://www.zecki1.com.br',

    // 3. URLs alternativas ou legadas, se houver
    'https://zecki-site.vercel.app',

    // Você pode remover a variável de ambiente daqui, já que agora está explícito
    // process.env.NEXT_PUBLIC_ADMIN_URL, 
].filter(Boolean);

const corsHeaders = (origin: string) => {
    const headers = new Headers();
    // Permite a origem apenas se ela estiver na nossa lista
    if (allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
    }
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return headers;
};

// Handler para a requisição GET principal
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');

    // Se a origem não for nula e não for permitida, bloqueamos a requisição
    if (origin && !allowedOrigins.includes(origin)) {
        console.error(`CORS Blocked: Origin '${origin}' is not in the allowed list.`);
        return new NextResponse(JSON.stringify({ message: 'Origin not allowed' }), {
            status: 403, // Forbidden
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const headers = corsHeaders(origin || "");
    const secret = request.nextUrl.searchParams.get('secret');

    // A verificação do token continua a mesma, usando a variável privada
    if (secret !== process.env.REVALIDATE_TOKEN) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), { status: 401, headers });
    }

    // Se o token for válido, revalida a página principal
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, now: Date.now() }, { status: 200, headers });
}

// Handler para a requisição de "preflight" OPTIONS
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin || "");
    return new NextResponse(null, { status: 204, headers });
}