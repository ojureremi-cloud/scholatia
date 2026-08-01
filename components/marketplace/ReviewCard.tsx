import React from 'react';
import { formatDate, formatNumber, formatStars } from './format';
import type { MarketplaceReview } from '@/types/marketplace';

type ReviewCardProps = {
  review: MarketplaceReview;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{review.reviewerName}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {formatDate(review.date)}
            {review.reviewerSaid ? ' · verified Scholatia identity' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-amber-500">{formatStars(review.rating)}</p>
          {review.verifiedPurchase ? (
            <p className="mt-1 text-xs font-medium text-emerald-600">Verified purchase</p>
          ) : null}
        </div>
      </div>

      <h4 className="mt-3 font-semibold text-slate-800">{review.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{review.comment}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{formatNumber(review.helpfulVotes)} found this helpful</span>
        {review.reported ? <span className="font-semibold text-rose-600">Reported</span> : null}
      </div>
    </article>
  );
}
