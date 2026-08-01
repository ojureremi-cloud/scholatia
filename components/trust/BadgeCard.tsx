import React from 'react';
import { TierBadge } from './TrustBadge';
import { entityTypeLabel } from './format';
import type { BadgeDefinition } from '@/types/trust';

type BadgeCardProps = {
  definition: BadgeDefinition;
};

function badgeAudience(entityType: BadgeDefinition['entityType']): string {
  if (!entityType) return 'Any entity';
  if (entityType === 'vendor') return 'Vendor';
  if (entityType === 'any') return 'Any entity';
  return entityTypeLabel(entityType);
}

export default function BadgeCard({ definition }: BadgeCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {definition.icon}
        </span>
        <TierBadge tier={definition.tier} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{definition.name}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">{badgeAudience(definition.entityType)}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{definition.description}</p>
      <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
        {definition.criteria.map((criterion) => (
          <li key={criterion} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-0.5 text-emerald-600">✓</span>
            {criterion}
          </li>
        ))}
      </ul>
    </article>
  );
}
