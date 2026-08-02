import Badge from '@/components/ui/Badge';
import { formatKind, formatKindIcon, kindVariant } from './format';
import type { CollaborationWorkspaceKind } from '@/types/collaboration';

type WorkspaceBadgeProps = {
  kind: CollaborationWorkspaceKind;
  count?: number;
};

export function WorkspaceBadge({ kind, count }: WorkspaceBadgeProps) {
  return (
    <Badge variant={kindVariant(kind)}>
      {formatKindIcon(kind)} {formatKind(kind)}
      {typeof count === 'number' ? ` · ${count}` : ''}
    </Badge>
  );
}
