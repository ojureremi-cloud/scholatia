import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import {
  DEFAULT_SESSION_TTL_MS,
  REMEMBER_ME_SESSION_TTL_MS,
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from './tokens';

export function getSessionTtlMs(rememberMe: boolean): number {
  return rememberMe ? REMEMBER_ME_SESSION_TTL_MS : DEFAULT_SESSION_TTL_MS;
}

export function createSessionToken(payload: SessionPayload): string {
  return signSessionToken(payload);
}

export async function setSessionCookie(token: string, rememberMe: boolean): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(getSessionTtlMs(rememberMe) / 1000),
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function readSessionTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}

export async function readSessionTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export function decodeSessionToken(token: string | null | undefined): SessionPayload | null {
  return verifySessionToken(token);
}
