import type { RoleType } from './identity';
import type { PermissionKey, PermissionScope } from './security';

/**
 * Canonical platform role identifiers used by the Scholatia RBAC layer.
 *
 * These ten roles form the previously designed platform-wide hierarchy:
 * Visitor → Student → Researcher → Reviewer → Editor → Journal Admin →
 * Conference Admin → Institution Admin → Publisher → Platform Administrator.
 *
 * The RBAC layer is additive: it maps onto the existing SAID identity roles
 * (`RoleType`) instead of replacing them, so existing components and the
 * Research Lifecycle Engine remain compatible.
 */
export type PlatformRoleId =
  | 'visitor'
  | 'student'
  | 'researcher'
  | 'reviewer'
  | 'editor'
  | 'journal_admin'
  | 'conference_admin'
  | 'institution_admin'
  | 'publisher'
  | 'platform_administrator';

export type PlatformRoleName =
  | 'Visitor'
  | 'Student'
  | 'Researcher'
  | 'Reviewer'
  | 'Editor'
  | 'Journal Admin'
  | 'Conference Admin'
  | 'Institution Admin'
  | 'Publisher'
  | 'Platform Administrator';

export interface PlatformRoleDefinition {
  id: PlatformRoleId;
  name: PlatformRoleName;
  description: string;
  /** Position in the canonical hierarchy; higher inherits lower. */
  level: number;
  /** Permissions granted directly by this role (before inheritance). */
  permissions: PermissionKey[];
  /** Ancestor role ids in the hierarchy that this role inherits from. */
  inherits: PlatformRoleId[];
  /** Existing SAID identity roles (`RoleType`) that map to this platform role. */
  legacyRoles: RoleType[];
}

export type { PermissionScope };

export interface PlatformRoleAssignment {
  role: PlatformRoleId;
  scope: PermissionScope;
  targetId?: string;
}

export interface RbacCheckInput {
  roles: RoleType[];
  verificationLevel: number;
  permission: PermissionKey;
  scope?: PermissionScope;
  targetId?: string;
}

export interface RbacResolution {
  platformRoleIds: PlatformRoleId[];
  effectivePermissions: PermissionKey[];
  primaryRole: PlatformRoleId;
}
