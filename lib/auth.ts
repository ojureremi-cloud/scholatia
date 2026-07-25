import type { AccessPolicy, AuthUser, Permission, PermissionGroup, PermissionKey, RoleDefinition, SessionState, UserRoleAssignment, ZeroTrustSignals } from '@/types/security';
import { VerificationLevel as IdentityVerificationLevel, type RoleType } from '@/types/identity';

export type { AccessPolicy, AuthUser, Permission, PermissionGroup, RoleDefinition, SessionState, UserRoleAssignment, ZeroTrustSignals } from '@/types/security';

export type PermissionResolverInput = {
  user: AuthUser;
  permission: PermissionKey;
  scope?: 'global' | 'organization' | 'institution' | 'resource';
  targetId?: string;
};

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  Student: {
    name: 'Student',
    displayName: 'Student',
    description: 'Learner participating in academic programmes.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session'],
    hierarchy: ['Student'],
    badgeColour: 'bg-sky-100 text-sky-800',
    icon: '🎓',
    trustRequirements: ['Email verification'],
    verificationRequirements: [IdentityVerificationLevel.EmailVerified],
  },
  Researcher: {
    name: 'Researcher',
    displayName: 'Researcher',
    description: 'Researcher with publishing and collaboration capabilities.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:identity'],
    hierarchy: ['Student', 'Researcher'],
    badgeColour: 'bg-violet-100 text-violet-800',
    icon: '🔬',
    trustRequirements: ['Institution affiliation'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Lecturer: {
    name: 'Lecturer',
    displayName: 'Lecturer',
    description: 'Educator teaching academic programmes.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Lecturer'],
    badgeColour: 'bg-amber-100 text-amber-800',
    icon: '🧑‍🏫',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Professor: {
    name: 'Professor',
    displayName: 'Professor',
    description: 'Senior academic with advanced oversight rights.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Lecturer', 'Professor'],
    badgeColour: 'bg-emerald-100 text-emerald-800',
    icon: '🧑‍🎓',
    trustRequirements: ['Institution verification', 'Peer review activity'],
    verificationRequirements: [IdentityVerificationLevel.VerifiedExpert],
  },
  'Academic Staff': {
    name: 'Academic Staff',
    displayName: 'Academic Staff',
    description: 'Institutional academic employee with operational privileges.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'Academic Staff'],
    badgeColour: 'bg-fuchsia-100 text-fuchsia-800',
    icon: '👩‍💼',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  'University Administrator': {
    name: 'University Administrator',
    displayName: 'University Administrator',
    description: 'Institution-level administrator.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:users', 'manage:roles', 'manage:permissions', 'manage:access', 'manage:verification', 'manage:institutions'],
    hierarchy: ['Student', 'Researcher', 'Academic Staff', 'University Administrator'],
    badgeColour: 'bg-indigo-100 text-indigo-800',
    icon: '🏛️',
    trustRequirements: ['Institution verification', 'Trusted device'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'Institution Administrator': {
    name: 'Institution Administrator',
    displayName: 'Institution Administrator',
    description: 'Institutional administrator overseeing policies.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:users', 'manage:roles', 'manage:access', 'manage:verification', 'manage:institutions'],
    hierarchy: ['Student', 'Researcher', 'Institution Administrator'],
    badgeColour: 'bg-cyan-100 text-cyan-800',
    icon: '🏫',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  'Journal Editor': {
    name: 'Journal Editor',
    displayName: 'Journal Editor',
    description: 'Editorial role for journal operations.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Journal Editor'],
    badgeColour: 'bg-rose-100 text-rose-800',
    icon: '📝',
    trustRequirements: ['Publication history', 'Peer review activity'],
    verificationRequirements: [IdentityVerificationLevel.PublicationVerified],
  },
  Reviewer: {
    name: 'Reviewer',
    displayName: 'Reviewer',
    description: 'Peer reviewer for scholarly submissions.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Reviewer'],
    badgeColour: 'bg-orange-100 text-orange-800',
    icon: '✅',
    trustRequirements: ['Peer review activity'],
    verificationRequirements: [IdentityVerificationLevel.PeerReviewed],
  },
  'Conference Organizer': {
    name: 'Conference Organizer',
    displayName: 'Conference Organizer',
    description: 'Organizes academic events and conferences.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Conference Organizer'],
    badgeColour: 'bg-pink-100 text-pink-800',
    icon: '🎤',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Publisher: {
    name: 'Publisher',
    displayName: 'Publisher',
    description: 'Publishing organisation role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'Publisher'],
    badgeColour: 'bg-slate-100 text-slate-800',
    icon: '📚',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'Funding Organisation': {
    name: 'Funding Organisation',
    displayName: 'Funding Organisation',
    description: 'Role for funding bodies.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Funding Organisation'],
    badgeColour: 'bg-lime-100 text-lime-800',
    icon: '💰',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'Professional Association': {
    name: 'Professional Association',
    displayName: 'Professional Association',
    description: 'Professional body stewardship role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'Professional Association'],
    badgeColour: 'bg-teal-100 text-teal-800',
    icon: '🤝',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'Government Agency': {
    name: 'Government Agency',
    displayName: 'Government Agency',
    description: 'Government-backed institutional role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:access', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Government Agency'],
    badgeColour: 'bg-zinc-100 text-zinc-800',
    icon: '🏛️',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'Research Institute': {
    name: 'Research Institute',
    displayName: 'Research Institute',
    description: 'Research institution role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content', 'manage:verification'],
    hierarchy: ['Student', 'Researcher', 'Research Institute'],
    badgeColour: 'bg-purple-100 text-purple-800',
    icon: '🧪',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Academy: {
    name: 'Academy',
    displayName: 'Academy',
    description: 'Academy or training institution role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'Academy'],
    badgeColour: 'bg-blue-100 text-blue-800',
    icon: '🏫',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  College: {
    name: 'College',
    displayName: 'College',
    description: 'College-level institutional role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'College'],
    badgeColour: 'bg-stone-100 text-stone-800',
    icon: '🏫',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Polytechnic: {
    name: 'Polytechnic',
    displayName: 'Polytechnic',
    description: 'Polytechnic institutional role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'Polytechnic'],
    badgeColour: 'bg-gray-100 text-gray-800',
    icon: '🏭',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  University: {
    name: 'University',
    displayName: 'University',
    description: 'University-level institutional role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'University'],
    badgeColour: 'bg-sky-100 text-sky-800',
    icon: '🏛️',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  Library: {
    name: 'Library',
    displayName: 'Library',
    description: 'Library service role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Library'],
    badgeColour: 'bg-yellow-100 text-yellow-800',
    icon: '📖',
    trustRequirements: ['Institution verification'],
    verificationRequirements: [IdentityVerificationLevel.InstitutionVerified],
  },
  'Industry Partner': {
    name: 'Industry Partner',
    displayName: 'Industry Partner',
    description: 'Industry collaboration role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Industry Partner'],
    badgeColour: 'bg-red-100 text-red-800',
    icon: '🏢',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  Employer: {
    name: 'Employer',
    displayName: 'Employer',
    description: 'Employment partner role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Employer'],
    badgeColour: 'bg-green-100 text-green-800',
    icon: '💼',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  Recruiter: {
    name: 'Recruiter',
    displayName: 'Recruiter',
    description: 'Recruitment and talent partner role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:content'],
    hierarchy: ['Student', 'Researcher', 'Recruiter'],
    badgeColour: 'bg-cyan-100 text-cyan-800',
    icon: '🔎',
    trustRequirements: ['Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.OrganisationVerified],
  },
  'System Administrator': {
    name: 'System Administrator',
    displayName: 'System Administrator',
    description: 'Platform-wide system administration role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:users', 'manage:roles', 'manage:permissions', 'manage:access', 'manage:audit', 'manage:verification', 'manage:institutions', 'manage:students'],
    hierarchy: ['Student', 'Researcher', 'System Administrator'],
    badgeColour: 'bg-zinc-900 text-white',
    icon: '🛡️',
    trustRequirements: ['Trusted device', 'Verified expert'],
    verificationRequirements: [IdentityVerificationLevel.VerifiedExpert],
  },
  'Super Administrator': {
    name: 'Super Administrator',
    displayName: 'Super Administrator',
    description: 'Full platform governance role.',
    permissions: ['read:profile', 'write:profile', 'read:session', 'manage:session', 'manage:users', 'manage:roles', 'manage:permissions', 'manage:access', 'manage:audit', 'manage:verification', 'manage:institutions', 'manage:students', 'manage:content', 'manage:identity'],
    hierarchy: ['Student', 'Researcher', 'System Administrator', 'Super Administrator'],
    badgeColour: 'bg-red-600 text-white',
    icon: '👑',
    trustRequirements: ['Trusted device', 'Verified expert', 'Organisation verification'],
    verificationRequirements: [IdentityVerificationLevel.Trusted],
  },
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  { key: 'profile', label: 'Profile', description: 'Profile access and editing', permissions: ['read:profile', 'write:profile'] },
  { key: 'session', label: 'Session', description: 'Session and device access', permissions: ['read:session', 'manage:session'] },
  { key: 'security', label: 'Security', description: 'Security and authentication controls', permissions: ['read:security', 'manage:security'] },
  { key: 'audit', label: 'Audit', description: 'Audit and governance access', permissions: ['read:audit', 'manage:audit'] },
  { key: 'identity', label: 'Identity', description: 'Identity and verification operations', permissions: ['manage:identity', 'manage:verification'] },
  { key: 'student', label: 'Student', description: 'Student lifecycle administration', permissions: ['manage:students'] },
  { key: 'institution', label: 'Institution', description: 'Institution administration', permissions: ['manage:institutions'] },
  { key: 'content', label: 'Content', description: 'Scholarly content moderation', permissions: ['manage:content'] },
  { key: 'administration', label: 'Administration', description: 'User, role, and access administration', permissions: ['manage:users', 'manage:roles', 'manage:permissions', 'manage:access'] },
];

export const PERMISSIONS: Permission[] = [
  { key: 'read:profile', label: 'Read profile', description: 'View user profile data', group: 'profile' },
  { key: 'write:profile', label: 'Edit profile', description: 'Update profile data', group: 'profile' },
  { key: 'read:session', label: 'Read session', description: 'Read session state', group: 'session' },
  { key: 'manage:session', label: 'Manage session', description: 'Manage current session and device state', group: 'session' },
  { key: 'read:security', label: 'Read security', description: 'Inspect security settings', group: 'security' },
  { key: 'manage:security', label: 'Manage security', description: 'Change security settings', group: 'security' },
  { key: 'read:audit', label: 'Read audit', description: 'View audit records', group: 'audit' },
  { key: 'manage:audit', label: 'Manage audit', description: 'Manage audit trail', group: 'audit' },
  { key: 'manage:users', label: 'Manage users', description: 'Create and update users', group: 'administration' },
  { key: 'manage:roles', label: 'Manage roles', description: 'Adjust role assignments', group: 'administration' },
  { key: 'manage:permissions', label: 'Manage permissions', description: 'Manage permission definitions', group: 'administration' },
  { key: 'manage:access', label: 'Manage access', description: 'Control access policies', group: 'administration' },
  { key: 'manage:verification', label: 'Manage verification', description: 'Handle verification workflows', group: 'identity' },
  { key: 'manage:students', label: 'Manage students', description: 'Manage student lifecycle', group: 'student' },
  { key: 'manage:institutions', label: 'Manage institutions', description: 'Manage institutional administration', group: 'institution' },
  { key: 'manage:content', label: 'Manage content', description: 'Moderate scholarly content', group: 'content' },
  { key: 'manage:identity', label: 'Manage identity', description: 'Manage identity and trust data', group: 'identity' },
];

export const DEFAULT_ACCESS_POLICIES: AccessPolicy[] = [
  {
    id: 'policy-student-read',
    name: 'Student profile access',
    description: 'Allow students to access their own profile data.',
    allowedRoles: ['Student'],
    requiredPermissions: ['read:profile'],
    minimumVerification: IdentityVerificationLevel.EmailVerified,
    scope: 'resource',
    effect: 'allow',
  },
  {
    id: 'policy-admin-access',
    name: 'Administrator access',
    description: 'Allow institutional and system administrators to manage access.',
    allowedRoles: ['Institution Administrator', 'University Administrator', 'System Administrator', 'Super Administrator'],
    requiredPermissions: ['manage:access'],
    minimumVerification: IdentityVerificationLevel.OrganisationVerified,
    minimumTrustScore: 80,
    scope: 'institution',
    effect: 'allow',
  },
];

export const ROLE_HIERARCHY: Record<RoleType, readonly RoleType[]> = {
  Student: ['Student'],
  Researcher: ['Student', 'Researcher'],
  Lecturer: ['Student', 'Researcher', 'Lecturer'],
  Professor: ['Student', 'Researcher', 'Lecturer', 'Professor'],
  'Academic Staff': ['Student', 'Researcher', 'Academic Staff'],
  'University Administrator': ['Student', 'Researcher', 'Academic Staff', 'University Administrator'],
  'Institution Administrator': ['Student', 'Researcher', 'Institution Administrator'],
  'Journal Editor': ['Student', 'Researcher', 'Journal Editor'],
  Reviewer: ['Student', 'Researcher', 'Reviewer'],
  'Conference Organizer': ['Student', 'Researcher', 'Conference Organizer'],
  Publisher: ['Student', 'Researcher', 'Publisher'],
  'Funding Organisation': ['Student', 'Researcher', 'Funding Organisation'],
  'Professional Association': ['Student', 'Researcher', 'Professional Association'],
  'Government Agency': ['Student', 'Researcher', 'Government Agency'],
  'Research Institute': ['Student', 'Researcher', 'Research Institute'],
  Academy: ['Student', 'Researcher', 'Academy'],
  College: ['Student', 'Researcher', 'College'],
  Polytechnic: ['Student', 'Researcher', 'Polytechnic'],
  University: ['Student', 'Researcher', 'University'],
  Library: ['Student', 'Researcher', 'Library'],
  'Industry Partner': ['Student', 'Researcher', 'Industry Partner'],
  Employer: ['Student', 'Researcher', 'Employer'],
  Recruiter: ['Student', 'Researcher', 'Recruiter'],
  'System Administrator': ['Student', 'Researcher', 'System Administrator'],
  'Super Administrator': ['Student', 'Researcher', 'System Administrator', 'Super Administrator'],
};

export class PermissionResolver {
  static resolve(input: PermissionResolverInput): boolean {
    const roleDefinitions = input.user.roles.map((role) => ROLE_DEFINITIONS[role]);
    const matchesPermission = roleDefinitions.some((definition) => definition.permissions.includes(input.permission));
    if (!matchesPermission) {
      return false;
    }

    if (input.user.verificationLevel < IdentityVerificationLevel.EmailVerified) {
      return false;
    }

    return true;
  }
}

export class PermissionGuard {
  static can(input: PermissionResolverInput): boolean {
    return PermissionResolver.resolve(input);
  }
}

export class PermissionMatrix {
  static forUser(user: AuthUser): PermissionKey[] {
    const permissions = user.roles.flatMap((role) => ROLE_DEFINITIONS[role].permissions);
    return Array.from(new Set(permissions));
  }
}

export class RoleHierarchy {
  static getAncestors(role: RoleType): RoleType[] {
    return [...(ROLE_HIERARCHY[role] ?? [])];
  }
}

export function createSessionState(overrides: Partial<SessionState> = {}): SessionState {
  return {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    refreshExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    rememberMe: false,
    idleTimeoutMinutes: 30,
    deviceId: 'device-001',
    trustedDevice: false,
    revoked: false,
    lastActivityAt: new Date().toISOString(),
    ...overrides,
  };
}

export function evaluateRiskSignals(signals: ZeroTrustSignals): number {
  let score = signals.deviceTrustScore;
  if (signals.suspiciousLogin) {
    score += 25;
  }
  if (signals.impossibleTravel) {
    score += 20;
  }
  if (signals.rateLimited) {
    score += 15;
  }
  return Math.min(score, 100);
}

export function createAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-001',
    displayName: 'Scholatia User',
    email: 'user@scholatia.org',
    roles: ['Student'],
    accountType: 'Institution',
    verificationLevel: IdentityVerificationLevel.EmailVerified,
    ...overrides,
  };
}

export function createRoleAssignment(role: RoleType, grantedBy?: string): UserRoleAssignment {
  return {
    role,
    grantedAt: new Date().toISOString(),
    grantedBy,
    scope: 'institution',
  };
}
