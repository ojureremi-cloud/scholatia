import type { VerificationLevel } from '@/types/identity';
import Badge from './Badge';
import { VERIFICATION_LEVEL_LABELS } from '@/types/identity';

const verificationStyles: Record<VerificationLevel, Parameters<typeof Badge>[0]['variant']> = {
  0: 'danger',
  1: 'info',
  2: 'info',
  3: 'success',
  4: 'success',
  5: 'success',
  6: 'success',
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
