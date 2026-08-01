'use client';

import type { ResearcherProfile } from '@/types/researcher';

type StartupCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function StartupCard({ researcher, className = '' }: StartupCardProps) {
  const { startups } = researcher;
  if (startups.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No startups recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Startups</h3>
      <ul className="mt-5 space-y-3">
        {startups.map((startup) => (
          <li key={startup.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{startup.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {startup.sector} • {startup.stage} • Founded {startup.founded}
            </p>
            <p className="mt-2 text-sm text-slate-600">{startup.description}</p>
            {startup.fundingRaised ? (
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Funding raised: </span>
                {startup.fundingRaised}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
