import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { ActivityStatistics } from '@/types/activity';

type ActivityStatisticsProps = {
  statistics: ActivityStatistics;
};

export function ActivityStatistics({ statistics }: ActivityStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <StatisticCard title="Total activities" value={formatNumber(statistics.totalActivities)} />
      <StatisticCard title="Contributors" value={formatNumber(statistics.totalActors)} />
      <StatisticCard title="Reactions" value={formatNumber(statistics.totalReactions)} />
      <StatisticCard title="Comments" value={formatNumber(statistics.totalComments + statistics.totalReplies)} />
      <StatisticCard title="Reposts" value={formatNumber(statistics.totalReposts)} />
    </div>
  );
}
