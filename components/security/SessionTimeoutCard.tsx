'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type SessionTimeoutCardProps = {
  className?: string;
  minutes?: number;
};

export default function SessionTimeoutCard({ className = '', minutes = 30 }: SessionTimeoutCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Session timeout</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">Your session will expire in {minutes} minutes</h3>
        <p className="mt-2 text-sm text-slate-600">Keep your access secure by re-authenticating after inactivity.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Extend session</Button>
        <Button variant="secondary">Sign out</Button>
      </div>
    </div>
  );
}
