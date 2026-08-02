import { Badge } from '@/components/ui';
import type { TaskPriority, TaskStatus } from '@/types/tasks';
import { formatTaskPriority, formatTaskPriorityIcon, formatTaskStatus, formatTaskStatusIcon, taskPriorityVariant, taskStatusVariant } from './format';

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant={taskStatusVariant(status)}>
      {formatTaskStatusIcon(status)} {formatTaskStatus(status)}
    </Badge>
  );
}

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <Badge variant={taskPriorityVariant(priority)}>
      {formatTaskPriorityIcon(priority)} {formatTaskPriority(priority)}
    </Badge>
  );
}
