import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import type { ManuscriptStatistics } from '@/types/manuscript';

type ManuscriptStatisticsProps = {
  statistics: ManuscriptStatistics;
};

export function ManuscriptStatistics({ statistics }: ManuscriptStatisticsProps) {
  const inPreparation = statistics.drafts + statistics.submitted;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total Manuscripts" value={`${statistics.totalManuscripts}`} trend="Across stages 8-10" icon="📚" />
      <StatisticCard title="In Preparation" value={`${inPreparation}`} trend={`${statistics.drafts} drafts · ${statistics.submitted} submitted`} icon="✍️" />
      <StatisticCard title="Under Review" value={`${statistics.underReview}`} trend="Currently in peer review" trendPositive icon="👥" />
      <StatisticCard title="In Revision" value={`${statistics.inRevision}`} trend="Major or minor revision" icon="🔄" />
      <StatisticCard title="Accepted" value={`${statistics.accepted}`} trend="Ready for publication" trendPositive icon="✅" />
      <StatisticCard title="Rejected" value={`${statistics.rejected}`} trend="After full review" icon="🚫" />
      <StatisticCard title="Withdrawn" value={`${statistics.withdrawn}`} trend="Closed out by authors" icon="📤" />
      <StatisticCard title="Avg Review Time" value={`${statistics.avgReviewDays} days`} trend="Across review rounds" icon="⏱️" />
      <StatisticCard title="Lifecycle Progress" value={`${statistics.lifecycleCompletionPercent}%`} trend="Through Peer Review" trendPositive icon="🌱" />
    </div>
  );
}
