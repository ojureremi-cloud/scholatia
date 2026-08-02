import React from 'react';
import { RecommendationTypeBadge } from './ServiceBadge';
import { formatDate, formatNumber } from './format';
import type { ServiceRecommendation } from '@/types/services';

type RecommendationCardProps = {
  recommendation: ServiceRecommendation;
};

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RecommendationTypeBadge type={recommendation.type} />
        <span className="text-xs text-slate-400">{formatDate(recommendation.date)}</span>
      </div>

      <a href={recommendation.url} className="mt-4 font-semibold text-slate-900 hover:text-sky-700">
        {recommendation.title}
      </a>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{recommendation.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
          Score {recommendation.score}
        </span>
        <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-800">
          {recommendation.confidence} confidence
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
          {formatNumber(recommendation.reasons.length)} reasons
        </span>
      </div>

      {recommendation.reasons.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {recommendation.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {recommendation.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
