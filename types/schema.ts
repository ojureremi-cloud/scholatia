import type {
  AccountCategory,
  AccountType,
  ProfilePrivacy,
  RoleType,
  VerificationLevel,
} from './identity';
import type { AccountSecurityStatus } from './security';

/**
 * Production-ready TypeScript models for the Scholatia persistence layer.
 *
 * These models mirror the SQL schema in `db/schema.sql`. They are used by the
 * in-memory repository (`lib/auth/store.ts`) and will back the production
 * database tables once persistence is introduced. No ORM is required for
 * Phase 1.1.
 */

export interface UserRow {
  id: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  securityStatus: AccountSecurityStatus;
  verificationLevel: VerificationLevel;
  emailVerifiedAt?: string;
  accountCategory: AccountCategory;
  accountType: AccountType;
  roles: RoleType[];
  institutionId?: string;
  mustResetPassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRow {
  userId: string;
  fullName: string;
  institution?: string;
  department?: string;
  country?: string;
  avatarUrl?: string;
  biography?: string;
  privacy: ProfilePrivacy;
  createdAt: string;
  updatedAt: string;
}

export interface SaidRow {
  id: string;
  userId: string;
  said: string;
  displayName: string;
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRow {
  id: string;
  userId: string;
  rememberMe: boolean;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface RoleRow {
  id: string;
  key: string;
  name: string;
  description: string;
  level: number;
  hierarchy: string[];
  permissions: string[];
  createdAt: string;
}

export interface PermissionRow {
  id: string;
  key: string;
  label: string;
  description: string;
  group: string;
}

export interface VerificationTokenRow {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  consumedAt?: string;
  createdAt: string;
}

export interface PasswordResetTokenRow {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  consumedAt?: string;
  createdAt: string;
}
