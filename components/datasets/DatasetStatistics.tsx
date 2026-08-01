import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import type { DatasetAnalytics } from '@/types/dataset';
import { formatCompactNumber } from './format';

type DatasetStatisticsProps = {
  analytics: DatasetAnalytics;
};

export function DatasetStatistics({ analytics }: DatasetStatisticsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total Datasets" value={`${analytics.totalDatasets}`} trend="+2 this year" trendPositive icon="📊" />
      <StatisticCard title="Open Datasets" value={`${analytics.openDatasets}`} trend="Publicly accessible" trendPositive icon="🔓" />
      <StatisticCard title="Restricted Datasets" value={`${analytics.restrictedDatasets}`} trend="Embargoed or controlled" icon="🔒" />
      <StatisticCard title="Downloads" value={formatCompactNumber(analytics.totalDownloads)} trend={`+${analytics.downloadGrowthPercent}% vs last year`} trendPositive icon="⬇️" />
      <StatisticCard title="Dataset Citations" value={formatCompactNumber(analytics.totalCitations)} trend={`+${analytics.citationGrowthPercent}% vs last year`} trendPositive icon="📖" />
      <StatisticCard title="Dataset DOIs" value={`${analytics.doiCount}`} trend="All datasets minted" icon="🆔" />
      <StatisticCard title="Latest Version" value={analytics.latestVersion} trend="Newest published" icon="🏷️" />
      <StatisticCard title="Storage Used" value={`${analytics.storageUsedGb} GB`} trend="Across all versions" icon="💾" />
    </div>
  );
}
