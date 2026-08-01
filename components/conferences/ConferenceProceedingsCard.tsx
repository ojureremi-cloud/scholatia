'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceProceedings } from '@/types/conference';

type ConferenceProceedingsCardProps = {
  proceedings: ConferenceProceedings;
  className?: string;
};

export default function ConferenceProceedingsCard({ proceedings, className = '' }: ConferenceProceedingsCardProps) {
  const statusVariant = {
    Published: 'success',
    'In Production': 'info',
    Planned: 'warning',
  } as const;

  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{proceedings.title}</p>
        <Badge variant={statusVariant[proceedings.publicationStatus]}>{proceedings.publicationStatus}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">{proceedings.publisher}</p>
      <p className="mt-1 text-sm text-slate-600">
        {proceedings.volume} · {proceedings.year} · {proceedings.numberOfPapers} papers
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {[proceedings.issn ? `ISSN ${proceedings.issn}` : null, proceedings.eissn ? `eISSN ${proceedings.eissn}` : null, proceedings.doiPrefix ? `DOI prefix ${proceedings.doiPrefix}` : null]
          .filter(Boolean)
          .join(' · ')}
      </p>
      {proceedings.publicationDate ? (
        <p className="mt-1 text-xs text-slate-500">Publication date: {proceedings.publicationDate}</p>
      ) : null}
      {proceedings.editors && proceedings.editors.length > 0 ? (
        <p className="mt-2 text-xs text-slate-500">Editors: {proceedings.editors.join(', ')}</p>
      ) : null}
      {proceedings.indexing && proceedings.indexing.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {proceedings.indexing.map((index) => (
            <span
              key={index}
              className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700"
            >
              {index}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
