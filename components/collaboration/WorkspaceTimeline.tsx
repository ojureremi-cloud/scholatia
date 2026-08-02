import { formatRelative } from './format';
import type { WorkspaceLogEntry } from '@/types/collaboration';

type WorkspaceTimelineProps = {
  log: WorkspaceLogEntry[];
};

export function WorkspaceTimeline({ log }: WorkspaceTimelineProps) {
  if (log.length === 0) {
    return <p className="text-sm text-slate-400">No workspace activity yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
      {log.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-sky-400 bg-white text-[10px] dark:bg-slate-900">
            {entry.type === 'created' ? '🌟' : entry.type === 'member-added' ? '👥' : entry.type === 'member-removed' ? '🚪' : entry.type === 'task-created' ? '➕' : entry.type === 'task-completed' ? '✅' : entry.type === 'document-published' ? '📄' : entry.type === 'milestone-achieved' ? '🏁' : entry.type === 'meeting-scheduled' ? '📅' : entry.type === 'discussion-opened' ? '💬' : '✉️'}
          </span>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">
                {entry.type.replace(/-/g, ' ')}
              </span>
              <span className="text-xs text-slate-400">
                {entry.actorName ?? entry.actor} · {formatRelative(entry.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.message}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
