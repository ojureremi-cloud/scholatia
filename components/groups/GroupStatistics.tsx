import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { GroupStatistics } from '@/types/groups';

type GroupStatisticsProps = {
  statistics: GroupStatistics;
};

export function GroupStatistics({ statistics }: GroupStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <StatisticCard title="Groups" value={formatNumber(statistics.totalGroups)} icon="👥" />
      <StatisticCard title="Members" value={formatNumber(statistics.totalMembers)} icon="👤" />
      <StatisticCard title="Publications" value={formatNumber(statistics.totalPublications)} icon="📄" />
      <StatisticCard title="Events" value={formatNumber(statistics.totalEvents)} icon="📅" />
      <StatisticCard title="Resources" value={formatNumber(statistics.totalResources)} icon="📚" />
    </div>
  );
}
