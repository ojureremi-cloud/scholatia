import React from 'react';
import { ObjectiveBadge } from './AdsBadge';
import { formatCompactNumber, formatCurrency, formatDate, formatObjectiveLabel, formatPricingModel } from './format';
import type { AdAudience, AdForecast } from '@/types/ads';

type ForecastCardProps = {
  forecast: AdForecast;
  audience?: AdAudience;
};

export default function ForecastCard({ forecast, audience }: ForecastCardProps) {
  const confidenceClass =
    forecast.confidence === 'high'
      ? 'bg-emerald-100 text-emerald-800'
      : forecast.confidence === 'medium'
        ? 'bg-sky-100 text-sky-800'
        : 'bg-amber-100 text-amber-800';

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ObjectiveBadge objective={forecast.objective} />
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${confidenceClass}`}>
          {forecast.confidence} confidence
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
        AI forecast — {formatObjectiveLabel(forecast.objective)}
      </h3>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {formatPricingModel(forecast.recommendedPricingModel)} ·{' '}
        {formatCurrency(forecast.recommendedBudget.amount, forecast.recommendedBudget.currency)} over{' '}
        {forecast.recommendedDurationDays} days
      </p>
      {audience ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">🎯 {audience.name}</p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-slate-600">🎯 {forecast.recommendedAudienceId}</p>
      )}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Quality</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{forecast.campaignQualityScore}/100</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Relevance</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{forecast.adRelevanceScore}/100</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">ROI</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{Math.round(forecast.estimatedRoi)}%</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Reach</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(forecast.expectedReach)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impressions</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(forecast.expectedImpressions)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clicks</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(forecast.expectedClicks)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">CTR</p>
          <p className="mt-1 font-semibold text-slate-900">{forecast.expectedCtr}%</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">CPA</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCurrency(forecast.expectedCpa, forecast.recommendedBudget.currency)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Conversions</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(forecast.expectedConversions)}</p>
        </div>
      </div>
      <div className="mt-4 flex-1 space-y-1.5">
        {forecast.rationale.map((point) => (
          <p key={point} className="text-xs leading-5 text-slate-500">
            · {point}
          </p>
        ))}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">Forecasted {formatDate(forecast.date)}</p>
    </article>
  );
}
