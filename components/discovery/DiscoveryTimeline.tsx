'use client';

import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import { entityTypeIcon, entityTypeLabel, formatDate } from './format';
import type { DiscoveryTimelineEntry } from '@/types/discovery';

type DiscoveryTimelineProps = {
  entries: DiscoveryTimelineEntry[];
  className?: string;
};

export default function DiscoveryTimeline({ entries, className = '' }: DiscoveryTimelineProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Recent activity</p>
      <div className="mt-6">
        <Timeline>
          {entries.map((entry) => (
            <Timeline.Item
              key={entry.id}
              date={formatDate(entry.date)}
              icon={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">{entityTypeIcon(entry.type)}</span>}
            >
              <p className="font-semibold text-slate-900">{entry.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                {entry.detail} · {entityTypeLabel(entry.type)}
              </p>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
