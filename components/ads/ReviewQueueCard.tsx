import React from 'react';
import { ReviewStatusBadge } from './AdsBadge';
import { formatDate } from './format';
import type { AdReviewRecord } from '@/types/ads';

type ReviewQueueCardProps = {
  review: AdReviewRecord;
};

const checkLabels: Record<AdReviewRecord['checks'][number], string> = {
  'manual-moderation': 'Manual',
  'ai-moderation': 'AI',
  'academic-integrity': 'Integrity',
  'spam-detection': 'Spam',
  'fraud-detection': 'Fraud',
};

export default function ReviewQueueCard({ review }: ReviewQueueCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {review.targetKind} · {review.targetId}
        </span>
        <ReviewStatusBadge status={review.status} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{review.id}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {review.notes ?? 'No notes yet — automated checks completed.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {review.checks.map((check) => (
          <span key={check} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {checkLabels[check]}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Created {formatDate(review.createdAt)}</span>
        {review.decidedBy ? <span>By {review.decidedBy}</span> : null}
      </div>
    </article>
  );
}
