import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { CollaborationPortfolio } from '@/types/collaboration';

type WorkspacePortfolioCardProps = {
  portfolio: CollaborationPortfolio;
};

export function WorkspacePortfolioCard({ portfolio }: WorkspacePortfolioCardProps) {
  const { statistics, analytics } = portfolio;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">🗂️ Collaboration workspace portfolio</h3>
      <p className="mt-1 text-sm text-slate-400">
        {formatNumber(statistics.totalWorkspaces)} workspaces · {formatNumber(statistics.totalMembers)} members ·{' '}
        {formatNumber(statistics.totalTasks)} tasks
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Task completion" value={formatPercent(analytics.taskCompletionRate)} />
        <StatisticCard title="Milestones achieved" value={formatNumber(statistics.achievedMilestones)} />
        <StatisticCard title="Documents published" value={formatNumber(statistics.publishedDocuments)} />
        <StatisticCard title="Discussions" value={formatNumber(statistics.totalDiscussions)} />
      </div>
    </div>
  );
}
