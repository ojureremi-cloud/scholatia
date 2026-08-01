'use client';

import React from 'react';
import type { PublishingDivision } from '@/types/publisher';

type PublishingDivisionCardProps = {
  divisions: PublishingDivision[];
  className?: string;
};

export default function PublishingDivisionCard({ divisions, className = '' }: PublishingDivisionCardProps) {
  if (divisions.length === 0) {
    return <p className="text-sm text-slate-500">No publishing divisions recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {divisions.map((division) => (
        <div key={division.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{division.name}</p>
            <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {division.type}
            </span>
          </div>
          {division.description ? <p className="mt-2 text-xs leading-5 text-slate-600">{division.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {division.outputCount !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                {division.outputCount.toLocaleString('en-US')} outputs
              </span>
            ) : null}
            {division.countries && division.countries.length > 0 ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                {division.countries.join(', ')}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
