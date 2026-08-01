'use client';

import React from 'react';
import { formatDate } from './format';
import type { FundingDeadline, DeadlinePriority } from '@/types/funding';

type FundingDeadlineCardProps = {
  deadlines: FundingDeadline[];
  className?: string;
};

const priorityVariant: Record<DeadlinePriority, string> = {
  high: 'bg-rose-100 text-rose-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-slate-100 text-slate-600',
};

export default function FundingDeadlineCard({ deadlines, className = '' }: FundingDeadlineCardProps) {
  const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Deadlines</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Upcoming deadlines</h3>
      <ul className="mt-5 space-y-3">
        {sorted.map((deadline) => (
          <li key={deadline.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-center">
                <p className="text-lg font-semibold leading-none text-slate-900">{formatDate(deadline.date).split(', ')[0].split(' ')[1]}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {formatDate(deadline.date).split(' ')[0]}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">{deadline.title}</p>
                <p className="text-xs text-slate-500">{deadline.agency} · {deadline.type}</p>
              </div>
            </div>
            <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityVariant[deadline.priority]}`}>
              {deadline.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
