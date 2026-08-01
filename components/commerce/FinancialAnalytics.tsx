import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatNumber } from './format';
import type { CommercePlatformAnalytics, CommerceRevenueReport } from '@/types/commerce';

type FinancialAnalyticsProps = {
  analytics: CommercePlatformAnalytics;
  report: CommerceRevenueReport;
};

export default function FinancialAnalytics({ analytics, report }: FinancialAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Gross revenue" value={formatCurrency(report.grossRevenue, 'USD')} icon="💰" trendPositive />
        <StatisticCard
          title="Net revenue"
          value={formatCurrency(report.netRevenue, 'USD')}
          icon="📈"
          trend={`${formatCurrency(report.refunds, 'USD')} refunded`}
        />
        <StatisticCard title="Platform fees" value={formatCurrency(report.platformFees, 'USD')} icon="🧾" trend="charged on orders" />
        <StatisticCard title="Commissions" value={formatCurrency(report.commissions, 'USD')} icon="🏦" trend="earned on sales" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">MRR</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(analytics.mrr, 'USD')}</p>
          <p className="mt-1 text-sm text-slate-500">monthly recurring revenue</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">ARR</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(analytics.arr, 'USD')}</p>
          <p className="mt-1 text-sm text-slate-500">annual recurring revenue</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Avg order</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(analytics.averageOrderValue, 'USD')}</p>
          <p className="mt-1 text-sm text-slate-500">across {formatNumber(analytics.totalOrders)} orders</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Refund rate</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.refundRate}%</p>
          <p className="mt-1 text-sm text-slate-500">share of revenue returned</p>
        </div>
      </div>
    </div>
  );
}
