/**
 * CRIE methodology & study design types (fspec §2.7).
 *
 * `StudyDesign`, `SamplingPlan`, and `MethodologyRecommendation` capture the
 * justified methodological choices of a research entity; `InstrumentDesign`
 * and `PsychometricValidation` cover instrument construction (CRIE Chs. 18,
 * 22).
 */
import type { Auditable, ConfidenceScore, Versioned } from './base';

export type StudyDesignType =
  | 'randomized-trial'
  | 'quasi-experimental'
  | 'cohort'
  | 'case-control'
  | 'cross-sectional'
  | 'longitudinal'
  | 'qualitative'
  | 'mixed-methods'
  | 'systematic-review'
  | 'meta-analysis'
  | 'case-study'
  | 'design-science'
  | 'theoretical';

/** A chosen design with rationale. */
export interface StudyDesign extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  designType: StudyDesignType;
  rationale: string;
  confidence: ConfidenceScore;
}

export type SamplingMethod =
  | 'simple-random'
  | 'stratified'
  | 'cluster'
  | 'systematic'
  | 'convenience'
  | 'purposive'
  | 'snowball'
  | 'census';

/** A sampling design and rationale. */
export interface SamplingPlan extends Auditable {
  id: string;
  studyDesignId: string;
  samplingMethod: SamplingMethod;
  targetSize: number;
  rationale: string;
}

/** A justified method recommendation. */
export interface MethodologyRecommendation extends Auditable {
  id: string;
  researchEntityId: string;
  researchQuestionId?: string;
  designType: StudyDesignType;
  confidence: ConfidenceScore;
  rationale: string;
}

export type InstrumentType =
  | 'questionnaire'
  | 'survey'
  | 'interview-guide'
  | 'observation-protocol'
  | 'test'
  | 'checklist'
  | 'rubric'
  | 'laboratory-equipment'
  | 'software';

/** An instrument design with validation. */
export interface InstrumentDesign extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  instrumentType: InstrumentType;
  title: string;
  items: string[];
  version: number;
}

/** A psychometric validation record. */
export interface PsychometricValidation extends Auditable {
  id: string;
  instrumentDesignId: string;
  reliability: number; // 0..1
  validity: Record<string, unknown>;
  sampleSize: number;
}
