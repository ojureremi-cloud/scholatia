import React from 'react';
import { formatCompactNumber, formatCurrency, formatNumber, formatPercent } from './format';
import type { AdCampaignAnalytics } from '@/types/ads';

type CampaignAnalyticsCardProps = {
  analytics: AdCampaignAnalytics;
};

export default function CampaignAnalyticsCard({ analytics }: CampaignAnalyticsCardProps) {
  const { metrics, funnel, devices, geography, referrals, heatMap, budgetUtilization } = analytics;
  const peakHour = analytics.timeOfDay.reduce((best, point) => (point.impressions > best.impressions ? point : best), analytics.timeOfDay[0]);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Campaign analytics</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{analytics.campaignName}</h3>
          <p className="text-xs text-slate-400">{analytics.campaignId}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Budget used</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{budgetUtilization}%</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impressions</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatCompactNumber(metrics.impressions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clicks</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatCompactNumber(metrics.clicks)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">CTR</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{metrics.ctr}%</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Conversions</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatCompactNumber(metrics.conversions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">CPC</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(metrics.cpc, 'USD')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Conv. rate</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{metrics.conversionRate}%</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Spend</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(metrics.spend, 'USD')}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">ROI</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">{formatPercent(metrics.roi)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Conversion funnel</p>
          <ul className="mt-4 space-y-3">
            {funnel.map((step, index) => (
              <li key={step.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {index + 1}. {step.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatNumber(step.value)} · {step.rate}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${Math.max(2, Math.min(100, step.rate))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Devices</p>
          <ul className="mt-4 space-y-3">
            {devices.map((device) => (
              <li key={device.device}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">{device.device}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatCompactNumber(device.impressions)} · {device.ctr}% CTR
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${Math.max(2, Math.round((device.impressions / Math.max(1, metrics.impressions)) * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Top geographies</p>
          <ul className="mt-4 divide-y divide-slate-100">
            {geography.slice(0, 5).map((geo) => (
              <li key={geo.country} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-slate-600">{geo.country}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {formatCompactNumber(geo.impressions)} · {formatCurrency(geo.spend, 'USD')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Placement heat</p>
          <ul className="mt-4 space-y-3">
            {heatMap.map((point) => (
              <li key={point.placement}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="capitalize text-slate-600">{point.placement.replace(/-/g, ' ')}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatCompactNumber(point.impressions)} · {point.ctr}% CTR
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${Math.max(2, Math.round((point.impressions / Math.max(1, metrics.impressions)) * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Referral sources</p>
          <ul className="mt-4 divide-y divide-slate-100">
            {referrals.map((referral) => (
              <li key={referral.source} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-slate-600">{referral.source}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {formatCompactNumber(referral.clicks)} clicks
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Time of day</p>
          <p className="mt-2 text-sm text-slate-600">
            Peak delivery at <span className="font-semibold text-slate-900">{peakHour?.hour ?? '—'}:00</span> with{' '}
            {peakHour ? formatCompactNumber(peakHour.impressions) : '—'} impressions.
          </p>
          <div className="mt-4 flex h-24 items-end gap-1">
            {analytics.timeOfDay.map((point) => (
              <div
                key={point.hour}
                className="flex-1 rounded-t bg-sky-100"
                style={{ height: `${Math.max(4, (point.impressions / Math.max(1, peakHour?.impressions ?? 1)) * 100)}%` }}
                title={`${point.hour}:00 — ${formatCompactNumber(point.impressions)} impressions`}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
