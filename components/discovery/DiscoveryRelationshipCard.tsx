'use client';

import React from 'react';
import { entityTypeIcon, entityTypeLabel } from './format';
import type { DiscoveryRelationship } from '@/types/discovery';

type DiscoveryRelationshipCardProps = {
  relationships: DiscoveryRelationship[];
  className?: string;
};

export default function DiscoveryRelationshipCard({ relationships, className = '' }: DiscoveryRelationshipCardProps) {
  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {relationships.map((relationship) => (
        <div key={relationship.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="text-base">{entityTypeIcon(relationship.sourceType)}</span>
              <a href={`/discovery`} className="max-w-48 truncate transition hover:text-sky-700">
                {relationship.sourceTitle}
              </a>
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {relationship.relation}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="text-base">{entityTypeIcon(relationship.targetType)}</span>
              <a href={`/discovery`} className="max-w-48 truncate transition hover:text-sky-700">
                {relationship.targetTitle}
              </a>
            </span>
            <span className="ml-auto text-xs text-slate-400">
              {entityTypeLabel(relationship.sourceType)} → {entityTypeLabel(relationship.targetType)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Relationship weight</span>
            <div className="h-1.5 flex-1 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-sky-600" style={{ width: `${relationship.weight}%` }} />
            </div>
            <span className="font-semibold text-slate-600">{relationship.weight}/100</span>
          </div>
        </div>
      ))}
    </div>
  );
}
