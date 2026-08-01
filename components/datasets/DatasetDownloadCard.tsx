import React from 'react';
import Button from '@/components/ui/Button';
import type { Dataset } from '@/types/dataset';
import { formatBytes, formatCompactNumber } from './format';

type DatasetDownloadCardProps = {
  dataset: Dataset;
};

export function DatasetDownloadCard({ dataset }: DatasetDownloadCardProps) {
  const latest = [...dataset.versions].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{formatCompactNumber(dataset.statistics.downloads)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Downloads</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{formatCompactNumber(dataset.statistics.views)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Views</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{dataset.statistics.fileCount.toLocaleString()}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Files</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Formats</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {dataset.metadata.fileFormats.map((format) => (
            <span
              key={format}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
      {latest ? (
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">Download latest version</p>
              <p className="mt-1 text-sm text-slate-600">
                {latest.version} · {formatBytes(latest.sizeBytes)} · {latest.fileCount.toLocaleString()} files
              </p>
            </div>
            <Button variant="primary" size="sm" href="#download">
              Download
            </Button>
          </div>
        </div>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Versions</p>
        <ul className="mt-2 space-y-1.5">
          {dataset.versions.map((version) => (
            <li key={version.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-900">{version.version}</span>
              <span className="text-xs text-slate-500">{version.doi}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
