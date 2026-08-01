import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCategory, formatCompactNumber, formatCurrency, formatPercent, formatStars } from './format';
import type { MarketplaceAnalytics } from '@/types/marketplace';

type MarketplaceAnalyticsProps = {
  analytics: MarketplaceAnalytics;
};

export default function MarketplaceAnalytics({ analytics }: MarketplaceAnalyticsProps) {
  const topRevenue = analytics.byCategory.reduce((max, entry) => Math.max(max, entry.revenue), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Impressions"
          value={formatCompactNumber(analytics.impressions)}
          icon="👁️"
          trend={`${formatCompactNumber(analytics.views)} views`}
        />
        <StatisticCard
          title="Revenue"
          value={formatCurrency(analytics.revenue, 'GBP')}
          icon="💷"
          trend={`${formatPercent(analytics.conversionRate)} conversion`}
          trendPositive
        />
        <StatisticCard
          title="Engagement"
          value={formatCompactNumber(analytics.favorites)}
          icon="❤️"
          trend={`${analytics.repeatCustomers} repeat customers`}
          trendPositive
        />
        <StatisticCard
          title="Activity"
          value={formatCompactNumber(analytics.messages)}
          icon="💬"
          trend={`${analytics.reviews} reviews · ${analytics.bookings} bookings`}
        />
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Revenue by category</p>
        <div className="mt-5 space-y-4">
          {analytics.byCategory.map((entry) => (
            <div key={entry.category}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{formatCategory(entry.category)}</span>
                <span className="text-slate-500">
                  {entry.listings} listings · {entry.orders} orders ·{' '}
                  <span className="font-semibold text-slate-900">{formatCurrency(entry.revenue, 'GBP')}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${topRevenue > 0 ? Math.round((entry.revenue / topRevenue) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top listings</p>
          <ul className="mt-4 space-y-3">
            {analytics.topListings.map((listing) => (
              <li key={listing.listingId} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{listing.title}</p>
                  <p className="text-xs text-slate-400">
                    {formatCompactNumber(listing.views)} views · {listing.orders} orders · {formatStars(listing.rating)}
                  </p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(listing.revenue, 'GBP')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Top vendors</p>
          <ul className="mt-4 space-y-3">
            {analytics.topVendors.map((vendor) => (
              <li key={vendor.vendorId} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {vendor.name} {vendor.verified ? <span className="text-emerald-600">✓</span> : null}
                  </p>
                  <p className="text-xs text-slate-400">
                    {vendor.orders} orders · {formatStars(vendor.rating)}
                  </p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(vendor.revenue, 'GBP')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
