import Badge from '@/components/ui/Badge';
import { communityUrl } from '@/lib/communities';
import { formatNumber } from './format';
import type { Community } from '@/types/communities';

type CommunitySidebarProps = {
  community: Community;
};

export function CommunitySidebar({ community }: CommunitySidebarProps) {
  const rules = community.rules;
  const trends = community.trends;

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">At a glance</h4>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Discipline</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{community.discipline}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Language</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{community.language}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Country</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{community.country}</dd>
          </div>
          {community.region && (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Region</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{community.region}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Members</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(community.memberCount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Followers</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(community.followerCount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Activity</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(community.activityScore)}</dd>
          </div>
        </dl>
        {community.website && (
          <p className="mt-3 truncate text-xs text-sky-600 dark:text-sky-400">
            <a href={community.website} target="_blank" rel="noreferrer">
              {community.website}
            </a>
          </p>
        )}
      </div>

      {community.researchAreas.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Research areas</h4>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {community.researchAreas.map((area) => (
              <li
                key={area}
                className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-300"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {trends.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Trending</h4>
          <ul className="mt-3 space-y-2">
            {trends.map((trend) => (
              <li key={trend.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">🔥 {trend.label}</span>
                <Badge variant="info">{formatNumber(trend.score)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rules.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Community rules</h4>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-slate-600 dark:text-slate-300">
            {rules.slice(0, 5).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </div>
      )}

      {community.codeOfConduct && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Code of conduct</h4>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{community.codeOfConduct}</p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Community id: <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{community.id}</code> ·{' '}
        <a href={communityUrl(community)} className="text-sky-600 hover:underline dark:text-sky-400">
          permalink
        </a>
      </p>
    </div>
  );
}
