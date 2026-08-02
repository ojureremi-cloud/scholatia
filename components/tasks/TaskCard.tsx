import { TaskPriorityBadge, TaskStatusBadge } from './TaskStatusBadge';
import { formatDate, formatRelative } from './format';
import { taskProgress } from '@/lib/tasks';
import type { Task } from '@/types/tasks';

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const progress = taskProgress(task);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TaskPriorityBadge priority={task.priority} />
        {task.workflowId && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
            🧩 Workflow
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{task.assigneeName ?? task.assignee ?? 'Unassigned'}</span>
        <span>{formatRelative(task.createdAt)}</span>
      </div>

      {task.dueDate && (
        <p className="mt-1 text-xs font-semibold text-slate-400">📅 Due {formatDate(task.dueDate)}</p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}
