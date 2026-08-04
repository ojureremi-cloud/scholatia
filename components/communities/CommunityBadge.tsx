import Badge from '@/components/ui/Badge';
import { categoryVariant, formatCategory, formatCategoryIcon } from './format';
import type { CommunityCategory } from '@/types/communities';

type CommunityBadgeProps = {
  category: CommunityCategory;
  count?: number;
};

export function CommunityBadge({ category, count }: CommunityBadgeProps) {
  return (
    <Badge variant={categoryVariant(category)}>
      {formatCategoryIcon(category)} {formatCategory(category)}
      {typeof count === 'number' ? ` · ${count}` : ''}
    </Badge>
  );
}
