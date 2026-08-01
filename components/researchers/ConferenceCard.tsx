'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ConferenceCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ConferenceCard({ researcher, className = '' }: ConferenceCardProps) {
  const { conferenceParticipation } = researcher;
  const linked = researcher.relationships.conferences;
  if (conferenceParticipation.length === 0 && linked.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No conference participation recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Conferences</h3>
      <ul className="mt-5 space-y-3">
        {conferenceParticipation.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{entry.conference}</p>
            <p className="mt-1 text-sm text-slate-600">
              {entry.role} • {entry.year}
            </p>
            {entry.paperTitle ? <p className="mt-1 text-sm text-slate-600">Paper: {entry.paperTitle}</p> : null}
            {entry.city ? (
              <p className="mt-1 text-sm text-slate-500">
                {entry.city}
                {entry.country ? `, ${entry.country}` : ''}
              </p>
            ) : null}
          </li>
        ))}
        {linked.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
            {entry.detail ? <p className="mt-1 text-sm text-slate-600">{entry.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
