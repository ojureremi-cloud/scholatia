import Badge from '@/components/ui/Badge';
import { verificationVariant } from './format';
import type { InstitutionVerificationStatus } from '@/types/identity';

type GroupVerificationBadgeProps = {
  status: InstitutionVerificationStatus;
};

export function GroupVerificationBadge({ status }: GroupVerificationBadgeProps) {
  return (
    <Badge variant={verificationVariant(status)}>🛡️ {status}</Badge>
  );
}
