import React from 'react';
import { formatCompactNumber, formatCurrency, formatPercent } from './format';
import type { ServiceMarketplaceAnalytics } from '@/types/services';

type ServiceAnalyticsProps = {
  analytics: ServiceMarketplaceAnalytics;
};

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      {note ? <p className="mt-1 text-sm text-slate-500">{note}</p> : null}
    </div>
  );
}

export default function ServiceAnalytics({ analytics }: ServiceAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Impressions" value={formatCompactNumber(analytics.impressions)} note="advertising impressions" />
        <Metric label="Views" value={formatCompactNumber(analytics.views)} note="profile & listing views" />
        <Metric label="Inquiries" value={formatNumberShort(analytics.inquiries)} note="prospective buyers reached out" />
        <Metric label="Orders" value={formatNumberShort(analytics.orders)} note={`${formatPercent(analytics.conversionRate)} conversion rate`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Revenue" value={formatCurrency(analytics.revenue, 'USD')} note="booked through the commerce engine" />
        <Metric label="Average order" value={formatCurrency(analytics.averageOrderValue, 'USD')} note="per completed order" />
        <Metric label="Repeat buyers" value={formatNumberShort(analytics.repeatBuyers)} note="buyers with more than one order" />
        <Metric label="Order states" value={formatNumberShort(analytics.byStatus.length)} note="statuses present in the ledger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top services</p>
          <ul className="mt-4 space-y-3">
            {analytics.topServices.map((top) => (
              <li key={top.serviceId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">{top.title}</span>
                <span className="shrink-0 font-semibold text-slate-900">{formatCurrency(top.revenue, 'USD')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top providers</p>
          <ul className="mt-4 space-y-3">
            {analytics.topProviders.map((top) => (
              <li key={top.providerId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">{top.name}</span>
                <span className="shrink-0 font-semibold text-slate-900">{formatCurrency(top.revenue, 'USD')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top markets</p>
          <ul className="mt-4 space-y-3">
            {analytics.byCountry.map((country) => (
              <li key={country.country} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-700">{country.country}</span>
                <span className="font-semibold text-slate-900">{formatNumberShort(country.orders)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatNumberShort(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
