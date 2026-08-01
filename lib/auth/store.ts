import { createHash, randomUUID } from 'crypto';
import { PERMISSIONS } from '@/lib/auth';
import { PLATFORM_ROLE_HIERARCHY, PLATFORM_ROLES } from '@/lib/rbac';
import type {
  PasswordResetTokenRow,
  PermissionRow,
  ProfileRow,
  RoleRow,
  SaidRow,
  SessionRow,
  UserRow,
  VerificationTokenRow,
} from '@/types/schema';
import { DEFAULT_SESSION_TTL_MS, REMEMBER_ME_SESSION_TTL_MS } from './tokens';

/**
 * In-memory repository backing the Phase 1.1 authentication platform.
 *
 * Mirrors the production schema in `db/schema.sql` and `types/schema.ts`.
 * No ORM or external database is required yet; a repository swap is the only
 * change needed to move to persistent storage.
 *
 * The state lives on `globalThis` (not module scope) because Next.js compiles
 * route handlers and server components into separate server bundles. A
 * module-scoped `Map` would give each bundle its own store and break the
 * register -> verify-email page -> login flow. The `globalThis` singleton
 * shares a single store across bundles within the same server process.
 */

interface StoreData {
  users: Map<string, UserRow>;
  usersByEmail: Map<string, string>;
  profiles: Map<string, ProfileRow>;
  saids: Map<string, SaidRow>;
  sessions: Map<string, SessionRow>;
  roles: Map<string, RoleRow>;
  permissions: Map<string, PermissionRow>;
  verificationTokens: Map<string, VerificationTokenRow>;
  passwordResetTokens: Map<string, PasswordResetTokenRow>;
  saidSequence: { next: number };
  seeded: boolean;
}

const STORE_KEY = '__scholatiaStore';

function createStore(): StoreData {
  return {
    users: new Map<string, UserRow>(),
    usersByEmail: new Map<string, string>(),
    profiles: new Map<string, ProfileRow>(),
    saids: new Map<string, SaidRow>(),
    sessions: new Map<string, SessionRow>(),
    roles: new Map<string, RoleRow>(),
    permissions: new Map<string, PermissionRow>(),
    verificationTokens: new Map<string, VerificationTokenRow>(),
    passwordResetTokens: new Map<string, PasswordResetTokenRow>(),
    saidSequence: { next: 1 },
    seeded: false,
  };
}

function getStore(): StoreData {
  const globalForStore = globalThis as unknown as { [STORE_KEY]?: StoreData };
  if (!globalForStore[STORE_KEY]) {
    globalForStore[STORE_KEY] = createStore();
  }
  return globalForStore[STORE_KEY];
}

function ensureSeeded(): void {
  const store = getStore();
  if (store.seeded) {
    return;
  }

  for (const roleId of PLATFORM_ROLE_HIERARCHY) {
    const definition = PLATFORM_ROLES[roleId];
    store.roles.set(roleId, {
      id: roleId,
      key: roleId,
      name: definition.name,
      description: definition.description,
      level: definition.level,
      hierarchy: [...definition.inherits, definition.id],
      permissions: definition.permissions,
      createdAt: new Date().toISOString(),
    });
  }

  for (const permission of PERMISSIONS) {
    store.permissions.set(permission.key, {
      id: permission.key,
      key: permission.key,
      label: permission.label,
      description: permission.description,
      group: permission.group,
    });
  }

  store.seeded = true;
}

export function nextSaidIndex(): number {
  const store = getStore();
  const value = store.saidSequence.next;
  store.saidSequence.next += 1;
  return value;
}

// Users

export function createUser(row: UserRow): UserRow {
  const store = getStore();
  ensureSeeded();
  store.users.set(row.id, row);
  store.usersByEmail.set(row.emailNormalized, row.id);
  return row;
}

export function findUserByEmail(email: string): UserRow | undefined {
  const store = getStore();
  const id = store.usersByEmail.get(normalizeEmailKey(email));
  return id ? store.users.get(id) : undefined;
}

export function findUserById(id: string): UserRow | undefined {
  return getStore().users.get(id);
}

export function updateUser(id: string, patch: Partial<UserRow>): UserRow | undefined {
  const store = getStore();
  const current = store.users.get(id);
  if (!current) {
    return undefined;
  }
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  store.users.set(id, next);
  if (patch.emailNormalized) {
    store.usersByEmail.set(patch.emailNormalized, id);
  }
  return next;
}

// Profiles

export function createProfile(row: ProfileRow): ProfileRow {
  getStore().profiles.set(row.userId, row);
  return row;
}

export function findProfileByUserId(userId: string): ProfileRow | undefined {
  return getStore().profiles.get(userId);
}

export function updateProfile(userId: string, patch: Partial<ProfileRow>): ProfileRow | undefined {
  const store = getStore();
  const current = store.profiles.get(userId);
  if (!current) {
    return undefined;
  }
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  store.profiles.set(userId, next);
  return next;
}

// SAID

export function createSaid(row: SaidRow): SaidRow {
  getStore().saids.set(row.userId, row);
  return row;
}

export function findSaidByUserId(userId: string): SaidRow | undefined {
  return getStore().saids.get(userId);
}

// Sessions

export function createSession(userId: string, rememberMe: boolean, userAgent?: string, ipAddress?: string): SessionRow {
  const now = new Date();
  const row: SessionRow = {
    id: randomUUID(),
    userId,
    rememberMe,
    userAgent,
    ipAddress,
    createdAt: now.toISOString(),
    lastActivityAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + (rememberMe ? REMEMBER_ME_SESSION_TTL_MS : DEFAULT_SESSION_TTL_MS)).toISOString(),
  };
  getStore().sessions.set(row.id, row);
  return row;
}

export function findSessionById(id: string): SessionRow | undefined {
  return getStore().sessions.get(id);
}

export function updateSession(id: string, patch: Partial<SessionRow>): SessionRow | undefined {
  const store = getStore();
  const current = store.sessions.get(id);
  if (!current) {
    return undefined;
  }
  const next = { ...current, ...patch };
  store.sessions.set(id, next);
  return next;
}

export function revokeSession(id: string): SessionRow | undefined {
  const store = getStore();
  const current = store.sessions.get(id);
  if (!current) {
    return undefined;
  }
  const next = { ...current, revokedAt: new Date().toISOString() };
  store.sessions.set(id, next);
  return next;
}

export function listSessionsForUser(userId: string): SessionRow[] {
  return Array.from(getStore().sessions.values())
    .filter((session) => session.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function revokeSessionsForUser(userId: string): number {
  const targets = listSessionsForUser(userId);
  for (const session of targets) {
    revokeSession(session.id);
  }
  return targets.length;
}

// Verification tokens

export function createVerificationToken(userId: string, token: string, expiresAt: string): VerificationTokenRow {
  const row: VerificationTokenRow = {
    id: token,
    userId,
    tokenHash: hashValue(token),
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  getStore().verificationTokens.set(token, row);
  return row;
}

export function findVerificationToken(token: string): VerificationTokenRow | undefined {
  return getStore().verificationTokens.get(token);
}

export function consumeVerificationToken(token: string): VerificationTokenRow | undefined {
  const store = getStore();
  const current = store.verificationTokens.get(token);
  if (!current) {
    return undefined;
  }
  const next = { ...current, consumedAt: new Date().toISOString() };
  store.verificationTokens.set(token, next);
  return next;
}

// Password reset tokens

export function createPasswordResetToken(userId: string, token: string, expiresAt: string): PasswordResetTokenRow {
  const row: PasswordResetTokenRow = {
    id: token,
    userId,
    tokenHash: hashValue(token),
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  getStore().passwordResetTokens.set(token, row);
  return row;
}

export function findPasswordResetToken(token: string): PasswordResetTokenRow | undefined {
  return getStore().passwordResetTokens.get(token);
}

export function consumePasswordResetToken(token: string): PasswordResetTokenRow | undefined {
  const store = getStore();
  const current = store.passwordResetTokens.get(token);
  if (!current) {
    return undefined;
  }
  const next = { ...current, consumedAt: new Date().toISOString() };
  store.passwordResetTokens.set(token, next);
  return next;
}

// Roles & permissions (read-only seed)

export function listRoles(): RoleRow[] {
  ensureSeeded();
  return Array.from(getStore().roles.values()).sort((a, b) => a.level - b.level);
}

export function listPermissions(): PermissionRow[] {
  ensureSeeded();
  return Array.from(getStore().permissions.values());
}

function normalizeEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
