import React from 'react';
import SectionCard from '@/components/ui/SectionCard';
import type { DatasetAnalytics } from '@/types/dataset';
import { DatasetTagList } from './DatasetTagList';
import { formatCompactNumber } from './format';

type DatasetSummaryProps = {
  analytics: DatasetAnalytics;
};

export function DatasetSummary({ analytics }: DatasetSummaryProps) {
  const maxDownloads = Math.max(...analytics.downloadTrend.map((point) => point.downloads));
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <SectionCard eyebrow="Access" title="Access level breakdown" description="Distribution of datasets by access level.">
        <div className="space-y-4">
          {analytics.accessBreakdown.map((entry) => (
            <div key={entry.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate-600">{entry.label}</span>
                <span className="font-semibold text-slate-900">{entry.count}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-teal-600"
                  style={{ width: `${(entry.count / analytics.totalDatasets) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={entry.count}
                  aria-valuemin={0}
                  aria-valuemax={analytics.totalDatasets}
                  aria-label={`${entry.label} datasets`}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard
        className="lg:col-span-2"
        eyebrow="Trends"
        title="Downloads per month"
        description="Placeholder dataset download trends by month."
      >
        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {analytics.downloadTrend.map((point) => (
            <div key={point.period} className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{formatCompactNumber(point.downloads)}</span>
              <div className="flex h-28 w-full items-end rounded-full bg-slate-100">
                <div
                  className="w-full rounded-full bg-sky-600"
                  style={{ height: `${(point.downloads / maxDownloads) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">
                {point.period.replace(/\s\d{4}/, '')}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard
        className="lg:col-span-3"
        eyebrow="Signals"
        title="Top dataset tags"
        description="Most common tags across the dataset portfolio."
      >
        <DatasetTagList tags={analytics.topTags} />
      </SectionCard>
    </div>
  );
}
