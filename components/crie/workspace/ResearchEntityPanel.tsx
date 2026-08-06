import type { ResearchEntity } from '@/types/crie';
import { CRIE_LIFECYCLE_STAGE_ICONS, CRIE_LIFECYCLE_STAGE_LABELS } from '@/types/crie';
import { ConfidenceMeter, Panel, Stack } from '../primitives';
import { entityKindIcon, entityKindLabel, formatDateTime } from '../format';
import { entityStageProgress } from '../data';

type ResearchEntityPanelProps = {
  entity: ResearchEntity;
};

export function ResearchEntityPanel({ entity }: ResearchEntityPanelProps) {
  const { model } = entity;
  const progress = entityStageProgress(entity);

  return (
    <Stack>
      <Panel
        eyebrow={entityKindLabel(entity.kind)}
        title={entity.title}
        icon={entityKindIcon(entity.kind)}
        actions={
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
            {CRIE_LIFECYCLE_STAGE_ICONS[model.stage]}
          </span>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Current stage</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {CRIE_LIFECYCLE_STAGE_LABELS[model.stage] ?? model.stage} · {Math.round(progress * 100)}% coverage
            </p>
            <div className="mt-4">
              <ConfidenceMeter confidence={model.statusVector.confidence} />
            </div>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{entity.owner.name ?? entity.owner.username}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">Created</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(entity.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(entity.updatedAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">Version</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">v{entity.version}</dd>
            </div>
          </dl>
        </div>
      </Panel>

      <Panel eyebrow="Cognitive model" title="Research questions" icon="❔">
        {model.questions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No research questions recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {model.questions.map((question) => (
              <li key={question.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {question.text}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Cognitive model" title="Hypotheses" icon="🔬">
        {model.hypotheses.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No hypotheses recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {model.hypotheses.map((hypothesis) => (
              <li key={hypothesis.id} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <span className="text-sm text-slate-700 dark:text-slate-200">{hypothesis.statement}</span>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{hypothesis.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Cognitive model" title="Aims" icon="🎯">
        {model.aims.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No aims recorded yet.</p>
        ) : (
          <ol className="space-y-2">
            {[...model.aims].sort((a, b) => a.aimOrder - b.aimOrder).map((aim) => (
              <li key={aim.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {aim.aimOrder}
                </span>
                {aim.statement}
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </Stack>
  );
}
