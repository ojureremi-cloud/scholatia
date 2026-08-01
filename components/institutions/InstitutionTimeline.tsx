'use client';

import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import type { InstitutionTimelineEntry } from '@/types/institution';

type InstitutionTimelineProps = {
  entries: InstitutionTimelineEntry[];
  className?: string;
};

export default function InstitutionTimeline({ entries, className = '' }: InstitutionTimelineProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Institutional timeline</h3>
      <div className="mt-5">
        <Timeline>
          {entries.map((entry) => (
            <Timeline.Item key={entry.id} date={entry.date}>
              <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{entry.detail}</p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {entry.type}
              </span>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </section>
  );
}
