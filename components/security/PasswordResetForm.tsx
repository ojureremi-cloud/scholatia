'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type PasswordResetFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function PasswordResetForm({ className = '', onSubmit }: PasswordResetFormProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Password reset</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Reset your password</h2>
        <p className="mt-2 text-sm text-slate-600">Enter your email and we will send a secure reset link to help you regain access.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        <a href="#" className="font-semibold text-sky-700 hover:text-sky-900">
          Return to sign in
        </a>
      </p>
    </div>
  );
}
