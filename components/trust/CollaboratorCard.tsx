import React from 'react';
import { ConfidenceBadge, ScorePill } from './TrustBadge';
import { formatCompactNumber } from './format';
import type { RecommendedCollaborator } from '@/types/trust';

type CollaboratorCardProps = {
  recommendation: RecommendedCollaborator;
};

export default function CollaboratorCard({ recommendation }: CollaboratorCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-7 text-slate-900">{recommendation.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{recommendation.discipline}</p>
        </div>
        <ScorePill score={recommendation.trustScore} />
      </div>
      <p className="mt-1 text-xs font-medium text-slate-400">{recommendation.institution}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendation.sharedInterests.map((interest) => (
          <span key={interest} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {interest}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
        <span className="text-slate-500">
          h{recommendation.hIndex} · {formatCompactNumber(recommendation.citations)} citations
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
    </article>
  );
}
