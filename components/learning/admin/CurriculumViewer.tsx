'use client';

import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';

export function CurriculumViewer() {
  const { curriculum, progressOf } = useLearning();
  const model = curriculum();

  if (model.curricula.length === 0) {
    return <AdminEmptyState title="No curricula" description="No curriculum trees are available to inspect." />;
  }

  return (
    <Panel eyebrow="Curriculum tree" title="Course placement explorer" icon="🌳">
      <ul className="space-y-5">
        {model.curricula.map((row) => (
          <li key={row.curriculum.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.curriculum.title}</p>
                <p className="text-xs text-slate-400">{row.programme.title}</p>
              </div>
              <Chip tone={row.completion >= 100 ? 'success' : 'info'}>
                {row.completedNodes}/{row.totalNodes} nodes · {formatPercent(row.completion)}
              </Chip>
            </div>
            <div className="mt-3">
              <ProgressBar percent={row.completion} />
            </div>
            {row.courses.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {row.courses.map((course) => {
                  const courseProgress = progressOf(course);
                  const percent = courseProgress.percent;
                  return (
                    <li key={course.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">{course.title}</span>
                      <span className="text-xs text-slate-400">{courseProgress.completed}/{courseProgress.total} nodes</span>
                      <span className="w-28">
                        <ProgressBar percent={percent} />
                      </span>
                      <Chip tone={percent >= 100 ? 'success' : percent > 0 ? 'warning' : 'default'}>{formatPercent(percent)}</Chip>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-400">No courses placed in this curriculum.</p>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
