'use client';

import Link from 'next/link';
import useCRIE from '@/hooks/useCRIE';
import {
  CRIE_GRAPH_STATISTICS,
  CRIE_MEMORY_ITEMS,
  CRIE_RECOMMENDATION,
} from '@/constants/placeholder-crie';
import { memoryStatistics } from '@/lib/crie/memory';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, ConfidenceMeter, Chip } from '../primitives';
import { formatNumber, formatPercent, graphEntityUrl, researchEntityUrl, crieResearchUrl } from '../format';
import { ResearchEntityCard } from './ResearchEntityCard';
import { ResearchTimeline } from './ResearchTimeline';
import { ResearchSession } from './ResearchSession';

export function ResearchDashboard() {
  const { researchEntities, currentEntity, activeSession, context, graph } = useCRIE();
  const memoryStats = memoryStatistics(CRIE_MEMORY_ITEMS);

  const stats: CRIEStat[] = [
    { title: 'Research entities', value: formatNumber(researchEntities.length), icon: '🗂️' },
    { title: 'Knowledge graph', value: formatNumber(graph.entities.length), icon: '🕸️' },
    { title: 'Memory items', value: formatNumber(memoryStats.total), icon: '🧠' },
    { title: 'Context packs', value: formatNumber(context.length), icon: '🧩' },
  ];

  const current = currentEntity ?? researchEntities[0];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Active research</h2>
          <Link href={crieResearchUrl()} className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">
            Open workspace →
          </Link>
        </div>
        {researchEntities.length === 0 ? (
          <p className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            No research entities yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {researchEntities.map((entity) => (
              <ResearchEntityCard key={entity.id} entity={entity} href={researchEntityUrl(entity)} />
            ))}
          </div>
        )}
      </section>

      <ResearchTimeline currentStage={current.model.stage} />

      <div className="grid gap-8 lg:grid-cols-2">
        <ResearchSession session={activeSession} />

        <Stack>
          <Panel eyebrow="Recommendation" title="Next best action" icon="💡">
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{CRIE_RECOMMENDATION.summary}</p>
            <div className="mt-4">
              <ConfidenceMeter confidence={CRIE_RECOMMENDATION.confidence} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip tone="info">{CRIE_RECOMMENDATION.kind}</Chip>
              <Chip tone="warning">{CRIE_RECOMMENDATION.status}</Chip>
            </div>
          </Panel>

          <Panel eyebrow="Statistics" title="Graph snapshot" icon="📐">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Entities</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(CRIE_GRAPH_STATISTICS.entityCount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Relations</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(CRIE_GRAPH_STATISTICS.relationCount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Average confidence</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatPercent(CRIE_GRAPH_STATISTICS.averageConfidence)}</dd>
              </div>
            </dl>
            <Link href={graphEntityUrl({ crieId: 'kg-ojuri' })} className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">
              Explore the graph →
            </Link>
          </Panel>
        </Stack>
      </div>
    </Stack>
  );
}
