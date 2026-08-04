'use client';

import { useMemo } from 'react';
import { ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { LearningEmptyState } from './LearningEmptyState';
import { courseUrl, formatDate, formatNumber, nodeTypeIcon } from './format';
import useLearning from '@/hooks/useLearning';

type LearningPathDetailProps = {
  pathId: string;
};

export function LearningPathDetail({ pathId }: LearningPathDetailProps) {
  const { allPaths, allCourses, progressOf } = useLearning();

  const path = useMemo(() => allPaths.find((entry) => entry.id === pathId), [allPaths, pathId]);

  if (!path) {
    return <LearningEmptyState title="Path not found" description="The learning path you are looking for does not exist." />;
  }

  const resolveCourse = (courseId: string) => allCourses.find((course) => course.id === courseId);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-3xl dark:bg-sky-900/50">
              <span aria-hidden="true">🧭</span>
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{path.title}</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                by @{path.ownerUsername} · created {formatDate(path.createdAt)}
                {path.isPublic ? ' · public' : ''}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
            {formatNumber(path.items.length)} steps
          </span>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{path.description}</p>
        <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">Purpose: {path.purpose}</p>
      </header>

      <ol className="space-y-4">
        {path.items.map((item) => {
          const course = resolveCourse(item.ref.nodeId);
          const progress = course ? progressOf(course) : undefined;
          return (
            <li
              key={item.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.position}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                    {course ? (
                      <a
                        href={courseUrl(course)}
                        className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
                      >
                        {course.title} <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400">{item.ref.nodeType}</p>
                    )}
                  </div>
                </div>
                {progress ? (
                  <div className="flex items-center gap-3">
                    <span className="w-32">
                      <ProgressBar percent={progress.percent} />
                    </span>
                    <ProgressPercentBadge percent={progress.percent} />
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <span aria-hidden="true">{nodeTypeIcon('course')}</span> Not yet started
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
