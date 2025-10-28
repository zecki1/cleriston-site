import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://zecki1.com.br',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

    if (!REVALIDATE_TOKEN) {
        console.error("A variável de ambiente REVALIDATE_TOKEN não está definida.");
        return NextResponse.json({ message: 'A configuração do servidor está incompleta.' }, { status: 500, headers: corsHeaders });
    }

    if (secret !== REVALIDATE_TOKEN) {
        console.warn(`Tentativa de revalidação com token inválido.`);
        return NextResponse.json({ message: 'Invalid Token' }, { status: 401, headers: corsHeaders });
    }

    revalidatePath('/');
    return NextResponse.json({ revalidated: true, now: Date.now() }, { headers: corsHeaders });
}