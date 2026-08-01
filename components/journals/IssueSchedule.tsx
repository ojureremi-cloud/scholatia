'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { IssueScheduleEntry } from '@/types/identity';

type IssueScheduleProps = {
  entries: IssueScheduleEntry[];
  className?: string;
};

const statusVariant: Record<IssueScheduleEntry['status'], 'success' | 'info' | 'default'> = {
  Published: 'success',
  'In Production': 'info',
  Planned: 'default',
};

export default function IssueSchedule({ entries, className = '' }: IssueScheduleProps) {
  if (entries.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">No issues are currently scheduled.</p>;
  }

  return (
    <div className={['space-y-3', className].filter(Boolean).join(' ')}>
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Issue {entry.issueNumber}</p>
              <p className="mt-1 text-xs text-slate-500">
                {entry.volume ? `Volume ${entry.volume} · ` : ''}
                {entry.year}
              </p>
            </div>
            <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
          </div>
          {entry.theme ? <p className="mt-2 text-sm leading-6 text-slate-600">{entry.theme}</p> : null}
          <p className="mt-2 text-xs text-slate-500">
            Publication: {entry.publicationDate}
            {entry.articles ? ` · ${entry.articles} articles` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
