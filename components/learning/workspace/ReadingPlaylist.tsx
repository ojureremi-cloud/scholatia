'use client';

import { useMemo } from 'react';
import Button from '@/components/ui/Button';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { courseUrl, lessonUrl, moduleUrl } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningObjectRef } from '@/types/learning';

export function ReadingPlaylist() {
  const { reading, progress, allCourses } = useLearning();
  const playlists = reading().playlists;

  const nodeLookup = useMemo(() => {
    const courses = new Map<string, string>();
    const modules = new Map<string, { courseSlug: string; moduleSlug: string }>();
    const lessons = new Map<string, { courseSlug: string; moduleSlug: string; lessonSlug: string }>();
    const topics = new Map<string, string>();
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
    return { courses, modules, lessons, topics };
  }, [allCourses]);

  const hrefFor = (ref: LearningObjectRef): string | undefined => {
    if (ref.nodeType === 'course') return nodeLookup.courses.has(ref.nodeId) ? courseUrl({ slug: nodeLookup.courses.get(ref.nodeId)! }) : undefined;
    if (ref.nodeType === 'module') {
      const moduleEntry = nodeLookup.modules.get(ref.nodeId);
      return moduleEntry ? moduleUrl({ slug: moduleEntry.courseSlug }, { slug: moduleEntry.moduleSlug }) : undefined;
    }
    if (ref.nodeType === 'lesson') {
      const lesson = nodeLookup.lessons.get(ref.nodeId);
      return lesson ? lessonUrl({ slug: lesson.courseSlug }, { slug: lesson.lessonSlug }) : undefined;
    }
    return undefined;
  };

  const completed = useMemo(() => {
    const set = new Set<string>();
    for (const entry of progress) {
      if (entry.state === 'completed') set.add(`${entry.nodeType}:${entry.learningObjectId}`);
    }
    return set;
  }, [progress]);

  if (playlists.length === 0) {
    return <WorkspaceEmptyState title="No playlists" description="Sequenced reading playlists will appear here." />;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Reading playlists
      </h2>
      <div className="mt-5 space-y-6">
        {playlists.map((playlist) => {
          const withState = playlist.items.map((item) => {
            const done = completed.has(`${item.ref.nodeType}:${item.ref.nodeId}`);
            return { item, done };
          });
          const doneCount = withState.filter((entry) => entry.done).length;
          const percent = Math.round((doneCount / Math.max(1, withState.length)) * 100);
          const next = withState.find((entry) => !entry.done);
          return (
            <article key={playlist.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{playlist.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{playlist.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">{percent}%</p>
                  <p className="text-xs text-slate-400">
                    {doneCount} of {withState.length} completed
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <ProgressBar percent={percent} />
              </div>

              <ol className="mt-4 space-y-2">
                {withState
                  .slice()
                  .sort((a, b) => a.item.position - b.item.position)
                  .map(({ item, done }) => {
                    const href = hrefFor(item.ref);
                    return (
                      <li key={item.id} className="flex items-center gap-3">
                        <span
                          className={[
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                            done
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
                          ].join(' ')}
                        >
                          {done ? '✓' : item.position}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                          {!done && item.position === next?.item.position ? (
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              Up next
                            </p>
                          ) : null}
                        </div>
                        {!done && item.position === next?.item.position && href ? (
                          <Button size="sm" href={href} variant="primary">
                            Resume
                          </Button>
                        ) : null}
                        {done && href ? (
                          <a href={href} className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400">
                            Review
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
              </ol>

              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Completed history</h4>
                <ul className="mt-2 space-y-1">
                  {withState.filter((entry) => entry.done).length === 0 ? (
                    <li className="text-sm text-slate-400">Nothing completed yet — start with the first item.</li>
                  ) : (
                    withState
                      .filter((entry) => entry.done)
                      .sort((a, b) => a.item.position - b.item.position)
                      .map(({ item }) => (
                        <li key={item.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <span aria-hidden="true">✓</span> {item.title}
                        </li>
                      ))
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
