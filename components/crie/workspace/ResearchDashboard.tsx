'use client';

import Link from 'next/link';
import type {
  ContextPack,
  KnowledgeGraph,
  MemoryItem,
  Recommendation,
  ResearchEntity,
  ResearchSession as ResearchSessionModel,
  SessionMessage,
} from '@/types/crie';
import { graphStatistics } from '@/lib/crie/knowledge-graph';
import { memoryStatistics } from '@/lib/crie/memory';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, ConfidenceMeter, Chip } from '../primitives';
import { formatNumber, formatPercent, graphEntityUrl, researchEntityUrl, crieResearchUrl, crieGraphUrl } from '../format';
import { ResearchEntityCard } from './ResearchEntityCard';
import { ResearchTimeline } from './ResearchTimeline';
import { ResearchSession } from './ResearchSession';

type ResearchDashboardProps = {
  entities: ResearchEntity[];
  graph: KnowledgeGraph;
  memoryItems: MemoryItem[];
  session?: ResearchSessionModel;
  sessionMessages?: SessionMessage[];
  context: ContextPack[];
  recommendation?: Recommendation;
};

export function ResearchDashboard({
  entities,
  graph,
  memoryItems,
  session,
  sessionMessages = [],
  context,
  recommendation,
}: ResearchDashboardProps) {
  const memoryStats = memoryStatistics(memoryItems);
  const graphStats = graphStatistics(graph);

  const stats: CRIEStat[] = [
    { title: 'Research entities', value: formatNumber(entities.length), icon: '🗂️' },
    { title: 'Knowledge graph', value: formatNumber(graph.entities.length), icon: '🕸️' },
    { title: 'Memory items', value: formatNumber(memoryStats.total), icon: '🧠' },
    { title: 'Context packs', value: formatNumber(context.length), icon: '🧩' },
  ];

  const current = entities[0];

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
        {entities.length === 0 ? (
          <p className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
            No research entities yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {entities.map((entity) => (
              <ResearchEntityCard key={entity.id} entity={entity} href={researchEntityUrl(entity)} />
            ))}
          </div>
        )}
      </section>

      {current ? <ResearchTimeline currentStage={current.model.stage} /> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        {session ? (
          <ResearchSession session={session} messages={sessionMessages} />
        ) : (
          <Panel eyebrow="Session" title="No active session" icon="💬">
            <p className="text-sm text-slate-500 dark:text-slate-400">No research session is active.</p>
          </Panel>
        )}

        <Stack>
          <Panel eyebrow="Recommendation" title="Next best action" icon="💡">
            {recommendation ? (
              <>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{recommendation.summary}</p>
                <div className="mt-4">
                  <ConfidenceMeter confidence={recommendation.confidence} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip tone="info">{recommendation.kind}</Chip>
                  <Chip tone="warning">{recommendation.status}</Chip>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No recommendation is available.</p>
            )}
          </Panel>

          <Panel eyebrow="Statistics" title="Graph snapshot" icon="📐">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Entities</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(graphStats.entityCount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Relations</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatNumber(graphStats.relationCount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Average confidence</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatPercent(graphStats.averageConfidence)}</dd>
              </div>
            </dl>
            <Link href={graph.entities[0] ? graphEntityUrl(graph.entities[0]) : crieGraphUrl()} className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">
              Explore the graph →
            </Link>
          </Panel>
        </Stack>
      </div>
    </Stack>
  );
}
