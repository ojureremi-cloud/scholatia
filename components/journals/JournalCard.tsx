'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { JournalProfile } from '@/types/identity';

type JournalCardProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalCard({ journal, className = '' }: JournalCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{journal.publicationType}</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{journal.journalTitle}</h3>
      <p className="mt-2 text-sm text-slate-600">{journal.publisher ?? 'Publisher TBD'} • {journal.country ?? 'Country TBD'}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary">View journal</Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}
