import React from 'react';
import { formatNumber } from './format';
import type { ServiceRatingSummary } from '@/types/services';

type ServiceRatingCardProps = {
  rating: ServiceRatingSummary;
};

const STARS = ['5', '4', '3', '2', '1'] as const;

export default function ServiceRatingCard({ rating }: ServiceRatingCardProps) {
  const max = Math.max(1, ...STARS.map((star) => rating.distribution[star]));

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-end justify-between gap-3">
        <p className="text-4xl font-semibold text-slate-900">{rating.average.toFixed(1)}</p>
        <p className="pb-1 text-sm text-slate-500">{formatNumber(rating.count)} reviews</p>
      </div>

      <ul className="mt-5 space-y-2">
        {STARS.map((star) => {
          const count = rating.distribution[star];
          const width = (count / max) * 100;
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className="w-8 shrink-0 text-slate-500">{star} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right text-xs text-slate-400">{formatNumber(count)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
