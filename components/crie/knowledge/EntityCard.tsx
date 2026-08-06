import Link from 'next/link';
import type { KGEntity } from '@/types/crie';
import { Chip, ConfidenceMeter } from '../primitives';
import { confidenceTone, graphEntityUrl, kgEntityClassIcon, kgEntityClassLabel, kgEntityLabel } from '../format';

type EntityCardProps = {
  entity: KGEntity;
};

export function EntityCard({ entity }: EntityCardProps) {
  const institutionId = entity.attributes?.institutionId;
  const researchEntityId = entity.attributes?.researchEntityId;

  return (
    <Link
      href={graphEntityUrl(entity)}
      className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
          {kgEntityClassIcon(entity.entityClass)}
        </span>
        <Chip tone={confidenceTone(entity.confidence)}>{entity.lifecycleState}</Chip>
      </div>
      <h3 className="mt-4 truncate font-bold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
        {kgEntityLabel(entity)}
      </h3>
      <p className="mt-1 text-xs font-medium text-slate-400">{kgEntityClassLabel(entity.entityClass)} · {entity.crieId}</p>
      {typeof institutionId === 'string' || typeof researchEntityId === 'string' ? (
        <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
          {typeof institutionId === 'string' ? `🏛️ ${institutionId}` : ''}
          {typeof researchEntityId === 'string' ? ` · 🔬 ${researchEntityId}` : ''}
        </p>
      ) : null}
      <div className="mt-4">
        <ConfidenceMeter confidence={entity.confidence} />
      </div>
    </Link>
  );
}
