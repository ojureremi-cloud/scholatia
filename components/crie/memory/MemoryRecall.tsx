'use client';

import { useMemo, useState } from 'react';
import type { MemoryItem } from '@/types/crie';
import { MEMORY_TYPE_IDS } from '@/types/crie';
import { CRIESearch } from '../core';
import { Chip, Panel } from '../primitives';
import { formatRelative, memoryTypeLabel } from '../format';
import { memoryUrl } from '../format';
import Link from 'next/link';

type MemoryRecallProps = {
  items: MemoryItem[];
};

export function MemoryRecall({ items }: MemoryRecallProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return items.slice(0, 6);
    return items
      .filter((item) => tokens.every((token) => item.content.toLowerCase().includes(token) || item.memoryType.includes(token)))
      .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
      .slice(0, 6);
  }, [items, query]);

  return (
    <Panel eyebrow="Unified memory" title="Recall" icon="🔍">
      <CRIESearch placeholder="Search memory contents…" onSearch={setQuery} />
      <ul className="mt-5 space-y-3">
        {results.length === 0 ? (
          <li className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No memory matched “{query}”.
          </li>
        ) : (
          results.map((item) => (
            <li key={item.id}>
              <Link href={memoryUrl(item)} className="block rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{item.content}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.id} · {formatRelative(item.createdAt)}</p>
                  </div>
                  <Chip tone="info">{memoryTypeLabel(item.memoryType)}</Chip>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
      <p className="mt-4 text-xs text-slate-400">
        Recall is consent-gated and access-controlled across all {formatMemoryTypesCount()} memory types.
      </p>
    </Panel>
  );
}

function formatMemoryTypesCount(): number {
  return MEMORY_TYPE_IDS.length;
}
