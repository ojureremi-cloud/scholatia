'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import type { ApiErrorResponse, ResetPasswordRequest } from '@/types/auth';

type PasswordResetFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

type ResetResult = { ok: boolean; resetUrl?: string };

export default function PasswordResetForm({ className = '', onSubmit }: PasswordResetFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ResetResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload: ResetPasswordRequest = { email: String(formData.get('email') ?? '') };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { data?: ResetResult } | ApiErrorResponse;

      if (response.ok && 'data' in body && body.data) {
        setMessage(body.data);
        return;
      }

      if ('error' in body) {
        setError(body.error.message);
      } else {
        setError('Unable to process your request. Please try again.');
      }
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Password reset</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Reset your password</h2>
        <p className="mt-2 text-sm text-slate-600">Enter your email and we will send a secure reset link to help you regain access.</p>
      </div>

      {error ? <Alert variant="danger" title="Request failed" description={error} className="mb-6" /> : null}
      {message ? (
        <Alert
          variant="success"
          title="Recovery email sent"
          description="If an account exists for this email address, a secure reset link has been issued."
          className="mb-6"
        />
      ) : null}
      {message?.resetUrl ? (
        <Alert
          variant="info"
          title="Demo reset link"
          description="No email service is connected in Phase 1.1, so a demo reset link is provided below."
          className="mb-6"
        />
      ) : null}

      <form className="space-y-5" onSubmit={onSubmit ?? handleSubmit}>
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending reset link…' : 'Send reset link'}
        </Button>
      </form>

      {message?.resetUrl ? (
        <Button href={message.resetUrl} variant="secondary" className="mt-4 w-full">
          Open reset link
        </Button>
      ) : null}

      <p className="mt-6 text-sm text-slate-600">
        <a href="/login" className="font-semibold text-sky-700 hover:text-sky-900">
          Return to sign in
        </a>
      </p>
    </div>
  );
}
