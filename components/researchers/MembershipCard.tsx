'use client';

import type { ResearcherProfile } from '@/types/researcher';

type MembershipCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function MembershipCard({ researcher, className = '' }: MembershipCardProps) {
  const { memberships, certifications } = researcher;
  if (memberships.length === 0 && certifications.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No memberships or certifications recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Memberships and certifications</h3>
      {memberships.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {memberships.map((membership) => (
            <li key={membership.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">{membership.organisation}</p>
              <p className="mt-1 text-sm text-slate-600">
                {membership.role} • {membership.type} • Since {membership.since}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">Status: {membership.status}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {certifications.length > 0 ? (
        <>
          <p className="mt-6 text-sm font-medium text-slate-500">Certifications</p>
          <ul className="mt-3 space-y-3">
            {certifications.map((certification) => (
              <li key={certification.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{certification.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {certification.issuer} • {certification.year}
                </p>
                {certification.description ? <p className="mt-1 text-sm text-slate-600">{certification.description}</p> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
