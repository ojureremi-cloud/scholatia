'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ResearchVisibilityCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchVisibilityCard({ researcher, className = '' }: ResearchVisibilityCardProps) {
  const { visibility } = researcher;
  const stats = [
    { label: 'Visibility score', value: `${visibility.visibilityScore}/100` },
    { label: 'Profile views', value: visibility.profileViews.toLocaleString('en-US') },
    { label: 'Monthly visitors', value: visibility.monthlyVisitors?.toLocaleString('en-US') ?? 'Not listed' },
    { label: 'Monthly downloads', value: visibility.monthlyDownloads?.toLocaleString('en-US') ?? 'Not listed' },
    { label: 'Search appearances', value: visibility.searchAppearances?.toLocaleString('en-US') ?? 'Not listed' },
    { label: 'Countries reached', value: visibility.countriesReached?.toString() ?? 'Not listed' },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Research visibility</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-600">{stat.label}</span>
            <span className="font-semibold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>
      {visibility.topReferrers && visibility.topReferrers.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">Top referrers</p>
          <ul className="mt-2 space-y-2">
            {visibility.topReferrers.map((referrer) => (
              <li key={referrer.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                <span className="text-slate-700">{referrer.name}</span>
                <span className="font-semibold text-slate-900">{referrer.count.toLocaleString('en-US')}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
