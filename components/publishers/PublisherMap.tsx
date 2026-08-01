'use client';

import React from 'react';
import type { Publisher } from '@/types/publisher';

type PublisherMapProps = {
  publishers: Publisher[];
  className?: string;
};

const continentEmoji: Record<string, string> = {
  Africa: '🌍',
  Asia: '🌏',
  Europe: '🌍',
  'North America': '🌎',
  'South America': '🌎',
  Oceania: '🌏',
  Global: '🌐',
};

export default function PublisherMap({ publishers, className = '' }: PublisherMapProps) {
  const continents = Array.from(new Set(publishers.map((publisher) => publisher.continent)));
  const distribution = continents
    .map((continent) => ({
      continent,
      count: publishers.filter((publisher) => publisher.continent === continent).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...distribution.map((stat) => stat.count));
  const totalCount = publishers.length;
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Global publishing</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Publishers by continent</h3>
      <ul className="mt-5 space-y-5">
        {distribution.map((stat) => (
          <li key={stat.continent}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">
                {continentEmoji[stat.continent] ?? '•'} {stat.continent}
              </span>
              <span className="font-semibold text-slate-900">{stat.count} publishers</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxCount) * 100))}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
        {totalCount} publishers across {distribution.length} continents
      </p>
    </div>
  );
}
