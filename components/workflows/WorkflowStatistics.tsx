import { StatisticCard } from '@/components/ui';
import { formatNumber } from './format';
import type { WorkflowStatistics as WorkflowStatisticsData } from '@/types/workflows';

type WorkflowStatisticsProps = {
  statistics: WorkflowStatisticsData;
};

export function WorkflowStatistics({ statistics }: WorkflowStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total workflows" value={formatNumber(statistics.totalWorkflows)} icon="🧩" />
      <StatisticCard title="Active" value={formatNumber(statistics.activeWorkflows)} icon="⚙️" />
      <StatisticCard title="Awaiting review" value={formatNumber(statistics.awaitingReview)} icon="🔍" />
      <StatisticCard title="Overall progress" value={`${statistics.overallProgress}%`} icon="📈" />
      <StatisticCard title="Completed stages" value={formatNumber(statistics.completedStages)} icon="✅" trend={`of ${formatNumber(statistics.totalStages)} total`} />
      <StatisticCard title="Achieved milestones" value={formatNumber(statistics.achievedMilestones)} icon="🏅" trend={`of ${formatNumber(statistics.totalMilestones)} total`} />
      <StatisticCard title="Overdue deadlines" value={formatNumber(statistics.overdueDeadlines)} icon="⏰" trendPositive={statistics.overdueDeadlines === 0} trend={statistics.overdueDeadlines === 0 ? 'On track' : 'Needs attention'} />
      <StatisticCard title="Completed" value={formatNumber(statistics.completed)} icon="🏁" />
    </div>
  );
}
