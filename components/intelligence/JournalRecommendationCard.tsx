import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatScore } from './format';
import type { JournalRecommendation } from '@/types/intelligence';

type JournalRecommendationCardProps = {
  recommendation: JournalRecommendation;
};

export default function JournalRecommendationCard({ recommendation }: JournalRecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {recommendation.discipline}
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
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
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impact</p>
          <p className="mt-1 font-semibold text-slate-800">
            {recommendation.impactFactor !== undefined ? recommendation.impactFactor.toFixed(1) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Quartile</p>
          <p className="mt-1 font-semibold text-slate-800">{recommendation.quartile ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Fit</p>
          <p className="mt-1 font-semibold text-sky-700">{formatScore(recommendation.fitScore)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{recommendation.openAccess}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{recommendation.reviewModel}</span>
        {recommendation.issn ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">ISSN {recommendation.issn}</span>
        ) : null}
      </div>
    </article>
  );
}
