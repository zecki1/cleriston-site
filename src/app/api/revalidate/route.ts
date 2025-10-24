import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Lista de origens permitidas
const allowedOrigins = [
    process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_ADMIN_URL : 'http://localhost:3000',
    'https://zecki-site.vercel.app', 'zecki1.com.br/',
];

const corsHeaders = (origin: string | null) => {
    const headers = new Headers();
    if (origin && allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
    }
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return headers;
};

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);

    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_TOKEN) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), { status: 401, headers });
    }

    revalidatePath('/');

    return NextResponse.json({ revalidated: true, now: Date.now() }, { status: 200, headers });
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin);
    return new NextResponse(null, { status: 204, headers });
}