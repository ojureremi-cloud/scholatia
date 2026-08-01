import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCategory, formatCurrency, formatPaymentMethod } from './format';
import type { MarketplaceRevenueDashboard } from '@/types/marketplace';

type RevenueDashboardProps = {
  dashboard: MarketplaceRevenueDashboard;
};

export default function RevenueDashboard({ dashboard }: RevenueDashboardProps) {
  const maxCategory = dashboard.byCategory.reduce((max, entry) => Math.max(max, entry.revenue), 0);
  const maxCountry = dashboard.byCountry.reduce((max, entry) => Math.max(max, entry.revenue), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Gross revenue"
          value={formatCurrency(dashboard.grossRevenue, 'GBP')}
          icon="💷"
        />
        <StatisticCard
          title="Platform fees"
          value={formatCurrency(dashboard.platformFees, 'GBP')}
          icon="🏦"
          trend="8% platform commission"
        />
        <StatisticCard
          title="Vendor payouts"
          value={formatCurrency(dashboard.vendorPayouts, 'GBP')}
          icon="🤝"
          trendPositive
        />
        <StatisticCard
          title="Net platform revenue"
          value={formatCurrency(dashboard.netPlatformRevenue, 'GBP')}
          icon="📈"
          trend={`${formatCurrency(dashboard.refunds, 'GBP')} refunds`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by category</p>
          <div className="mt-5 space-y-4">
            {dashboard.byCategory.map((entry) => (
              <div key={entry.category}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{formatCategory(entry.category)}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, 'GBP')}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${maxCategory > 0 ? Math.round((entry.revenue / maxCategory) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by country</p>
          <div className="mt-5 space-y-4">
            {dashboard.byCountry.map((entry) => (
              <div key={entry.country}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{entry.country}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, 'GBP')}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${maxCountry > 0 ? Math.round((entry.revenue / maxCountry) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by payment method</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {dashboard.byMethod.map((entry) => (
            <span
              key={entry.method}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
            >
              {formatPaymentMethod(entry.method)} ·{' '}
              <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, 'GBP')}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
