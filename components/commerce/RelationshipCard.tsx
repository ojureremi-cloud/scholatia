import React from 'react';
import { RelationshipKindBadge } from './CommerceBadge';
import type { CommerceRelationship } from '@/types/commerce';

type RelationshipCardProps = {
  relationship: CommerceRelationship;
};

export default function RelationshipCard({ relationship }: RelationshipCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{relationship.description}</p>
        <RelationshipKindBadge kind={relationship.kind} />
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs">
        <span className="rounded-xl bg-slate-900 px-3 py-1.5 font-medium text-white">
          {relationship.fromEntity} · {relationship.fromId}
        </span>
        <span className="text-slate-400">→</span>
        <span className="rounded-xl bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
          {relationship.toEntity} · {relationship.toId}
        </span>
      </div>
    </article>
  );
}
