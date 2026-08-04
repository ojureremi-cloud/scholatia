'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { WorkspaceFilters } from './WorkspaceFilters';
import { formatDate, highlightCategoryIcon, highlightCategoryLabel } from '../format';
import useLearning from '@/hooks/useLearning';

export function LearningHighlights() {
  const { highlights } = useLearning();
  const model = highlights();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const categoryOptions = [
    { label: 'All categories', value: 'all' },
    ...model.categories.map((item) => ({ label: highlightCategoryLabel(item), value: item })),
  ];

  const visible = useMemo(
    () =>
      model.highlights.filter(
        (highlight) =>
          (category === 'all' || highlight.category === category) &&
          (!query.trim() || highlight.text.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [model.highlights, category, query],
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Highlights
          </h2>
          <p className="mt-1 text-xs text-slate-400">Key passages categorised and colour-coded for easy retrieval.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => undefined} title="Export placeholder">
          ⬇️ Export
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <WorkspaceFilters
          selects={[
            { id: 'highlight-category', label: 'Category', value: category, options: categoryOptions, onChange: setCategory },
          ]}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search highlights..."
          aria-label="Search highlights"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {model.categories.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
            style={{ borderTopColor: model.colours[item], borderTopWidth: 3 }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: model.colours[item] }}
                aria-hidden="true"
              />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {highlightCategoryIcon(item)} {highlightCategoryLabel(item)}
              </h3>
              <span className="text-xs text-slate-400">({model.byCategory[item].length})</span>
            </div>
            <ul className="mt-3 space-y-2">
              {model.byCategory[item].slice(0, 2).map((highlight) => (
                <li key={highlight.id} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  “{highlight.text}”
                  <span className="block text-xs text-slate-400">
                    — {highlight.sourceTitle} · {formatDate(highlight.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No matching highlights" description="Try a different category or search term." />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {visible.map((highlight) => (
            <li
              key={highlight.id}
              className="rounded-2xl border-l-4 border-slate-200 bg-slate-50 p-4 dark:bg-slate-800/40"
              style={{ borderLeftColor: highlight.colour }}
            >
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">“{highlight.text}”</p>
              <p className="mt-2 text-xs text-slate-400">
                {highlightCategoryIcon(highlight.category)} {highlightCategoryLabel(highlight.category)} —{' '}
                {highlight.sourceTitle} · {formatDate(highlight.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
