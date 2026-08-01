'use client';

import React, { useMemo, useState } from 'react';
import DiscoveryCategoryTabs from './DiscoveryCategoryTabs';
import DiscoveryFacetPanel from './DiscoveryFacetPanel';
import DiscoveryFilterPanel from './DiscoveryFilterPanel';
import DiscoveryResultCard from './DiscoveryResultCard';
import DiscoverySearchBar from './DiscoverySearchBar';
import SearchEmptyState from './SearchEmptyState';
import { searchDiscoveryItems } from '@/constants/placeholder-discovery';
import type { DiscoveryCategory, DiscoveryFacet, DiscoveryFilter, DiscoveryItem } from '@/types/discovery';

type DiscoveryExplorerProps = {
  items: DiscoveryItem[];
  categories: DiscoveryCategory[];
  facets: DiscoveryFacet[];
  defaultQuery?: string;
  defaultCategory?: DiscoveryCategory;
  pageSize?: number;
  className?: string;
};

function itemMatchesFacet(item: DiscoveryItem, facet: DiscoveryFacet): boolean {
  switch (facet.category) {
    case 'entityType':
      return item.entityType === facet.name;
    case 'discipline':
      return item.discipline === facet.name;
    case 'country':
      return item.country === facet.name;
    case 'continent':
      return item.continent === facet.name;
    case 'year':
      return item.year === facet.name;
    case 'status':
      return item.status === facet.name;
    default:
      return false;
  }
}

function facetToFilter(facet: DiscoveryFacet): DiscoveryFilter {
  return {
    id: facet.id,
    label: facet.name,
    type: facet.category === 'entityType' ? 'category' : facet.category,
    value: facet.name,
    count: facet.count,
  };
}

export default function DiscoveryExplorer({
  items,
  categories,
  facets,
  defaultQuery = '',
  defaultCategory = 'all',
  pageSize = 9,
  className = '',
}: DiscoveryExplorerProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState<DiscoveryCategory>(defaultCategory);
  const [activeFacetIds, setActiveFacetIds] = useState<string[]>([]);

  const activeFacets = useMemo(
    () => facets.filter((facet) => activeFacetIds.includes(facet.id)),
    [facets, activeFacetIds]
  );

  const results = useMemo(() => {
    const matched = searchDiscoveryItems(items, query, category, 50);
    if (activeFacets.length === 0) return matched.slice(0, pageSize);
    return matched
      .filter((result) => activeFacets.every((facet) => itemMatchesFacet(result.item, facet)))
      .slice(0, pageSize);
  }, [items, query, category, activeFacets, pageSize]);

  const activeFilters: DiscoveryFilter[] = useMemo(() => {
    const categoryFilter = category === 'all' ? null : {
      id: `category-${category}`,
      label: category,
      type: 'category' as const,
      value: category,
    };
    const facetFilters: DiscoveryFilter[] = activeFacets.map(facetToFilter);
    return [...(categoryFilter ? [categoryFilter] : []), ...facetFilters];
  }, [category, activeFacets]);

  function toggleFacet(facetId: string) {
    setActiveFacetIds((previous) =>
      previous.includes(facetId) ? previous.filter((id) => id !== facetId) : [...previous, facetId]
    );
  }

  function reset() {
    setQuery('');
    setCategory('all');
    setActiveFacetIds([]);
  }

  return (
    <div className={className}>
      <DiscoverySearchBar defaultValue={query} onSearch={(value) => setQuery(value)} />
      <div className="mt-6">
        <DiscoveryCategoryTabs
          categories={categories}
          active={category}
          onSelect={(selected) => setCategory(selected)}
        />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <DiscoveryFacetPanel
            facets={facets}
            activeFilters={activeFacetIds}
            onToggle={toggleFacet}
          />
        </div>
        <div className="space-y-6 lg:col-span-3">
          {activeFilters.length > 0 ? (
            <DiscoveryFilterPanel
              filters={activeFilters}
              onRemove={(filterId) => {
                if (filterId === `category-${category}`) {
                  setCategory('all');
                  return;
                }
                setActiveFacetIds((previous) => previous.filter((id) => id !== filterId));
              }}
              onClear={reset}
            />
          ) : null}
          <p className="text-sm text-slate-500">
            {results.length} result{results.length === 1 ? '' : 's'}
            {query.trim() ? (
              <>
                {' '}
                for <span className="font-semibold text-slate-900">“{query.trim()}”</span>
              </>
            ) : null}
          </p>
          {results.length === 0 ? (
            <SearchEmptyState query={query} onReset={reset} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((result) => (
                <DiscoveryResultCard
                  key={result.item.id}
                  item={result.item}
                  relevanceScore={result.relevanceScore}
                  matchedFields={result.matchedFields}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
