import React from 'react';
import { GradeBadge } from './TrustBadge';
import { formatScore } from './format';
import type { TrustScoreBreakdown } from '@/types/trust';

type TrustScoreCardProps = {
  breakdown: TrustScoreBreakdown;
  featured?: boolean;
};

export default function TrustScoreCard({ breakdown, featured = false }: TrustScoreCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Scholatia Trust Score</p>
          <p className={['mt-2 font-semibold text-slate-900', featured ? 'text-6xl' : 'text-5xl'].join(' ')}>
            {formatScore(breakdown.overall)}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">{breakdown.status}</p>
        </div>
        <GradeBadge grade={breakdown.grade} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{breakdown.summary}</p>
      <div className="mt-5 space-y-3">
        {breakdown.factors.map((factor) => (
          <div key={factor.id}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-700">{factor.label}</span>
              <span className="text-slate-500">{Math.round(factor.score)}/100</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-600"
                style={{ width: `${factor.score}%` }}
              />
            </div>
            {factor.description ? <p className="mt-1 text-xs text-slate-500">{factor.description}</p> : null}
          </div>
        ))}
      </div>
    </article>
  );
}
