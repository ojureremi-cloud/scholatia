'use client';

import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import { formatDate } from './format';
import type { PublisherTimelineEntry } from '@/types/publisher';

type PublisherTimelineProps = {
  entries: PublisherTimelineEntry[];
  className?: string;
};

export default function PublisherTimeline({ entries, className = '' }: PublisherTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No timeline recorded for this publisher.</p>;
  }
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Publisher timeline</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Milestones</h3>
      <div className="mt-5">
        <Timeline>
          {entries.map((entry) => (
            <Timeline.Item key={entry.id} date={formatDate(entry.date)}>
              <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{entry.detail}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{entry.type}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
