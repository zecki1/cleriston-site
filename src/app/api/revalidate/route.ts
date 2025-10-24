import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    // Protege a rota com um token secreto
    if (secret !== process.env.REVALIDATE_TOKEN) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
            status: 401,
            statusText: 'Unauthorized',
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Revalida a página principal
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, now: Date.now() });
}