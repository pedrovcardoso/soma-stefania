import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const MOCK_USERS = [
  { email: 'admin@fazenda', password: '123', role: 'admin' },
  { email: 'user@fazenda', password: '123', role: 'user' },
];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function POST(request) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { email, password } = await request.json();
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: 'Login inválido (MOCK)' }, { status: 401 });
  }

  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);

  const response = NextResponse.json({ success: true, message: 'Login Mock realizado' });

  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7200
  });

  return response;
}