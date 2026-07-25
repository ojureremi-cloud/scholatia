'use client';

import React from 'react';
import type { ConferenceSubmissionOption } from '@/types/identity';

type SubmissionCardProps = {
  option: ConferenceSubmissionOption;
  className?: string;
};

export default function SubmissionCard({ option, className = '' }: SubmissionCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{option.type}</p>
      <p className="mt-2 text-sm text-slate-600">Required: {option.required ? 'Yes' : 'No'}</p>
      <p className="mt-1 text-sm text-slate-600">Deadline: {option.deadline ?? 'TBD'}</p>
    </div>
  );
}
