'use client';

import Badge from '@/components/ui/Badge';
import { bookmarkKindIcon, formatRelative, journalKindIcon } from '../format';
import useLearning from '@/hooks/useLearning';

const QUICK_LINKS: { label: string; href: string; icon: string }[] = [
  { label: 'Reading workspace', href: '/learning/reading', icon: '📚' },
  { label: 'Student home', href: '/learning/home', icon: '🏠' },
  { label: 'Courses', href: '/learning/courses', icon: '📘' },
  { label: 'Programmes', href: '/learning/programmes', icon: '🎓' },
  { label: 'Paths', href: '/learning/paths', icon: '🧭' },
];

export function WorkspaceSidebar() {
  const { workspace, notes, journal, notifications } = useLearning();
  const pinnedBookmarks = workspace().pinnedResources.slice(0, 4);
  const recentNotes = notes().recent;
  const recentJournal = journal().recent.slice(0, 3);
  const notificationCount = notifications.length;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Workspace tools
        </h2>
        <ul className="mt-4 space-y-1">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span aria-hidden="true">{link.icon}</span> {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Badge variant="info">{notificationCount}</Badge>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">open notifications</span>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Pinned bookmarks
        </h2>
        <ul className="mt-4 space-y-3">
          {pinnedBookmarks.length === 0 ? (
            <li className="text-sm text-slate-400">No pinned bookmarks.</li>
          ) : (
            pinnedBookmarks.map((bookmark) => (
              <li key={bookmark.id} className="flex items-start gap-3">
                <span aria-hidden="true">{bookmarkKindIcon(bookmark.kind)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-5 text-slate-800 dark:text-slate-100">{bookmark.title}</p>
                  <p className="text-xs text-slate-400">{formatRelative(bookmark.createdAt)}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Recent notes
        </h2>
        <ul className="mt-4 space-y-3">
          {recentNotes.length === 0 ? (
            <li className="text-sm text-slate-400">No notes yet.</li>
          ) : (
            recentNotes.map((note) => (
              <li key={note.id} className="text-sm leading-5 text-slate-700 dark:text-slate-200">
                <p className="font-medium text-slate-800 dark:text-slate-100">{note.title}</p>
                <p className="text-xs text-slate-400">{formatRelative(note.updatedAt)}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Journal
        </h2>
        <ul className="mt-4 space-y-3">
          {recentJournal.length === 0 ? (
            <li className="text-sm text-slate-400">No journal entries yet.</li>
          ) : (
            recentJournal.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3">
                <span aria-hidden="true">{journalKindIcon(entry.kind)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-5 text-slate-800 dark:text-slate-100">{entry.title}</p>
                  <p className="text-xs text-slate-400">{formatRelative(entry.date)}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
