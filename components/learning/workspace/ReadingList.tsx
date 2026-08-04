'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatDate } from '../format';
import useLearning from '@/hooks/useLearning';

export function ReadingList() {
  const { reading, createReadingList, updateReadingList, deleteReadingList, duplicateReadingList, togglePinReadingList, toggleFavouriteReadingList, toggleArchiveReadingList, setReadingListCategory } =
    useLearning();
  const lists = reading().lists;

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [category, setCategory] = useState('General');

  const visible = useMemo(
    () =>
      lists
        .filter((list) => !query.trim() || list.title.toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => {
          if (Number(Boolean(a.pinned)) - Number(Boolean(b.pinned)) !== 0) {
            return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
          }
          return sort === 'title' ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt);
        }),
    [lists, query, sort],
  );

  const active = visible.filter((list) => !list.archived);
  const archived = visible.filter((list) => list.archived);

  const startCreate = () => {
    setCreating(true);
    setNewTitle('');
    setNewDescription('');
  };

  const startEdit = (list: (typeof lists)[number]) => {
    setEditingId(list.id);
    setEditTitle(list.title);
    setEditDescription(list.description);
  };

  const saveNew = () => {
    if (!newTitle.trim()) return;
    createReadingList({ title: newTitle.trim(), description: newDescription.trim(), category });
    setCreating(false);
  };

  const saveEdit = (listId: string) => {
    if (!editTitle.trim()) return;
    updateReadingList(listId, { title: editTitle.trim(), description: editDescription.trim() });
    setEditingId(null);
  };

  const renderList = (list: (typeof lists)[number], muted: boolean) => (
    <li
      key={list.id}
      className={[
        'rounded-2xl border border-slate-200 p-4 dark:border-slate-700',
        muted ? 'opacity-60' : '',
        list.pinned ? 'border-sky-200 bg-sky-50/40 dark:border-sky-800 dark:bg-sky-900/20' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {editingId === list.id ? (
        <div className="space-y-2">
          <input
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            aria-label="Reading list title"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            aria-label="Reading list description"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveEdit(list.id)}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{list.title}</h3>
              {list.pinned ? (
                <span className="text-xs" aria-label="Pinned">
                  📌
                </span>
              ) : null}
              {list.favourite ? (
                <span className="text-xs" aria-label="Favourite">
                  ⭐
                </span>
              ) : null}
              {list.archived ? (
                <span className="text-xs" aria-label="Archived">
                  🗄️
                </span>
              ) : null}
            </div>
            {list.description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{list.description}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate-400">
              {list.items.length} item{list.items.length === 1 ? '' : 's'} · updated {formatDate(list.updatedAt)}
              {list.category ? ` · ${list.category}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => togglePinReadingList(list.id)}>
              {list.pinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleFavouriteReadingList(list.id)}>
              {list.favourite ? 'Unfavourite' : 'Favourite'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleArchiveReadingList(list.id)}>
              {list.archived ? 'Restore' : 'Archive'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => duplicateReadingList(list.id)}>
              Duplicate
            </Button>
            <Button size="sm" variant="outline" onClick={() => startEdit(list)}>
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => deleteReadingList(list.id)}>
              Delete
            </Button>
            <select
              value={list.category ?? 'General'}
              onChange={(event) => setReadingListCategory(list.id, event.target.value)}
              aria-label="Reading list category"
              className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {['General', 'Methods', 'Writing', 'Statistics', 'Open science'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </li>
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Reading lists
          </h2>
          <p className="mt-1 text-xs text-slate-400">Create, organise, pin, and favourite your curated readings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lists..."
            aria-label="Search reading lists"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort reading lists"
            className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="recent">Recently updated</option>
            <option value="title">Title A–Z</option>
          </select>
          <Button size="sm" onClick={startCreate}>
            New list
          </Button>
        </div>
      </div>

      {creating ? (
        <div className="mt-4 space-y-2 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-600">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="List title"
            aria-label="New reading list title"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            placeholder="Short description (optional)"
            aria-label="New reading list description"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="New reading list category"
              className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {['General', 'Methods', 'Writing', 'Statistics', 'Open science'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={saveNew}>
              Create
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {active.length === 0 && archived.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState
            title="No reading lists"
            description="Create your first reading list to start curating readings."
          />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {active.map((list) => renderList(list, false))}
          {archived.map((list) => renderList(list, true))}
        </ul>
      )}
    </section>
  );
}
