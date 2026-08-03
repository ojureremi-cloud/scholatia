import Badge from '@/components/ui/Badge';
import { formatVisibility, formatVisibilityIcon, visibilityVariant } from './format';
import type { GroupVisibility } from '@/types/groups';

type GroupVisibilityBadgeProps = {
  visibility: GroupVisibility;
};

export function GroupVisibilityBadge({ visibility }: GroupVisibilityBadgeProps) {
  return (
    <Badge variant={visibilityVariant(visibility)}>
      {formatVisibilityIcon(visibility)} {formatVisibility(visibility)}
    </Badge>
  );
}
