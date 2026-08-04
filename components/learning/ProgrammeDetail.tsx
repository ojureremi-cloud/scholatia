'use client';

import { useMemo } from 'react';
import { ProgrammeHeader } from './ProgrammeHeader';
import { CourseKindBadge, LevelBadge, ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { LearningEmptyState } from './LearningEmptyState';
import { courseKindIcon, courseUrl, formatDuration, formatNumber, nodeTypeIcon } from './format';
import useLearning from '@/hooks/useLearning';

type ProgrammeDetailProps = {
  programmeId: string;
};

export function ProgrammeDetail({ programmeId }: ProgrammeDetailProps) {
  const { allProgrammes, progressOf } = useLearning();

  const programme = useMemo(
    () => allProgrammes.find((entry) => entry.id === programmeId),
    [allProgrammes, programmeId],
  );

  if (!programme) {
    return (
      <LearningEmptyState
        title="Programme not found"
        description="The programme you are looking for does not exist."
      />
    );
  }

  return (
    <div className="space-y-8">
      <ProgrammeHeader programme={programme} />

      <ol className="space-y-6">
        {programme.curricula.map((curriculum) => {
          const aggregate = curriculum.courses.reduce(
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
            <li
              key={curriculum.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-xl dark:bg-sky-900/50">
                    <span aria-hidden="true">{nodeTypeIcon('curriculum')}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                      Curriculum {curriculum.position}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{curriculum.title}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{curriculum.description}</p>
                  </div>
                </div>
                <div className="flex w-40 items-center gap-2">
                  <ProgressBar percent={percent} className="flex-1" />
                  <ProgressPercentBadge percent={percent} />
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {curriculum.courses.map((course) => {
                  const courseProgress = progressOf(course);
                  return (
                    <li
                      key={course.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span aria-hidden="true" className="text-xl">
                          {courseKindIcon(course.courseKind)}
                        </span>
                        <div className="min-w-0">
                          <a
                            href={courseUrl(course)}
                            className="block text-sm font-semibold text-slate-800 hover:text-sky-600 hover:underline dark:text-slate-100 dark:hover:text-sky-400"
                          >
                            {course.title}
                          </a>
                          <p className="mt-0.5 text-xs text-slate-400">
                            ⏱ {formatDuration(course.durationHours)} · {formatNumber(course.modules.length)} modules
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CourseKindBadge kind={course.courseKind} />
                        <LevelBadge level={course.level} />
                        <span className="w-24">
                          <ProgressBar percent={courseProgress.percent} />
                        </span>
                        <ProgressPercentBadge percent={courseProgress.percent} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
