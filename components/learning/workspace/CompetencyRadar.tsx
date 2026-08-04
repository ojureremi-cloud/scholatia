'use client';

import Badge from '@/components/ui/Badge';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { domainIcon, domainLabel, formatPercent } from '../format';
import useLearning from '@/hooks/useLearning';
import type { BadgeTone } from '../format';

function stateVariant(state: 'gap' | 'at-par' | 'ahead'): BadgeTone {
  switch (state) {
    case 'ahead':
      return 'success';
    case 'at-par':
      return 'info';
    default:
      return 'warning';
  }
}

export function CompetencyRadar() {
  const { competencyRadar } = useLearning();
  const model = competencyRadar();

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Competency radar
        </h2>
        <Badge variant="info">Overall {formatPercent(model.attainment)}</Badge>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Current vs target level per competency, with growth since tracking began.
      </p>

      <ul className="mt-5 space-y-4">
        {model.competencies.map((competency) => (
          <li key={competency.key}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                <span aria-hidden="true">{domainIcon(competency.domain)}</span> {competency.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{domainLabel(competency.domain)}</span>
                <Badge variant={stateVariant(competency.state)}>
                  {competency.state.replace('-', ' ')}
                </Badge>
                {competency.growth !== 0 ? (
                  <span
                    className={[
                      'text-xs font-semibold',
                      competency.growth > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                    ].join(' ')}
                  >
                    {competency.growth > 0 ? `+${competency.growth}` : competency.growth}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current — level {competency.currentLevel}</span>
                <span className="text-slate-400">Target — level {competency.targetLevel}</span>
              </div>
              <ProgressBar percent={(competency.currentLevel / Math.max(1, competency.targetLevel)) * 100} />
              {competency.gap > 0 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Gap of {competency.gap} level{competency.gap === 1 ? '' : 's'} to target.
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {model.recommendations.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Recommended next steps</h3>
          <ul className="mt-2 space-y-2">
            {model.recommendations.slice(0, 3).map((recommendation) => (
              <li key={recommendation.id} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {recommendation.title}
                <span className="block text-xs text-slate-400">{recommendation.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {model.history.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No competency history" description="Level snapshots will appear here over time." />
        </div>
      ) : null}
    </section>
  );
}
