import React from 'react';
import RevenueCard from './RevenueCard';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency } from './format';
import type { CommerceRevenueReport } from '@/types/commerce';

type MarketplaceRevenueCardProps = {
  report: CommerceRevenueReport;
};

export default function MarketplaceRevenueCard({ report }: MarketplaceRevenueCardProps) {
  const share =
    report.grossRevenue > 0 ? Math.round((report.marketplaceRevenue / report.grossRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Marketplace revenue" value={formatCurrency(report.marketplaceRevenue, 'USD')} icon="🏪" trend={`${share}% of gross`} />
        <StatisticCard title="Commissions" value={formatCurrency(report.commissions, 'USD')} icon="🏦" trend="earned on orders" />
        <StatisticCard title="Platform fees" value={formatCurrency(report.platformFees, 'USD')} icon="🧾" trendPositive />
        <StatisticCard title="Net revenue" value={formatCurrency(report.netRevenue, 'USD')} icon="📈" trend={`${formatCurrency(report.refunds, 'USD')} refunds`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard label="Marketplace" value={report.marketplaceRevenue} currency="USD" icon="🏪" sharePercent={share} />
        <RevenueCard label="Advertising" value={report.advertisingRevenue} currency="USD" icon="📣" />
        <RevenueCard label="Subscriptions" value={report.subscriptionRevenue} currency="USD" icon="🔁" />
        <RevenueCard label="AI services" value={report.aiServicesRevenue} currency="USD" icon="🤖" />
      </div>
    </div>
  );
}
