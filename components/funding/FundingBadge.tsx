'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';

type FundingBadgeProps = {
  status: string;
  className?: string;
};

const statusVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  open: 'success',
  upcoming: 'info',
  awarded: 'success',
  completed: 'default',
  active: 'success',
  'under-review': 'warning',
  'on-hold': 'warning',
  pending: 'warning',
  declined: 'danger',
  withdrawn: 'danger',
  terminated: 'danger',
  closed: 'default',
};

export default function FundingBadge({ status, className = '' }: FundingBadgeProps) {
  const variant = statusVariant[status] ?? 'default';
  return (
    <Badge variant={variant} className={className}>
      {status.replace(/-/g, ' ')}
    </Badge>
  );
}
