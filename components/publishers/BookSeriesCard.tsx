'use client';

import React from 'react';
import type { BookSeries } from '@/types/publisher';

type BookSeriesCardProps = {
  series: BookSeries[];
  className?: string;
};

export default function BookSeriesCard({ series, className = '' }: BookSeriesCardProps) {
  if (series.length === 0) {
    return <p className="text-sm text-slate-500">No book series recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {series.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{entry.name}</p>
            {entry.openAccess ? (
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                Open access
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-500">{entry.discipline}</p>
          {entry.description ? <p className="mt-2 text-xs leading-5 text-slate-600">{entry.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {entry.volumes !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.volumes} volumes</span>
            ) : null}
            <span className={`rounded-full px-2 py-0.5 font-medium ${entry.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {entry.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {entry.editors.length > 0 ? (
            <p className="mt-3 text-xs text-slate-500">Editors: {entry.editors.join(', ')}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
