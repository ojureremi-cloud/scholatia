'use client';

import { CourseKindBadge, LevelBadge, ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { courseKindIcon, courseUrl, formatDuration, formatNumber } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningCourse } from '@/types/learning';

type CourseCardProps = {
  course: LearningCourse;
};

export function CourseCard({ course }: CourseCardProps) {
  const { progressOf } = useLearning();
  const progress = progressOf(course);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl dark:bg-sky-900/50">
          <span aria-hidden="true">{courseKindIcon(course.courseKind)}</span>
        </span>
        <CourseKindBadge kind={course.courseKind} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        <a href={courseUrl(course)} className="hover:text-sky-600 hover:underline dark:hover:text-sky-400">
          {course.title}
        </a>
      </h3>

      <div className="mt-2 flex flex-wrap gap-2">
        <LevelBadge level={course.level} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {course.category}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>

      <p className="mt-3 text-xs text-slate-400">
        ⏱ {formatDuration(course.durationHours)}
        {course.institutionName ? ` · ${course.institutionName}` : ''}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar percent={progress.percent} className="flex-1" />
        <ProgressPercentBadge percent={progress.percent} />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {formatNumber(progress.completed)} of {formatNumber(progress.total)} activities complete
      </p>

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <a
          href={courseUrl(course)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          View course <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
