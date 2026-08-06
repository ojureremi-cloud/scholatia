'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  ContextPack,
  LifecycleStageId,
  ResearchEntity,
  ResearchSession,
  ResearcherRef,
} from '@/types/crie';
import {
  CRIE_CONTEXT_ELEMENTS,
  CRIE_CONTEXT_PACKS,
  CRIE_ENTITIES,
  CRIE_KNOWLEDGE_GRAPH,
  CRIE_SESSION,
} from '@/constants/placeholder-crie';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { assembleContext, createContextPack } from '@/lib/crie/context';
import { currentStageOf } from '@/lib/crie/lifecycle';
import { createSession as createSessionEngine, endSession as endSessionEngine } from '@/lib/crie/session';

/**
 * useCRIE — Mission 004-D (Wave 2).
 *
 * Hub state hook for the Cognitive Research Intelligence Environment
 * (fspec Ch. 6). Seeds from `constants/placeholder-crie.ts`, delegates all
 * derivation to the pure engines in `lib/crie/*`, and never owns data.
 * Identity resolves to the canonical current user (`ojuri`).
 */
const CURRENT_USERNAME = 'ojuri';

export default function useCRIE() {
  const currentUser = useMemo<ResearcherRef>(() => {
    const profile = RESEARCHERS.find((researcher) => researcher.username === CURRENT_USERNAME);
    return { username: CURRENT_USERNAME, name: profile?.displayName };
  }, []);

  const seedEntities = useMemo(() => CRIE_ENTITIES, []);
  const [researchEntities, setResearchEntities] = useState<ResearchEntity[]>(seedEntities);
  const [currentEntity, setCurrentEntity] = useState<ResearchEntity>(() => {
    return (
      seedEntities.find((entity) => entity.owner.username === CURRENT_USERNAME) ?? seedEntities[0]
    );
  });
  const [activeSession, setActiveSession] = useState<ResearchSession>(CRIE_SESSION);
  const [context, setContext] = useState<ContextPack[]>(CRIE_CONTEXT_PACKS);

  const entity = currentEntity?.id;
  const stage: LifecycleStageId | undefined = currentEntity
    ? currentStageOf(currentEntity)
    : undefined;

  const setEntity = useCallback((entityId: string) => {
    setResearchEntities((current) => {
      const found = current.find((candidate) => candidate.id === entityId);
      if (found) setCurrentEntity(found);
      return current;
    });
  }, []);

  const openEntity = useCallback(
    (entityId: string): ResearchEntity | undefined => {
      const found = researchEntities.find((candidate) => candidate.id === entityId);
      if (found) setCurrentEntity(found);
      return found;
    },
    [researchEntities],
  );

  const setStage = useCallback((next: LifecycleStageId) => {
    const now = new Date().toISOString();
    setCurrentEntity((current) => {
      if (!current) return current;
      const updated: ResearchEntity = {
        ...current,
        model: {
          ...current.model,
          stage: next,
          statusVector: { ...current.model.statusVector, updatedAt: now },
        },
        updatedAt: now,
        version: current.version + 1,
      };
      setResearchEntities((all) =>
        all.map((candidate) => (candidate.id === updated.id ? updated : candidate)),
      );
      return updated;
    });
  }, []);

  const startSession = useCallback(
    (label: string): ResearchSession => {
      const session = createSessionEngine({
        label,
        researcher: { username: currentUser.username, name: currentUser.name },
        workspaceId: `workspace-${currentUser.username}`,
      });
      setActiveSession(session);
      return session;
    },
    [currentUser],
  );

  const endSession = useCallback(() => {
    setActiveSession((session) => endSessionEngine(session));
  }, []);

  const refreshContext = useCallback((): ContextPack[] => {
    if (!currentEntity) return context;
    const pack = assembleContext(
      createContextPack({
        label: `${currentUser.username}-refresh`,
        contextKind: 'micro',
        budgetLimit: 1,
        researchEntityId: currentEntity.id,
        sessionId: activeSession.id,
      }),
      CRIE_CONTEXT_ELEMENTS,
    );
    const next = [pack, ...context.filter((entry) => entry.id !== pack.id)];
    setContext(next);
    return next;
  }, [currentEntity, currentUser, activeSession, context]);

  return {
    currentUser,
    researchEntities,
    currentEntity,
    activeSession,
    context,
    graph: CRIE_KNOWLEDGE_GRAPH,
    entity,
    setEntity,
    stage,
    setStage,
    openEntity,
    startSession,
    endSession,
    refreshContext,
  };
}
