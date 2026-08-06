'use client';

import type { ResearchEntity } from '@/types/crie';
import Link from 'next/link';
import { entityKindLabel, entityKindIcon, formatRelative, lifecycleStageLabel, projectUrl, researchEntityUrl } from '../format';
import { ProgressBar, Chip } from '../primitives';
import { entityStageProgress } from '../data';

type ActiveProjectsProps = {
  entities: ResearchEntity[];
};

export function ActiveProjects({ entities }: ActiveProjectsProps) {
  const researchEntities = entities;
  const own = researchEntities.filter((entity) => entity.owner.username === 'ojuri');
  const others = researchEntities.filter((entity) => entity.owner.username !== 'ojuri');

  return (
    <section aria-label="Active projects" className="space-y-8">
      {own.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your projects</h2>
          <ul className="space-y-4">
            {own.map((entity) => {
              const progress = entityStageProgress(entity);
              return (
                <li key={entity.id}>
                  <Link
                    href={projectUrl(entity)}
                    className="block rounded-[1.75rem] border border-slate-200 bg-white p-6 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
                          {entityKindIcon(entity.kind)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100">{entity.title}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {entityKindLabel(entity.kind)} · {lifecycleStageLabel(entity.model.stage)} · updated {formatRelative(entity.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Chip tone="success">Active</Chip>
                    </div>
                    <div className="mt-5">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Lifecycle progress</span>
                        <span className="font-semibold">{Math.round(progress * 100)}%</span>
                      </div>
                      <ProgressBar percent={progress * 100} label={`${Math.round(progress * 100)}% lifecycle progress`} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Collaborators&apos; projects</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {others.map((entity) => (
              <Link
                key={entity.id}
                href={researchEntityUrl(entity)}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl" aria-hidden="true">{entityKindIcon(entity.kind)}</span>
                  <Chip>{lifecycleStageLabel(entity.model.stage)}</Chip>
                </div>
                <h3 className="mt-3 font-bold text-slate-900 dark:text-slate-100">{entity.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Led by {entity.owner.name ?? entity.owner.username}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
