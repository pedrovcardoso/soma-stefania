import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'defina-uma-chave-secreta-forte-no-env'
);

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ASSETS = ['/_next', '/favicon.ico', '/api/auth', '/static'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  if (PUBLIC_ASSETS.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/', req.url));
      } catch (error) {
        const response = NextResponse.next();
        response.cookies.delete('auth_token');
        return response;
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();

  } catch (error) {
    const loginUrl = new URL('/login', req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)'],
};