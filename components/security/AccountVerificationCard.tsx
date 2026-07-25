'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type AccountVerificationCardProps = {
  className?: string;
  title?: string;
  description?: string;
};

const steps = ['Confirm your institutional affiliation', 'Upload supporting documentation', 'Complete identity review'];

export default function AccountVerificationCard({
  className = '',
  title = 'Account verification',
  description = 'Strengthen trust and unlock advanced platform capabilities.',
}: AccountVerificationCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Identity review</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <ul className="space-y-3">
        {steps.map((step) => (
          <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {step}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button>Start verification</Button>
      </div>
    </div>
  );
}
