import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCompactNumber, formatCurrency, formatPercent, formatStars } from './format';
import type { MarketplaceSalesDashboard } from '@/types/marketplace';

type SalesDashboardProps = {
  dashboard: MarketplaceSalesDashboard;
};

export default function SalesDashboard({ dashboard }: SalesDashboardProps) {
  const maxRevenue = dashboard.byDay.reduce((max, point) => Math.max(max, point.revenue), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Gross revenue"
          value={formatCurrency(dashboard.totalRevenue, 'GBP')}
          icon="💷"
          trend={`${formatPercent(dashboard.growthPercent)} period growth`}
          trendPositive={dashboard.growthPercent >= 0}
        />
        <StatisticCard
          title="Net revenue"
          value={formatCurrency(dashboard.netRevenue, 'GBP')}
          icon="🧾"
          trend={`${formatCurrency(dashboard.refundedRevenue, 'GBP')} refunded`}
        />
        <StatisticCard
          title="Orders"
          value={formatCompactNumber(dashboard.totalOrders)}
          icon="🛒"
          trend={`Avg ${formatCurrency(dashboard.averageOrderValue, 'GBP')}`}
        />
        <StatisticCard
          title="Conversion"
          value={formatPercent(dashboard.conversionRate)}
          icon="🎯"
        />
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Daily revenue</p>
        <div className="mt-5 flex h-40 items-end gap-1">
          {dashboard.byDay.map((point) => (
            <div key={point.date} className="group relative flex-1">
              <div
                className="rounded-t bg-sky-600/80 transition group-hover:bg-sky-600"
                style={{ height: `${maxRevenue > 0 ? Math.max(4, (point.revenue / maxRevenue) * 100) : 4}%` }}
              />
              <span className="sr-only">
                {point.date}: {formatCurrency(point.revenue, 'GBP')} across {point.orders} orders
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top products</p>
        <ul className="mt-4 space-y-3">
          {dashboard.topProducts.map((product) => (
            <li key={product.listingId} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{product.title}</p>
                <p className="text-xs text-slate-400">
                  {formatCompactNumber(product.views)} views · {formatCompactNumber(product.favorites)} favorites ·{' '}
                  {product.orders} orders · {formatStars(product.rating)}
                </p>
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(product.revenue, 'GBP')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
