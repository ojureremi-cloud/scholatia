import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSessionToken, readSessionTokenFromRequest } from '@/lib/auth/session';

/**
 * Scholatia auth proxy (Next.js 16 "middleware").
 *
 * Protects authenticated routes by redirecting unauthenticated visitors to
 * /login. The check is optimistic: it verifies the signed session cookie
 * without a database lookup, per the Next.js authentication guidance.
 */
const PUBLIC_AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/settings',
  '/identity',
  '/verification',
  '/research',
  '/projects',
  '/manuscripts',
  '/datasets',
  '/collaborators',
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected || isPublicAuthRoute) {
    return NextResponse.next();
  }

  const token = readSessionTokenFromRequest(request);
  const session = decodeSessionToken(token);

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
