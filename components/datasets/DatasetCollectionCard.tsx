import React from 'react';
import type { DatasetCollection } from '@/types/dataset';

type DatasetCollectionCardProps = {
  collections: DatasetCollection[];
};

export function DatasetCollectionCard({ collections }: DatasetCollectionCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <div key={collection.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">
              {collection.icon}
            </span>
            <h4 className="font-semibold text-slate-900">{collection.name}</h4>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{collection.description}</p>
          <p className="mt-3 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{collection.datasetCount}</span> datasets
          </p>
        </div>
      ))}
    </div>
  );
}
