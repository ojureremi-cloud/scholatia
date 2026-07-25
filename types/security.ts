import type { AccountType, RoleType } from './identity';

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
  | 'manage:access';

export type PermissionGroup = {
  key: string;
  label: string;
  permissions: PermissionKey[];
};

export type RoleDefinition = {
  name: RoleType;
  description: string;
  permissions: PermissionKey[];
  inherits?: RoleType[];
};

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

export type DeviceSession = {
  sessionId: string;
  deviceName: string;
  deviceType: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile' | 'Browser';
  ipAddress?: string;
  location?: string;
  createdAt: string;
  lastActivityAt: string;
  trusted: boolean;
  currentSession: boolean;
};

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

export type AuditRecord = {
  id: string;
  actorId: string;
  action: AuditAction;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
};

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
