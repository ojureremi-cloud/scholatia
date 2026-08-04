import Badge from '@/components/ui/Badge';
import { formatVisibility, formatVisibilityIcon, visibilityVariant } from './format';
import type { CommunityVisibility } from '@/types/communities';

type CommunityVisibilityBadgeProps = {
  visibility: CommunityVisibility;
};

export function CommunityVisibilityBadge({ visibility }: CommunityVisibilityBadgeProps) {
  return (
    <Badge variant={visibilityVariant(visibility)}>
      {formatVisibilityIcon(visibility)} {formatVisibility(visibility)}
    </Badge>
  );
}
