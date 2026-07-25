'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type MfaVerificationCardProps = {
  className?: string;
};

const methods = ['Authenticator app', 'Email one-time passcode', 'Recovery codes'];

export default function MfaVerificationCard({ className = '' }: MfaVerificationCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Multi-factor verification</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">Secure your account</h3>
        <p className="mt-2 text-sm text-slate-600">Add a second factor to reduce the risk of unauthorised access.</p>
      </div>

      <ul className="space-y-3">
        {methods.map((method) => (
          <li key={method} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {method}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button variant="secondary">Configure MFA</Button>
      </div>
    </div>
  );
}
