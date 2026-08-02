import { StatisticCard } from '@/components/ui';
import { formatNumber } from './format';
import type { TaskStatistics as TaskStatisticsData } from '@/types/tasks';

type TaskStatisticsProps = {
  statistics: TaskStatisticsData;
};

export function TaskStatistics({ statistics }: TaskStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total tasks" value={formatNumber(statistics.totalTasks)} icon="📋" />
      <StatisticCard title="Open" value={formatNumber(statistics.openTasks)} icon="⚙️" />
      <StatisticCard title="Completed" value={formatNumber(statistics.completedTasks)} icon="✅" trend={`${statistics.completionRate}% completion`} trendPositive={statistics.completionRate >= 50} />
      <StatisticCard title="Blocked" value={formatNumber(statistics.blockedTasks)} icon="🚧" />
      <StatisticCard title="In review" value={formatNumber(statistics.inReview)} icon="🔍" />
      <StatisticCard title="Overdue" value={formatNumber(statistics.overdueTasks)} icon="⏰" trendPositive={statistics.overdueTasks === 0} trend={statistics.overdueTasks === 0 ? 'On track' : 'Needs attention'} />
    </div>
  );
}
