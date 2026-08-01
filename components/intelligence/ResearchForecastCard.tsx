import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import type { ResearchForecast } from '@/types/intelligence';

type ResearchForecastCardProps = {
  forecast: ResearchForecast;
};

export default function ResearchForecastCard({ forecast }: ResearchForecastCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{forecast.discipline}</span>
        <ConfidenceBadge confidence={forecast.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{forecast.topic}</h3>
      <p className="mt-1 text-xs font-medium text-slate-400">{forecast.horizonMonths}-month horizon</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{forecast.rationale}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Projected growth</p>
          <p className="mt-1 text-2xl font-semibold text-sky-700">+{forecast.projectedGrowth}%</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Scenarios</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{forecast.scenarios.length}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {forecast.scenarios.map((scenario) => (
          <div key={scenario.label}>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{scenario.label}</span>
              <span>
                {scenario.probability}% · {scenario.growth >= 0 ? '+' : ''}
                {scenario.growth}% growth
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-sky-600" style={{ width: `${scenario.probability}%` }} />
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">{scenario.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
