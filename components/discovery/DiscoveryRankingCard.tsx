'use client';

import React from 'react';
import DiscoveryBadge from './DiscoveryBadge';
import { formatCompactNumber, formatYear } from './format';
import type { DiscoveryRanking } from '@/types/discovery';

type DiscoveryRankingCardProps = {
  ranking: DiscoveryRanking;
  rankOffset?: number;
  className?: string;
};

export default function DiscoveryRankingCard({ ranking, rankOffset = 0, className = '' }: DiscoveryRankingCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{ranking.label}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{ranking.basis}</span>
      </div>
      {ranking.metric ? <p className="mt-1 text-xs text-slate-400">Ranked by {ranking.metric}</p> : null}
      <ol className="mt-5 space-y-3">
        {ranking.items.slice(0, 5).map((item, index) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {rankOffset + index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                <a href={item.url} className="transition hover:text-sky-700">
                  {item.title}
                </a>
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <DiscoveryBadge entityType={item.entityType} />
                <span className="text-xs text-slate-400">{formatYear(item.year)}</span>
                {item.country ? <span className="text-xs text-slate-400">{item.country}</span> : null}
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-slate-400">
              {formatCompactNumber(item.score)} pts
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
