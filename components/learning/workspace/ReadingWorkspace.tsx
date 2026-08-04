'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { WorkspaceSearch } from './WorkspaceSearch';
import { WorkspaceFilters } from './WorkspaceFilters';
import { WorkspaceWidgets } from './WorkspaceWidgets';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { ReadingList } from './ReadingList';
import { ReadingPlaylist } from './ReadingPlaylist';
import { formatDuration, formatRelative, readingKindIcon, readingKindLabel } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningReadingKind } from '@/types/learning';

const READING_KINDS: LearningReadingKind[] = ['research', 'course', 'saved'];

export function ReadingWorkspace() {
  const { reading } = useLearning();
  const model = reading();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<string>('all');
  const [sort, setSort] = useState<string>('recent');

  const matchesQuery = (title: string) => !query.trim() || title.toLowerCase().includes(query.trim().toLowerCase());

  const visibleByKind = (items: typeof model.research) =>
    items
      .filter((item) => kind === 'all' || item.kind === kind)
      .filter((item) => matchesQuery(item.title))
      .sort((a, b) =>
        sort === 'title' ? a.title.localeCompare(b.title) : b.openedAt.localeCompare(a.openedAt),
      );

  const kindOptions = [
    { label: 'All kinds', value: 'all' },
    ...READING_KINDS.map((item) => ({ label: readingKindLabel(item), value: item })),
  ];
  const sortOptions = [
    { label: 'Recently opened', value: 'recent' },
    { label: 'Title A–Z', value: 'title' },
  ];

  return (
    <>
      <WorkspaceToolbar
        title="Reading workspace"
        subtitle="Track readings, curate lists, and work through sequenced playlists."
      />

      <div className="space-y-3">
        <WorkspaceSearch value={query} onChange={setQuery} placeholder="Search readings by title..." />
        <WorkspaceFilters
          selects={[
            { id: 'reading-kind', label: 'Kind', value: kind, options: kindOptions, onChange: setKind },
            { id: 'reading-sort', label: 'Sort by', value: sort, options: sortOptions, onChange: setSort },
          ]}
        />
      </div>

      {model.current ? (
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-600 to-teal-500 p-8 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Continue reading</p>
              <h2 className="mt-2 text-2xl font-semibold">{model.current.title}</h2>
              {model.current.authors ? <p className="mt-1 text-sm text-sky-100">{model.current.authors}</p> : null}
            </div>
            <Button href="/learning/reading" variant="primary" className="!bg-white !text-sky-700 hover:!bg-sky-50">
              Resume reading
            </Button>
          </div>
          <div className="mt-6">
            <ProgressBar percent={model.current.progress} className="!bg-white/25" />
            <p className="mt-2 text-xs text-sky-100">
              {Math.round(model.current.progress)}% complete · {formatDuration(model.estimatedCompletionMinutes)}
              {' '}
              of reading remaining
            </p>
          </div>
        </section>
      ) : (
        <WorkspaceEmptyState title="No reading in progress" description="Open a reading to pick up where you left off." />
      )}

      <WorkspaceWidgets>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Your readings
          </h2>
          <div className="mt-5 space-y-5">
            {READING_KINDS.map((itemKind) => {
              const items = visibleByKind(model[itemKind] as typeof model.research);
              return (
                <div key={itemKind}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {readingKindIcon(itemKind)} {readingKindLabel(itemKind)}
                  </h3>
                  {items.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">None.</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.authors ? `${item.authors} · ` : ''}
                              {item.publicationType} · opened {formatRelative(item.openedAt)}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-sky-600 dark:text-sky-400">
                            {Math.round(item.progress)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Recently opened
          </h2>
          <ul className="mt-5 space-y-3">
            {model.recentlyOpened.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span aria-hidden="true" className="text-xl">
                  {readingKindIcon(item.kind)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-400">{formatRelative(item.openedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </WorkspaceWidgets>

      <ReadingList />
      <ReadingPlaylist />

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          AI-assisted reading
        </h2>
        <ul className="mt-5 space-y-4">
          {model.aiSuggestions.map((suggestion) => (
            <li key={suggestion.title} className="flex items-start gap-3">
              <span aria-hidden="true" className="text-xl">
                ✨
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{suggestion.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{suggestion.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
