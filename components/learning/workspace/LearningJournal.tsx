'use client';

import { useMemo, useState } from 'react';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { WorkspaceFilters } from './WorkspaceFilters';
import { formatDate, journalKindIcon, journalKindLabel } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningJournalEntryKind } from '@/types/learning';

const JOURNAL_KINDS: LearningJournalEntryKind[] = [
  'daily',
  'reflection',
  'log',
  'research',
  'weekly',
  'monthly',
  'diary',
];

export function LearningJournal() {
  const { journal } = useLearning();
  const model = journal();
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');

  const kindOptions = [
    { label: 'All kinds', value: 'all' },
    ...JOURNAL_KINDS.map((item) => ({ label: journalKindLabel(item), value: item })),
  ];

  const visible = useMemo(
    () =>
      model.entries.filter(
        (entry) =>
          (kind === 'all' || entry.kind === kind) &&
          (!query.trim() || entry.title.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [model.entries, kind, query],
  );

  const renderEntry = (entry: (typeof model.entries)[number]) => (
    <li key={entry.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xl">
            {journalKindIcon(entry.kind)}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{entry.title}</h3>
        </div>
        <time className="shrink-0 text-xs text-slate-400" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.content}</p>
      {entry.tags && entry.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Learning journal
          </h2>
          <p className="mt-1 text-xs text-slate-400">Daily notes, reflections, logs, and monthly reviews.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <WorkspaceFilters
          selects={[{ id: 'journal-kind', label: 'Kind', value: kind, options: kindOptions, onChange: setKind }]}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search journal..."
          aria-label="Search journal"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No journal entries" description="Journal entries you write will appear here." />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {visible.map(renderEntry)}
          <li className="pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Recent entries
          </li>
          {model.recent.map(renderEntry)}
        </ul>
      )}
    </section>
  );
}
