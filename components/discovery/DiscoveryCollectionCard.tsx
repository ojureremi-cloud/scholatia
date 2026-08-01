'use client';

import React from 'react';
import { formatDate } from './format';
import type { DiscoveryCollection } from '@/types/discovery';

type DiscoveryCollectionCardProps = {
  collection: DiscoveryCollection;
  className?: string;
};

export default function DiscoveryCollectionCard({ collection, className = '' }: DiscoveryCollectionCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {collection.coverIcon}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {collection.items.length} items
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{collection.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{collection.description}</p>
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        <p>{collection.curator}</p>
        <p className="mt-0.5">Updated {formatDate(collection.updatedAt)}</p>
      </div>
    </div>
  );
}
