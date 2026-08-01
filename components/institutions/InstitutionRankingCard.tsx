'use client';

import React from 'react';
import type { InstitutionRanking } from '@/types/institution';

type InstitutionRankingCardProps = {
  rankings: InstitutionRanking[];
  className?: string;
};

export default function InstitutionRankingCard({ rankings, className = '' }: InstitutionRankingCardProps) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {rankings.map((ranking) => (
        <div key={ranking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{ranking.source}</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{ranking.year}</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            #{ranking.rank}
            {ranking.totalRanked ? (
              <span className="text-sm font-medium text-slate-500"> of {ranking.totalRanked}</span>
            ) : null}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{ranking.category}</p>
          {ranking.region ? <p className="mt-1 text-xs text-slate-500">Region: {ranking.region}</p> : null}
          {ranking.percentile !== undefined ? (
            <p className="mt-1 text-xs text-slate-500">Top {ranking.percentile}%</p>
          ) : null}
          {ranking.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{ranking.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
