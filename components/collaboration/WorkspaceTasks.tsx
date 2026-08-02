'use client';

import Badge from '@/components/ui/Badge';
import { formatDate, formatTaskPriority, formatTaskPriorityIcon, formatTaskStatus, formatTaskStatusIcon, priorityVariant, taskStatusVariant } from './format';
import { COLLABORATION_TASK_STATUSES } from '@/types/collaboration';
import type { CollaborationTaskStatus, CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceTasksProps = {
  workspace: CollaborationWorkspace;
  canEdit: boolean;
  onStatusChange: (taskId: string, status: CollaborationTaskStatus) => void;
};

export function WorkspaceTasks({ workspace, canEdit, onStatusChange }: WorkspaceTasksProps) {
  if (workspace.tasks.length === 0) {
    return <p className="text-sm text-slate-400">No tasks in this workspace yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={taskStatusVariant(task.status)}>
                  {formatTaskStatusIcon(task.status)} {formatTaskStatus(task.status)}
                </Badge>
                <Badge variant={priorityVariant(task.priority)}>
                  {formatTaskPriorityIcon(task.priority)} {formatTaskPriority(task.priority)}
                </Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
              {task.description && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {task.assigneeName ?? task.assignee ?? 'Unassigned'} · due {formatDate(task.dueDate)}
              </p>
            </div>
            {canEdit && (
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as CollaborationTaskStatus)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                {COLLABORATION_TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatTaskStatus(status)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
