import type { RoleType } from '@/types/identity';
import Badge from './Badge';

const roleVariants: Partial<Record<RoleType, Parameters<typeof Badge>[0]['variant']>> = {
  Student: 'info',
  Researcher: 'info',
  Lecturer: 'info',
  Professor: 'info',
  'Academic Staff': 'info',
  'University Administrator': 'danger',
  'Institution Administrator': 'danger',
  'Journal Editor': 'warning',
  Reviewer: 'warning',
  'Conference Organizer': 'info',
  Publisher: 'danger',
  'Funding Organisation': 'danger',
  'Professional Association': 'danger',
  'Government Agency': 'danger',
  'Research Institute': 'info',
  Academy: 'info',
  College: 'info',
  Polytechnic: 'info',
  University: 'info',
  Library: 'info',
  'Industry Partner': 'success',
  Employer: 'success',
  Recruiter: 'success',
  'System Administrator': 'danger',
  'Super Administrator': 'danger',
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
