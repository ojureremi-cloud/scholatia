'use client';

import React from 'react';
import type { ProceedingsRef } from '@/types/publisher';

type ProceedingsCardProps = {
  proceedings: ProceedingsRef[];
  className?: string;
};

const statusVariant: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-800',
  'In Production': 'bg-amber-100 text-amber-800',
  Planned: 'bg-slate-100 text-slate-700',
};

export default function ProceedingsCard({ proceedings, className = '' }: ProceedingsCardProps) {
  if (proceedings.length === 0) {
    return <p className="text-sm text-slate-500">No proceedings recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {proceedings.map((entry) => (
        <div key={entry.proceedingsId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{entry.title}</p>
            {entry.publicationStatus ? (
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusVariant[entry.publicationStatus] ?? 'bg-slate-100 text-slate-700'}`}
              >
                {entry.publicationStatus}
              </span>
            ) : null}
          </div>
          {entry.conference ? <p className="mt-1 text-xs text-slate-500">{entry.conference}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {entry.year ? <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.year}</span> : null}
            {entry.numberOfPapers !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                {entry.numberOfPapers} papers
              </span>
            ) : null}
            {entry.issn ? <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">ISSN {entry.issn}</span> : null}
            {entry.doiPrefix ? <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.doiPrefix}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
