import React from 'react';
import type { CitationYearEntry } from '@/constants/placeholder-profile';

type CitationChartProps = {
  data: CitationYearEntry[];
  className?: string;
};

export default function CitationChart({ data, className = '' }: CitationChartProps) {
  const max = Math.max(...data.map((entry) => entry.citations), 1);

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <div className="flex h-56 items-end gap-4">
        {data.map((entry) => (
          <div key={entry.year} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-semibold text-slate-700">{entry.citations}</span>
            <div
              className="w-full max-w-14 rounded-t-2xl bg-sky-200"
              style={{ height: `${Math.max((entry.citations / max) * 100, 8)}%` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 border-t border-slate-200 pt-3">
        {data.map((entry) => (
          <span key={entry.year} className="flex-1 text-center text-sm font-medium text-slate-500">
            {entry.year}
          </span>
        ))}
      </div>
    </div>
  );
}
