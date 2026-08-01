'use client';

import React from 'react';
import type { InstitutionRelationshipRef, InstitutionRelationships } from '@/types/institution';

type InstitutionRelationshipCardProps = {
  relationships: InstitutionRelationships;
  className?: string;
};

const groups: Array<{ key: keyof InstitutionRelationships; label: string }> = [
  { key: 'projects', label: 'Projects' },
  { key: 'publications', label: 'Publications' },
  { key: 'manuscripts', label: 'Manuscripts' },
  { key: 'datasets', label: 'Datasets' },
  { key: 'journals', label: 'Journals' },
  { key: 'conferences', label: 'Conferences' },
  { key: 'researchers', label: 'Researchers (SAID)' },
  { key: 'grants', label: 'Grants' },
  { key: 'partners', label: 'Partners' },
];

export default function InstitutionRelationshipCard({ relationships, className = '' }: InstitutionRelationshipCardProps) {
  return (
    <div className={['grid gap-6 md:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {groups.map((group) => {
        const entries: InstitutionRelationshipRef[] = relationships[group.key];
        return (
          <div key={group.key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{group.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{entries.length}</p>
            <ul className="mt-4 space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <li key={entry.id}>
                  <p className="text-sm font-medium leading-5 text-slate-900">{entry.title}</p>
                  {entry.detail ? <p className="mt-0.5 text-xs leading-5 text-slate-500">{entry.detail}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
