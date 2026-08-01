'use client';

import React from 'react';
import type { PublisherJournalRef } from '@/types/publisher';

type JournalPortfolioProps = {
  journals: PublisherJournalRef[];
  className?: string;
};

export default function JournalPortfolio({ journals, className = '' }: JournalPortfolioProps) {
  if (journals.length === 0) {
    return (
      <p className="text-sm text-slate-500">No journal portfolio recorded for this publisher.</p>
    );
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {journals.map((journal) => (
        <div key={journal.journalId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{journal.title}</p>
            {journal.quartile ? (
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                {journal.quartile}
              </span>
            ) : null}
          </div>
          {journal.issn ? <p className="mt-1 text-xs text-slate-500">ISSN {journal.issn}</p> : null}
          <p className="mt-1 text-xs text-slate-500">{journal.discipline ?? 'Multidisciplinary'}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            {journal.impactFactor !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                IF {journal.impactFactor}
              </span>
            ) : null}
            {journal.openAccessStatus ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                {journal.openAccessStatus}
              </span>
            ) : null}
            {journal.country ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{journal.country}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
