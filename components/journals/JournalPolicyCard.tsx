'use client';

import React from 'react';
import type { JournalPolicy, JournalProfile } from '@/types/identity';

type JournalPolicyCardProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalPolicyCard({ journal, className = '' }: JournalPolicyCardProps) {
  const policy: JournalPolicy = journal.policy ?? {};
  const items: Array<{ label: string; value?: string }> = [
    { label: 'Article processing charges', value: policy.articleProcessingCharges },
    { label: 'Submission fee', value: policy.submissionFee },
    { label: 'Embargo period', value: policy.embargoPeriod },
    { label: 'Licensing', value: policy.licensing },
    { label: 'Copyright', value: policy.copyright },
    { label: 'Plagiarism policy', value: policy.plagiarismPolicy },
    { label: 'Data policy', value: policy.dataPolicy },
    { label: 'Ethics policy', value: policy.ethicsPolicy },
    { label: 'Appeals policy', value: policy.appealsPolicy },
    { label: 'Conflicts of interest', value: policy.conflictsOfInterestPolicy },
    { label: 'Preprints policy', value: policy.preprintsPolicy },
  ];

  return (
    <dl className={['space-y-3', className].filter(Boolean).join(' ')}>
      {items
        .filter((item) => Boolean(item.value))
        .map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium leading-6 text-slate-900">{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}
