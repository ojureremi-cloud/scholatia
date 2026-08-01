'use client';

import type { ResearcherProfile } from '@/types/researcher';

type RecentActivityCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function RecentActivityCard({ researcher, className = '' }: RecentActivityCardProps) {
  const { recentActivity } = researcher;
  if (recentActivity.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No recent activity recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
      <ul className="mt-5 space-y-3">
        {recentActivity.map((activity) => (
          <li key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
            <p className="mt-1 text-sm text-slate-600">{activity.detail}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-sky-700">{activity.type}</p>
            <p className="mt-1 text-xs text-slate-500">{activity.date}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
