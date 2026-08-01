import React from 'react';
import { formatDate, formatRecommendationType } from './format';
import type { MarketplaceRecommendation } from '@/types/marketplace';

type RecommendationCardProps = {
  recommendation: MarketplaceRecommendation;
  featured?: boolean;
};

const confidenceLabels: Record<string, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

export default function RecommendationCard({ recommendation, featured = false }: RecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
          {formatRecommendationType(recommendation.type)}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
            {recommendation.score}
          </span>
          <span className="text-xs text-slate-400">{confidenceLabels[recommendation.confidence] ?? recommendation.confidence}</span>
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{recommendation.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{recommendation.summary}</p>

      <ul className="mt-3 space-y-1 text-xs text-slate-500">
        {recommendation.reasons.slice(0, 3).map((reason) => (
          <li key={reason}>· {reason}</li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {recommendation.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {recommendation.audience ? <span>For {recommendation.audience}</span> : <span>Personalised</span>}
        <span>{formatDate(recommendation.date)}</span>
      </div>

      {featured ? (
        <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <a href={recommendation.url}>Open recommendation</a>
        </div>
      ) : null}
    </article>
  );
}
