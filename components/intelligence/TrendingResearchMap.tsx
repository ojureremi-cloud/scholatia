import React from 'react';
import { momentumArrow, momentumClass } from './format';
import type { ResearchTrend } from '@/types/intelligence';

type TrendingResearchMapProps = {
  trends: ResearchTrend[];
};

export default function TrendingResearchMap({ trends }: TrendingResearchMapProps) {
  const disciplines = new Map<string, ResearchTrend[]>();
  trends.forEach((trend) => {
    const list = disciplines.get(trend.discipline) ?? [];
    list.push(trend);
    disciplines.set(trend.discipline, list);
  });
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from(disciplines.entries()).map(([discipline, list]) => (
        <div
          key={discipline}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{discipline}</p>
          <ul className="mt-4 space-y-3">
            {list.map((trend) => (
              <li key={trend.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-800">{trend.topic}</span>
                  <span className={['shrink-0 font-semibold', momentumClass(trend.momentum)].join(' ')}>
                    {momentumArrow(trend.momentum)} {trend.momentum > 0 ? '+' : ''}
                    {trend.momentum}
                  </span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={[
                      'h-full rounded-full',
                      trend.momentum > 25 ? 'bg-emerald-500' : trend.momentum < -25 ? 'bg-rose-400' : 'bg-slate-400',
                    ].join(' ')}
                    style={{ width: `${Math.max(4, Math.abs(trend.momentum))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
