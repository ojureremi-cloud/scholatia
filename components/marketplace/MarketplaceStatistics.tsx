import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCompactNumber, formatCurrency, formatPercent } from './format';
import type { MarketplaceStatistics } from '@/types/marketplace';

type MarketplaceStatisticsProps = {
  statistics: MarketplaceStatistics;
};

export default function MarketplaceStatistics({ statistics }: MarketplaceStatisticsProps) {
  const cards: {
    title: string;
    value: string;
    icon: string;
    trend?: string;
    trendPositive?: boolean;
  }[] = [
    {
      title: 'Total revenue',
      value: formatCurrency(statistics.totalRevenue, 'GBP'),
      icon: '💷',
      trend: `Avg order ${formatCurrency(statistics.averageOrderValue, 'GBP')}`,
      trendPositive: true,
    },
    {
      title: 'Orders',
      value: formatCompactNumber(statistics.totalOrders),
      icon: '🛒',
      trend: `${statistics.completedOrders} completed · ${statistics.pendingOrders} pending`,
    },
    {
      title: 'Vendors',
      value: formatCompactNumber(statistics.totalVendors),
      icon: '🏪',
      trend: `${statistics.verifiedVendors} verified · ${statistics.countries} countries`,
      trendPositive: true,
    },
    {
      title: 'Listings',
      value: formatCompactNumber(statistics.totalListings),
      icon: '📦',
      trend: `${statistics.activeListings} active · ${statistics.featuredListings} featured · ${statistics.sponsoredListings} sponsored`,
    },
    {
      title: 'Categories',
      value: formatCompactNumber(statistics.totalCategories),
      icon: '🗂️',
    },
    {
      title: 'Average rating',
      value: statistics.averageRating.toFixed(1),
      icon: '⭐',
      trend: `${statistics.totalReviews} reviews`,
    },
    {
      title: 'Bookings',
      value: formatCompactNumber(statistics.totalBookings),
      icon: '📅',
    },
    {
      title: 'Coupons & promotions',
      value: formatCompactNumber(statistics.totalCoupons),
      icon: '🏷️',
      trend: `${statistics.activePromotions} promotions active`,
      trendPositive: true,
    },
    {
      title: 'Conversion rate',
      value: formatPercent(statistics.conversionRate),
      icon: '🎯',
    },
    {
      title: 'Open disputes',
      value: formatCompactNumber(statistics.openDisputes),
      icon: '⚖️',
      trend: `${statistics.completedRefunds} refunds completed`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatisticCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
          trendPositive={card.trendPositive}
        />
      ))}
    </div>
  );
}
