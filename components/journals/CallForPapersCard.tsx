'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { CallForPapers } from '@/types/identity';

type CallForPapersCardProps = {
  calls: CallForPapers[];
  className?: string;
};

const statusVariant: Record<CallForPapers['status'], 'success' | 'warning' | 'default'> = {
  Open: 'success',
  Closed: 'default',
  Upcoming: 'warning',
};

export default function CallForPapersCard({ calls, className = '' }: CallForPapersCardProps) {
  if (calls.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">No calls for papers are currently open.</p>;
  }

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {calls.map((call) => (
        <div key={call.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{call.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{call.theme}</p>
            </div>
            <Badge variant={statusVariant[call.status]}>{call.status}</Badge>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Deadline</dt>
              <dd className="font-semibold text-slate-900">{call.deadline}</dd>
            </div>
            {call.targetIssue ? (
              <div>
                <dt className="text-slate-500">Target issue</dt>
                <dd className="font-semibold text-slate-900">{call.targetIssue}</dd>
              </div>
            ) : null}
          </dl>
          {call.guestEditor ? (
            <p className="mt-2 text-sm text-slate-500">Guest editor: {call.guestEditor}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {call.submissionTypes.map((type) => (
              <span
                key={type}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
