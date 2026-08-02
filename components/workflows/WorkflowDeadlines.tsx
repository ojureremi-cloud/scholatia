import { Badge } from '@/components/ui';
import { deadlineVariant, formatDate, formatDeadlineStatus } from './format';
import type { WorkflowDeadline } from '@/types/workflows';

type WorkflowDeadlinesProps = {
  deadlines: WorkflowDeadline[];
};

export function WorkflowDeadlines({ deadlines }: WorkflowDeadlinesProps) {
  if (deadlines.length === 0) {
    return <p className="text-sm text-slate-400">No deadlines defined for this workflow.</p>;
  }
  return (
    <ul className="space-y-3">
      {deadlines.map((deadline) => {
        const due = deadline.extendedTo ?? deadline.dueAt;
        return (
          <li key={deadline.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{deadline.title}</p>
              <p className="text-xs text-slate-400">
                Due {formatDate(due)}
                {deadline.extendedTo ? <> <span className="font-semibold text-amber-600">(extended from {formatDate(deadline.dueAt)})</span></> : null}
              </p>
              {deadline.gracePeriodDays ? (
                <p className="mt-1 text-xs text-slate-400">{deadline.gracePeriodDays} day grace period</p>
              ) : null}
            </div>
            <Badge variant={deadlineVariant(deadline.status)}>{formatDeadlineStatus(deadline.status)}</Badge>
          </li>
        );
      })}
    </ul>
  );
}
