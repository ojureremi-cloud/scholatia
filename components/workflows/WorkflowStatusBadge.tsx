import { Badge } from '@/components/ui';
import type { WorkflowStatus } from '@/types/workflows';
import { formatStatus, formatStatusIcon, statusVariant } from './format';

type WorkflowStatusBadgeProps = {
  status: WorkflowStatus;
};

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  return (
    <Badge variant={statusVariant(status)}>
      {formatStatusIcon(status)} {formatStatus(status)}
    </Badge>
  );
}
