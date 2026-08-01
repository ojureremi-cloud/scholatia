import React from 'react';
import { CouponStatusBadge } from './MarketplaceBadge';
import { formatCurrency, formatDate, formatPercent } from './format';
import { applyCoupon } from '@/lib/marketplace';
import type { MarketplaceCoupon } from '@/types/marketplace';

type CouponCardProps = {
  coupon: MarketplaceCoupon;
};

export default function CouponCard({ coupon }: CouponCardProps) {
  const valueLabel =
    coupon.type === 'percent'
      ? formatPercent(coupon.value)
      : formatCurrency(coupon.value, 'GBP');
  const appliesToLabel = coupon.appliesTo.replace(/-/g, ' ');
  const sample = applyCoupon(coupon, 100);
  const usageLabel =
    coupon.usageLimit != null ? `${coupon.timesUsed}/${coupon.usageLimit} used` : `${coupon.timesUsed} used`;

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-xl bg-slate-900 px-4 py-2 font-mono text-sm font-semibold tracking-widest text-white">
          {coupon.code}
        </span>
        <CouponStatusBadge status={coupon.status} />
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-7 text-slate-900">{coupon.title}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-slate-600">{coupon.description}</p>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">{appliesToLabel}</span>
        <span className="text-xl font-semibold text-slate-900">{valueLabel}</span>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        {coupon.minimumSpend != null ? <p>Minimum spend {formatCurrency(coupon.minimumSpend, 'GBP')}</p> : null}
        {sample ? (
          <p>
            On a £100 cart you save {formatCurrency(sample.discount, 'GBP')}
          </p>
        ) : (
          <p className="font-medium text-rose-600">Not currently applicable</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          {formatDate(coupon.validFrom)} – {formatDate(coupon.validUntil)}
        </span>
        <span className="font-semibold text-slate-700">{usageLabel}</span>
      </div>
    </article>
  );
}
