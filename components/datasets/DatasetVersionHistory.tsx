import React from 'react';
import Badge from '@/components/ui/Badge';
import type { DatasetVersion } from '@/types/dataset';
import { formatBytes, formatDate } from './format';

type DatasetVersionHistoryProps = {
  versions: DatasetVersion[];
};

export function DatasetVersionHistory({ versions }: DatasetVersionHistoryProps) {
  return (
    <ul className="space-y-3">
      {versions.map((version) => (
        <li key={version.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={version.status === 'published' ? 'success' : 'warning'}>{version.version}</Badge>
              <span className="text-sm text-slate-500">{formatDate(version.publishedAt)}</span>
            </div>
            <span className="text-xs text-slate-500">{version.doi}</span>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
            <span>
              Size: <span className="font-medium text-slate-900">{formatBytes(version.sizeBytes)}</span>
            </span>
            <span>
              Files: <span className="font-medium text-slate-900">{version.fileCount}</span>
            </span>
            <span>
              Format: <span className="font-medium text-slate-900">{version.format}</span>
            </span>
          </div>
          {version.changes ? <p className="mt-2 text-sm leading-6 text-slate-500">{version.changes}</p> : null}
        </li>
      ))}
    </ul>
  );
}
