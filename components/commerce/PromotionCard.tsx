import React from 'react';
import { PromotionKindBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import { estimatePromotionReach, isPromotionActive } from '@/lib/commerce';
import type { CommercePromotion } from '@/types/commerce';

type PromotionCardProps = {
  promotion: CommercePromotion;
  audienceSize?: number;
};

export default function PromotionCard({ promotion, audienceSize = 120000 }: PromotionCardProps) {
  const active = isPromotionActive(promotion);
  const reach = estimatePromotionReach({ promotion, audienceSize });
  const valueLabel =
    promotion.discount.kind === 'percent'
      ? `${Math.round(promotion.discount.value)}% off`
      : formatCurrency(promotion.discount.value, promotion.currency ?? 'USD') + ' off';

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{promotion.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{promotion.productIds.length} products covered</p>
        </div>
        <PromotionKindBadge kind={promotion.kind} />
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{promotion.description}</p>

      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
        <span className="text-slate-600">Discount </span>
        <span className="font-semibold text-slate-900">{valueLabel}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          {formatDate(promotion.startsAt)} – {formatDate(promotion.endsAt)}
        </span>
        <span
          className={[
            'rounded-full px-3 py-1 font-semibold',
            active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {active ? 'Live' : 'Scheduled'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Est. reach {reach.reach.toLocaleString()}</span>
        <span>
          Budget {formatCurrency(promotion.budget ?? reach.cost, promotion.currency ?? 'USD')}
        </span>
      </div>
    </article>
  );
}
