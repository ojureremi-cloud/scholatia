import type { ResearchEntity } from '@/types/crie';
import { Panel, Stack } from '../primitives';

type ResearchCanvasProps = {
  entity: ResearchEntity;
};

export function ResearchCanvas({ entity }: ResearchCanvasProps) {
  const { conceptMap } = entity.model;
  const nodes = conceptMap?.nodes ?? [];
  const edges = conceptMap?.edges ?? [];

  return (
    <Panel eyebrow="Cognitive model" title="Concept map" icon="🕸️">
      <Stack>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          {nodes.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No concept nodes mapped yet. Concepts are learned as the cognitive model develops.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {nodes.map((node) => (
                <span
                  key={node.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  {node.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {edges.length > 0 ? (
          <ul className="space-y-2">
            {edges.map((edge) => (
              <li key={edge.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {edge.from} <span className="font-semibold text-slate-400">{edge.relation}</span> {edge.to}
              </li>
            ))}
          </ul>
        ) : null}
      </Stack>
    </Panel>
  );
}
