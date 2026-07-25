'use client';

import React from 'react';
import type { JournalProfile } from '@/types/identity';

type PublicationTimelineProps = {
  journal: JournalProfile;
  className?: string;
};

export default function PublicationTimeline({ journal, className = '' }: PublicationTimelineProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Publication workflow</h3>
      <div className="mt-4 space-y-3">
        {journal.workflow.map((stage) => (
          <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{stage}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
