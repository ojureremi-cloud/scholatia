import { VerificationLevel } from '@/types/identity';
import Badge from './Badge';
import { VERIFICATION_LEVEL_LABELS } from '@/types/identity';

const verificationStyles: Record<VerificationLevel, Parameters<typeof Badge>[0]['variant']> = {
  [VerificationLevel.Unverified]: 'danger',
  [VerificationLevel.EmailVerified]: 'info',
  [VerificationLevel.IdentityVerified]: 'info',
  [VerificationLevel.InstitutionVerified]: 'success',
  [VerificationLevel.OrganisationVerified]: 'success',
  [VerificationLevel.ORCIDLinked]: 'success',
  [VerificationLevel.PublicationVerified]: 'success',
  [VerificationLevel.PeerReviewed]: 'success',
  [VerificationLevel.Trusted]: 'success',
  [VerificationLevel.VerifiedExpert]: 'success',
};

type VerificationBadgeProps = {
  level: VerificationLevel;
  className?: string;
};

export default function VerificationBadge({ level, className = '' }: VerificationBadgeProps) {
  return (
    <Badge variant={verificationStyles[level]} className={className}>
      {VERIFICATION_LEVEL_LABELS[level]}
    </Badge>
  );
}
