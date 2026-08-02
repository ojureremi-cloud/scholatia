import { formatLogEvent, formatRelative } from './format';
import type { WorkflowLogEntry } from '@/types/workflows';

type WorkflowTimelineProps = {
  log: WorkflowLogEntry[];
  limit?: number;
};

export function WorkflowTimeline({ log, limit }: WorkflowTimelineProps) {
  const entries = limit ? log.slice(0, limit) : log;
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">No activity recorded yet.</p>;
  }
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-6 dark:border-slate-700">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-sky-500 dark:border-slate-900" />
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {entry.message}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {entry.actorName ?? entry.actor} · {formatLogEvent(entry.type)} · {formatRelative(entry.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
