'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type DiscoverySearchBarProps = {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
};

export default function DiscoverySearchBar({
  defaultValue = '',
  onSearch,
  placeholder = 'Search researchers, journals, conferences, datasets, funding…',
  className = '',
}: DiscoverySearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={['flex w-full items-center gap-3', className].filter(Boolean).join(' ')}
    >
      <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-card transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
        <span className="text-lg">🔍</span>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      <Button type="submit" size="md">
        Search
      </Button>
    </form>
  );
}
