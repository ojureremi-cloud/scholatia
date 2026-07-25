'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type EmailVerificationCardProps = {
  className?: string;
  email?: string;
  onResend?: () => void;
};

export default function EmailVerificationCard({ className = '', email = 'member@scholatia.org', onResend }: EmailVerificationCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Email verification</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">Verify your email address</h3>
          <p className="mt-2 text-sm text-slate-600">A verification message was sent to {email}.</p>
        </div>
        <Button variant="secondary" onClick={onResend}>Resend email</Button>
      </div>
    </div>
  );
}
