'use client';

import React, { useMemo } from 'react';
import { formatDate, formatMonth } from './format';
import type { FundingCalendarEntry, DeadlinePriority } from '@/types/funding';

type FundingCalendarProps = {
  entries: FundingCalendarEntry[];
  className?: string;
};

const priorityVariant: Record<DeadlinePriority, string> = {
  high: 'bg-rose-100 text-rose-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-slate-100 text-slate-600',
};

export default function FundingCalendar({ entries, className = '' }: FundingCalendarProps) {
  const months = useMemo(() => {
    const grouped = new Map<string, FundingCalendarEntry[]>();
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    for (const entry of sorted) {
      const bucket = grouped.get(entry.month) ?? [];
      bucket.push(entry);
      grouped.set(entry.month, bucket);
    }
    return Array.from(grouped.entries());
  }, [entries]);

  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Calendar</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Funding calendar</h3>
      <div className="mt-5 space-y-6">
        {months.map(([month, monthEntries]) => (
          <div key={month}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{formatMonth(month)}</p>
            <ul className="mt-3 space-y-2">
              {monthEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-24 flex-shrink-0 font-medium text-slate-900">{formatDate(entry.date)}</span>
                    <div>
                      <p className="font-medium text-slate-900">{entry.title}</p>
                      <p className="text-xs text-slate-500">{entry.agency}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityVariant[entry.priority]}`}>
                    {entry.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
