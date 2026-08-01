'use client';

import React from 'react';
import DiscoverySuggestionCard from './DiscoverySuggestionCard';
import type { DiscoverySuggestion } from '@/types/discovery';

type RecentSearchesProps = {
  searches: DiscoverySuggestion[];
  className?: string;
};

export default function RecentSearches({ searches, className = '' }: RecentSearchesProps) {
  return (
    <div className={['grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {searches.map((search) => (
        <DiscoverySuggestionCard key={search.id} suggestion={search} />
      ))}
    </div>
  );
}
