'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceAcceptedPaper } from '@/types/conference';

type AcceptedPaperCardProps = {
  paper: ConferenceAcceptedPaper;
  className?: string;
};

const statusVariant: Record<ConferenceAcceptedPaper['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  Accepted: 'success',
  'In Production': 'info',
  Published: 'default',
};

export default function AcceptedPaperCard({ paper, className = '' }: AcceptedPaperCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-5 text-slate-900">{paper.title}</p>
        <Badge variant={statusVariant[paper.status]}>{paper.status}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">{paper.authors.join(', ')}</p>
      <p className="mt-1 text-xs text-slate-500">
        {paper.submissionType} · Track: {paper.track}
      </p>
      {paper.bestPaperAward ? (
        <p className="mt-2 text-xs font-medium text-amber-700">{paper.bestPaperAward} award</p>
      ) : null}
      {paper.doi ? <p className="mt-2 text-xs text-slate-500">DOI: {paper.doi}</p> : null}
    </div>
  );
}
