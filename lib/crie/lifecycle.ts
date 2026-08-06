/**
 * E-09 Lifecycle Engine — Mission 004-D (Wave 2).
 *
 * Pure lifecycle helpers over the 14 canonical CRIE stages (CRIE Ch. 8).
 * Traversals (forward, loop, revert) are recorded as `StageTransition`
 * events; stage progress is derived, never authoritative.
 */
import type {
  LifecycleStageId,
  ResearchEntity,
  StageTransition,
  StatusVector,
  TransitionType,
} from '@/types/crie';
import { LIFECYCLE_STAGE_IDS } from '@/types/crie';
import { nowIso } from './utils';

export function stageIndex(stage: LifecycleStageId): number {
  return LIFECYCLE_STAGE_IDS.indexOf(stage);
}

export function isForward(from: LifecycleStageId, to: LifecycleStageId): boolean {
  return stageIndex(to) > stageIndex(from);
}

export function transitionTypeFor(
  from: LifecycleStageId,
  to: LifecycleStageId,
): TransitionType {
  if (to === from) return 'loop';
  return isForward(from, to) ? 'forward' : 'revert';
}

export function createStageTransition(
  from: LifecycleStageId,
  to: LifecycleStageId,
): StageTransition {
  const now = nowIso();
  return {
    from,
    to,
    transitionType: transitionTypeFor(from, to),
    createdAt: now,
    updatedAt: now,
  };
}

export function currentStageOf(entity: ResearchEntity): LifecycleStageId {
  return entity.model.stage;
}

/** Average stage progress across the status vector (0..1). */
export function stageCoverage(statusVector: StatusVector): number {
  const values = Object.values(statusVector.stageProgress);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / LIFECYCLE_STAGE_IDS.length;
}

export interface LifecycleStatistics {
  totalEntities: number;
  byStage: Partial<Record<LifecycleStageId, number>>;
  averageStageCoverage: number;
}

export function lifecycleStatistics(entities: readonly ResearchEntity[]): LifecycleStatistics {
  const byStage: Partial<Record<LifecycleStageId, number>> = {};
  let coverageTotal = 0;
  for (const entity of entities) {
    byStage[entity.model.stage] = (byStage[entity.model.stage] ?? 0) + 1;
    coverageTotal += stageCoverage(entity.model.statusVector);
  }
  return {
    totalEntities: entities.length,
    byStage,
    averageStageCoverage:
      entities.length === 0 ? 0 : coverageTotal / entities.length,
  };
}
