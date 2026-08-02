import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/tasks';
import { formatTaskStatus, formatTaskStatusIcon, taskStatusVariant } from './format';
import { Badge } from '@/components/ui';

type TaskBoardProps = {
  columns: { status: TaskStatus; tasks: Task[] }[];
};

export function TaskBoard({ columns }: TaskBoardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {columns.map((column) => (
        <div key={column.status} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {formatTaskStatusIcon(column.status)} {formatTaskStatus(column.status)}
            </span>
            <Badge variant={taskStatusVariant(column.status)}>{column.tasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.tasks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
                No tasks
              </p>
            ) : (
              column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskStatusColumns({ columns }: TaskBoardProps) {
  return <TaskBoard columns={columns} />;
}
