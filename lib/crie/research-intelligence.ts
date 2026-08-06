/**
 * E-01 Research Intelligence Engine — Mission 004-D (Wave 2).
 *
 * Pure research-intelligence helpers over the CRIE research entity model
 * (CRIE Ch. 3, Ch. 8). Owns no records; every operation returns new values.
 * Entities carry the living cognitive model (stage, questions, hypotheses,
 * aims, concept map, status vector).
 */
import type {
  LifecycleStageId,
  ResearchCognitiveModel,
  ResearchEntity,
  ResearchEntityKind,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function researchEntityId(label: string): string {
  return `rie-${slugOf(label)}`;
}

/** Build the living cognitive model of an entity. */
export function cognitiveModelFor(
  entityId: string,
  stage: LifecycleStageId = 'idea',
): ResearchCognitiveModel {
  const now = nowIso();
  return {
    id: `cm-${entityId}`,
    researchEntityId: entityId,
    stage,
    questions: [],
    hypotheses: [],
    aims: [],
    conceptMap: { id: `cmap-${entityId}`, nodes: [], edges: [] },
    statusVector: { stageProgress: { [stage]: 1 }, confidence: confidence(0.5), updatedAt: now },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface ResearchEntityInput {
  kind: ResearchEntityKind;
  owner: { username: string; name?: string };
  title: string;
  stage?: LifecycleStageId;
}

/** Create a research entity with its cognitive model. */
export function createResearchEntity(
  input: ResearchEntityInput,
  model?: ResearchCognitiveModel,
): ResearchEntity {
  const now = nowIso();
  const id = researchEntityId(input.title);
  const resolvedModel = model ?? cognitiveModelFor(id, input.stage);
  return {
    id,
    kind: input.kind,
    owner: { username: input.owner.username, name: input.owner.name },
    title: input.title,
    model: resolvedModel,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function researchEntitiesFor(
  entities: readonly ResearchEntity[],
  ownerUsername: string,
): ResearchEntity[] {
  return entities.filter((entity) => entity.owner.username === ownerUsername);
}

export function stageOf(entity: ResearchEntity): LifecycleStageId {
  return entity.model.stage;
}

export function stageProgressOf(entity: ResearchEntity): number {
  const values = Object.values(entity.model.statusVector.stageProgress);
  if (values.length === 0) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export interface ResearchEntityStatistics {
  total: number;
  byKind: Partial<Record<ResearchEntityKind, number>>;
  activeInStage: Partial<Record<LifecycleStageId, number>>;
  averageProgress: number;
}

export function researchEntityStatistics(
  entities: readonly ResearchEntity[],
): ResearchEntityStatistics {
  const byKind: Partial<Record<ResearchEntityKind, number>> = {};
  const activeInStage: Partial<Record<LifecycleStageId, number>> = {};
  for (const entity of entities) {
    byKind[entity.kind] = (byKind[entity.kind] ?? 0) + 1;
    activeInStage[entity.model.stage] = (activeInStage[entity.model.stage] ?? 0) + 1;
  }
  return {
    total: entities.length,
    byKind,
    activeInStage,
    averageProgress: averageProgressOf(entities),
  };
}

function averageProgressOf(entities: readonly ResearchEntity[]): number {
  if (entities.length === 0) return 0;
  const total = entities.reduce((sum, entity) => sum + stageProgressOf(entity), 0);
  return round(total / entities.length);
}
