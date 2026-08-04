'use client';

import { useMemo, useState } from 'react';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { bookmarkKindIcon, bookmarkKindLabel, courseUrl, lessonUrl, moduleUrl } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningBookmarkKind } from '@/types/learning';

const BOOKMARK_KINDS: LearningBookmarkKind[] = [
  'course',
  'lesson',
  'module',
  'topic',
  'reading',
  'research',
  'video',
  'resource',
];

export function BookmarksPanel() {
  const { bookmarks, allCourses } = useLearning();
  const model = bookmarks();
  const [query, setQuery] = useState('');

  const lookup = useMemo(() => {
    const courses = new Map<string, string>();
    const modules = new Map<string, { courseSlug: string; moduleSlug: string }>();
    const lessons = new Map<string, { courseSlug: string; moduleSlug: string; lessonSlug: string }>();
    for (const course of allCourses) {
      courses.set(course.id, course.slug);
      for (const moduleEntry of course.modules) {
        modules.set(moduleEntry.id, { courseSlug: course.slug, moduleSlug: moduleEntry.slug });
        for (const lessonEntry of moduleEntry.lessons) {
          lessons.set(lessonEntry.id, {
            courseSlug: course.slug,
            moduleSlug: moduleEntry.slug,
            lessonSlug: lessonEntry.slug,
          });
        }
      }
    }
    return { courses, modules, lessons };
  }, [allCourses]);

  const hrefFor = (bookmark: (typeof model.bookmarks)[number]): string | undefined => {
    if (!bookmark.ref) return undefined;
    if (bookmark.ref.nodeType === 'course') {
      const slug = lookup.courses.get(bookmark.ref.nodeId);
      return slug ? courseUrl({ slug }) : undefined;
    }
    if (bookmark.ref.nodeType === 'lesson') {
      const lesson = lookup.lessons.get(bookmark.ref.nodeId);
      return lesson
        ? lessonUrl({ slug: lesson.courseSlug }, { slug: lesson.lessonSlug })
        : undefined;
    }
    if (bookmark.ref.nodeType === 'module') {
      const moduleEntry = lookup.modules.get(bookmark.ref.nodeId);
      return moduleEntry ? moduleUrl({ slug: moduleEntry.courseSlug }, { slug: moduleEntry.moduleSlug }) : undefined;
    }
    return undefined;
  };

  const filtered = useMemo(
    () =>
      [...model.bookmarks]
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.createdAt.localeCompare(a.createdAt))
        .filter((bookmark) => !query.trim() || bookmark.title.toLowerCase().includes(query.trim().toLowerCase())),
    [model.bookmarks, query],
  );

  const byKind = (kind: LearningBookmarkKind) =>
    filtered.filter((bookmark) => bookmark.kind === kind);

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Bookmarks
          </h2>
          <p className="mt-1 text-xs text-slate-400">Quick shortcuts across every kind of learning object.</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search bookmarks..."
          aria-label="Search bookmarks"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {BOOKMARK_KINDS.map((kind) => {
          const items = byKind(kind);
          return (
            <div key={kind} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">{bookmarkKindIcon(kind)}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bookmarkKindLabel(kind)}</h3>
                <span className="text-xs text-slate-400">({items.length})</span>
              </div>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">None.</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {items.map((bookmark) => {
                    const href = hrefFor(bookmark);
                    return (
                      <li key={bookmark.id}>
                        {href ? (
                          <a
                            href={href}
                            className="flex items-center gap-2 text-sm text-sky-600 hover:underline dark:text-sky-400"
                          >
                            <span>{bookmark.title}</span>
                            {bookmark.pinned ? <span className="text-xs" aria-label="Pinned">📌</span> : null}
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            {bookmark.title}
                            {bookmark.pinned ? <span className="text-xs" aria-label="Pinned">📌</span> : null}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No matching bookmarks" description="Try a different search term." />
        </div>
      ) : null}
    </section>
  );
}
