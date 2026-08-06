'use client';

import Badge from '@/components/ui/Badge';
import useCRIE from '@/hooks/useCRIE';
import { CRIE_SESSION_MESSAGES } from '@/constants/placeholder-crie';
import { Chip, Panel, Row } from '../primitives';
import { formatRelative, statusTone, lifecycleStageLabel, lifecycleStageIcon } from '../format';
import { crieWorkspaceModel } from '../data';
import { ResearchEntityPanel } from './ResearchEntityPanel';
import { ResearchSession } from './ResearchSession';
import { ResearchTimeline } from './ResearchTimeline';

export function ResearchWorkspace() {
  const { currentEntity, activeSession, context, refreshContext } = useCRIE();
  const model = crieWorkspaceModel();
  const entity = currentEntity ?? model.current;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-8">
          <ResearchEntityPanel entity={entity} />
          <ResearchTimeline currentStage={entity.model.stage} />
        </div>

        <div className="space-y-8">
          <Panel eyebrow="Session" title={activeSession.id} icon="💬">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status: {activeSession.status}</p>
            <div className="mt-3 space-y-2">
              {CRIE_SESSION_MESSAGES.map((message) => (
                <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{message.role}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{message.content}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Context" title="Active context packs" icon="🧩">
            {context.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No context assembled yet.</p>
            ) : (
              <ul className="space-y-3">
                {context.slice(0, 4).map((pack) => (
                  <li key={pack.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pack.id}</p>
                      <Chip tone={statusTone(pack.contextKind)}>{pack.contextKind}</Chip>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {pack.elements.length} elements · {pack.budgetUsed}/{pack.budgetLimit} budget
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={refreshContext}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              ↻ Refresh context
            </button>
          </Panel>
        </div>
      </div>

      <ResearchSession session={activeSession} />

      <section aria-label="Related research">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Related research</h2>
          <Badge variant="default">{model.otherEntities.length} others</Badge>
        </div>
        <Row className="mt-4">
          {model.otherEntities.map((related) => (
            <span
              key={related.id}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <span aria-hidden="true">{lifecycleStageIcon(related.model.stage)}</span>
              {related.title} · {lifecycleStageLabel(related.model.stage)} · {formatRelative(related.updatedAt)}
            </span>
          ))}
        </Row>
      </section>
    </div>
  );
}
