'use client';

import React, { useMemo, useState } from 'react';
import { MARKETPLACE_CATEGORY_LABELS } from '@/types/marketplace';
import { MARKETPLACE_CATEGORIES } from '@/types/marketplace';
import { filterListings, sortListings } from '@/lib/marketplace';
import type { MarketplaceListingSort } from '@/lib/marketplace';
import type { MarketplaceCategory, MarketplaceListing } from '@/types/marketplace';
import ListingCard from './ListingCard';

type MarketplaceSearchPanelProps = {
  listings: readonly MarketplaceListing[];
};

const sortOptions: { value: MarketplaceListingSort; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'recent', label: 'Most recent' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popularity', label: 'Most popular' },
];

export default function MarketplaceSearchPanel({ listings }: MarketplaceSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | MarketplaceCategory>('all');
  const [sort, setSort] = useState<MarketplaceListingSort>('relevance');

  const results = useMemo(() => {
    const filtered = filterListings(listings, {
      query,
      category,
      inStockOnly: true,
    });
    return sortListings(filtered, sort, query);
  }, [listings, query, category, sort]);

  return (
    <div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services, products, courses…"
            className="w-full rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 lg:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'all' | MarketplaceCategory)}
              className="rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500"
            >
              <option value="all">All categories</option>
              {MARKETPLACE_CATEGORIES.map((entry) => (
                <option key={entry} value={entry}>
                  {MARKETPLACE_CATEGORY_LABELS[entry]}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as MarketplaceListingSort)}
              className="rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          {results.length} in-stock listing{results.length === 1 ? '' : 's'} matched
        </p>
      </div>

      {results.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, 12).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-4xl">🔎</p>
          <p className="mt-4 font-semibold text-slate-900">No listings matched</p>
          <p className="mt-1 text-sm text-slate-500">Try clearing the search or choosing a different category.</p>
        </div>
      )}
    </div>
  );
}
