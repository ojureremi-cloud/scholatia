'use client';

import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';

export function AssessmentStatistics() {
  const { assessmentManager } = useLearning();
  const model = assessmentManager();
  const results = model.results;

  if (results.length === 0) {
    return <AdminEmptyState title="No assessment statistics" description="Graded assessments will populate statistics." />;
  }

  const scores = results.map((row) => row.score ?? 0);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const passedCount = results.filter((row) => row.passed).length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  return (
    <Panel eyebrow="Assessment statistics" title="Score distribution" icon="📊">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Average score</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{formatPercent(average)}</p>
          <div className="mt-2">
            <ProgressBar percent={average} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Pass rate</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {formatPercent((passedCount / results.length) * 100)}
          </p>
          <div className="mt-2">
            <ProgressBar percent={(passedCount / results.length) * 100} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
        <span>Highest: <strong className="text-slate-800 dark:text-slate-100">{formatPercent(highest)}</strong></span>
        <span>Lowest: <strong className="text-slate-800 dark:text-slate-100">{formatPercent(lowest)}</strong></span>
        <span>Graded: <strong className="text-slate-800 dark:text-slate-100">{results.length}</strong></span>
      </div>
    </Panel>
  );
}
