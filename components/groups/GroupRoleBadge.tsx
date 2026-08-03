import Badge from '@/components/ui/Badge';
import { formatRole, formatRoleIcon, roleVariant } from './format';
import type { GroupRole } from '@/types/groups';

type GroupRoleBadgeProps = {
  role: GroupRole;
};

export function GroupRoleBadge({ role }: GroupRoleBadgeProps) {
  return (
    <Badge variant={roleVariant(role)}>
      {formatRoleIcon(role)} {formatRole(role)}
    </Badge>
  );
}
