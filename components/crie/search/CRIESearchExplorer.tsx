'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { searchGraph, searchStatistics } from '@/lib/crie/search';
import { CRIESearch } from '@/components/crie/CRIESearch';
import { CRIEStats } from '@/components/crie/CRIEStats';
import type { CRIEStat } from '@/components/crie/CRIEStats';
import { Chip, ConfidenceMeter } from '@/components/crie/primitives';
import { graphEntityUrl, kgEntityClassLabel, kgEntityLabel, formatPercent } from '@/components/crie/format';
import type { KnowledgeGraph } from '@/types/crie';

type CRIESearchExplorerProps = {
  graph: KnowledgeGraph;
};

export function CRIESearchExplorer({ graph }: CRIESearchExplorerProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchGraph(graph, query), [graph, query]);
  const statistics = useMemo(() => searchStatistics([results]), [results]);

  const stats: CRIEStat[] = [
    { title: 'Queries', value: String(statistics.searches), icon: '🔍' },
    { title: 'Results', value: String(statistics.totalResults), icon: '🎯' },
    { title: 'Avg results', value: String(statistics.averageResults), icon: '📊' },
    { title: 'Corpus', value: String(graph.entities.length), icon: '🕸️' },
  ];

  return (
    <div className="space-y-8">
      <CRIEStats stats={stats} />
      <CRIESearch placeholder="Search entities by CRIE-ID, class, or attribute…" onSearch={setQuery} />

      {query.trim() === '' ? (
        <p className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60">
          Enter a query to search the knowledge graph.
        </p>
      ) : results.length === 0 ? (
        <p className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60">
          No entities matched “{query}”.
        </p>
      ) : (
        <ul className="space-y-4">
          {results.map((result) => (
            <li key={result.entity.crieId}>
              <Link
                href={graphEntityUrl(result.entity)}
                className="block rounded-2xl bg-slate-50 px-5 py-4 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{kgEntityLabel(result.entity)}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {kgEntityClassLabel(result.entity.entityClass)} · {result.entity.crieId} · score {formatPercent(result.score)}
                    </p>
                  </div>
                  <Chip tone="info">{result.entity.lifecycleState}</Chip>
                </div>
                <div className="mt-3 max-w-sm">
                  <ConfidenceMeter confidence={result.entity.confidence} showLabel={false} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
