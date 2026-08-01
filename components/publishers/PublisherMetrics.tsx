'use client';

import React from 'react';
import { formatCompactNumber } from './format';
import type { PublishingMetrics } from '@/types/publisher';

type PublisherMetricsProps = {
  metrics: PublishingMetrics;
  className?: string;
};

export default function PublisherMetrics({ metrics, className = '' }: PublisherMetricsProps) {
  const tiles = [
    { label: 'Journals', value: metrics.journals.toLocaleString('en-US'), icon: '📄' },
    { label: 'Conferences', value: metrics.conferences.toLocaleString('en-US'), icon: '🎤' },
    { label: 'Proceedings', value: metrics.proceedings.toLocaleString('en-US'), icon: '📋' },
    { label: 'Book series', value: metrics.bookSeries.toString(), icon: '🔖' },
    { label: 'Books', value: metrics.books.toLocaleString('en-US'), icon: '📚' },
    { label: 'Editorial offices', value: metrics.editorialOffices.toString(), icon: '🏢' },
    { label: 'Articles published', value: formatCompactNumber(metrics.articlesPublished), icon: '✍️' },
    { label: 'Citations', value: formatCompactNumber(metrics.citations), icon: '🔗' },
    { label: 'Downloads', value: formatCompactNumber(metrics.downloads), icon: '⬇️' },
    { label: 'Open access share', value: `${metrics.openAccessShare}%`, icon: '🔓' },
    { label: 'Acceptance rate', value: metrics.acceptanceRate !== undefined ? `${metrics.acceptanceRate}%` : '—', icon: '📊' },
    { label: 'Countries served', value: metrics.countriesServed.toString(), icon: '🌍' },
  ];

  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className].filter(Boolean).join(' ')}>
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-xl">{tile.icon}</span>
          <p className="mt-2 text-xl font-semibold text-slate-900">{tile.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}
