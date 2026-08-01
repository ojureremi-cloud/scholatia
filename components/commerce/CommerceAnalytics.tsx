import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatNumber, formatPercent } from './format';
import type { CommercePlatformAnalytics } from '@/types/commerce';

type CommerceAnalyticsProps = {
  analytics: CommercePlatformAnalytics;
};

export default function CommerceAnalytics({ analytics }: CommerceAnalyticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Average order value"
        value={formatCurrency(analytics.averageOrderValue, 'USD')}
        icon="🛒"
        trend={`${formatNumber(analytics.totalOrders)} total orders`}
      />
      <StatisticCard
        title="Conversion rate"
        value={formatPercent(analytics.conversionRate)}
        icon="🎯"
        trendPositive
      />
      <StatisticCard
        title="Refund rate"
        value={formatPercent(analytics.refundRate)}
        icon="↩️"
        trend="of completed orders"
      />
      <StatisticCard
        title="Growth"
        value={formatPercent(analytics.growthPercent)}
        icon="📈"
        trend="period over period"
        trendPositive
      />
    </div>
  );
}
