'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ResetPasswordFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function ResetPasswordForm({ className = '', onSubmit }: ResetPasswordFormProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Reset password</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Choose a new password</h2>
        <p className="mt-2 text-sm text-slate-600">Use a strong password and keep your account protected with the latest security standards.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Input label="New password" type="password" name="newPassword" autoComplete="new-password" required />
        <Input label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" required />
        <Button type="submit" className="w-full">Update password</Button>
      </form>
    </div>
  );
}
