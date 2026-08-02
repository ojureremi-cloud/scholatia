import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { ActivityPortfolio } from '@/types/activity';

type ActivityPortfolioCardProps = {
  portfolio: ActivityPortfolio;
};

export function ActivityPortfolioCard({ portfolio }: ActivityPortfolioCardProps) {
  const { statistics, analytics } = portfolio;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">📊 Scholarly activity portfolio</h3>
      <p className="mt-1 text-sm text-slate-400">
        {formatNumber(statistics.totalActivities)} activities from {formatNumber(statistics.totalSources)} sources
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Reactions" value={formatNumber(statistics.totalReactions)} />
        <StatisticCard title="Comments" value={formatNumber(statistics.totalComments + statistics.totalReplies)} />
        <StatisticCard title="Reposts" value={formatNumber(statistics.totalReposts)} />
        <StatisticCard title="Engagements" value={formatNumber(analytics.totalEngagements)} />
      </div>
    </div>
  );
}
