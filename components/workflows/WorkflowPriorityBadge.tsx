import { Badge } from '@/components/ui';
import type { WorkflowPriority } from '@/types/workflows';
import { formatPriority, formatPriorityIcon, priorityVariant } from './format';

type WorkflowPriorityBadgeProps = {
  priority: WorkflowPriority;
};

export function WorkflowPriorityBadge({ priority }: WorkflowPriorityBadgeProps) {
  return (
    <Badge variant={priorityVariant(priority)}>
      {formatPriorityIcon(priority)} {formatPriority(priority)}
    </Badge>
  );
}
