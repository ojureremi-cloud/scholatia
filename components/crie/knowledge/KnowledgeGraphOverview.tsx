import type { KGEntity, KnowledgeGraph } from '@/types/crie';
import { KG_ENTITY_CLASSES } from '@/types/crie';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Chip, Panel } from '../primitives';
import { formatNumber, formatPercent, kgEntityClassIcon, kgEntityClassLabel, kgEntityLabel } from '../format';
import { graphEntityUrl } from '../format';
import Link from 'next/link';

type KnowledgeGraphOverviewProps = {
  graph: KnowledgeGraph;
};

export function KnowledgeGraphOverview({ graph }: KnowledgeGraphOverviewProps) {
  const byClass = KG_ENTITY_CLASSES.map((entityClass) => ({
    entityClass,
    entities: graph.entities.filter((entity) => entity.entityClass === entityClass),
  })).filter((group) => group.entities.length > 0);

  const stats: CRIEStat[] = [
    { title: 'Entities', value: formatNumber(graph.entities.length), icon: '🕸️' },
    { title: 'Relations', value: formatNumber(graph.relations.length), icon: '🔗' },
    { title: 'Version', value: formatNumber(graph.currentVersion), icon: '🧬' },
    {
      title: 'Avg confidence',
      value: formatPercent(
        graph.entities.reduce((sum, entity) => sum + entity.confidence.value, 0) / Math.max(1, graph.entities.length),
      ),
      icon: '📏',
    },
  ];

  return (
    <div className="space-y-8">
      <CRIEStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Panel eyebrow="Research Knowledge Graph" title="Entity classes" icon="🏷️">
          <div className="grid gap-4 sm:grid-cols-2">
            {byClass.map((group) => (
              <div key={group.entityClass} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl" aria-hidden="true">{kgEntityClassIcon(group.entityClass)}</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(group.entities.length)}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{kgEntityClassLabel(group.entityClass)}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Graph" title="Signature entities" icon="⭐">
          <ul className="space-y-3">
            {graph.entities.slice(0, 5).map((entity: KGEntity) => (
              <li key={entity.crieId}>
                <Link
                  href={graphEntityUrl(entity)}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{kgEntityLabel(entity)}</span>
                  <Chip tone="info">{kgEntityClassLabel(entity.entityClass)}</Chip>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
