'use client';

import React from 'react';
import { formatAmount } from './format';
import type { FundingAnalytics as FundingAnalyticsData } from '@/types/funding';

type FundingAnalyticsProps = {
  analytics: FundingAnalyticsData;
  className?: string;
};

export default function FundingAnalytics({ analytics, className = '' }: FundingAnalyticsProps) {
  const totalDisciplineCount = Math.max(
    1,
    analytics.applicationsByDiscipline.reduce((sum, stat) => sum + stat.count, 0)
  );
  return (
    <div className={['grid gap-6 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Outcomes</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.successRate}%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Success rate</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{analytics.budgetUtilisation}%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Budget utilisation</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900">{formatAmount(analytics.averageAwardSize, analytics.awardCurrency)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Average award</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900">{formatAmount(analytics.totalAwarded, analytics.awardCurrency)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Total awarded</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Awards by category</p>
        <ul className="mt-4 space-y-3">
          {analytics.awardsByCategory.map((stat) => (
            <li key={stat.category}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{stat.category.replace(/-/g, ' ')}</span>
                <span className="font-semibold text-slate-900">{formatAmount(stat.value, analytics.awardCurrency)}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{
                    width: `${Math.max(
                      2,
                      Math.round(
                        (stat.value / Math.max(1, analytics.totalAwarded)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Applications by discipline</p>
        <ul className="mt-4 space-y-3">
          {analytics.applicationsByDiscipline.slice(0, 10).map((stat) => (
            <li key={stat.discipline}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{stat.discipline}</span>
                <span className="font-semibold text-slate-900">{stat.count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.count / totalDisciplineCount) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
