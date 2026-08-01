import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 } as const;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !hash) {
    return false;
  }
  const derived = scryptSync(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS);
  const expected = Buffer.from(hash, 'hex');
  if (derived.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}

export function isPasswordStrong(password: string): boolean {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}
