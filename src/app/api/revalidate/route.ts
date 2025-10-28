import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    // ✨ CORREÇÃO: O token secreto DEVE ser lido de uma variável de ambiente privada
    const secret = request.nextUrl.searchParams.get('secret');
    const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

    // Verifica se a variável de ambiente está configurada no servidor
    if (!REVALIDATE_TOKEN) {
        console.error("A variável de ambiente REVALIDATE_TOKEN não está definida.");
        return NextResponse.json({ message: 'A configuração do servidor está incompleta.' }, { status: 500 });
    }

    // Compara o token da requisição com o token do ambiente
    if (secret !== REVALIDATE_TOKEN) {
        console.warn(`Tentativa de revalidação com token inválido: ${secret}`);
        return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    }

    // Se o token for válido, revalida o cache da página inicial
    revalidatePath('/');

    // Retorna uma resposta de sucesso
    return NextResponse.json({ revalidated: true, now: Date.now() });
}