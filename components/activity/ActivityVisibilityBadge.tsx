import Badge from '@/components/ui/Badge';
import { formatActivityVisibility, formatActivityVisibilityIcon, visibilityVariant } from './format';
import type { ActivityVisibility } from '@/types/activity';

type ActivityVisibilityBadgeProps = {
  visibility: ActivityVisibility;
};

export function ActivityVisibilityBadge({ visibility }: ActivityVisibilityBadgeProps) {
  return (
    <Badge variant={visibilityVariant(visibility)}>
      {formatActivityVisibilityIcon(visibility)} {formatActivityVisibility(visibility)}
    </Badge>
  );
}
