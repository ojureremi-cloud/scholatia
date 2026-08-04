'use client';

import Badge from '@/components/ui/Badge';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { deadlineKindIcon, deadlineKindLabel, deadlineKindVariant, formatDate } from '../format';
import useLearning from '@/hooks/useLearning';

export function WorkspaceCalendar() {
  const { workspace } = useLearning();
  const deadlines = workspace().deadlines;

  if (deadlines.length === 0) {
    return <WorkspaceEmptyState title="No deadlines" description="Upcoming assessments and submissions will appear here." />;
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Upcoming deadlines
      </h2>
      <ul className="mt-5 space-y-4">
        {deadlines.map((deadline) => (
          <li key={deadline.id} className="flex items-start gap-3">
            <span aria-hidden="true" className="text-xl">
              {deadlineKindIcon(deadline.kind)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{deadline.title}</p>
              <time className="mt-0.5 block text-xs text-slate-400" dateTime={deadline.dueAt}>
                {formatDate(deadline.dueAt)}
              </time>
            </div>
            <Badge variant={deadlineKindVariant(deadline.kind)}>{deadlineKindLabel(deadline.kind)}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
