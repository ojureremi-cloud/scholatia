import React from 'react';
import CommerceStatistics from './CommerceStatistics';
import CommerceAnalytics from './CommerceAnalytics';
import type { CommercePlatformAnalytics, CommerceStatistics as CommerceStatisticsType } from '@/types/commerce';

type AnalyticsDashboardProps = {
  statistics: CommerceStatisticsType;
  analytics: CommercePlatformAnalytics;
};

export default function AnalyticsDashboard({ statistics, analytics }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <CommerceStatistics statistics={statistics} />
      <CommerceAnalytics analytics={analytics} />
    </div>
  );
}
