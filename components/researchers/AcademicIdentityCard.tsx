'use client';

import type { ResearcherProfile } from '@/types/researcher';

type AcademicIdentityCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function AcademicIdentityCard({ researcher, className = '' }: AcademicIdentityCardProps) {
  const { identity } = researcher;
  const details = [
    { label: 'Scholatia Academic Identity (SAID)', value: identity.said },
    { label: 'ORCID iD', value: identity.orcid },
    { label: 'Google Scholar', value: identity.googleScholar ?? 'Not linked' },
    { label: 'Scopus Author ID', value: identity.scopusAuthorId ?? 'Not linked' },
    { label: 'Web of Science ResearcherID', value: identity.webOfScienceResearcherId ?? 'Not linked' },
    { label: 'Crossref', value: identity.crossref ?? 'Not linked' },
    { label: 'Member since', value: identity.memberSince },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Academic identity</h3>
      <p className="mt-1 text-sm text-slate-600">Persistent scholarly identifiers for {identity.displayName}.</p>
      <dl className="mt-5 space-y-3 text-sm">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0">
            <dt className="font-medium text-slate-500">{detail.label}</dt>
            <dd className="font-mono break-all text-slate-900">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
