import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatPercent } from './format';
import type { CommerceStatistics, CommercePlatformAnalytics } from '@/types/commerce';

type MarketplaceSalesCardProps = {
  statistics: CommerceStatistics;
  analytics: CommercePlatformAnalytics;
};

export default function MarketplaceSalesCard({ statistics, analytics }: MarketplaceSalesCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Total orders" value={statistics.totalOrders.toLocaleString()} icon="🧾" />
        <StatisticCard
          title="Completed orders"
          value={statistics.completedOrders.toLocaleString()}
          icon="✅"
          trend={`${statistics.pendingOrders} in flight`}
          trendPositive
        />
        <StatisticCard
          title="Total revenue"
          value={formatCurrency(analytics.totalRevenue, 'USD')}
          icon="💰"
          trend={`${formatCurrency(statistics.totalRefunds, 'USD')} refunded`}
        />
        <StatisticCard
          title="Average order value"
          value={formatCurrency(analytics.averageOrderValue, 'USD')}
          icon="📈"
          trend={`${formatPercent(analytics.conversionRate)} conversion`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Catalog</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{statistics.activeProducts}</p>
          <p className="mt-1 text-sm text-slate-500">
            active products · {statistics.totalProducts} total · {statistics.totalServices} services
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Growth</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(analytics.growthPercent)}</p>
          <p className="mt-1 text-sm text-slate-500">H2 revenue growth versus H1</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Refund rate</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(analytics.refundRate)}</p>
          <p className="mt-1 text-sm text-slate-500">of gross revenue refunded</p>
        </div>
      </div>
    </div>
  );
}
