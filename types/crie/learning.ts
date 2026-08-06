/**
 * CRIE learning & learner types (fspec §2.11).
 *
 * CRIE integrates with the Learning Ecosystem by reference and event, never by
 * duplication (CRIE Ch. 47). `LearnerState`/`LearnerMastery` are derived views
 * over consented learner records, and `LearningRecommendation` is a just-in-time
 * teaching recommendation.
 */
import type { Auditable, ConfidenceScore, ResearcherRef } from './base';
import type { LifecycleStageId } from './cognitive';

/** A just-in-time teaching recommendation. */
export interface LearningRecommendation extends Auditable {
  id: string;
  researcher: ResearcherRef;
  learningObjectId?: string;
  recommendationKind: LearningRecommendationKind;
  rationale: string;
  reasonEvidence: string[];
  confidence: ConfidenceScore;
}

/** Blueprint terminology for the teaching recommendation surface. */
export type TeachingRecommendation = LearningRecommendation;

export type LearningRecommendationKind =
  | 'prerequisite'
  | 'remediation'
  | 'extension'
  | 'just-in-time'
  | 'research-training'
  | 'method-scaffold';

/** The learner's state (mastery, misconceptions, progress). */
export interface LearnerState extends Auditable {
  id: string;
  researcher: ResearcherRef;
  mastery: LearnerMastery[];
  misconceptions: string[];
  progress: number; // 0..1
  lifecycleStage?: LifecycleStageId;
  confidence: ConfidenceScore;
}

/** Mastery per concept, with confidence calibration. */
export interface LearnerMastery {
  conceptId: string;
  mastery: number; // 0..1
  confidence: ConfidenceScore;
  lastAssessedAt: string;
}

/** A derived learner diagnosis (misconception diagnosis). */
export interface LearningDiagnosis {
  learner: ResearcherRef;
  misconceptionIds: string[];
  recommendedActions: string[];
  confidence: ConfidenceScore;
  generatedAt: string;
}
