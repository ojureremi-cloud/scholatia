import React from 'react';
import { PromotionKindBadge } from './MarketplaceBadge';
import { formatDate, formatPercent } from './format';
import type { MarketplacePromotion } from '@/types/marketplace';

type PromotionCardProps = {
  promotion: MarketplacePromotion;
};

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const discountLabel = promotion.discount.percent != null
    ? `${formatPercent(promotion.discount.percent)} off`
    : promotion.discount.fixed != null
      ? `£${promotion.discount.fixed} off`
      : 'Limited-time offer';

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PromotionKindBadge kind={promotion.kind} />
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {discountLabel}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{promotion.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{promotion.description}</p>

      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Covered listings</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{promotion.listingIds.length} listings</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Starts {formatDate(promotion.startsAt)}</span>
        <span>Ends {formatDate(promotion.endsAt)}</span>
      </div>
    </article>
  );
}
