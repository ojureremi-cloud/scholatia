/**
 * CRIE authentication integration — Mission 004-F (Wave 4).
 *
 * Resolves the canonical authenticated principal for CRIE surfaces from the
 * platform session (lib/auth) — never from a hardcoded user. Role resolution
 * reuses `lib/rbac.ts`; the resulting `AuthenticatedPrincipal` carries the CRIE
 * permission group (fspec Ch. 9) so the service layer can enforce policy
 * without re-deriving identity.
 */
import type { NextRequest } from 'next/server';
import type { UserRow } from '@/types/schema';
import { getRequestSession } from '@/lib/auth/service';
import * as authStore from '@/lib/auth/store';
import { PLATFORM_ROLES, resolvePlatformRoles } from '@/lib/rbac';
import type { AuthenticatedPrincipal, CrieScope, PermissionKey } from '@/types/crie';

export type CrieRoleLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const BASE_PERMISSIONS: readonly PermissionKey[] = ['crie:read'];

const RESEARCHER_PERMISSIONS: readonly PermissionKey[] = [
  ...BASE_PERMISSIONS,
  'crie:context',
  'crie:memory',
  'crie:evidence',
  'crie:reason',
  'crie:recommend',
  'crie:decision',
  'crie:agents',
  'crie:analytics',
];

const INSTITUTION_PERMISSIONS: readonly PermissionKey[] = [
  ...RESEARCHER_PERMISSIONS,
  'crie:federation',
];

const ADMIN_PERMISSIONS: readonly PermissionKey[] = [
  ...INSTITUTION_PERMISSIONS,
  'crie:connectors',
  'crie:admin',
  'crie:approve',
  'crie:override',
];

/** CRIE permissions granted to a platform role level (least-privilege, P16). */
export function criePermissionsForLevel(level: CrieRoleLevel): PermissionKey[] {
  if (level >= 9) return [...ADMIN_PERMISSIONS];
  if (level >= 7) return [...INSTITUTION_PERMISSIONS];
  if (level >= 2) return [...RESEARCHER_PERMISSIONS];
  return [...BASE_PERMISSIONS];
}

/** The CRIE operating scope for a platform role level. */
export function crieScopeForLevel(level: CrieRoleLevel): CrieScope {
  if (level >= 9) return 'system';
  if (level >= 7) return 'institution';
  return 'research';
}

/** Resolve the principal for a canonical platform user row. */
export function principalFromUser(user: UserRow): AuthenticatedPrincipal {
  const profile = authStore.findProfileByUserId(user.id);
  const said = authStore.findSaidByUserId(user.id);
  const { primaryRole } = resolvePlatformRoles(user.roles);
  const level = PLATFORM_ROLES[primaryRole].level as CrieRoleLevel;

  return {
    userId: user.id,
    username: said?.said ?? user.id,
    name: profile?.fullName ?? user.email,
    roles: user.roles,
    verificationLevel: user.verificationLevel,
    institutionId: user.institutionId ?? profile?.institution,
    scope: crieScopeForLevel(level),
    permissions: criePermissionsForLevel(level),
  };
}

/**
 * Resolve the CRIE principal from a request session, or `null` when the
 * request carries no valid authenticated session.
 */
export async function principalFromRequest(request: NextRequest): Promise<AuthenticatedPrincipal | null> {
  const current = await getRequestSession(request);
  if (!current) return null;
  return principalFromUser(current.user);
}

/**
 * Resolve the authenticated principal or throw a 401-style CrieError.
 * Convenience for route handlers that require authentication.
 */
export async function requirePrincipal(request: NextRequest): Promise<AuthenticatedPrincipal> {
  const principal = await principalFromRequest(request);
  if (!principal) {
    const { CriePermissionError } = await import('@/lib/crie/db/errors');
    throw new CriePermissionError('crie:read', 'Authentication required.');
  }
  return principal;
}
