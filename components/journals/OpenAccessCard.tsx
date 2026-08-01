'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { JournalProfile, OpenAccessStatus } from '@/types/identity';

type OpenAccessCardProps = {
  journal: JournalProfile;
  className?: string;
};

const statusVariant: Record<OpenAccessStatus, 'success' | 'info' | 'warning' | 'default'> = {
  'Open Access': 'success',
  Diamond: 'success',
  Gold: 'success',
  Green: 'info',
  Hybrid: 'info',
  Bronze: 'warning',
  Subscription: 'default',
};

export default function OpenAccessCard({ journal, className = '' }: OpenAccessCardProps) {
  const items: Array<{ label: string; value?: string }> = [
    { label: 'Publication frequency', value: journal.publicationFrequency ?? '—' },
    { label: 'Article processing charges', value: journal.policy?.articleProcessingCharges },
    { label: 'Licensing', value: journal.policy?.licensing },
    { label: 'Embargo period', value: journal.policy?.embargoPeriod },
  ];

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant[journal.openAccessStatus]}>{journal.openAccessStatus}</Badge>
      </div>
      <dl className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
