'use client';

import React from 'react';
import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABELS } from '@/types/services';
import type { ServiceCategory } from '@/types/services';
import type { ServiceSort } from '@/lib/services';

const sortOptions: { label: string; value: ServiceSort }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'recent' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Top rated', value: 'rating' },
  { label: 'Most popular', value: 'popularity' },
  { label: 'Fastest delivery', value: 'delivery' },
];

type ServiceSearchPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: 'all' | ServiceCategory;
  onCategoryChange: (value: 'all' | ServiceCategory) => void;
  sort: ServiceSort;
  onSortChange: (value: ServiceSort) => void;
  priceRange: { min?: number; max?: number };
  onPriceRangeChange: (value: { min?: number; max?: number }) => void;
};

export default function ServiceSearchPanel({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
}: ServiceSearchPanelProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search writing, statistics, grants, editing, data analysis..." />

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as 'all' | ServiceCategory)}
          options={[
            { label: 'All categories', value: 'all' },
            ...SERVICE_CATEGORIES.map((entry) => ({ label: SERVICE_CATEGORY_LABELS[entry], value: entry })),
          ]}
        />
        <Select
          label="Sort by"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ServiceSort)}
          options={sortOptions}
        />
        <Input
          label="Min price"
          type="number"
          min={0}
          value={priceRange.min ?? ''}
          onChange={(event) => {
            const value = event.target.value;
            onPriceRangeChange({ ...priceRange, min: value === '' ? undefined : Number(value) });
          }}
          placeholder="USD minimum"
        />
        <Input
          label="Max price"
          type="number"
          min={0}
          value={priceRange.max ?? ''}
          onChange={(event) => {
            const value = event.target.value;
            onPriceRangeChange({ ...priceRange, max: value === '' ? undefined : Number(value) });
          }}
          placeholder="USD maximum"
        />
      </div>
    </div>
  );
}
