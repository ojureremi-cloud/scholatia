import type { KGEntity } from '@/types/crie';
import { Panel, Chip } from '../primitives';
import { formatDate, formatNumber, kgEntityLabel } from '../format';

type EntitySourcesProps = {
  entities: KGEntity[];
};

export function EntitySources({ entities }: EntitySourcesProps) {
  const sources = new Map<string, { count: number; method: string }>();

  for (const entity of entities) {
    for (const source of entity.provenance) {
      const existing = sources.get(source.sourceId);
      sources.set(source.sourceId, {
        count: (existing?.count ?? 0) + 1,
        method: existing?.method ?? source.method,
      });
    }
  }

  const rows = [...sources.entries()].sort((a, b) => b[1].count - a[1].count);

  return (
    <Panel eyebrow="Research Knowledge Graph" title="Sources" icon="🧾">
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No provenance sources recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700">
                <th scope="col" className="py-2 pr-4">Source</th>
                <th scope="col" className="py-2 pr-4">Method</th>
                <th scope="col" className="py-2 pr-4">Entities</th>
                <th scope="col" className="py-2">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map(([sourceId, source]) => (
                <tr key={sourceId}>
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{sourceId}</td>
                  <td className="py-3 pr-4"><Chip>{source.method}</Chip></td>
                  <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-slate-100">{formatNumber(source.count)}</td>
                  <td className="py-3">
                    <span className="text-xs text-slate-400">
                      {entities
                        .filter((entity) => entity.provenance.some((entry) => entry.sourceId === sourceId))
                        .slice(0, 3)
                        .map((entity) => kgEntityLabel(entity))
                        .join(', ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-slate-400">
            Provenance records who asserted each entity, when, and how — {formatDate(entities[0]?.createdAt)} onward.
          </p>
        </div>
      )}
    </Panel>
  );
}
