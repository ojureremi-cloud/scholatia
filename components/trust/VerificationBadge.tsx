import React from 'react';
import { StatusBadge } from './TrustBadge';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { TrustEntityType, TrustVerificationStatus } from '@/types/trust';

type VerificationBadgeProps = {
  entityType: TrustEntityType;
  status: TrustVerificationStatus;
  showLabel?: boolean;
};

export default function VerificationBadge({ entityType, status, showLabel = true }: VerificationBadgeProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        {entityTypeIcon(entityType)} {showLabel ? entityTypeLabel(entityType) : null}
      </span>
      <StatusBadge status={status} />
    </span>
  );
}
