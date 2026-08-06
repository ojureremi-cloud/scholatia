import type { KGEntity, KGRelation } from '@/types/crie';
import { Panel, Stack, Chip, ConfidenceMeter } from '../primitives';
import { confidenceTone, formatDate, formatRelative, kgEntityClassIcon, kgEntityClassLabel, kgEntityLabel } from '../format';

type EntityDetailProps = {
  entity: KGEntity;
  relations: KGRelation[];
};

function attributeText(attributes: Record<string, unknown>): [string, string][] {
  return Object.entries(attributes).map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]);
}

export function EntityDetail({ entity, relations }: EntityDetailProps) {
  const attributes = attributeText(entity.attributes);

  return (
    <Stack>
      <Panel eyebrow="Knowledge entity" title={kgEntityLabel(entity)} icon={kgEntityClassIcon(entity.entityClass)}>
        <div className="flex flex-wrap gap-2">
          <Chip tone="info">{kgEntityClassLabel(entity.entityClass)}</Chip>
          <Chip tone={confidenceTone(entity.confidence)}>{entity.lifecycleState}</Chip>
          <Chip>version {entity.version}</Chip>
        </div>
        <div className="mt-5 max-w-md">
          <ConfidenceMeter confidence={entity.confidence} />
        </div>
        <dl className="mt-6 max-w-md space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">CRIE-ID</dt>
            <dd className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">{entity.crieId}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Created</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(entity.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatRelative(entity.updatedAt)}</dd>
          </div>
        </dl>
      </Panel>

      {attributes.length > 0 ? (
        <Panel eyebrow="Entity" title="Attributes" icon="🧩">
          <dl className="grid gap-3 sm:grid-cols-2">
            {attributes.map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ) : null}

      <Panel eyebrow="Knowledge graph" title="Relations" icon="🔗">
        {relations.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">No relations touch this entity yet.</p>
        ) : (
          <ul className="space-y-2">
            {relations.map((relation) => (
              <li key={relation.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800">
                <span className="font-mono text-xs text-slate-400">{relation.subject.crieId}</span>
                <span className="mx-2 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {relation.predicate}
                </span>
                <span className="font-mono text-xs text-slate-400">{relation.object.crieId}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Entity" title="Provenance" icon="🧾">
        <ul className="space-y-2">
          {entity.provenance.map((source) => (
            <li key={`${source.sourceId}-${source.method}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs">{source.sourceId}</span>
                <Chip>{source.method}</Chip>
              </div>
              <p className="mt-1 text-xs text-slate-400">asserted {formatDate(source.assertedAt)}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </Stack>
  );
}
