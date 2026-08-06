'use client';

import { useCallback, useState } from 'react';
import Badge from '@/components/ui/Badge';
import type { ContextElement, ContextPack, ResearchEntity, ResearchSession as ResearchSessionModel, SessionMessage } from '@/types/crie';
import { assembleContext, createContextPack } from '@/lib/crie/context';
import { Chip, Panel, Row } from '../primitives';
import { formatRelative, statusTone, lifecycleStageLabel, lifecycleStageIcon } from '../format';
import { ResearchEntityPanel } from './ResearchEntityPanel';
import { ResearchSession } from './ResearchSession';
import { ResearchTimeline } from './ResearchTimeline';

type ResearchWorkspaceProps = {
  entity: ResearchEntity;
  otherEntities: ResearchEntity[];
  session: ResearchSessionModel;
  sessionMessages?: SessionMessage[];
  initialContext: ContextPack[];
  contextElements: ContextElement[];
};

export function ResearchWorkspace({
  entity,
  otherEntities,
  session,
  sessionMessages = [],
  initialContext,
  contextElements,
}: ResearchWorkspaceProps) {
  const [context, setContext] = useState<ContextPack[]>(initialContext);

  const refreshContext = useCallback((): ContextPack[] => {
    const pack = assembleContext(
      createContextPack({
        label: 'ojuri-refresh',
        contextKind: 'micro',
        budgetLimit: 1,
        researchEntityId: entity.id,
        sessionId: session.id,
      }),
      contextElements,
    );
    const next = [pack, ...context.filter((entry) => entry.id !== pack.id)];
    setContext(next);
    return next;
  }, [entity, session, contextElements, context]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-8">
          <ResearchEntityPanel entity={entity} />
          <ResearchTimeline currentStage={entity.model.stage} />
        </div>

        <div className="space-y-8">
          <Panel eyebrow="Session" title={session.id} icon="💬">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status: {session.status}</p>
            <div className="mt-3 space-y-2">
              {sessionMessages.map((message) => (
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

      <ResearchSession session={session} messages={sessionMessages} />

      <section aria-label="Related research">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Related research</h2>
          <Badge variant="default">{otherEntities.length} others</Badge>
        </div>
        <Row className="mt-4">
          {otherEntities.map((related) => (
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
