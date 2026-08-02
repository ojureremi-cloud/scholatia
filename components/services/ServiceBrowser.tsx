'use client';

import React from 'react';
import useServices from '@/hooks/useServices';
import ServiceSearchPanel from './ServiceSearchPanel';
import ServiceCategoryTabs from './ServiceCategoryTabs';
import ServiceCard from './ServiceCard';

type ServiceBrowserProps = {
  usernamesById: Record<string, string>;
};

export default function ServiceBrowser({ usernamesById }: ServiceBrowserProps) {
  const {
    query,
    setQuery,
    category,
    setCategory,
    group,
    setGroup,
    sort,
    setSort,
    priceRange,
    setPriceRange,
    searchResults,
    favorites,
    toggleFavorite,
    isFavorite,
  } = useServices();

  return (
    <div className="space-y-6">
      <ServiceSearchPanel
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
      />

      <ServiceCategoryTabs group={group} onGroupChange={setGroup} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {searchResults.length} {searchResults.length === 1 ? 'service' : 'services'}
          {query.trim() ? ` for "${query.trim()}"` : ''}
        </p>
        <p className="text-xs text-slate-400">{favorites.size} saved</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            providerUsername={usernamesById[service.providerId]}
            favorite={isFavorite(service.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
