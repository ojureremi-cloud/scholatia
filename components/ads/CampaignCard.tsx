import React from 'react';
import { CampaignStatusBadge, ObjectiveBadge } from './AdsBadge';
import { formatCurrency, formatDate } from './format';
import { calculateBudgetUtilization } from '@/lib/ads';
import type { AdCampaign, AdSet, AdvertiserAccount } from '@/types/ads';

type CampaignCardProps = {
  campaign: AdCampaign;
  adSets?: readonly AdSet[];
  advertiser?: AdvertiserAccount;
};

export default function CampaignCard({ campaign, adSets = [], advertiser }: CampaignCardProps) {
  const sets = adSets.filter((set) => campaign.adSets.includes(set.id));
  const totalBudget = sets.reduce((sum, set) => sum + set.budget.total, 0);
  const totalSpent = sets.reduce((sum, set) => sum + set.budget.spent, 0);
  const utilization =
    totalBudget > 0 ? Math.max(0, Math.min(100, Math.round((totalSpent / totalBudget) * 100))) : 0;

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CampaignStatusBadge status={campaign.status} />
        <span className="text-xs font-medium text-slate-400">{campaign.id}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{campaign.name}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ObjectiveBadge objective={campaign.objective} />
        {advertiser ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {advertiser.name}
          </span>
        ) : null}
        <span className="text-xs text-slate-500">{sets.length} ad set{sets.length === 1 ? '' : 's'}</span>
      </div>
      <div className="mt-4 flex-1 space-y-3">
        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Budget</span>
            <span className="text-xs font-semibold text-slate-500">
              {formatCurrency(totalSpent, 'USD')} / {formatCurrency(totalBudget, 'USD')}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-900" style={{ width: `${utilization}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sets.map((set) => (
            <span
              key={set.id}
              className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {set.name} · {calculateBudgetUtilization(set.budget)}%
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>Created {formatDate(campaign.createdAt)}</span>
        <span>Updated {formatDate(campaign.updatedAt)}</span>
      </div>
    </article>
  );
}
