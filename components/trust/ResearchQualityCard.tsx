import React from 'react';
import { ScorePill } from './TrustBadge';
import { formatCompactNumber, formatPercent } from './format';
import type { JournalQualityIndex } from '@/types/trust';

type ResearchQualityCardProps = {
  quality: JournalQualityIndex;
};

export default function ResearchQualityCard({ quality }: ResearchQualityCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Journal Quality Index</p>
        <ScorePill score={quality.qualityIndex} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{quality.name}</h3>
      <p className="mt-1 text-xs font-medium text-slate-400">
        {quality.quartile ? `${quality.quartile} quartile · ` : ''}
        {quality.impactFactor ? `IF ${quality.impactFactor}` : 'No impact factor'} · h-index {quality.hIndex}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(100 - quality.rejectionRate)}</p>
          <p className="text-xs text-slate-500">Acceptance rate</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{quality.avgDaysToFirstDecision}d</p>
          <p className="text-xs text-slate-500">First decision</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatCompactNumber(quality.totalCitations)}</p>
          <p className="text-xs text-slate-500">Total citations</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{Math.round(quality.trustScore)}/100</p>
          <p className="text-xs text-slate-500">Trust score</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quality.indexingServices.slice(0, 4).map((service) => (
          <span key={service} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {service}
          </span>
        ))}
      </div>
    </article>
  );
}
