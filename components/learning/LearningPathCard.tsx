'use client';

import { ProgressPercentBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { formatNumber, pathUrl } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningPath } from '@/types/learning';

type LearningPathCardProps = {
  path: LearningPath;
};

export function LearningPathCard({ path }: LearningPathCardProps) {
  const { pathProgressOf } = useLearning();
  const progress = pathProgressOf(path.id);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl dark:bg-sky-900/50">
          <span aria-hidden="true">🧭</span>
        </span>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
          {formatNumber(path.items.length)} steps
        </span>
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        <a href={pathUrl(path)} className="hover:text-sky-600 hover:underline dark:hover:text-sky-400">
          {path.title}
        </a>
      </h3>

      <p className="mt-2 text-xs text-slate-400">by @{path.ownerUsername}</p>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{path.description}</p>

      <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">“{path.purpose}”</p>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar percent={progress.percent} className="flex-1" />
        <ProgressPercentBadge percent={progress.percent} />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <a
          href={pathUrl(path)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          View path <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
