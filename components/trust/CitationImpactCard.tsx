import React from 'react';
import { formatCompactNumber, formatNumber, formatPercent } from './format';
import type { ResearchImpactScore } from '@/types/trust';

type CitationImpactCardProps = {
  impact: ResearchImpactScore;
};

export default function CitationImpactCard({ impact }: CitationImpactCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Research impact</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(impact.totalCitations)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Total citations</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-slate-900">h{impact.hIndex}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">h-index · i10 {impact.i10Index}</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-slate-900">{impact.percentile}th</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Percentile</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-slate-900">{impact.citationVelocity}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Citations / year</p>
        </div>
      </div>
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Field-weighted impact</span>
          <span className="font-semibold text-slate-800">{impact.fieldWeightedCitationImpact.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Composite impact score</span>
          <span className="font-semibold text-slate-800">{Math.round(impact.score)}/100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">12-month trend</span>
          <span className={impact.trend >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>
            {impact.trend >= 0 ? '↗' : '↘'} {formatPercent(Math.abs(impact.trend))}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">{formatNumber(impact.totalCitations)} citations in the citation index</p>
    </article>
  );
}
