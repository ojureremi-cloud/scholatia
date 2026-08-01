import React from 'react';
import type { Dataset } from '@/types/dataset';
import { DatasetTagList } from './DatasetTagList';
import { formatBytes } from './format';

type DatasetMetadataCardProps = {
  dataset: Dataset;
};

export function DatasetMetadataCard({ dataset }: DatasetMetadataCardProps) {
  const { metadata } = dataset;
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</dt>
        <dd className="mt-1.5 leading-6 text-slate-700">{metadata.summary}</dd>
      </div>
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Methodology</dt>
        <dd className="mt-1.5 leading-6 text-slate-700">{metadata.methodology}</dd>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {metadata.collectionPeriod ? (
          <div>
            <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Collection period</dt>
            <dd className="mt-1.5 text-slate-700">{metadata.collectionPeriod}</dd>
          </div>
        ) : null}
        {metadata.temporalCoverage ? (
          <div>
            <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Temporal coverage</dt>
            <dd className="mt-1.5 text-slate-700">{metadata.temporalCoverage}</dd>
          </div>
        ) : null}
        {metadata.geographicCoverage ? (
          <div>
            <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Geographic coverage</dt>
            <dd className="mt-1.5 text-slate-700">{metadata.geographicCoverage}</dd>
          </div>
        ) : null}
        {metadata.language ? (
          <div>
            <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Language</dt>
            <dd className="mt-1.5 text-slate-700">{metadata.language}</dd>
          </div>
        ) : null}
        {metadata.sampleSize !== undefined ? (
          <div>
            <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Sample size</dt>
            <dd className="mt-1.5 text-slate-700">{metadata.sampleSize.toLocaleString()}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Size</dt>
          <dd className="mt-1.5 text-slate-700">{formatBytes(metadata.sizeBytes)}</dd>
        </div>
      </div>
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Subjects</dt>
        <dd className="mt-2">
          <DatasetTagList tags={metadata.subjects} />
        </dd>
      </div>
      <div>
        <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">File formats</dt>
        <dd className="mt-2 flex flex-wrap gap-2">
          {metadata.fileFormats.map((format) => (
            <span
              key={format}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {format}
            </span>
          ))}
        </dd>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Files</dt>
          <dd className="mt-1.5 text-slate-700">{metadata.fileCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.2em] text-slate-500">Dataset ID</dt>
          <dd className="mt-1.5 text-slate-700">{dataset.id}</dd>
        </div>
      </div>
    </dl>
  );
}
