'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import type { ApiErrorResponse, ResetPasswordRequest } from '@/types/auth';

type ResetPasswordFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function ResetPasswordForm({ className = '', onSubmit }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: ResetPasswordRequest = {
      token: token ?? '',
      newPassword: String(formData.get('newPassword') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { data?: { reset: boolean } } | ApiErrorResponse;

      if (response.ok && 'data' in body) {
        setSuccess(true);
        return;
      }

      if ('error' in body) {
        setError(body.error.message);
      } else {
        setError('Unable to reset your password. Please try again.');
      }
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
        <Alert
          variant="danger"
          title="Missing reset link"
          description="This reset link is invalid. Please request a new password reset link."
        />
        <Button href="/forgot-password" variant="secondary" className="mt-6 w-full">
          Request a new link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Password updated</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Your password has been reset</h2>
        <p className="mt-2 text-sm text-slate-600">You can now sign in with your new password. All active sessions were signed out.</p>
        <Button href="/login" className="mt-6 w-full">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Reset password</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Choose a new password</h2>
        <p className="mt-2 text-sm text-slate-600">Use a strong password and keep your account protected with the latest security standards.</p>
      </div>

      {error ? <Alert variant="danger" title="Unable to reset password" description={error} className="mb-6" /> : null}

      <form className="space-y-5" onSubmit={onSubmit ?? handleSubmit}>
        <Input label="New password" type="password" name="newPassword" autoComplete="new-password" required />
        <Input label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" required />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Updating password…' : 'Update password'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        <a href="/login" className="font-semibold text-sky-700 hover:text-sky-900">
          Return to sign in
        </a>
      </p>
    </div>
  );
}
