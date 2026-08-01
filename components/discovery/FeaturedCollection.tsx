'use client';

import React from 'react';
import DiscoveryResultCard from './DiscoveryResultCard';
import { formatDate } from './format';
import type { DiscoveryCollection } from '@/types/discovery';

type FeaturedCollectionProps = {
  collection: DiscoveryCollection;
  className?: string;
};

export default function FeaturedCollection({ collection, className = '' }: FeaturedCollectionProps) {
  return (
    <div className={className}>
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-8 shadow-card">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="lg:max-w-md lg:flex-none">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                {collection.coverIcon}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Featured collection</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Curated by {collection.curator}</p>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{collection.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{collection.description}</p>
            <p className="mt-4 text-sm text-slate-500">Updated {formatDate(collection.updatedAt)}</p>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {collection.items.slice(0, 4).map((item) => (
              <DiscoveryResultCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
