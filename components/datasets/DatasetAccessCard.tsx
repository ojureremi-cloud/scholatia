import React from 'react';
import Badge from '@/components/ui/Badge';
import type { Dataset, DatasetAccessLevel } from '@/types/dataset';
import { formatDate } from './format';

const accessDescriptions: Record<DatasetAccessLevel, string> = {
  open: 'Open access — anyone can download and reuse the data under the stated licence.',
  restricted: 'Restricted access — downloads require an access request and approval.',
  embargoed: 'Embargoed — metadata is public but files are withheld until the embargo ends.',
  controlled: 'Controlled access — data access is governed by a community or institution agreement.',
  private: 'Private — only the dataset team can access the data while it is prepared.',
};

const accessVariant: Record<DatasetAccessLevel, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  open: 'success',
  restricted: 'warning',
  embargoed: 'info',
  controlled: 'default',
  private: 'danger',
};

type DatasetAccessCardProps = {
  dataset: Dataset;
};

export function DatasetAccessCard({ dataset }: DatasetAccessCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={accessVariant[dataset.access]}>{dataset.access}</Badge>
        <span className="text-sm text-slate-600">{dataset.institution}</span>
      </div>
      <p className="text-sm leading-6 text-slate-700">{accessDescriptions[dataset.access]}</p>
      {dataset.accessNote ? (
        <p className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{dataset.accessNote}</p>
      ) : null}
      {dataset.embargoEndsAt ? (
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Embargo ends</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(dataset.embargoEndsAt)}</p>
        </div>
      ) : null}
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Latest version</dt>
          <dd className="font-semibold text-slate-900">{dataset.latestVersion}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Updated</dt>
          <dd className="font-semibold text-slate-900">{formatDate(dataset.updatedAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
