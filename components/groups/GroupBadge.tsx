import Badge from '@/components/ui/Badge';
import { categoryVariant, formatCategory, formatCategoryIcon } from './format';
import type { GroupCategory } from '@/types/groups';

type GroupBadgeProps = {
  category: GroupCategory;
  count?: number;
};

export function GroupBadge({ category, count }: GroupBadgeProps) {
  return (
    <Badge variant={categoryVariant(category)}>
      {formatCategoryIcon(category)} {formatCategory(category)}
      {typeof count === 'number' ? ` · ${count}` : ''}
    </Badge>
  );
}
