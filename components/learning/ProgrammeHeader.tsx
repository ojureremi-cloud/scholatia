'use client';

import { ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { formatNumber } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningProgramme } from '@/types/learning';

type ProgrammeHeaderProps = {
  programme: LearningProgramme;
};

export function ProgrammeHeader({ programme }: ProgrammeHeaderProps) {
  const { progressOf } = useLearning();
  const courses = programme.curricula.flatMap((curriculum) => curriculum.courses);
  const aggregate = courses.reduce(
    (acc, course) => {
      const courseProgress = progressOf(course);
      return {
        total: acc.total + courseProgress.total,
        completed: acc.completed + courseProgress.completed,
      };
    },
    { total: 0, completed: 0 },
  );
  const percent = Math.round((aggregate.completed / Math.max(1, aggregate.total)) * 100);

  return (
    <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-3xl dark:bg-sky-900/50">
            <span aria-hidden="true">🎓</span>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{programme.title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {programme.qualification} · {programme.durationLabel}
              {programme.institutionName ? ` · ${programme.institutionName}` : ''}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
          {programme.qualification}
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{programme.description}</p>

      <p className="mt-3 text-xs text-slate-400">
        {formatNumber(programme.curricula.length)} curricula · {formatNumber(courses.length)} courses
      </p>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Overall progress</span>
          <span>
            {formatNumber(aggregate.completed)}/{formatNumber(aggregate.total)} · <ProgressPercentBadge percent={percent} />
          </span>
        </div>
        <ProgressBar percent={percent} className="mt-2" />
      </div>
    </header>
  );
}
