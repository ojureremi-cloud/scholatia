'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ResearchRelationshipCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchRelationshipCard({ researcher, className = '' }: ResearchRelationshipCardProps) {
  const { relationships } = researcher;
  const groups = [
    { label: 'Projects', entries: relationships.projects, icon: '🧪' },
    { label: 'Datasets', entries: relationships.datasets, icon: '📊' },
    { label: 'Manuscripts', entries: relationships.manuscripts, icon: '✍️' },
    { label: 'Publications', entries: relationships.publications, icon: '📄' },
    { label: 'Journals', entries: relationships.journals, icon: '📚' },
    { label: 'Conferences', entries: relationships.conferences, icon: '🎤' },
    { label: 'Grants', entries: relationships.grants, icon: '💰' },
    { label: 'Awards', entries: relationships.awards, icon: '🏆' },
    { label: 'Collaborators', entries: relationships.collaborators, icon: '🤝' },
    { label: 'Institutions', entries: relationships.institutions, icon: '🏛️' },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Connected research</h3>
      <p className="mt-1 text-sm text-slate-600">Live cross-module references resolved from the Scholatia ecosystem.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <div key={group.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {group.icon} {group.label} ({group.entries.length})
            </p>
            {group.entries.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="truncate text-sm text-slate-600">
                    {entry.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No linked entries.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
