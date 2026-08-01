import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatDateLabel, formatScore } from './format';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import type { Recommendation } from '@/types/intelligence';

type RecommendationCardProps = {
  recommendation: Recommendation;
  featured?: boolean;
};

export default function RecommendationCard({ recommendation, featured = false }: RecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {entityTypeIcon(recommendation.entityType)} {entityTypeLabel(recommendation.entityType)}
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <h3
        className={[
          'mt-3 font-semibold text-slate-900',
          featured ? 'text-2xl leading-8' : 'text-lg leading-7',
        ].join(' ')}
      >
        <a href={recommendation.url} className="transition hover:text-sky-700">
          {recommendation.title}
        </a>
      </h3>
      {recommendation.audience ? (
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          For {recommendation.audience}
        </p>
      ) : null}
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      {recommendation.reasons.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {recommendation.reasons.map((reason) => (
            <span key={reason} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {reason}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{formatScore(recommendation.score)} fit</span>
        <span>{formatDateLabel(recommendation.date)}</span>
      </div>
    </article>
  );
}
