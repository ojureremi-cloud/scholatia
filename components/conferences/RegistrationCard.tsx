'use client';

import React from 'react';
import type { ConferenceRegistrationOption } from '@/types/identity';

type RegistrationCardProps = {
  option: ConferenceRegistrationOption;
  className?: string;
};

export default function RegistrationCard({ option, className = '' }: RegistrationCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{option.audience}</p>
      <p className="mt-2 text-sm text-slate-600">Fee: {option.fee ?? 'TBD'}</p>
      <p className="mt-1 text-sm text-slate-600">Status: {option.status}</p>
    </div>
  );
}
