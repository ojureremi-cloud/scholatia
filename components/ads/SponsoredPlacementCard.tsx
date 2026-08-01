import React from 'react';
import { SponsoredLabelBadge } from './AdsBadge';
import { formatCompactNumber, formatCurrency, formatDate, formatPlacement } from './format';
import type { SponsoredPlacement } from '@/types/ads';

type SponsoredPlacementCardProps = {
  placement: SponsoredPlacement;
};

const statusVariant: Record<SponsoredPlacement['status'], string> = {
  live: 'bg-emerald-100 text-emerald-800',
  paused: 'bg-amber-100 text-amber-800',
  ended: 'bg-slate-100 text-slate-600',
  scheduled: 'bg-sky-100 text-sky-800',
};

export default function SponsoredPlacementCard({ placement }: SponsoredPlacementCardProps) {
  const ctr = placement.impressions > 0 ? ((placement.clicks / placement.impressions) * 100).toFixed(2) : '0.00';
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SponsoredLabelBadge label={placement.label} />
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusVariant[placement.status]}`}>
          {placement.status}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{formatPlacement(placement.placement)}</h3>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Priority {placement.priority}</p>
      <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impressions</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(placement.impressions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clicks</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(placement.clicks)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">CTR</p>
          <p className="mt-1 font-semibold text-slate-900">{ctr}%</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{formatDate(placement.startDate)} — {placement.endDate ? formatDate(placement.endDate) : 'now'}</span>
        <span className="font-semibold text-slate-700">{formatCurrency(placement.spend, placement.currency)}</span>
      </div>
    </article>
  );
}
