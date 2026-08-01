import React from 'react';
import { RecommendationBadge, ReviewModelBadge } from './TrustBadge';
import { formatDateLabel } from './format';
import type { ReviewHistoryEntry } from '@/types/trust';

type ReviewHistoryCardProps = {
  entry: ReviewHistoryEntry;
};

export default function ReviewHistoryCard({ entry }: ReviewHistoryCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">{entry.role}</span>
        <ReviewModelBadge model={entry.model} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{entry.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{formatDateLabel(entry.date)}</span>
        {entry.outcome ? <RecommendationBadge recommendation={entry.outcome} /> : null}
      </div>
    </article>
  );
}
