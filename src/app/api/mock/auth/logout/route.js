import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true, message: 'Logout Mock realizado' });
  
  // Remove o cookie definindo maxAge como 0
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  return response;
}