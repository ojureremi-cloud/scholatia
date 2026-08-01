import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCompactNumber, formatCurrency } from './format';
import type { AdvertisingStatistics } from '@/types/ads';

type AdvertisingStatisticsProps = {
  statistics: AdvertisingStatistics;
};

export default function AdvertisingStatistics({ statistics }: AdvertisingStatisticsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        icon="🚀"
        title="Active campaigns"
        value={String(statistics.activeCampaigns)}
        trend={`${statistics.totalCampaigns} total · ${statistics.inReviewCampaigns} in review`}
        trendPositive
      />
      <StatisticCard
        icon="🎯"
        title="Promotable objects"
        value={formatCompactNumber(statistics.totalPromotableObjects)}
        trend={`${statistics.promotableCategories} categories`}
        trendPositive
      />
      <StatisticCard
        icon="🏢"
        title="Advertisers"
        value={String(statistics.totalAdvertisers)}
        trend={`${statistics.internalAdvertisers} Promote · ${statistics.externalAdvertisers} Ads`}
        trendPositive
      />
      <StatisticCard
        icon="🖥️"
        title="Placements"
        value={String(statistics.totalPlacements)}
        trend={`${statistics.livePlacements} live · ${statistics.totalAudiences} audiences`}
        trendPositive
      />
      <StatisticCard
        icon="👁️"
        title="Impressions"
        value={formatCompactNumber(statistics.totalImpressions)}
        trend={`${formatCompactNumber(statistics.totalClicks)} clicks`}
        trendPositive
      />
      <StatisticCard
        icon="✅"
        title="Conversions"
        value={formatCompactNumber(statistics.totalConversions)}
        trend={`${statistics.avgCtr}% CTR`}
        trendPositive
      />
      <StatisticCard
        icon="💳"
        title="Total spend"
        value={formatCurrency(statistics.totalSpend, 'USD')}
        trend={`${formatCurrency(statistics.totalRevenue, 'USD')} revenue`}
        trendPositive
      />
      <StatisticCard
        icon="🛡️"
        title="Quality & trust"
        value={`${statistics.avgQualityScore}`}
        trend={`${statistics.openFraudSignals} fraud open · ${statistics.reviewQueue} in review`}
        trendPositive
      />
    </div>
  );
}
