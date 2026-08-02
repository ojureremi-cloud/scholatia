import { StatisticCard } from '@/components/ui';
import { formatNumber } from './format';
import type { ReviewStatistics as ReviewStatisticsData } from '@/types/reviews';

type ReviewStatisticsProps = {
  statistics: ReviewStatisticsData;
};

export function ReviewStatistics({ statistics }: ReviewStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total reviews" value={formatNumber(statistics.totalReviews)} icon="🔬" />
      <StatisticCard title="Completed" value={formatNumber(statistics.completedReviews)} icon="✅" />
      <StatisticCard title="In progress" value={formatNumber(statistics.inProgressReviews)} icon="⚙️" />
      <StatisticCard title="Invited" value={formatNumber(statistics.invitedReviews)} icon="📨" />
      <StatisticCard
        title="Approval rate"
        value={`${statistics.approvalRate}%`}
        icon="👍"
        trend={`${statistics.revisionRate}% revisions`}
        trendPositive={statistics.approvalRate >= statistics.revisionRate}
      />
      <StatisticCard title="Avg review rounds" value={statistics.averageRounds.toFixed(1)} icon="🔄" />
    </div>
  );
}
