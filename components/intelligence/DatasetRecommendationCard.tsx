import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatCompactNumber, formatScore } from './format';
import type { DatasetRecommendation } from '@/types/intelligence';

type DatasetRecommendationCardProps = {
  recommendation: DatasetRecommendation;
};

export default function DatasetRecommendationCard({ recommendation }: DatasetRecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          {recommendation.discipline}
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
        <a href={recommendation.url} className="transition hover:text-sky-700">
          {recommendation.title}
        </a>
      </h3>
      <p className="mt-1 text-xs font-medium text-slate-400">{recommendation.doi}</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Downloads</p>
          <p className="mt-1 font-semibold text-slate-800">{formatCompactNumber(recommendation.downloads)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Citations</p>
          <p className="mt-1 font-semibold text-slate-800">{formatCompactNumber(recommendation.citations)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Fit</p>
          <p className="mt-1 font-semibold text-sky-700">{formatScore(recommendation.score)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{recommendation.access}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{recommendation.institution}</span>
      </div>
    </article>
  );
}
