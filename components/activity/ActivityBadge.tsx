import Badge from '@/components/ui/Badge';
import { formatActivityType, formatActivityTypeIcon, typeVariant } from './format';
import type { ActivityType } from '@/types/activity';

type ActivityBadgeProps = {
  type: ActivityType;
  count?: number;
};

export function ActivityBadge({ type, count }: ActivityBadgeProps) {
  return (
    <Badge variant={typeVariant(type)}>
      {formatActivityTypeIcon(type)} {formatActivityType(type)}
      {typeof count === 'number' ? ` · ${count}` : ''}
    </Badge>
  );
}
