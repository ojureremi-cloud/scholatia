'use client';

import React from 'react';
import type { JournalRelationship, JournalRelationships } from '@/types/identity';

type JournalRelationshipsProps = {
  relationships: JournalRelationships;
  className?: string;
};

const groups: Array<{ key: keyof JournalRelationships; label: string }> = [
  { key: 'manuscripts', label: 'Manuscripts' },
  { key: 'datasets', label: 'Datasets' },
  { key: 'projects', label: 'Projects' },
  { key: 'authors', label: 'Authors (SAID)' },
  { key: 'institutions', label: 'Institutions' },
  { key: 'grants', label: 'Grants' },
  { key: 'publications', label: 'Publications' },
];

export default function JournalRelationships({ relationships, className = '' }: JournalRelationshipsProps) {
  return (
    <div className={['grid gap-6 md:grid-cols-2 xl:grid-cols-4', className].filter(Boolean).join(' ')}>
      {groups.map((group) => {
        const entries: JournalRelationship[] = relationships[group.key];
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
