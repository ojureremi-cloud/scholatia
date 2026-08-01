'use client';

import React from 'react';
import { formatCompactNumber } from './format';
import type { PublisherAnalytics as PublisherAnalyticsData } from '@/types/publisher';

type PublisherAnalyticsProps = {
  analytics: PublisherAnalyticsData;
  className?: string;
};

export default function PublisherAnalytics({ analytics, className = '' }: PublisherAnalyticsProps) {
  const maxTypeCount = Math.max(1, ...analytics.publishersByType.map((stat) => stat.count));
  const maxContinentCount = Math.max(1, ...analytics.publishersByContinent.map((stat) => stat.count));
  const maxDivisionCount = Math.max(1, ...analytics.outputByDivision.map((stat) => stat.count));
  return (
    <div className={['grid gap-6 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Outcomes</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.averageTrustScore}/100</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Average trust</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.openAccessShare}%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Open access publishers</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{formatCompactNumber(analytics.totalArticlesPublished)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Articles published</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{formatCompactNumber(analytics.totalDownloads)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Downloads</p>
          </div>
        </div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
          {analytics.totalCitations.toLocaleString('en-US')} citations across the portfolio
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Publishers by type</p>
        <ul className="mt-4 space-y-3">
          {analytics.publishersByType.map((stat) => (
            <li key={stat.type}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{stat.type.replace(/-/g, ' ')}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxTypeCount) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Publishers by continent</p>
        <ul className="mt-4 space-y-3">
          {analytics.publishersByContinent.map((stat) => (
            <li key={stat.continent}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{stat.continent}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxContinentCount) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">Editorial offices: {analytics.totalEditorialOffices}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Output by division</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analytics.outputByDivision.map((stat) => (
            <div key={stat.division}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{stat.division}</span>
                <span className="font-semibold text-slate-900">{stat.count.toLocaleString('en-US')}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxDivisionCount) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
