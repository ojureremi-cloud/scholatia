import type { AccountCategory, AccountType, RoleType, VerificationLevel } from './identity';
import type { AccountSecurityStatus } from './security';

/**
 * API contract types for the Scholatia authentication and user management
 * platform. These describe the request/response payloads of the route
 * handlers under `app/api/auth/*` and `app/api/profile`.
 */

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_verified'
  | 'email_in_use'
  | 'invalid_input'
  | 'invalid_token'
  | 'expired_token'
  | 'user_not_found'
  | 'unauthorized'
  | 'rate_limited'
  | 'internal_error';

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  said: string;
  accountCategory: AccountCategory;
  accountType: AccountType;
  roles: RoleType[];
  verificationLevel: VerificationLevel;
  securityStatus: AccountSecurityStatus;
  emailVerified: boolean;
  createdAt: string;
}

export interface PublicSession {
  id: string;
  expiresAt: string;
  rememberMe: boolean;
  createdAt: string;
  lastActivityAt: string;
  userAgent?: string;
}

export interface PublicProfile {
  userId: string;
  fullName: string;
  institution?: string;
  department?: string;
  country?: string;
  avatarUrl?: string;
  biography?: string;
  privacy: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution?: string;
  consent: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface VerifyEmailRequest {
  token: string;
  email?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  institution?: string;
  department?: string;
  country?: string;
  avatarUrl?: string;
  biography?: string;
  privacy?: string;
}

export interface RegisterResponse {
  user: PublicUser;
  verificationRequired: boolean;
  verificationUrl?: string;
}

export interface LoginResponse {
  user: PublicUser;
  session: PublicSession;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: PublicUser;
  session?: PublicSession;
  activeSessions?: PublicSession[];
}

export interface ApiErrorBody {
  code: AuthErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}

export interface ApiSuccessResponse<T> {
  data: T;
}
