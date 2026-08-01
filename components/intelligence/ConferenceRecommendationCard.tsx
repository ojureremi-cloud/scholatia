import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatDateLabel, formatScore } from './format';
import type { ConferenceRecommendation } from '@/types/intelligence';

type ConferenceRecommendationCardProps = {
  recommendation: ConferenceRecommendation;
};

export default function ConferenceRecommendationCard({ recommendation }: ConferenceRecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {recommendation.eventType}
        </span>
        <ConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
        <a href={recommendation.url} className="transition hover:text-sky-700">
          {recommendation.title}
        </a>
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {[recommendation.city, recommendation.country].filter(Boolean).join(', ')}
      </p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{recommendation.rationale}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Starts</p>
          <p className="mt-1 font-semibold text-slate-800">{formatDateLabel(recommendation.startDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Ends</p>
          <p className="mt-1 font-semibold text-slate-800">{formatDateLabel(recommendation.endDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Registration</p>
          <p className="mt-1 font-semibold text-slate-800">{recommendation.registrationStatus}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Submission</p>
          <p className="mt-1 font-semibold text-slate-800">{recommendation.submissionStatus}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{formatScore(recommendation.score)} fit</span>
        {recommendation.researchAreas.slice(0, 2).map((area) => (
          <span key={area} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
            {area}
          </span>
        ))}
      </div>
    </article>
  );
}
