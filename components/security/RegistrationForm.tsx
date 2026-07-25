'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';

type RegistrationFormProps = {
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function RegistrationForm({ className = '', onSubmit }: RegistrationFormProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Create account</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Join Scholatia</h2>
        <p className="mt-2 text-sm text-slate-600">Create your academic profile and begin building trusted relationships across the scholarly ecosystem.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
        <Input label="Full name" name="fullName" autoComplete="name" required />
        <Input label="Institution" name="institution" autoComplete="organization" required />
        <Input label="Email address" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="new-password" required />
        <Input label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" required />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Checkbox label="I agree to the Scholatia terms and privacy policy" name="consent" required />
        </div>

        <Button type="submit" className="w-full">Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <a href="#" className="font-semibold text-sky-700 hover:text-sky-900">
          Sign in
        </a>
      </p>
    </div>
  );
}
