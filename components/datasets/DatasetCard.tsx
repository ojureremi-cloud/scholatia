import React from 'react';
import Badge from '@/components/ui/Badge';
import type {
  Dataset,
  DatasetAccessLevel,
  DatasetStatus,
  DatasetVerificationStatus,
} from '@/types/dataset';
import { DatasetTagList } from './DatasetTagList';
import { formatBytes, formatCompactNumber, formatDate } from './format';

const statusVariant: Record<DatasetStatus, 'success' | 'warning' | 'info' | 'default' | 'danger'> = {
  published: 'success',
  draft: 'warning',
  'in-review': 'info',
  archived: 'default',
  deprecated: 'danger',
};

const accessVariant: Record<DatasetAccessLevel, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  open: 'success',
  restricted: 'warning',
  embargoed: 'info',
  controlled: 'default',
  private: 'danger',
};

const verificationVariant: Record<DatasetVerificationStatus, 'success' | 'info' | 'warning'> = {
  verified: 'success',
  'peer-reviewed': 'success',
  'in-review': 'info',
  unverified: 'warning',
};

type DatasetCardProps = {
  dataset: Dataset;
};

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={accessVariant[dataset.access]}>{dataset.access}</Badge>
          <Badge variant={statusVariant[dataset.status]}>{dataset.status}</Badge>
          <Badge variant={verificationVariant[dataset.verification]}>{dataset.verification}</Badge>
        </div>
        <span className="text-xl" aria-hidden="true">
          📊
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{dataset.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{dataset.description}</p>
      <div className="mt-4">
        <DatasetTagList tags={dataset.tags} limit={4} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-slate-500">Downloads</dt>
          <dd className="font-semibold text-slate-900">{formatCompactNumber(dataset.statistics.downloads)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Citations</dt>
          <dd className="font-semibold text-slate-900">{dataset.statistics.citations}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Versions</dt>
          <dd className="font-semibold text-slate-900">{dataset.statistics.versionCount}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Size</dt>
          <dd className="font-semibold text-slate-900">{formatBytes(dataset.statistics.sizeBytes)}</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{dataset.doi}</span>
        {dataset.publishedAt ? (
          <>
            {' '}
            · {formatDate(dataset.publishedAt)}
          </>
        ) : null}
      </p>
    </div>
  );
}
