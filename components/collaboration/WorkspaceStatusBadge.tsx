import Badge from '@/components/ui/Badge';
import { formatWorkspaceStatus, formatWorkspaceStatusIcon, statusVariant } from './format';
import type { CollaborationWorkspaceStatus } from '@/types/collaboration';

type WorkspaceStatusBadgeProps = {
  status: CollaborationWorkspaceStatus;
};

export function WorkspaceStatusBadge({ status }: WorkspaceStatusBadgeProps) {
  return (
    <Badge variant={statusVariant(status)}>
      {formatWorkspaceStatusIcon(status)} {formatWorkspaceStatus(status)}
    </Badge>
  );
}
