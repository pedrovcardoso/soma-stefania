import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const API_BASE_URL = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
  ? 'http://localhost:3000/api/mock'
  : process.env.API_URL;

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'defina-uma-chave-secreta-forte-no-env'
);

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const backendResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 });
    }

    const token = await new SignJWT({ email, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7200 // 2 horas em segundos
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Erro interno.' }, { status: 500 });
  }
}