'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';

type PublisherBadgeProps = {
  status: string;
  className?: string;
};

const statusVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  Verified: 'success',
  Trusted: 'info',
  Pending: 'warning',
};

export default function PublisherBadge({ status, className = '' }: PublisherBadgeProps) {
  const variant = statusVariant[status] ?? 'default';
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
