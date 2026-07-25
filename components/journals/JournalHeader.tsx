'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import type { JournalProfile } from '@/types/identity';

type JournalHeaderProps = {
  journal: JournalProfile;
  className?: string;
};

export default function JournalHeader({ journal, className = '' }: JournalHeaderProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{journal.issn ?? journal.eissn ?? 'ISSN TBD'}</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">{journal.journalTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{journal.aimsAndScope}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Editorial board</Button>
          <Button>Submit article</Button>
        </div>
      </div>
    </div>
  );
}
