'use client';

import { DomainBadge } from './Badges';
import { ProgressBar } from './ProgressBar';
import { formatPercent, levelName } from './format';
import useLearning from '@/hooks/useLearning';

export function CompetencyPanel() {
  const { competencyGaps, competencyAttainment } = useLearning();

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Competency framework
        </h2>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
          {formatPercent(competencyAttainment)} attained
        </span>
      </div>

      <ul className="mt-6 space-y-5">
        {competencyGaps.map(({ competency, currentLevel, targetLevel, state }) => {
          const percent = Math.min(100, Math.round((currentLevel / Math.max(1, targetLevel)) * 100));
          return (
            <li key={competency.key}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{competency.name}</p>
                  <DomainBadge domain={competency.domain} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {levelName(currentLevel)} → target {levelName(targetLevel)}
                  {state === 'gap' ? ` · gap ${targetLevel - currentLevel}` : state === 'ahead' ? ' · ahead of target' : ' · at par'}
                </p>
              </div>
              <ProgressBar percent={percent} className="mt-2" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
