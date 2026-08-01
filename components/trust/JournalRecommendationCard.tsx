import React from 'react';
import { ConfidenceBadge, ScorePill } from './TrustBadge';
import type { JournalFitRecommendation } from '@/types/trust';

type JournalRecommendationCardProps = {
  recommendation: JournalFitRecommendation;
};

export default function JournalRecommendationCard({ recommendation }: JournalRecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-7 text-slate-900">{recommendation.journalName}</h3>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {recommendation.impactFactor ? `IF ${recommendation.impactFactor} · ` : ''}
            {recommendation.quartile ?? 'Unranked'} · {recommendation.openAccess} · {recommendation.reviewModel}
          </p>
        </div>
        <ScorePill score={recommendation.fitScore} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendation.reasons.map((reason) => (
          <span key={reason} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {reason}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
        <span className="text-slate-500">{recommendation.fitScore}/100 fit</span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
    </article>
  );
}
