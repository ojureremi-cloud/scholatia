import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { CollaborationStatistics } from '@/types/collaboration';

type WorkspaceStatisticsProps = {
  statistics: CollaborationStatistics;
};

export function WorkspaceStatistics({ statistics }: WorkspaceStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <StatisticCard title="Workspaces" value={formatNumber(statistics.totalWorkspaces)} icon="🗂️" />
      <StatisticCard title="Members" value={formatNumber(statistics.totalMembers)} icon="👥" />
      <StatisticCard title="Tasks" value={formatNumber(statistics.totalTasks)} icon="✅" />
      <StatisticCard title="Documents" value={formatNumber(statistics.totalDocuments)} icon="📄" />
      <StatisticCard title="Meetings" value={formatNumber(statistics.totalMeetings)} icon="📅" />
    </div>
  );
}
