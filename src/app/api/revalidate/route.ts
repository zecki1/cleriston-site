import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// URL do seu painel administrativo. Coloque em variáveis de ambiente para produção.
const ALLOWED_ORIGIN = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ADMIN_URL!
    : 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Headers de CORS
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (secret !== process.env.REVALIDATE_TOKEN) {
    return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
      status: 401,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  revalidatePath('/');
  
  return NextResponse.json({ revalidated: true, now: Date.now() }, {
    status: 200,
    headers: headers,
  });
}

// Rota OPTIONS para a "pergunta" de pre-flight do navegador
export async function OPTIONS(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new NextResponse(null, { status: 204, headers });
}