import React from 'react';
import { ConfidenceBadge, ScorePill } from './TrustBadge';
import { formatDateLabel } from './format';
import type { SuggestedGrant } from '@/types/trust';

type GrantSuggestionCardProps = {
  recommendation: SuggestedGrant;
};

export default function GrantSuggestionCard({ recommendation }: GrantSuggestionCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-7 text-slate-900">{recommendation.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{recommendation.funder}</p>
        </div>
        <ScorePill score={recommendation.matchScore} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendation.reasons.map((reason) => (
          <span key={reason} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {reason}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
        {recommendation.amount ? (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Typical amount</span>
            <span className="font-semibold text-slate-800">{recommendation.amount}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Career stage</span>
          <span className="font-semibold text-slate-800">{recommendation.careerStage}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Deadline</span>
          <span className="font-semibold text-slate-800">{formatDateLabel(recommendation.deadline)}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
    </article>
  );
}
