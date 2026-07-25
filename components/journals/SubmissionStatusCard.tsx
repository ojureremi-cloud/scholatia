'use client';

import React from 'react';
import type { JournalProfile } from '@/types/identity';

type SubmissionStatusCardProps = {
  journal: JournalProfile;
  className?: string;
};

export default function SubmissionStatusCard({ journal, className = '' }: SubmissionStatusCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">Submission types</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {journal.submissionTypes.map((submissionType) => (
          <span key={submissionType} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
            {submissionType}
          </span>
        ))}
      </div>
    </div>
  );
}
