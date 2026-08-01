import React from 'react';
import SectionCard from '@/components/ui/SectionCard';
import { formatCompactNumber, formatCurrency, formatObjectiveLabel, formatPlacement, formatRoi } from './format';
import type { AdvertisingAnalytics } from '@/types/ads';

type AdvertisingAnalyticsProps = {
  analytics: AdvertisingAnalytics;
};

function barWidth(value: number, max: number): string {
  return `${Math.max(2, Math.round((value / Math.max(1, max)) * 100))}%`;
}

export default function AdvertisingAnalytics({ analytics }: AdvertisingAnalyticsProps) {
  const maxSpend = Math.max(...analytics.spendByPlacement.map((row) => row.spend), 1);
  const maxRevenue = Math.max(...analytics.revenueByObjective.map((row) => row.spend), 1);
  const maxReach = Math.max(...analytics.audienceReachByDiscipline.map((row) => row.reach), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        eyebrow="Revenue by objective"
        title="Objective economics"
        description="Spend and return for each campaign objective, ranked by spend."
      >
        <ul className="space-y-4">
          {analytics.revenueByObjective.map((row) => (
            <li key={row.objective}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{formatObjectiveLabel(row.objective)}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {formatCurrency(row.spend, 'USD')} spend · {formatRoi(row.roi)} ROI
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: barWidth(row.spend, maxRevenue) }}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        eyebrow="Campaigns by status"
        title="Portfolio status"
        description="Campaign distribution across the lifecycle."
      >
        <div className="flex flex-wrap gap-3">
          {analytics.campaignsByStatus.map((row) => (
            <div
              key={row.status}
              className="flex min-w-[9rem] flex-1 items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium capitalize text-slate-600">{row.status.replace('-', ' ')}</span>
              <span className="text-xl font-semibold text-slate-900">{row.count}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Spend by placement"
        title="Placement spend"
        description="Where the promotion budget is consumed across natural surfaces."
      >
        <ul className="space-y-4">
          {analytics.spendByPlacement.map((row) => (
            <li key={row.placement}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{formatPlacement(row.placement)}</span>
                <span className="text-xs font-semibold text-slate-500">{formatCurrency(row.spend, 'USD')}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: barWidth(row.spend, maxSpend) }}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-6">
        <SectionCard
          eyebrow="Top campaigns"
          title="Highest revenue"
          description="The five best-performing campaigns by revenue."
        >
          <ul className="divide-y divide-slate-100">
            {analytics.topCampaigns.map((campaign) => (
              <li key={campaign.campaignId} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium text-slate-700">{campaign.campaignName}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {formatCurrency(campaign.revenue, 'USD')} · {formatRoi(campaign.roi)} ROI
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          eyebrow="Audience reach"
          title="Reach by discipline"
          description="Aggregate estimated audience reach per discipline across all audiences."
        >
          <ul className="space-y-4">
            {analytics.audienceReachByDiscipline.map((row) => (
              <li key={row.discipline}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{row.discipline}</span>
                  <span className="text-xs font-semibold text-slate-500">{formatCompactNumber(row.reach)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: barWidth(row.reach, maxReach) }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
