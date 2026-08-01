import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency } from './format';
import type { CommerceRevenueReport } from '@/types/commerce';

type RevenueDashboardProps = {
  report: CommerceRevenueReport;
};

export default function RevenueDashboard({ report }: RevenueDashboardProps) {
  const currency = 'USD';
  const maxStream = report.byStream.reduce((max, entry) => Math.max(max, entry.revenue), 0);
  const maxPeriod = report.byPeriod.reduce((max, entry) => Math.max(max, entry.revenue), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Gross revenue" value={formatCurrency(report.grossRevenue, currency)} icon="💰" />
        <StatisticCard title="Commissions" value={formatCurrency(report.commissions, currency)} icon="🏦" trend="Marketplace commission" />
        <StatisticCard title="Platform fees" value={formatCurrency(report.platformFees, currency)} icon="🧾" trendPositive />
        <StatisticCard
          title="Net revenue"
          value={formatCurrency(report.netRevenue, currency)}
          icon="📈"
          trend={`${formatCurrency(report.refunds, currency)} refunds`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by stream</p>
          <div className="mt-5 space-y-4">
            {report.byStream.map((entry) => (
              <div key={entry.stream}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="capitalize font-medium text-slate-700">{entry.stream.replace(/-/g, ' ')}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, currency)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${maxStream > 0 ? Math.round((entry.revenue / maxStream) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by period</p>
          <div className="mt-5 space-y-4">
            {report.byPeriod.map((entry) => (
              <div key={entry.period}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{entry.period}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, currency)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${maxPeriod > 0 ? Math.round((entry.revenue / maxPeriod) * 100) : 0}%` }}
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
          {report.byMethod.map((entry) => (
            <span key={entry.method} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {entry.method} · <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, currency)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
