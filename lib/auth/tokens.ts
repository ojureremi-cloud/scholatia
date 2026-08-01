import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE_NAME = 'scholatia_session';

export const SESSION_SECRET = process.env.SESSION_SECRET ?? 'scholatia-dev-session-secret';

export const DEFAULT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const REMEMBER_ME_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export interface SessionPayload {
  sid: string;
  uid: string;
  exp: number;
}

export function generateRandomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString();
}

export function signSessionToken(payload: SessionPayload): string {
  const body = encodeBase64Url(JSON.stringify(payload));
  const signature = createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }
  const [body, signature] = token.split('.');
  if (!body || !signature) {
    return null;
  }
  const expected = createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== providedBuffer.length || !timingSafeEqual(expectedBuffer, providedBuffer)) {
    return null;
  }
  try {
    const payload = JSON.parse(decodeBase64Url(body)) as SessionPayload;
    if (typeof payload.sid !== 'string' || typeof payload.uid !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }
    if (payload.exp <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
