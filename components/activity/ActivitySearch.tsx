'use client';

import SearchBox from '@/components/ui/SearchBox';

type ActivitySearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
};

export function ActivitySearch({ query, onQueryChange, placeholder = 'Search activities, authors, hashtags…' }: ActivitySearchProps) {
  return <SearchBox value={query} onChange={onQueryChange} placeholder={placeholder} />;
}
