import React from 'react';
import { CampaignStatusBadge } from './AdsBadge';
import { formatBudgetMode, formatCurrency, formatDate, formatPricingModel, formatPlacement } from './format';
import { calculateBudgetUtilization, remainingBudget } from '@/lib/ads';
import type { AdAudience, AdSet } from '@/types/ads';

type AdSetCardProps = {
  adSet: AdSet;
  audience?: AdAudience;
};

export default function AdSetCard({ adSet, audience }: AdSetCardProps) {
  const remaining = remainingBudget(adSet.budget);
  const utilization = calculateBudgetUtilization(adSet.budget);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CampaignStatusBadge status={adSet.status} />
        <span className="text-xs font-medium text-slate-400">{adSet.id}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{adSet.name}</h3>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {formatPricingModel(adSet.pricingModel)} · {formatCurrency(adSet.bidAmount, adSet.currency)} bid
      </p>
      {audience ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          👥 {audience.name} · {audience.estimatedReach.toLocaleString('en-US')} reach
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {adSet.placements.slice(0, 6).map((placement) => (
          <span key={placement} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {formatPlacement(placement)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex-1 space-y-3">
        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {formatBudgetMode(adSet.budget.mode)}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatCurrency(remaining, adSet.currency)} left
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-sky-600" style={{ width: `${utilization}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {adSet.creatives.map((creative) => (
            <span key={creative} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {creative}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Starts {formatDate(adSet.schedule.startDate)}</span>
        <span>{adSet.schedule.endDate ? `Ends ${formatDate(adSet.schedule.endDate)}` : 'No end date'}</span>
      </div>
    </article>
  );
}
