'use client';

import type { ResearcherProfile } from '@/types/researcher';

type CollaborationNetworkProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function CollaborationNetwork({ researcher, className = '' }: CollaborationNetworkProps) {
  const { network } = researcher;
  const stats = [
    { label: 'Professional network', value: network.professionalNetwork },
    { label: 'Followers', value: network.followers },
    { label: 'Following', value: network.following },
    { label: 'Co-authors', value: network.coAuthors },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Collaboration network</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-semibold text-slate-900">{stat.value.toLocaleString('en-US')}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {network.collaborators.map((collaborator) => (
          <li key={collaborator.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{collaborator.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {collaborator.institution}
              {collaborator.role ? ` • ${collaborator.role}` : ''}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {collaborator.jointPublications} joint publications
              {collaborator.yearsActive ? ` • ${collaborator.yearsActive}` : ''}
            </p>
            <p className="mt-1 text-xs text-slate-500">{collaborator.researchAreas.join(', ')}</p>
          </li>
        ))}
      </ul>
      {network.institutionalPartners.length > 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium text-slate-900">Institutional partners: </span>
          {network.institutionalPartners.join(', ')}
        </p>
      ) : null}
    </section>
  );
}
