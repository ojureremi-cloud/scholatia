import type { LoginRequest, RegisterRequest, ResetPasswordRequest } from '@/types/auth';
import { isPasswordStrong } from './password';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: Record<string, string> };

export function validateRegisterRequest(input: RegisterRequest): ValidationResult<RegisterRequest> {
  const errors: Record<string, string> = {};

  const fullName = input.fullName?.trim() ?? '';
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const email = normalizeEmail(input.email ?? '');
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const password = input.password ?? '';
  if (!isPasswordStrong(password)) {
    errors.password = 'Password must be at least 8 characters and contain a letter and a number.';
  }

  if (input.confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (input.consent !== true) {
    errors.consent = 'You must accept the terms and privacy policy.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      fullName,
      email,
      password,
      confirmPassword: password,
      consent: true,
      institution: input.institution?.trim() || undefined,
    },
  };
}

export function validateLoginRequest(input: LoginRequest): ValidationResult<LoginRequest> {
  const errors: Record<string, string> = {};

  const email = normalizeEmail(input.email ?? '');
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const password = input.password ?? '';
  if (password.length === 0) {
    errors.password = 'Please enter your password.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      email,
      password,
      rememberMe: input.rememberMe === true,
    },
  };
}

export function validatePasswordResetRequest(input: ResetPasswordRequest): ValidationResult<ResetPasswordRequest> {
  const errors: Record<string, string> = {};

  const hasEmail = typeof input.email === 'string' && isValidEmail(input.email);
  const hasToken = typeof input.token === 'string' && input.token.length > 0;

  if (hasEmail && hasToken) {
    errors.email = 'Provide either an email or a reset token, not both.';
  }

  if (!hasEmail && !hasToken) {
    errors.email = 'Please provide your email address to request a reset.';
  }

  const newPassword = input.newPassword ?? '';
  if (hasToken) {
    if (!isPasswordStrong(newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters and contain a letter and a number.';
    }
    if (input.confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  if (hasEmail) {
    return {
      ok: true,
      value: {
        email: normalizeEmail(input.email as string),
      },
    };
  }

  return {
    ok: true,
    value: {
      token: input.token,
      newPassword,
      confirmPassword: newPassword,
    },
  };
}
