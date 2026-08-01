'use client';

import type { ResearcherProfile } from '@/types/researcher';

type PublicationCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function PublicationCard({ researcher, className = '' }: PublicationCardProps) {
  const publications = researcher.relationships.publications;
  if (publications.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No linked publications.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Publications</h3>
      <ul className="mt-5 space-y-3">
        {publications.map((publication) => (
          <li key={publication.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{publication.title}</p>
            {publication.detail ? <p className="mt-1 text-sm text-slate-600">{publication.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
