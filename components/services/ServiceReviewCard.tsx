import React from 'react';
import { formatDate, formatNumber } from './format';
import type { ServiceReview } from '@/types/services';

type ServiceReviewCardProps = {
  review: ServiceReview;
};

export default function ServiceReviewCard({ review }: ServiceReviewCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {review.reviewerName.slice(0, 1)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{review.reviewerName}</p>
            <p className="text-xs text-slate-400">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">{review.rating.toFixed(1)} ★</span>
          {review.verifiedPurchase ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">Verified purchase</span>
          ) : null}
        </div>
      </div>

      <p className="mt-4 font-medium text-slate-800">{review.title}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{review.comment}</p>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        {formatNumber(review.helpfulVotes)} people found this helpful
      </p>
    </article>
  );
}
