'use client';

import { Badge } from '@/components/ui';
import { ProgressBar } from './ProgressBar';
import { GoalStatusBadge } from './Badges';
import { formatPercent, goalStatusLabel } from './format';
import useLearning from '@/hooks/useLearning';

export function LearningSidebar() {
  const { currentUser, currentUserName, kpis, goals } = useLearning();

  const quickStats = [
    { label: 'Progress rate', value: formatPercent(kpis.progressRate), icon: '📈' },
    { label: 'Completion rate', value: formatPercent(kpis.completionRate), icon: '✅' },
    { label: 'Engagement', value: formatPercent(kpis.engagementIndex), icon: '🔥' },
    { label: 'Competency attainment', value: formatPercent(kpis.competencyAttainment), icon: '🧠' },
  ];

  const activeGoals = goals.filter((goal) => goal.status === 'active').slice(0, 3);

  return (
    <aside className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
            {currentUserName
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{currentUserName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">@{currentUser}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">{stat.icon}</span> {stat.label}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Active goals
        </h2>
        <ul className="mt-4 space-y-4">
          {activeGoals.length === 0 ? (
            <li className="text-sm text-slate-400">No active goals.</li>
          ) : (
            activeGoals.map((goal) => (
              <li key={goal.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{goal.statement}</p>
                  <GoalStatusBadge status={goal.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{goalStatusLabel(goal.status)}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Learning velocity
          </h2>
          <Badge variant="info">{Math.round(kpis.learningVelocity)}</Badge>
        </div>
        <div className="mt-4">
          <ProgressBar percent={kpis.learningVelocity} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Your pace of completing learning objects across enrolled courses.
        </p>
      </section>
    </aside>
  );
}
