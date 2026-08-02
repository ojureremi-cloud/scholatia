import { StatisticCard } from '@/components/ui';
import { formatNumber } from './format';
import type { Workbench } from '@/types/workflows';

type WorkbenchStatisticsProps = {
  workbench: Workbench;
};

export function WorkbenchStatistics({ workbench }: WorkbenchStatisticsProps) {
  const items = workbench.items;
  const active = items.filter((item) => item.status === 'active').length;
  const drafts = items.filter((item) => item.status === 'draft').length;
  const promoted = items.filter((item) => item.status === 'promoted').length;
  const archived = items.filter((item) => item.status === 'archived').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Items" value={formatNumber(items.length)} icon="📦" />
      <StatisticCard title="Active" value={formatNumber(active)} icon="⚙️" />
      <StatisticCard title="Drafts" value={formatNumber(drafts)} icon="📝" />
      <StatisticCard title="Promoted" value={formatNumber(promoted)} icon="🚀" trend={`${archived} archived`} trendPositive={promoted > archived} />
    </div>
  );
}
