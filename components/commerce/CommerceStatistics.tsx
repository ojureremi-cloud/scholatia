import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatNumber } from './format';
import type { CommerceStatistics } from '@/types/commerce';

type CommerceStatisticsProps = {
  statistics: CommerceStatistics;
};

export default function CommerceStatistics({ statistics }: CommerceStatisticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Catalog products" value={formatNumber(statistics.totalProducts)} icon="📦" trend={`${formatNumber(statistics.activeProducts)} active`} />
        <StatisticCard title="Total orders" value={formatNumber(statistics.totalOrders)} icon="🧾" trend={`${formatNumber(statistics.completedOrders)} completed`} />
        <StatisticCard title="Total revenue" value={formatCurrency(statistics.totalRevenue, 'USD')} icon="💰" />
        <StatisticCard title="Active subscriptions" value={formatNumber(statistics.activeSubscriptions)} icon="🔁" trend={`${formatNumber(statistics.totalSubscriptions)} total`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Refunds</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(statistics.totalRefunds, 'USD')}</p>
          <p className="mt-1 text-sm text-slate-500">returned to buyers</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Wallets</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.totalWallets)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatCurrency(statistics.totalWalletBalance, 'USD')} held</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Escrow</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.activeEscrows)}</p>
          <p className="mt-1 text-sm text-slate-500">orders currently held</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Vendors</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.totalVendors)}</p>
          <p className="mt-1 text-sm text-slate-500">· {formatNumber(statistics.supportedProviders)} payment providers</p>
        </div>
      </div>
    </div>
  );
}
