'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ForgotPasswordFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function ForgotPasswordForm({ className = '', onSubmit }: ForgotPasswordFormProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Forgot password</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Recover your access</h2>
        <p className="mt-2 text-sm text-slate-600">We will send a secure recovery link to your verified email address.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Button type="submit" className="w-full">Send recovery email</Button>
      </form>
    </div>
  );
}
