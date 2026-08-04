'use client';

import { useMemo, useState } from 'react';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatDate } from '../format';
import useLearning from '@/hooks/useLearning';

export function LearningNotes() {
  const { notes } = useLearning();
  const model = notes();
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () =>
      model.notes.filter(
        (note) => !query.trim() || note.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [model.notes, query],
  );
  const pinned = visible.filter((note) => note.pinned);
  const rest = visible.filter((note) => !note.pinned);

  const renderNote = (note: (typeof model.notes)[number]) => (
    <li key={note.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{note.title}</h3>
        <div className="flex shrink-0 items-center gap-2">
          {note.pinned ? (
            <span className="text-xs" aria-label="Pinned">
              📌
            </span>
          ) : null}
          {note.richText ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Rich text
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.content}</p>
      {note.reference ? (
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900 dark:text-sky-200">
          {note.reference.nodeType} · {note.reference.label}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-slate-400">
        Created {formatDate(note.createdAt)} · Updated {formatDate(note.updatedAt)}
      </p>
    </li>
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Notes
          </h2>
          <p className="mt-1 text-xs text-slate-400">Pinned first, with course, module, and topic references.</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No notes" description="Notes you take across your learning will appear here." />
        </div>
      ) : (
        <>
          {pinned.length > 0 ? (
            <ul className="mt-5 space-y-3">
              <li className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pinned</li>
              {pinned.map(renderNote)}
            </ul>
          ) : null}
          {rest.length > 0 ? (
            <ul className="mt-5 space-y-3">
              <li className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">All notes</li>
              {rest.map(renderNote)}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
