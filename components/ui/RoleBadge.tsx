import type { RoleType } from '@/types/identity';
import Badge from './Badge';

const roleVariants: Record<RoleType, Parameters<typeof Badge>[0]['variant']> = {
  Student: 'info',
  Researcher: 'info',
  Lecturer: 'info',
  Professor: 'info',
  Reviewer: 'warning',
  Editor: 'warning',
  Author: 'success',
  Mentor: 'success',
  'Conference Participant': 'info',
  'Institution Administrator': 'danger',
  'Journal Administrator': 'danger',
  Publisher: 'danger',
  'Funding Organisation Administrator': 'danger',
  'Professional Association Administrator': 'danger',
};

type RoleBadgeProps = {
  role: RoleType;
  className?: string;
};

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  return (
    <Badge variant={roleVariants[role] ?? 'default'} className={className}>
      {role}
    </Badge>
  );
}
