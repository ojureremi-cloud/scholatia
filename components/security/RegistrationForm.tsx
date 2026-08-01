'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import type { ApiErrorResponse, ApiSuccessResponse, RegisterRequest, RegisterResponse } from '@/types/auth';

type RegistrationFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function RegistrationForm({ className = '', onSubmit }: RegistrationFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegisterResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: RegisterRequest = {
      fullName: String(formData.get('fullName') ?? ''),
      institution: String(formData.get('institution') ?? '') || undefined,
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      consent: formData.get('consent') === 'on',
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as ApiSuccessResponse<RegisterResponse> | ApiErrorResponse;

      if (response.ok && 'data' in body) {
        setSuccess(body.data);
        return;
      }

      if ('error' in body) {
        const fieldErrors = body.error.fieldErrors;
        if (fieldErrors) {
          const firstMessage = Object.values(fieldErrors)[0];
          setError(firstMessage ?? body.error.message);
        } else {
          setError(body.error.message);
        }
      } else {
        setError('Unable to create your account. Please try again.');
      }
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Account created</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Welcome to Scholatia</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your account and Scholatia Academic Identity have been created. Please verify your email address to activate
          your account and sign in.
        </p>
        <div className="mt-6 space-y-4">
          <Alert
            variant="info"
            title="One more step"
            description="Check your inbox for a verification email. No email service is connected in Phase 1.1, so a demo verification link is provided below."
          />
          {success.verificationUrl ? (
            <Button href={success.verificationUrl} className="w-full">
              Verify email address
            </Button>
          ) : null}
          <p className="text-center text-sm text-slate-600">
            Already verified?{' '}
            <a href="/login" className="font-semibold text-sky-700 hover:text-sky-900">
              Sign in
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Create account</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Join Scholatia</h2>
        <p className="mt-2 text-sm text-slate-600">Create your academic profile and begin building trusted relationships across the scholarly ecosystem.</p>
      </div>

      {error ? <Alert variant="danger" title="Unable to create account" description={error} className="mb-6" /> : null}

      <form className="space-y-5" onSubmit={onSubmit ?? handleSubmit}>
        <Input label="Full name" name="fullName" autoComplete="name" required />
        <Input label="Institution" name="institution" autoComplete="organization" required />
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="new-password" required />
        <Input label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" required />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Checkbox label="I agree to the Scholatia terms and privacy policy" name="consent" required />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-sky-700 hover:text-sky-900">
          Sign in
        </a>
      </p>
    </div>
  );
}
