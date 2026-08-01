import React from 'react';
import type { Manuscript } from '@/types/manuscript';
import { formatCompactNumber } from './format';

type ManuscriptMetadataCardProps = {
  manuscript: Manuscript;
};

export function ManuscriptMetadataCard({ manuscript }: ManuscriptMetadataCardProps) {
  const { metadata } = manuscript;
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Abstract</dt>
        <dd className="mt-1.5 leading-6 text-slate-700">{metadata.abstract}</dd>
      </div>
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Keywords</dt>
        <dd className="mt-2 flex flex-wrap gap-2">
          {metadata.keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {keyword}
            </span>
          ))}
        </dd>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Language</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.language}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Word count</dt>
          <dd className="mt-1.5 text-slate-700">{formatCompactNumber(metadata.wordCount)}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Pages</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.pageCount}</dd>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Figures</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.figures}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Tables</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.tables}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">References</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.references}</dd>
        </div>
      </div>
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Subjects</dt>
        <dd className="mt-2 flex flex-wrap gap-2">
          {metadata.subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {subject}
            </span>
          ))}
        </dd>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">DOI</dt>
          <dd className="mt-1.5 text-slate-700">{manuscript.doi ?? 'Pending publication'}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Preprint</dt>
          <dd className="mt-1.5 text-slate-700">{manuscript.preprintDoi ?? 'None'}</dd>
        </div>
      </div>
    </dl>
  );
}
