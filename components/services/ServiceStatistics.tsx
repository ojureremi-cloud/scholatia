import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency, formatNumber, formatPercent } from './format';
import type { ProviderStatistics, ServiceStatistics } from '@/types/services';

type ServiceStatisticsProps = {
  statistics: ServiceStatistics;
  providers: ProviderStatistics;
};

export default function ServiceStatistics({ statistics, providers }: ServiceStatisticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Services live"
          value={formatNumber(statistics.activeServices)}
          icon="🛠️"
          trend={`${formatNumber(statistics.totalServices)} total`}
        />
        <StatisticCard
          title="Providers"
          value={formatNumber(statistics.totalProviders)}
          icon="🧑‍🏫"
          trend={`${formatNumber(statistics.verifiedProviders)} verified`}
        />
        <StatisticCard
          title="Total revenue"
          value={formatCurrency(statistics.totalRevenue, 'USD')}
          icon="💰"
          trend={`${formatCurrency(statistics.averageOrderValue, 'USD')} avg order`}
        />
        <StatisticCard
          title="Average rating"
          value={statistics.averageRating.toFixed(1)}
          icon="⭐"
          trend={`${formatNumber(statistics.totalReviews)} reviews`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Orders</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.totalOrders)}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatNumber(statistics.pendingOrders)} pending · {formatNumber(statistics.completedOrders)} completed
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Delivery</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(statistics.completionRate)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatPercent(statistics.onTimeDeliveryRate)} delivered on time</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Milestones</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.totalMilestones)}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatNumber(statistics.completedMilestones)} completed · {formatNumber(statistics.totalDisputes)} disputes
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Promotion</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(statistics.featuredServices)}</p>
          <p className="mt-1 text-sm text-slate-500">
            featured · {formatNumber(statistics.sponsoredServices)} sponsored · {formatNumber(statistics.promotedServices)} promoted
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Provider reach</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(providers.totalCountries)}</p>
          <p className="mt-1 text-sm text-slate-500">countries · {formatNumber(providers.totalInstitutions)} institutions</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Completed jobs</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(providers.totalCompletedJobs)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(providers.totalCertifications)} certifications</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top rated</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(providers.topRatedProviders)}</p>
          <p className="mt-1 text-sm text-slate-500">of {formatNumber(providers.activeProviders)} active providers</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Response</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{providers.averageResponseTime}</p>
          <p className="mt-1 text-sm text-slate-500">provider response time</p>
        </div>
      </div>
    </div>
  );
}
