import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatCurrency, formatDateLabel, formatScore } from './format';
import type { FundingRecommendation } from '@/types/intelligence';

type FundingRecommendationCardProps = {
  recommendation: FundingRecommendation;
};

export default function FundingRecommendationCard({ recommendation }: FundingRecommendationCardProps) {
  const maxBreakdown = Math.max(1, ...recommendation.matchBreakdown.map((entry) => entry.score));
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {recommendation.agencyName}
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
        <a href={recommendation.url} className="transition hover:text-sky-700">
          {recommendation.title}
        </a>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[recommendation.category, recommendation.grantType, recommendation.careerStage]
          .filter(Boolean)
          .map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {tag}
            </span>
          ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Funding</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatCurrency(recommendation.amountTypical, recommendation.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Deadline</p>
          <p className="mt-1 font-semibold text-slate-800">{formatDateLabel(recommendation.deadline)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Duration</p>
          <p className="mt-1 font-semibold text-slate-800">{recommendation.durationMonths} months</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Match</p>
          <p className="mt-1 font-semibold text-sky-700">{formatScore(recommendation.score)}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {recommendation.matchBreakdown.map((entry) => (
          <div key={entry.criterion}>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{entry.criterion}</span>
              <span className="font-semibold">{formatScore(entry.score)}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-600"
                style={{ width: `${(entry.score / maxBreakdown) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {recommendation.eligibility.map((item) => (
          <span key={item} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
            {item}
          </span>
        ))}
        <span className="ml-auto">{formatDateLabel(recommendation.date)}</span>
      </div>
    </article>
  );
}
