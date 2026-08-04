import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { CommunityAnalytics } from '@/types/communities';

type CommunityAnalyticsProps = {
  analytics: CommunityAnalytics;
};

export function CommunityAnalytics({ analytics }: CommunityAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatisticCard title="Avg members" value={analytics.avgMembersPerCommunity.toFixed(1)} />
        <StatisticCard title="Avg followers" value={analytics.avgFollowersPerCommunity.toFixed(1)} />
        <StatisticCard title="Avg activity score" value={analytics.avgActivityScore.toFixed(1)} />
        <StatisticCard title="Public share" value={formatPercent(analytics.publicShare)} trend="open to everyone" trendPositive />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Top countries</h4>
          <ul className="mt-3 space-y-2">
            {analytics.topCountries.slice(0, 6).map((stat) => (
              <li key={stat.country} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">🌍 {stat.country}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(stat.count)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Leading disciplines</h4>
          <ul className="mt-3 space-y-2">
            {analytics.topDisciplines.slice(0, 6).map((stat) => (
              <li key={stat.discipline} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">🎓 {stat.discipline}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(stat.count)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Top keywords</h4>
        <div className="flex flex-wrap gap-2">
          {analytics.topKeywords.slice(0, 10).map((stat) => (
            <span
              key={stat.keyword}
              className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-300"
            >
              #{stat.keyword} · {formatNumber(stat.count)}
            </span>
          ))}
        </div>
      </div>

      {analytics.topTrendingTopics.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Trending topics</h4>
          <ul className="space-y-2">
            {analytics.topTrendingTopics.map((stat) => (
              <li key={stat.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">🔥 {stat.label}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(stat.score)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
