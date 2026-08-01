import React from 'react';
import { formatCompactNumber, momentumArrow, momentumClass, momentumLabel } from './format';
import { entityTypeIcon } from '@/components/discovery';
import type { ResearchTrend } from '@/types/intelligence';

type ResearchTrendCardProps = {
  trend: ResearchTrend;
  featured?: boolean;
};

export default function ResearchTrendCard({ trend, featured = false }: ResearchTrendCardProps) {
  const momentumAbsolute = Math.min(100, Math.abs(trend.momentum));
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{trend.discipline}</span>
        <span className={['text-2xl font-bold', momentumClass(trend.momentum)].join(' ')}>
          {trend.momentum > 0 ? '+' : ''}
          {trend.momentum}
        </span>
      </div>
      <h3
        className={[
          'mt-3 font-semibold text-slate-900',
          featured ? 'text-2xl leading-8' : 'text-lg leading-7',
        ].join(' ')}
      >
        {trend.topic}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{trend.description}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {momentumArrow(trend.momentum)} {momentumLabel(trend.momentum)}
          </span>
          <span>
            {formatCompactNumber(trend.itemCount)} records · {formatCompactNumber(trend.recentCount)} recent
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-600"
            style={{ width: `${Math.max(4, momentumAbsolute)}%` }}
          />
        </div>
      </div>
      {trend.signalSources.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {trend.signalSources.map((source) => (
            <span key={source} title={source}>
              {entityTypeIcon(source)}
            </span>
          ))}
          <span className="ml-auto font-medium">{trend.growthRate >= 0 ? '+' : ''}{trend.growthRate}% growth</span>
        </div>
      ) : null}
    </article>
  );
}
