import type { OrchestrationTask } from '@/types/crie';
import { Chip } from '../primitives';
import { statusTone } from '../format';

type AgentTaskListProps = {
  tasks: OrchestrationTask[];
};

export function AgentTaskList({ tasks }: AgentTaskListProps) {
  if (tasks.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No tasks assigned.</p>;
  }
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{task.step}</p>
              <p className="mt-0.5 font-mono text-xs text-slate-400">{task.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Chip tone={statusTone(task.status)}>{task.status}</Chip>
              <Chip>{task.priority}</Chip>
            </div>
          </div>
          {task.dependencyIds.length > 0 ? (
            <p className="mt-2 text-xs text-slate-400">Depends on: <code className="font-mono">{task.dependencyIds.join(', ')}</code></p>
          ) : null}
          {task.requiresApproval ? (
            <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">✋ Requires researcher approval before execution</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
