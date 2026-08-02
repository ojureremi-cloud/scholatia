import Badge from '@/components/ui/Badge';
import { formatVisibility, formatVisibilityIcon, visibilityVariant } from './format';
import type { CollaborationWorkspaceVisibility } from '@/types/collaboration';

type WorkspaceVisibilityBadgeProps = {
  visibility: CollaborationWorkspaceVisibility;
};

export function WorkspaceVisibilityBadge({ visibility }: WorkspaceVisibilityBadgeProps) {
  return (
    <Badge variant={visibilityVariant(visibility)}>
      {formatVisibilityIcon(visibility)} {formatVisibility(visibility)}
    </Badge>
  );
}
