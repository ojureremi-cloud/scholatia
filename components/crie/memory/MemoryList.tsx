'use client';

import { useMemo, useState } from 'react';
import type { MemoryItem } from '@/types/crie';
import { MEMORY_TYPE_IDS } from '@/types/crie';
import { CRIEFilters } from '../core';
import EmptyState from '@/components/ui/EmptyState';
import { memoryTypeLabel } from '../format';
import { MemoryCard } from './MemoryCard';
import { memoryUrl } from '../format';
import Link from 'next/link';

type MemoryListProps = {
  items: MemoryItem[];
};

export function MemoryList({ items }: MemoryListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (selected.length === 0) return items;
    return items.filter((item) => selected.includes(item.memoryType));
  }, [items, selected]);

  return (
    <div className="space-y-5">
      <CRIEFilters
        label="Type"
        options={MEMORY_TYPE_IDS.map((memoryType) => ({ value: memoryType, label: memoryTypeLabel(memoryType) }))}
        selected={selected}
        onChange={setSelected}
      />
      {filtered.length === 0 ? (
        <EmptyState title="No memory items" description="Try clearing the type filters, or record new memory." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Link key={item.id} href={memoryUrl(item)} className="group">
              <MemoryCard item={item} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
