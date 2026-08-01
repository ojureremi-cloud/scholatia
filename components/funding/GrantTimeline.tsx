'use client';

import React from 'react';
import { Timeline } from '@/components/ui/Timeline';
import { formatDate } from './format';
import type { Grant } from '@/types/funding';

type GrantTimelineProps = {
  grant: Grant;
  className?: string;
};

const typeIcon: Record<string, string> = {
  Discovery: '🔍',
  Application: '📝',
  Review: '👥',
  Decision: '⚖️',
  Award: '🏆',
  Milestone: '🎯',
  Reporting: '📊',
  Completion: '✅',
};

export default function GrantTimeline({ grant, className = '' }: GrantTimelineProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Timeline</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Grant journey</h3>
      <div className="mt-5">
        <Timeline>
          {grant.timeline.entries.map((entry) => (
            <Timeline.Item
              key={entry.id}
              date={formatDate(entry.date)}
              icon={<span className="text-lg">{typeIcon[entry.type] ?? '•'}</span>}
            >
              <p className="font-medium text-slate-900">{entry.title}</p>
              <p className="mt-0.5 text-sm leading-5 text-slate-500">{entry.detail}</p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {entry.type}
              </span>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
