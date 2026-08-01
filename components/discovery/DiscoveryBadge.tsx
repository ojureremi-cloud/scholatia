'use client';

import React from 'react';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { DiscoveryEntityType } from '@/types/discovery';

type DiscoveryBadgeProps = {
  entityType: DiscoveryEntityType;
  className?: string;
};

const accentStyles: Record<DiscoveryEntityType, string> = {
  researcher: 'bg-violet-100 text-violet-700',
  journal: 'bg-sky-100 text-sky-700',
  conference: 'bg-amber-100 text-amber-700',
  institution: 'bg-emerald-100 text-emerald-700',
  publisher: 'bg-rose-100 text-rose-700',
  project: 'bg-indigo-100 text-indigo-700',
  publication: 'bg-cyan-100 text-cyan-700',
  dataset: 'bg-teal-100 text-teal-700',
  manuscript: 'bg-orange-100 text-orange-700',
  funding: 'bg-slate-100 text-slate-700',
};

export default function DiscoveryBadge({ entityType, className = '' }: DiscoveryBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        accentStyles[entityType],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-sm leading-none">{entityTypeIcon(entityType)}</span>
      {entityTypeLabel(entityType)}
    </span>
  );
}
