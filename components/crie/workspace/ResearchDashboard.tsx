'use client';

import Link from 'next/link';
import type {
  ContextPack,
  EntitySimilarity,
  IntelligenceIndicator,
  KnowledgeGraph,
  MemoryItem,
  Recommendation,
  ResearchEntity,
  ResearchRecommendation,
  ResearchSession as ResearchSessionModel,
  SessionMessage,
} from '@/types/crie';
import { graphStatistics } from '@/lib/crie/knowledge-graph';
import { memoryStatistics } from '@/lib/crie/memory';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, ConfidenceMeter, Chip } from '../primitives';
import { formatNumber, formatPercent, graphEntityUrl, kgEntityLabel, researchEntityUrl, crieResearchUrl, crieGraphUrl } from '../format';
import { ResearchEntityCard } from './ResearchEntityCard';
import { ResearchTimeline } from './ResearchTimeline';
import { ResearchSession } from './ResearchSession';

export type ResearchDashboardIntelligence = {
  indicators: IntelligenceIndicator[];
  nextRecommendation?: ResearchRecommendation;
  similarEntities: EntitySimilarity[];
};

type ResearchDashboardProps = {
  entities: ResearchEntity[];
  graph: KnowledgeGraph;
  memoryItems: MemoryItem[];
  session?: ResearchSessionModel;
  sessionMessages?: SessionMessage[];
  context: ContextPack[];
  recommendation?: Recommendation;
  intelligence?: ResearchDashboardIntelligence;
};

export function ResearchDashboard({
  entities,
  graph,
  memoryItems,
  session,
  sessionMessages = [],
  context,
  recommendation,
  intelligence,
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

          <Panel eyebrow="Intelligence" title="Derived intelligence" icon="🧠">
            {intelligence?.nextRecommendation ? (
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{intelligence.nextRecommendation.title}</p>
                  <Chip tone="info">{intelligence.nextRecommendation.kind}</Chip>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{intelligence.nextRecommendation.summary}</p>
                <div className="mt-3">
                  <ConfidenceMeter confidence={intelligence.nextRecommendation.confidence} />
                </div>
              </div>
            ) : null}
            {intelligence && intelligence.indicators.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {intelligence.indicators.map((indicator) => (
                  <div key={indicator.key} className="rounded-[1.25rem] border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{indicator.label}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatPercent(indicator.value)}</span>
                    </div>
                    <div className="mt-2">
                      <ConfidenceMeter confidence={indicator.confidence} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {intelligence && intelligence.similarEntities.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Similar entities</p>
                <ul className="mt-2 space-y-1">
                  {intelligence.similarEntities.map((similarity) => {
                    const entity = graph.entities.find((candidate) => candidate.crieId === similarity.entityB);
                    if (!entity) return null;
                    return (
                      <li key={similarity.entityB} className="flex items-center justify-between gap-2">
                        <Link href={graphEntityUrl(entity)} className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">
                          {kgEntityLabel(entity)}
                        </Link>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{formatPercent(similarity.similarity)} similar</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
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
