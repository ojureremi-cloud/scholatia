import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { GroupPortfolio } from '@/types/groups';

type GroupPortfolioCardProps = {
  portfolio: GroupPortfolio;
};

export function GroupPortfolioCard({ portfolio }: GroupPortfolioCardProps) {
  const { statistics, analytics } = portfolio;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">👥 Academic groups portfolio</h3>
      <p className="mt-1 text-sm text-slate-400">
        {formatNumber(statistics.totalGroups)} groups · {formatNumber(statistics.totalMembers)} members ·{' '}
        {formatNumber(statistics.totalPublications)} publications
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Public share" value={formatPercent(analytics.publicShare)} />
        <StatisticCard title="Discussions" value={formatNumber(statistics.totalDiscussions)} />
        <StatisticCard title="Projects" value={formatNumber(statistics.totalProjects)} />
        <StatisticCard title="Research areas" value={formatNumber(statistics.totalResearchAreas)} />
      </div>
    </div>
  );
}
