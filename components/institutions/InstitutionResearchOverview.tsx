'use client';

import React from 'react';
import type { InstitutionResearchOutput } from '@/types/institution';

type InstitutionResearchOverviewProps = {
  outputs: InstitutionResearchOutput[];
  className?: string;
};

export default function InstitutionResearchOverview({ outputs, className = '' }: InstitutionResearchOverviewProps) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {outputs.map((output) => (
        <div key={output.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">{output.type}</span>
            <span className="text-xs text-slate-500">{output.year}</span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-900">{output.title}</p>
          <p className="mt-2 text-xs text-slate-600">{output.authors.join(', ')}</p>
          {output.venue ? <p className="mt-1 text-xs text-slate-500">{output.venue}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {output.citations !== undefined ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                {output.citations} citations
              </span>
            ) : null}
            {output.doi ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">DOI {output.doi}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
