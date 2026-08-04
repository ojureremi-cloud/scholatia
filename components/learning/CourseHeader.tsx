'use client';

import Button from '@/components/ui/Button';
import { CourseKindBadge, LevelBadge, ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { courseKindIcon, formatDuration, formatNumber, levelName } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningCourse } from '@/types/learning';

type CourseHeaderProps = {
  course: LearningCourse;
};

export function CourseHeader({ course }: CourseHeaderProps) {
  const { progressOf, enrol, withdraw } = useLearning();
  const progress = progressOf(course);
  const enrolled = progress.percent > 0;
  const completed = progress.percent >= 100;

  return (
    <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-3xl dark:bg-sky-900/50">
            <span aria-hidden="true">{courseKindIcon(course.courseKind)}</span>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{course.title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {course.category} · Level {course.level} · {formatDuration(course.durationHours)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CourseKindBadge kind={course.courseKind} />
          <LevelBadge level={course.level} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {course.category}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{course.description}</p>

      <p className="mt-3 text-xs text-slate-400">
        {course.institutionName ? `${course.institutionName} · ` : ''}
        {course.instructorUsername ? `Instructor: @${course.instructorUsername}` : ''}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
        <div className="min-w-[10rem] flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span>
              {formatNumber(progress.completed)}/{formatNumber(progress.total)} · <ProgressPercentBadge percent={progress.percent} />
            </span>
          </div>
          <ProgressBar percent={progress.percent} className="mt-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {!enrolled ? (
            <Button onClick={() => enrol(course.id)}>Enrol</Button>
          ) : completed ? (
            <Button variant="outline" disabled>
              Completed · {levelName(course.level)}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => withdraw(course.id)}>
              Withdraw
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
