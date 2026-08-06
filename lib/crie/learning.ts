/**
 * E-28 Learning Engine — Mission 004-D (Wave 2).
 *
 * Pure CRIE–Learning integration helpers over `LearnerState`,
 * `LearningRecommendation`, and `LearningDiagnosis` (CRIE Ch. 47).
 * CRIE integrates with the Learning Ecosystem by reference and event, never
 * by duplication.
 */
import type {
  LearnerMastery,
  LearnerState,
  LearningDiagnosis,
  LearningRecommendation,
  LearningRecommendationKind,
  LifecycleStageId,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function learnerStateId(label: string): string {
  return `learner-${slugOf(label)}`;
}

export interface LearnerStateInput {
  label: string;
  researcher: ResearcherRef;
  mastery?: LearnerMastery[];
  misconceptions?: string[];
  progress?: number;
  lifecycleStage?: LifecycleStageId;
}

export function createLearnerState(input: LearnerStateInput): LearnerState {
  const now = nowIso();
  return {
    id: learnerStateId(input.label),
    researcher: input.researcher,
    mastery: input.mastery ?? [],
    misconceptions: input.misconceptions ?? [],
    progress: round(Math.max(0, Math.min(1, input.progress ?? 0))),
    lifecycleStage: input.lifecycleStage,
    confidence: confidence(0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export function learnerMastery(
  conceptId: string,
  mastery: number,
  confidenceValue = 0.5,
  lastAssessedAt = nowIso(),
): LearnerMastery {
  return {
    conceptId,
    mastery: round(Math.max(0, Math.min(1, mastery))),
    confidence: confidence(confidenceValue),
    lastAssessedAt,
  };
}

export interface LearningRecommendationInput {
  label: string;
  researcher: ResearcherRef;
  recommendationKind: LearningRecommendationKind;
  rationale: string;
  reasonEvidence: string[];
  learningObjectId?: string;
  confidenceValue?: number;
}

export function recommendLearning(input: LearningRecommendationInput): LearningRecommendation {
  const now = nowIso();
  return {
    id: `learning-rec-${slugOf(input.label)}`,
    researcher: input.researcher,
    learningObjectId: input.learningObjectId,
    recommendationKind: input.recommendationKind,
    rationale: input.rationale,
    reasonEvidence: input.reasonEvidence,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export interface LearningDiagnosisInput {
  learner: ResearcherRef;
  misconceptionIds: string[];
  recommendedActions: string[];
  confidenceValue?: number;
}

export function diagnoseLearning(input: LearningDiagnosisInput): LearningDiagnosis {
  return {
    learner: input.learner,
    misconceptionIds: input.misconceptionIds,
    recommendedActions: input.recommendedActions,
    confidence: confidence(input.confidenceValue ?? 0.5),
    generatedAt: nowIso(),
  };
}

export interface LearnerStatistics {
  states: number;
  recommendations: number;
  diagnoses: number;
  averageProgress: number;
}

export function learnerStatistics(
  states: readonly LearnerState[],
  recommendations: readonly LearningRecommendation[] = [],
  diagnoses: readonly LearningDiagnosis[] = [],
): LearnerStatistics {
  const progressTotal = states.reduce((sum, state) => sum + state.progress, 0);
  return {
    states: states.length,
    recommendations: recommendations.length,
    diagnoses: diagnoses.length,
    averageProgress: states.length === 0 ? 0 : round(progressTotal / states.length),
  };
}
