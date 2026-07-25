import type { AccountType, RoleType, StudentProfile, VerificationLevel } from './identity';

export type AuthProviderType =
  | 'EmailPassword'
  | 'MagicLink'
  | 'Passkey'
  | 'Google'
  | 'Microsoft'
  | 'ORCID'
  | 'SAML'
  | 'OAuth'
  | 'ApiToken';

export type MfaMethod =
  | 'EmailOTP'
  | 'SMSOTP'
  | 'AuthenticatorApp'
  | 'Passkey'
  | 'RecoveryCodes';

export type AccountSecurityStatus =
  | 'Active'
  | 'Suspended'
  | 'Locked'
  | 'PendingVerification'
  | 'Deactivated';

export type PermissionKey =
  | 'read:profile'
  | 'write:profile'
  | 'read:session'
  | 'manage:session'
  | 'read:security'
  | 'manage:security'
  | 'read:audit'
  | 'manage:audit'
  | 'manage:users'
  | 'manage:roles'
  | 'manage:permissions'
  | 'manage:access'
  | 'manage:verification'
  | 'manage:students'
  | 'manage:institutions'
  | 'manage:content'
  | 'manage:identity';

export type PermissionGroupKey = 'profile' | 'session' | 'security' | 'audit' | 'identity' | 'student' | 'institution' | 'content' | 'administration';

export interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
  group: PermissionGroupKey;
}

export interface PermissionGroup {
  key: PermissionGroupKey;
  label: string;
  description: string;
  permissions: PermissionKey[];
}

export interface RoleDefinition {
  name: RoleType;
  displayName: string;
  description: string;
  permissions: PermissionKey[];
  hierarchy: RoleType[];
  badgeColour: string;
  icon: string;
  trustRequirements: readonly string[];
  verificationRequirements: readonly VerificationLevel[];
}

export type PermissionScope = 'global' | 'organization' | 'institution' | 'resource';

export type ScopedPermission = {
  permission: PermissionKey;
  scope: PermissionScope;
  targetId?: string;
};

export type AuthMethod = {
  provider: AuthProviderType;
  enabled: boolean;
  configuredAt?: string;
  lastUsedAt?: string;
};

export type MfaConfiguration = {
  method: MfaMethod;
  enabled: boolean;
  verified: boolean;
  enrolledAt?: string;
};

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  roles: RoleType[];
  accountType: AccountType;
  verificationLevel: VerificationLevel;
  trustScore?: number;
  institutionId?: string;
  studentProfile?: StudentProfile;
}

export type DeviceType = 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile' | 'Browser';

export type DeviceSession = {
  sessionId: string;
  deviceName: string;
  deviceType: DeviceType;
  ipAddress?: string;
  location?: string;
  createdAt: string;
  lastActivityAt: string;
  trusted: boolean;
  currentSession: boolean;
};

export interface SessionState {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
  rememberMe: boolean;
  idleTimeoutMinutes: number;
  deviceId: string;
  trustedDevice: boolean;
  revoked: boolean;
  lastActivityAt: string;
}

export interface TrustedDevice {
  deviceId: string;
  name: string;
  deviceType: DeviceType;
  createdAt: string;
  lastSeenAt: string;
  trusted: boolean;
}

export type SessionPolicy = {
  rememberMe: boolean;
  expiresInMinutes: number;
  lastActivityAt: string;
  revokedAt?: string;
};

export type AuditAction =
  | 'Login'
  | 'Logout'
  | 'PasswordChange'
  | 'VerificationChange'
  | 'PermissionChange'
  | 'ProfileUpdate'
  | 'AdminAction';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditRecord = {
  id: string;
  actorId: string;
  action: AuditAction;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  severity?: AuditSeverity;
};

export interface SecurityEvent extends AuditRecord {
  category: 'authentication' | 'authorization' | 'verification' | 'session' | 'device' | 'admin' | 'policy';
}

export interface SecurityProfile {
  userId: string;
  accountType: AccountType;
  securityStatus: AccountSecurityStatus;
  authMethods: AuthMethod[];
  mfaConfigurations: MfaConfiguration[];
  accountStatus: AccountSecurityStatus;
  permissions: ScopedPermission[];
  roles: RoleType[];
  sessionPolicy: SessionPolicy;
  activeSessions: DeviceSession[];
  mustResetPassword: boolean;
  lastPasswordChangeAt?: string;
}

export interface UserRoleAssignment {
  role: RoleType;
  grantedAt: string;
  grantedBy?: string;
  scope?: PermissionScope;
}

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  allowedRoles: readonly RoleType[];
  requiredPermissions: readonly PermissionKey[];
  minimumVerification: VerificationLevel;
  minimumTrustScore?: number;
  scope: PermissionScope;
  effect: 'allow' | 'deny';
}

export interface ZeroTrustSignals {
  deviceTrustScore: number;
  riskScore: number;
  ipAddress?: string;
  geoLocation?: string;
  suspiciousLogin: boolean;
  impossibleTravel: boolean;
  rateLimited: boolean;
  passwordStrength: 'weak' | 'fair' | 'good' | 'strong';
}

export const AUTH_PROVIDER_LABELS: Record<AuthProviderType, string> = {
  EmailPassword: 'Email & Password',
  MagicLink: 'Magic Link',
  Passkey: 'Passkey',
  Google: 'Google',
  Microsoft: 'Microsoft',
  ORCID: 'ORCID',
  SAML: 'Institutional SSO',
  OAuth: 'OAuth',
  ApiToken: 'API Token',
};

export const MFA_METHOD_LABELS: Record<MfaMethod, string> = {
  EmailOTP: 'Email OTP',
  SMSOTP: 'SMS OTP',
  AuthenticatorApp: 'Authenticator App',
  Passkey: 'Passkey',
  RecoveryCodes: 'Recovery Codes',
};
