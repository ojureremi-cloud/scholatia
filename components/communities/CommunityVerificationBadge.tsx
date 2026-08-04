import Badge from '@/components/ui/Badge';
import { verificationVariant } from './format';
import type { InstitutionVerificationStatus } from '@/types/identity';

type CommunityVerificationBadgeProps = {
  status: InstitutionVerificationStatus;
};

export function CommunityVerificationBadge({ status }: CommunityVerificationBadgeProps) {
  return (
    <Badge variant={verificationVariant(status)}>🛡️ {status}</Badge>
  );
}
