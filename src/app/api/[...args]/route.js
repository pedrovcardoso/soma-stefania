import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const TARGET_API_URL = process.env.API_URL;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sua-chave-secreta');

async function handler(request) {
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ message: 'Sessão expirada' }, { status: 401 });
  }

  const path = request.nextUrl.pathname.replace(/^\/api/, '');
  const targetUrl = `${TARGET_API_URL}${path}${request.nextUrl.search}`;

  try {
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('content-length');
    headers.delete('cookie');
    
    const options = {
      method: request.method,
      headers: headers,
      body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : undefined,
      duplex: 'half'
    };

    const backendResponse = await fetch(targetUrl, options);
    
    const data = await backendResponse.text();

    return new NextResponse(data, {
      status: backendResponse.status,
      headers: {
        'Content-Type': backendResponse.headers.get('content-type') || 'application/json',
      },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ message: 'Erro de comunicação' }, { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };