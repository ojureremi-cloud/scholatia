'use client';

import React from 'react';
import { formatCompactNumber } from './format';
import type { DiscoveryAnalytics } from '@/types/discovery';

type DiscoveryAnalyticsProps = {
  analytics: DiscoveryAnalytics;
  className?: string;
};

export default function DiscoveryAnalytics({ analytics, className = '' }: DiscoveryAnalyticsProps) {
  const maxCategory = Math.max(1, ...analytics.itemsByCategory.map((stat) => stat.count));
  const maxDiscipline = Math.max(1, ...analytics.itemsByDiscipline.map((stat) => stat.count));
  const maxKeyword = Math.max(1, ...analytics.topKeywords.map((stat) => stat.count));

  return (
    <div className={['grid gap-6 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Search activity</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(analytics.searches)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Searches</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(analytics.uniqueSearches)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Unique queries</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.clickThroughRate}%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Click-through</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.averageRelevance}/100</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Avg relevance</p>
          </div>
        </div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
          {analytics.totalItems.toLocaleString('en-US')} items across {analytics.totalCategories} categories
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Items by category</p>
        <ul className="mt-4 space-y-3">
          {analytics.itemsByCategory.map((stat) => (
            <li key={stat.entityType}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-slate-700">{stat.entityType}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxCategory) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Top disciplines</p>
        <ul className="mt-4 space-y-3">
          {analytics.itemsByDiscipline.map((stat) => (
            <li key={stat.discipline}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">{stat.discipline}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxDiscipline) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Top keywords</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {analytics.topKeywords.map((stat) => (
            <div key={stat.keyword}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">{stat.keyword}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-violet-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / maxKeyword) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
