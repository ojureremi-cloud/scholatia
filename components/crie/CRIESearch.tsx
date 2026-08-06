'use client';

import { useState } from 'react';
import SearchBox from '@/components/ui/SearchBox';

type CRIESearchProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
};

export function CRIESearch({ placeholder = 'Search entities, memory, evidence, agents…', onSearch, className = '' }: CRIESearchProps) {
  const [query, setQuery] = useState('');

  return (
    <form
      className={className}
      role="search"
      aria-label="Search CRIE"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(query);
      }}
    >
      <SearchBox value={query} onChange={setQuery} placeholder={placeholder} />
    </form>
  );
}
