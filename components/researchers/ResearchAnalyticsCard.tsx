'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ResearchAnalyticsCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchAnalyticsCard({ researcher, className = '' }: ResearchAnalyticsCardProps) {
  const { analytics } = researcher;
  const stats = [
    { label: 'Profile views', value: analytics.profileViews.toLocaleString('en-US') },
    { label: 'Downloads', value: analytics.downloads.toLocaleString('en-US') },
    { label: 'Reads', value: analytics.reads.toLocaleString('en-US') },
    { label: 'Citations', value: analytics.citations.toLocaleString('en-US') },
    { label: 'Followers', value: analytics.followers.toLocaleString('en-US') },
    { label: 'Collaborators', value: analytics.collaborators.toLocaleString('en-US') },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
        {analytics.analyticsPeriod ? <span className="text-xs font-medium text-slate-500">{analytics.analyticsPeriod}</span> : null}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {analytics.topCountries && analytics.topCountries.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">Top countries</p>
          <ul className="mt-2 space-y-2">
            {analytics.topCountries.map((country) => (
              <li key={country.country} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                <span className="text-slate-700">{country.country}</span>
                <span className="font-semibold text-slate-900">{country.views.toLocaleString('en-US')} views</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
