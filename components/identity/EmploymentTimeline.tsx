'use client';

import React from 'react';
import type { EmploymentEntry } from '@/types/identity';

type EmploymentTimelineProps = {
  employmentHistory: EmploymentEntry[];
  className?: string;
};

export default function EmploymentTimeline({ employmentHistory, className = '' }: EmploymentTimelineProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Employment</p>
      <div className="mt-4 space-y-4">
        {employmentHistory.length === 0 ? (
          <p className="text-sm text-slate-600">No employment history provided.</p>
        ) : (
          employmentHistory.map((entry) => (
            <div key={`${entry.organisation}-${entry.role}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{entry.role}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.organisation}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {entry.endDate ? `${entry.startDate} - ${entry.endDate}` : `${entry.startDate} - Present`}
                </span>
              </div>
              {entry.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{entry.description}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
