'use client';

import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';

export function CompetencyStatistics() {
  const { competencyRadar } = useLearning();
  const radar = competencyRadar();

  if (radar.competencies.length === 0) {
    return <AdminEmptyState title="No competency statistics" description="Attainment evidence will populate statistics." />;
  }

  const atPar = radar.competencies.filter((entry) => entry.gap <= 0).length;
  const ahead = radar.competencies.filter((entry) => entry.growth > 0 && entry.gap < 0).length;

  return (
    <Panel eyebrow="Competency statistics" title="Attainment summary" icon="📊">
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Overall attainment</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{formatPercent(radar.attainment)}</p>
          <div className="mt-2">
            <ProgressBar percent={radar.attainment} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">At or above target</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {formatPercent((atPar / radar.competencies.length) * 100)}
          </p>
          <p className="mt-2 text-xs text-slate-400">{atPar} of {radar.competencies.length} competencies</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Growth trend</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{ahead > 0 ? '↑ ahead' : 'flat'}</p>
          <p className="mt-2 text-xs text-slate-400">{ahead} competencies ahead of target</p>
        </div>
      </div>
    </Panel>
  );
}
