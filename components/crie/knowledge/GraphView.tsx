import type { KGEntity, KGRelation, KnowledgeGraph } from '@/types/crie';
import { Panel, Chip } from '../primitives';
import { confidenceTone, formatPercent, kgEntityClassIcon, kgEntityLabel } from '../format';
import { graphEntityUrl } from '../format';
import Link from 'next/link';

type GraphViewProps = {
  graph: KnowledgeGraph;
};

function labelFor(graph: KnowledgeGraph, crieId: string): string {
  const entity = graph.entities.find((candidate) => candidate.crieId === crieId);
  return entity ? kgEntityLabel(entity) : crieId;
}

export function GraphView({ graph }: GraphViewProps) {
  return (
    <div className="space-y-8">
      <Panel eyebrow="Research Knowledge Graph" title="Graph view" icon="🕸️">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex flex-wrap justify-center gap-4">
            {graph.entities.map((entity: KGEntity) => (
              <Link
                key={entity.crieId}
                href={graphEntityUrl(entity)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <span aria-hidden="true">{kgEntityClassIcon(entity.entityClass)}</span>
                {kgEntityLabel(entity)}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">
            {formatPercent(graph.entities.reduce((sum, entity) => sum + entity.confidence.value, 0) / Math.max(1, graph.entities.length))} average confidence across {graph.entities.length} nodes
          </p>
        </div>
      </Panel>

      <Panel eyebrow="Research Knowledge Graph" title="Relations" icon="🔗">
        <ul className="space-y-3">
          {graph.relations.map((relation: KGRelation) => (
            <li key={relation.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link href={graphEntityUrl({ crieId: relation.subject.crieId })} className="font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400">
                  {labelFor(graph, relation.subject.crieId)}
                </Link>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {relation.predicate}
                </span>
                <Link href={graphEntityUrl({ crieId: relation.object.crieId })} className="font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400">
                  {labelFor(graph, relation.object.crieId)}
                </Link>
                <span className="ml-auto flex items-center gap-2">
                  <Chip tone={confidenceTone(relation.confidence)}>strength {formatPercent(relation.strength)}</Chip>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
