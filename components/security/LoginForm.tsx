'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import IconButton from '@/components/ui/IconButton';
import Alert from '@/components/ui/Alert';
import type { ApiErrorResponse, ApiSuccessResponse, LoginRequest, LoginResponse } from '@/types/auth';

const providerButtons = [
  { label: 'Google', value: 'Google' },
  { label: 'Microsoft', value: 'Microsoft' },
  { label: 'ORCID', value: 'ORCID' },
];

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = '' }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: LoginRequest = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      rememberMe: formData.get('remember') === 'on',
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as ApiSuccessResponse<LoginResponse> | ApiErrorResponse;

      if (response.ok) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        window.location.href = next && next.startsWith('/') ? next : '/dashboard';
        return;
      }

      if ('error' in body) {
        setError(body.error.message);
      } else {
        setError('Unable to sign in. Please try again.');
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Secure access</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to Scholatia</h2>
        <p className="mt-2 text-sm text-slate-600">Use your secure Scholatia credentials or one of the approved providers.</p>
      </div>

      {error ? <Alert variant="danger" title="Sign in failed" description={error} className="mb-6" /> : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="current-password" required />
        <div className="flex items-center justify-between gap-4">
          <Checkbox label="Remember me" name="remember" />
          <a href="/forgot-password" className="text-sm font-medium text-sky-700 hover:text-sky-900">Forgot password?</a>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Sign in with</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {providerButtons.map((provider) => (
            <IconButton key={provider.value} label={provider.label} icon={<span aria-hidden="true">•</span>} />
          ))}
        </div>
      </div>
    </div>
  );
}
