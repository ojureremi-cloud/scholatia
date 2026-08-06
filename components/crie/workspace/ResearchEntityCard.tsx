import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import type { ResearchEntity } from '@/types/crie';
import { CRIE_LIFECYCLE_STAGE_LABELS } from '@/types/crie';
import { ProgressBar } from '../primitives';
import { entityKindIcon, entityKindLabel, stageProgressTone } from '../format';
import { entityStageProgress } from '../data';

type ResearchEntityCardProps = {
  entity: ResearchEntity;
  href?: string;
};

export function ResearchEntityCard({ entity, href }: ResearchEntityCardProps) {
  const progress = entityStageProgress(entity);
  const stageLabel = CRIE_LIFECYCLE_STAGE_LABELS[entity.model.stage] ?? entity.model.stage;
  const card = (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
          {entityKindIcon(entity.kind)}
        </span>
        <Badge variant={stageProgressTone(progress)}>{stageLabel}</Badge>
      </div>
      <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 dark:text-slate-100">{entity.title}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {entityKindLabel(entity.kind)} · {entity.owner.name ?? entity.owner.username}
      </p>
      <div className="mt-auto pt-5">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Lifecycle progress</span>
          <span className="font-semibold">{Math.round(progress * 100)}%</span>
        </div>
        <ProgressBar percent={progress * 100} label={`${Math.round(progress * 100)}% lifecycle progress`} />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full" aria-label={entity.title}>
        {card}
      </Link>
    );
  }
  return card;
}
