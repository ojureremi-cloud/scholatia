'use client';

import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatRelative, historyEventVariant, historyEventTypeLabel, workflowKindLabel, workflowKindVariant } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningHistoryEventType, LearningWorkflowKind } from '@/types/learning';

export function WorkspaceActivity() {
  const { workspace } = useLearning();
  const entries = workspace().recentActivity;

  if (entries.length === 0) {
    return <WorkspaceEmptyState title="No recent activity" description="Your recent learning activity will appear here." />;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Recent activity
      </h2>
      <ol className="mt-5 space-y-4">
        {entries.map((entry) => {
          const isWorkflow = entry.source === 'workflow';
          const label = isWorkflow
            ? workflowKindLabel(entry.kind as LearningWorkflowKind)
            : historyEventTypeLabel(entry.kind as LearningHistoryEventType);
          const variant = isWorkflow
            ? workflowKindVariant(entry.kind as LearningWorkflowKind)
            : historyEventVariant(entry.kind as LearningHistoryEventType);
          return (
            <li key={entry.id} className="flex items-start gap-3">
              <span
                className={[
                  'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                  variant === 'success'
                    ? 'bg-emerald-400'
                    : variant === 'danger'
                      ? 'bg-rose-400'
                      : variant === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-sky-400',
                ].join(' ')}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{entry.detail}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {label} · {formatRelative(entry.occurredAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
