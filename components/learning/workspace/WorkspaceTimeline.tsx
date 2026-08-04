'use client';

import Badge from '@/components/ui/Badge';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { formatRelative, historyEventVariant, historyEventTypeLabel, workflowKindLabel, workflowKindVariant } from '../format';
import useLearning from '@/hooks/useLearning';
import type { LearningHistoryEventType, LearningWorkflowKind } from '@/types/learning';

export function WorkspaceTimeline() {
  const { timeline } = useLearning();
  const entries = timeline();

  if (entries.length === 0) {
    return <WorkspaceEmptyState title="No activity yet" description="Your learning timeline will fill in as you learn." />;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Full timeline
      </h2>
      <ol className="mt-6 space-y-6">
        {entries.map((entry) => {
          const isWorkflow = entry.source === 'workflow';
          const variant = isWorkflow
            ? workflowKindVariant(entry.kind as LearningWorkflowKind)
            : historyEventVariant(entry.kind as LearningHistoryEventType);
          const label = isWorkflow
            ? workflowKindLabel(entry.kind as LearningWorkflowKind)
            : historyEventTypeLabel(entry.kind as LearningHistoryEventType);
          return (
            <li key={entry.id} className="relative flex gap-4">
              <span
                className="mt-1 flex h-3 w-3 shrink-0 rounded-full bg-sky-400 ring-4 ring-sky-100 dark:ring-sky-900/40"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={variant}>{label}</Badge>
                  <time className="text-xs text-slate-400" dateTime={entry.occurredAt}>
                    {formatRelative(entry.occurredAt)}
                  </time>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{entry.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
