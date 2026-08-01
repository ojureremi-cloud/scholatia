import { VerificationLevel, type RoleType } from '@/types/identity';
import type { PermissionKey } from '@/types/security';
import type {
  PlatformRoleDefinition,
  PlatformRoleId,
  PlatformRoleName,
  RbacCheckInput,
  RbacResolution,
} from '@/types/rbac';

/**
 * Scholatia RBAC engine.
 *
 * Implements the previously designed 10-role platform hierarchy:
 *   Visitor → Student → Researcher → Reviewer → Editor → Journal Admin →
 *   Conference Admin → Institution Admin → Publisher → Platform Administrator
 *
 * The RBAC layer is additive. It resolves permissions from existing SAID
 * identity roles (`RoleType`) through `legacyRoles` mappings, and reuses the
 * `PermissionKey` vocabulary from `types/security.ts`. No identity model is
 * duplicated; the platform roles are a lightweight authorization projection
 * over the SAID identity.
 */

export const PLATFORM_ROLE_HIERARCHY: readonly PlatformRoleId[] = [
  'visitor',
  'student',
  'researcher',
  'reviewer',
  'editor',
  'journal_admin',
  'conference_admin',
  'institution_admin',
  'publisher',
  'platform_administrator',
] as const;

export const PLATFORM_ROLE_NAMES: readonly PlatformRoleName[] = [
  'Visitor',
  'Student',
  'Researcher',
  'Reviewer',
  'Editor',
  'Journal Admin',
  'Conference Admin',
  'Institution Admin',
  'Publisher',
  'Platform Administrator',
] as const;

export const PLATFORM_ROLES: Record<PlatformRoleId, PlatformRoleDefinition> = {
  visitor: {
    id: 'visitor',
    name: 'Visitor',
    description: 'Unauthenticated visitor browsing public Scholatia content.',
    level: 0,
    permissions: [],
    inherits: [],
    legacyRoles: [],
  },
  student: {
    id: 'student',
    name: 'Student',
    description: 'Learner participating in academic programmes.',
    level: 1,
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session'],
    inherits: ['visitor'],
    legacyRoles: ['Student'],
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    description: 'Researcher with publishing and collaboration capabilities.',
    level: 2,
    permissions: ['manage:content', 'manage:identity'],
    inherits: ['visitor', 'student'],
    legacyRoles: ['Researcher', 'Lecturer', 'Professor', 'Academic Staff'],
  },
  reviewer: {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Peer reviewer for scholarly submissions.',
    level: 3,
    permissions: ['manage:verification'],
    inherits: ['visitor', 'student', 'researcher'],
    legacyRoles: ['Reviewer'],
  },
  editor: {
    id: 'editor',
    name: 'Editor',
    description: 'Editorial role for scholarly content curation.',
    level: 4,
    permissions: ['manage:verification'],
    inherits: ['visitor', 'student', 'researcher', 'reviewer'],
    legacyRoles: ['Journal Editor'],
  },
  journal_admin: {
    id: 'journal_admin',
    name: 'Journal Admin',
    description: 'Administrative role for journal operations.',
    level: 5,
    permissions: ['manage:users', 'manage:roles'],
    inherits: ['visitor', 'student', 'researcher', 'reviewer', 'editor'],
    legacyRoles: ['Journal Editor', 'University Administrator'],
  },
  conference_admin: {
    id: 'conference_admin',
    name: 'Conference Admin',
    description: 'Administrative role for conference operations.',
    level: 6,
    permissions: ['manage:users', 'manage:roles'],
    inherits: ['visitor', 'student', 'researcher', 'reviewer', 'editor'],
    legacyRoles: ['Conference Organizer', 'University Administrator'],
  },
  institution_admin: {
    id: 'institution_admin',
    name: 'Institution Admin',
    description: 'Institution-level administrator overseeing policies and members.',
    level: 7,
    permissions: ['manage:users', 'manage:roles', 'manage:access', 'manage:verification', 'manage:institutions', 'manage:students'],
    inherits: ['visitor', 'student', 'researcher'],
    legacyRoles: ['Institution Administrator', 'University Administrator', 'System Administrator'],
  },
  publisher: {
    id: 'publisher',
    name: 'Publisher',
    description: 'Publishing organisation role.',
    level: 8,
    permissions: ['manage:content', 'manage:verification', 'manage:identity'],
    inherits: ['visitor', 'student', 'researcher'],
    legacyRoles: ['Publisher', 'Funding Organisation', 'Professional Association', 'Government Agency'],
  },
  platform_administrator: {
    id: 'platform_administrator',
    name: 'Platform Administrator',
    description: 'Full platform governance and administration role.',
    level: 9,
    permissions: [
      'read:profile',
      'write:profile',
      'read:session',
      'manage:session',
      'read:security',
      'manage:security',
      'read:audit',
      'manage:audit',
      'manage:users',
      'manage:roles',
      'manage:permissions',
      'manage:access',
      'manage:verification',
      'manage:students',
      'manage:institutions',
      'manage:content',
      'manage:identity',
    ],
    inherits: PLATFORM_ROLE_HIERARCHY.filter((role) => role !== 'platform_administrator'),
    legacyRoles: ['Super Administrator', 'System Administrator'],
  },
};

const ALL_PERMISSIONS: readonly PermissionKey[] = [
  'read:profile',
  'write:profile',
  'read:session',
  'manage:session',
  'read:security',
  'manage:security',
  'read:audit',
  'manage:audit',
  'manage:users',
  'manage:roles',
  'manage:permissions',
  'manage:access',
  'manage:verification',
  'manage:students',
  'manage:institutions',
  'manage:content',
  'manage:identity',
];

export const getPlatformRole = (roleId: PlatformRoleId): PlatformRoleDefinition => PLATFORM_ROLES[roleId];

export const getRoleLevel = (roleId: PlatformRoleId): number => PLATFORM_ROLES[roleId].level;

export const isRoleAtLeast = (roleId: PlatformRoleId, minimum: PlatformRoleId): boolean =>
  PLATFORM_ROLES[roleId].level >= PLATFORM_ROLES[minimum].level;

export const getRoleDisplayName = (roleId: PlatformRoleId): PlatformRoleName => PLATFORM_ROLES[roleId].name;

const LEGACY_ROLE_TO_PLATFORM: Map<RoleType, PlatformRoleId> = (() => {
  const map = new Map<RoleType, PlatformRoleId>();
  for (const definition of Object.values(PLATFORM_ROLES)) {
    for (const legacyRole of definition.legacyRoles) {
      map.set(legacyRole, definition.id);
    }
  }
  return map;
})();

/**
 * Resolve the effective platform roles and permissions for a SAID identity.
 * The highest platform role wins when several legacy identity roles map to
 * different platform roles.
 */
export function resolvePlatformRoles(identityRoles: RoleType[]): RbacResolution {
  const resolved = new Set<PlatformRoleId>();
  for (const legacyRole of identityRoles) {
    const platformRole = LEGACY_ROLE_TO_PLATFORM.get(legacyRole);
    if (platformRole) {
      resolved.add(platformRole);
    }
  }

  const platformRoleIds = Array.from(resolved).sort((a, b) => PLATFORM_ROLES[b].level - PLATFORM_ROLES[a].level);
  const primaryRole: PlatformRoleId = platformRoleIds[0] ?? 'visitor';

  const effectivePermissions = new Set<PermissionKey>();
  for (const roleId of platformRoleIds) {
    const definition = PLATFORM_ROLES[roleId];
    for (const inherited of definition.inherits) {
      for (const permission of PLATFORM_ROLES[inherited].permissions) {
        effectivePermissions.add(permission);
      }
    }
    for (const permission of definition.permissions) {
      effectivePermissions.add(permission);
    }
  }

  return {
    platformRoleIds,
    effectivePermissions: Array.from(effectivePermissions),
    primaryRole,
  };
}

export function getEffectivePermissions(identityRoles: RoleType[]): PermissionKey[] {
  return resolvePlatformRoles(identityRoles).effectivePermissions;
}

export function getPrimaryPlatformRole(identityRoles: RoleType[]): PlatformRoleId {
  return resolvePlatformRoles(identityRoles).primaryRole;
}

export function hasPlatformRole(identityRoles: RoleType[], roleId: PlatformRoleId): boolean {
  return resolvePlatformRoles(identityRoles).platformRoleIds.includes(roleId);
}

export function isAtLeast(identityRoles: RoleType[], minimum: PlatformRoleId): boolean {
  return resolvePlatformRoles(identityRoles).platformRoleIds.some((roleId) => isRoleAtLeast(roleId, minimum));
}

export function can(input: RbacCheckInput): boolean {
  if (input.verificationLevel < VerificationLevel.EmailVerified && input.permission !== 'read:profile') {
    return false;
  }

  const { effectivePermissions } = resolvePlatformRoles(input.roles);
  return effectivePermissions.includes(input.permission);
}

export function requirePermission(input: RbacCheckInput): boolean {
  return can(input);
}

export function getPermissionsForRole(roleId: PlatformRoleId): PermissionKey[] {
  return ALL_PERMISSIONS.filter((permission) => can({
    roles: PLATFORM_ROLES[roleId].legacyRoles,
    verificationLevel: VerificationLevel.EmailVerified,
    permission,
  }));
}

export const RoleHierarchyEngine = {
  getAllRoles: () => PLATFORM_ROLE_HIERARCHY,
  getRole: getPlatformRole,
  getRoleLevel,
  isRoleAtLeast,
  getDisplayName: getRoleDisplayName,
  resolve: resolvePlatformRoles,
  getPermissions: getEffectivePermissions,
  getPrimaryRole: getPrimaryPlatformRole,
  hasRole: hasPlatformRole,
  isAtLeast,
  can,
  getPermissionsForRole,
} as const;

export default RoleHierarchyEngine;
