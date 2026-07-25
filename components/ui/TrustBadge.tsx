import Badge from './Badge';

type TrustBadgeProps = {
  score?: number;
  className?: string;
};

export default function TrustBadge({ score, className = '' }: TrustBadgeProps) {
  const label = typeof score === 'number' ? `Trust Score ${score}` : 'Trust score pending';
  const variant = typeof score === 'number' ? (score >= 80 ? 'success' : score >= 50 ? 'info' : 'warning') : 'default';

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
