import React from 'react';
import { categoryLabel, formatDateLabel } from './format';
import type { AcademicTimelineEntry } from '@/types/trust';

type AcademicTimelineProps = {
  entries: AcademicTimelineEntry[];
};

export default function AcademicTimeline({ entries }: AcademicTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l-2 border-slate-100 pl-6">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[0.5rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-sky-600 ring-2 ring-slate-100" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-400">{formatDateLabel(entry.date)}</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {categoryLabel(entry.category)}
            </span>
          </div>
          <h4 className="mt-1 font-semibold text-slate-900">{entry.title}</h4>
          <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
        </li>
      ))}
    </ol>
  );
}
