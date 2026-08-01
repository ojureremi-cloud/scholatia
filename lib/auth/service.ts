import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { VerificationLevel, type AccountCategory, type AccountType } from '@/types/identity';
import type {
  PublicProfile,
  PublicSession,
  PublicUser,
  RegisterRequest,
} from '@/types/auth';
import type { ProfileRow, SessionRow, UserRow } from '@/types/schema';
import { createSaidIdentifier } from '@/lib/said';
import { hashPassword, verifyPassword } from './password';
import {
  EMAIL_VERIFICATION_TOKEN_TTL_MS,
  PASSWORD_RESET_TOKEN_TTL_MS,
  generateRandomToken,
  signSessionToken,
} from './tokens';
import { decodeSessionToken, readSessionTokenFromRequest } from './session';
import * as store from './store';
import { normalizeEmail } from './validation';

export class AuthServiceError extends Error {
  constructor(
    public readonly code: 'invalid_credentials' | 'email_not_verified' | 'email_in_use' | 'invalid_token' | 'expired_token' | 'user_not_found',
    message: string,
  ) {
    super(message);
  }
}

const DEFAULT_ROLE = 'Student' as const;
const DEFAULT_ACCOUNT_CATEGORY: AccountCategory = 'Individual';
const DEFAULT_ACCOUNT_TYPE: AccountType = 'Student';

export async function registerUser(input: RegisterRequest): Promise<{ user: PublicUser; verificationRequired: boolean; verificationUrl: string }> {
  const email = normalizeEmail(input.email);

  const existing = store.findUserByEmail(email);
  if (existing) {
    throw new AuthServiceError('email_in_use', 'An account with this email address already exists.');
  }

  const now = new Date().toISOString();
  const id = generateUserId();
  const passwordHash = hashPassword(input.password);

  const user: UserRow = {
    id,
    email,
    emailNormalized: email,
    passwordHash,
    securityStatus: 'PendingVerification',
    verificationLevel: VerificationLevel.Unverified,
    accountCategory: DEFAULT_ACCOUNT_CATEGORY,
    accountType: DEFAULT_ACCOUNT_TYPE,
    roles: [DEFAULT_ROLE],
    mustResetPassword: false,
    createdAt: now,
    updatedAt: now,
  };
  store.createUser(user);

  const profile: ProfileRow = {
    userId: id,
    fullName: input.fullName,
    institution: input.institution,
    privacy: 'Public',
    createdAt: now,
    updatedAt: now,
  };
  store.createProfile(profile);

  const said = createSaidIdentifier(store.nextSaidIndex());
  store.createSaid({
    id: generateUserId(),
    userId: id,
    said,
    displayName: input.fullName,
    verificationLevel: VerificationLevel.Unverified,
    isVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  const verificationToken = generateRandomToken();
  store.createVerificationToken(id, verificationToken, new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS).toISOString());

  return {
    user: toPublicUser(user, said),
    verificationRequired: true,
    verificationUrl: `/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`,
  };
}

export async function authenticateUser(email: string, password: string): Promise<UserRow> {
  const user = store.findUserByEmail(normalizeEmail(email));
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AuthServiceError('invalid_credentials', 'Invalid email or password.');
  }

  if (user.securityStatus === 'PendingVerification' || user.verificationLevel < VerificationLevel.EmailVerified) {
    throw new AuthServiceError('email_not_verified', 'Please verify your email address before signing in.');
  }

  store.updateUser(user.id, {
    securityStatus: 'Active',
    lastLoginAt: new Date().toISOString(),
  });

  return store.findUserById(user.id) as UserRow;
}

export async function createUserSession(
  user: UserRow,
  rememberMe: boolean,
  request: NextRequest,
): Promise<{ token: string; session: SessionRow }> {
  const userAgent = request.headers.get('user-agent') ?? undefined;
  const forwarded = request.headers.get('x-forwarded-for');
  const ipAddress = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? undefined;

  const session = store.createSession(user.id, rememberMe, userAgent, ipAddress);
  const token = signSessionToken({
    sid: session.id,
    uid: user.id,
    exp: Date.parse(session.expiresAt),
  });

  return { token, session };
}

export async function verifyEmail(token: string, email?: string): Promise<PublicUser> {
  const record = store.findVerificationToken(token);
  if (!record || record.consumedAt) {
    throw new AuthServiceError('invalid_token', 'This verification link is invalid.');
  }
  if (Date.parse(record.expiresAt) <= Date.now()) {
    throw new AuthServiceError('expired_token', 'This verification link has expired.');
  }

  const user = store.findUserById(record.userId);
  if (!user) {
    throw new AuthServiceError('user_not_found', 'The account for this verification link no longer exists.');
  }

  if (email && normalizeEmail(email) !== user.emailNormalized) {
    throw new AuthServiceError('invalid_token', 'This verification link does not match your email address.');
  }

  store.consumeVerificationToken(token);
  store.updateUser(user.id, {
    securityStatus: 'Active',
    verificationLevel: VerificationLevel.EmailVerified,
    emailVerifiedAt: new Date().toISOString(),
  });

  const said = store.findSaidByUserId(user.id);
  if (said) {
    store.createSaid({
      ...said,
      verificationLevel: VerificationLevel.EmailVerified,
      isVerified: true,
      updatedAt: new Date().toISOString(),
    });
  }

  const updated = store.findUserById(user.id) as UserRow;
  return toPublicUser(updated, said?.said);
}

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; resetUrl?: string }> {
  const user = store.findUserByEmail(normalizeEmail(email));
  if (!user) {
    return { ok: true };
  }

  const token = generateRandomToken();
  store.createPasswordResetToken(user.id, token, new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS).toISOString());

  return {
    ok: true,
    resetUrl: `/reset-password?token=${token}`,
  };
}

export async function resetPassword(token: string, newPassword: string): Promise<PublicUser> {
  const record = store.findPasswordResetToken(token);
  if (!record || record.consumedAt) {
    throw new AuthServiceError('invalid_token', 'This password reset link is invalid.');
  }
  if (Date.parse(record.expiresAt) <= Date.now()) {
    throw new AuthServiceError('expired_token', 'This password reset link has expired.');
  }

  const user = store.findUserById(record.userId);
  if (!user) {
    throw new AuthServiceError('user_not_found', 'The account for this reset link no longer exists.');
  }

  store.consumePasswordResetToken(token);
  store.updateUser(user.id, {
    passwordHash: hashPassword(newPassword),
    mustResetPassword: false,
    securityStatus: 'Active',
  });
  store.revokeSessionsForUser(user.id);

  const updated = store.findUserById(user.id) as UserRow;
  const said = store.findSaidByUserId(user.id);
  return toPublicUser(updated, said?.said);
}

export function toPublicUser(user: UserRow, said?: string): PublicUser {
  const profile = store.findProfileByUserId(user.id);
  return {
    id: user.id,
    email: user.email,
    displayName: profile?.fullName ?? user.email,
    said: said ?? '',
    accountCategory: user.accountCategory,
    accountType: user.accountType,
    roles: user.roles as PublicUser['roles'],
    verificationLevel: user.verificationLevel,
    securityStatus: user.securityStatus,
    emailVerified: user.verificationLevel >= VerificationLevel.EmailVerified,
    createdAt: user.createdAt,
  };
}

export function toPublicSession(session: SessionRow): PublicSession {
  return {
    id: session.id,
    expiresAt: session.expiresAt,
    rememberMe: session.rememberMe,
    createdAt: session.createdAt,
    lastActivityAt: session.lastActivityAt,
    userAgent: session.userAgent,
  };
}

export function getPublicUser(userId: string): PublicUser | undefined {
  const user = store.findUserById(userId);
  if (!user) {
    return undefined;
  }
  const said = store.findSaidByUserId(userId);
  return toPublicUser(user, said?.said);
}

export function toPublicProfile(profile: ProfileRow): PublicProfile {
  return {
    userId: profile.userId,
    fullName: profile.fullName,
    institution: profile.institution,
    department: profile.department,
    country: profile.country,
    avatarUrl: profile.avatarUrl,
    biography: profile.biography,
    privacy: profile.privacy,
  };
}

export async function getRequestSession(
  request: NextRequest,
): Promise<{ session: SessionRow; user: UserRow } | null> {
  const token = readSessionTokenFromRequest(request);
  const payload = decodeSessionToken(token);
  if (!payload) {
    return null;
  }
  const session = store.findSessionById(payload.sid);
  if (!session || session.revokedAt) {
    return null;
  }
  if (Date.parse(session.expiresAt) <= Date.now()) {
    return null;
  }
  const user = store.findUserById(payload.uid);
  if (!user) {
    return null;
  }
  store.updateSession(session.id, { lastActivityAt: new Date().toISOString() });
  return { session, user };
}

export async function revokeRequestSession(request: NextRequest): Promise<void> {
  const token = readSessionTokenFromRequest(request);
  const payload = decodeSessionToken(token);
  if (payload) {
    store.revokeSession(payload.sid);
  }
}

function generateUserId(): string {
  return randomUUID();
}
