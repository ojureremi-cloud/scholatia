import React from 'react';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import { formatDateLabel } from './format';
import type { IntelligenceAnalytics } from '@/types/intelligence';

type IntelligenceAnalyticsProps = {
  analytics: IntelligenceAnalytics;
};

export default function IntelligenceAnalytics({ analytics }: IntelligenceAnalyticsProps) {
  const maxByType = Math.max(1, ...analytics.recommendationsByType.map((entry) => entry.count));
  const maxByDiscipline = Math.max(1, ...analytics.trendsByDiscipline.map((entry) => entry.count));
  const severityColors: Record<string, string> = {
    info: 'bg-slate-100 text-slate-600',
    positive: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    critical: 'bg-rose-50 text-rose-700',
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <h3 className="text-lg font-semibold text-slate-900">Recommendations by type</h3>
        <div className="mt-4 space-y-3">
          {analytics.recommendationsByType.map((entry) => (
            <div key={entry.entityType}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">
                  {entityTypeIcon(entry.entityType)} {entityTypeLabel(entry.entityType)}
                </span>
                <span className="font-semibold">{entry.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${(entry.count / maxByType) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-900">Insights by severity</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analytics.insightsBySeverity.map((entry) => (
            <span key={entry.severity} className={['rounded-full px-3 py-1 text-xs font-semibold', severityColors[entry.severity] ?? 'bg-slate-100 text-slate-600'].join(' ')}>
              {entry.severity} · {entry.count}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <h3 className="text-lg font-semibold text-slate-900">Trends by discipline</h3>
        <div className="mt-4 space-y-3">
          {analytics.trendsByDiscipline.map((entry) => (
            <div key={entry.discipline}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">{entry.discipline}</span>
                <span className="font-semibold">{entry.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{ width: `${(entry.count / maxByDiscipline) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-900">Research gaps by severity</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analytics.gapsBySeverity.map((entry) => (
            <span key={entry.severity} className={['rounded-full px-3 py-1 text-xs font-semibold', severityColors[entry.severity] ?? 'bg-slate-100 text-slate-600'].join(' ')}>
              {entry.severity} · {entry.count}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <h3 className="text-lg font-semibold text-slate-900">Model metrics</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Recommendation hit rate</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{analytics.modelMetrics.recommendationHitRate}%</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Prediction accuracy</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{analytics.modelMetrics.predictionAccuracy}%</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Index coverage</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{analytics.modelMetrics.coverage}%</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Average latency</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{analytics.modelMetrics.averageLatency}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-400">Data freshness: {formatDateLabel(analytics.modelMetrics.freshness)}</p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <h3 className="text-lg font-semibold text-slate-900">Top emerging topics</h3>
        <ul className="mt-4 space-y-3">
          {analytics.topEmergingTopics.map((topic, index) => (
            <li key={topic.id} className="flex items-center gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{topic.topic}</p>
                <p className="text-xs text-slate-500">{topic.discipline} · potential {topic.potential}/100</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
