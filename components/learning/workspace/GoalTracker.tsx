'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatDate, goalStatusLabel, goalStatusVariant } from '../format';
import useLearning from '@/hooks/useLearning';

export function GoalTracker() {
  const { goalTracker, setGoalStatusOf } = useLearning();
  const model = goalTracker();

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Goal tracker
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{model.activeCount} active</Badge>
          <Badge variant="success">{model.completedCount} achieved</Badge>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">Average progress {Math.round(model.averageProgress)}% across goals.</p>

      {model.goals.length === 0 ? (
        <div className="mt-6">
          <WorkspaceEmptyState title="No goals" description="Set a learning goal to start tracking progress." />
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {model.goals.map((goal) => {
            const source = model.active.find((item) => item.id === goal.goalId);
            return (
              <li key={goal.goalId} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100">{goal.statement}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {goal.targetCompetencyKeys.length} target competencies · created{' '}
                      {source ? formatDate(source.createdAt) : '—'}
                    </p>
                  </div>
                  <Badge variant={goalStatusVariant(goal.status)}>{goalStatusLabel(goal.status)}</Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar percent={goal.progress} />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-400">
                      {goal.achievedKeys.length} of {goal.targetCompetencyKeys.length} competencies met
                    </p>
                    {goal.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setGoalStatusOf(goal.goalId, 'achieved')}
                      >
                        Mark achieved
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
