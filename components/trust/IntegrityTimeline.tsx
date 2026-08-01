import React from 'react';
import { IntegrityStatusBadge } from './TrustBadge';
import { formatDateLabel, integrityTypeLabel } from './format';
import type { IntegrityTimelineEntry } from '@/types/trust';

type IntegrityTimelineProps = {
  entries: IntegrityTimelineEntry[];
};

export default function IntegrityTimeline({ entries }: IntegrityTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l-2 border-slate-100 pl-6">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.875rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-sky-600 ring-2 ring-slate-100" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-400">{formatDateLabel(entry.date)}</p>
            <IntegrityStatusBadge status={entry.status} />
          </div>
          <h4 className="mt-1 font-semibold text-slate-900">{entry.title}</h4>
          <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{integrityTypeLabel(entry.type)}</p>
        </li>
      ))}
    </ol>
  );
}
