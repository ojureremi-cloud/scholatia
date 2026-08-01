'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type GrantCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function GrantCard({ researcher, className = '' }: GrantCardProps) {
  const { grantParticipation } = researcher;
  if (grantParticipation.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No grant participation recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Grants</h3>
      <ul className="mt-5 space-y-5">
        {grantParticipation.map((grant) => (
          <li key={grant.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{grant.title}</p>
              <Badge variant={grant.status === 'Active' ? 'success' : grant.status === 'Completed' ? 'default' : 'warning'}>
                {grant.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{grant.funder}</p>
            <p className="mt-1 text-sm text-slate-500">
              {grant.role} • {grant.period}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{grant.amount}</p>
            {grant.description ? <p className="mt-2 text-sm text-slate-600">{grant.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
