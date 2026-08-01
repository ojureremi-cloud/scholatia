import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatNumber } from './format';
import type { CommercePlatformAnalytics } from '@/types/commerce';

type FinancialAnalyticsCardProps = {
  analytics: CommercePlatformAnalytics;
};

export default function FinancialAnalyticsCard({ analytics }: FinancialAnalyticsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Monthly recurring revenue" value={formatCurrency(analytics.mrr, 'USD')} icon="🔁" trendPositive />
        <StatisticCard title="Annual recurring revenue" value={formatCurrency(analytics.arr, 'USD')} icon="📅" trendPositive />
        <StatisticCard
          title="Active subscriptions"
          value={analytics.activeSubscriptions.toLocaleString()}
          icon="🗂️"
          trend="MRR basis"
        />
        <StatisticCard
          title="Wallet balances"
          value={formatCurrency(analytics.totalWalletBalance, 'USD')}
          icon="💳"
          trend={`${analytics.totalWallets} wallets`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Escrow</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(analytics.activeEscrows)}</p>
          <p className="mt-1 text-sm text-slate-500">orders held in escrow</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Payouts</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(analytics.pendingPayouts)}</p>
          <p className="mt-1 text-sm text-slate-500">
            pending · {formatNumber(analytics.completedSettlements)} completed settlements
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Coupons</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(analytics.couponsUsed)}</p>
          <p className="mt-1 text-sm text-slate-500">total redemptions</p>
        </div>
      </div>
    </div>
  );
}
