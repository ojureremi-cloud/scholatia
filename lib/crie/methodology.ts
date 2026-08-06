/**
 * E-12 Methodology Engine — Mission 004-D (Wave 2).
 *
 * Pure methodology helpers over `StudyDesign`, `SamplingPlan`,
 * `MethodologyRecommendation`, `InstrumentDesign`, and
 * `PsychometricValidation` (CRIE Chs. 18, 22). Design choices carry an
 * explicit rationale and calibrated confidence.
 */
import type {
  InstrumentDesign,
  InstrumentType,
  MethodologyRecommendation,
  PsychometricValidation,
  SamplingMethod,
  SamplingPlan,
  StudyDesign,
  StudyDesignType,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function studyDesignId(label: string): string {
  return `design-${slugOf(label)}`;
}

export interface StudyDesignInput {
  label: string;
  researchEntityId: string;
  designType: StudyDesignType;
  rationale: string;
  confidenceValue?: number;
}

export function createStudyDesign(input: StudyDesignInput): StudyDesign {
  const now = nowIso();
  return {
    id: studyDesignId(input.label),
    researchEntityId: input.researchEntityId,
    designType: input.designType,
    rationale: input.rationale,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface SamplingPlanInput {
  label: string;
  studyDesignId: string;
  samplingMethod: SamplingMethod;
  targetSize: number;
  rationale: string;
}

export function createSamplingPlan(input: SamplingPlanInput): SamplingPlan {
  const now = nowIso();
  return {
    id: `sampling-${slugOf(input.label)}`,
    studyDesignId: input.studyDesignId,
    samplingMethod: input.samplingMethod,
    targetSize: input.targetSize,
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface MethodologyRecommendationInput {
  label: string;
  researchEntityId: string;
  designType: StudyDesignType;
  rationale: string;
  researchQuestionId?: string;
  confidenceValue?: number;
}

export function recommendMethod(input: MethodologyRecommendationInput): MethodologyRecommendation {
  const now = nowIso();
  return {
    id: `method-rec-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    researchQuestionId: input.researchQuestionId,
    designType: input.designType,
    confidence: confidence(input.confidenceValue ?? 0.5),
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface InstrumentDesignInput {
  label: string;
  researchEntityId: string;
  instrumentType: InstrumentType;
  title: string;
  items: string[];
}

export function createInstrument(input: InstrumentDesignInput): InstrumentDesign {
  const now = nowIso();
  return {
    id: `instrument-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    instrumentType: input.instrumentType,
    title: input.title,
    items: input.items,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export interface PsychometricValidationInput {
  label: string;
  instrumentDesignId: string;
  reliability: number;
  validity: Record<string, unknown>;
  sampleSize: number;
}

export function validateInstrument(input: PsychometricValidationInput): PsychometricValidation {
  const now = nowIso();
  return {
    id: `psychometric-${slugOf(input.label)}`,
    instrumentDesignId: input.instrumentDesignId,
    reliability: round(Math.max(0, Math.min(1, input.reliability))),
    validity: input.validity,
    sampleSize: input.sampleSize,
    createdAt: now,
    updatedAt: now,
  };
}

export interface MethodologyStatistics {
  studyDesigns: number;
  samplingPlans: number;
  recommendations: number;
  instruments: number;
  averageDesignConfidence: number;
}

export function methodologyStatistics(
  designs: readonly StudyDesign[],
  plans: readonly SamplingPlan[] = [],
  recommendations: readonly MethodologyRecommendation[] = [],
  instruments: readonly InstrumentDesign[] = [],
): MethodologyStatistics {
  const confidenceTotal = designs.reduce((sum, design) => sum + design.confidence.value, 0);
  return {
    studyDesigns: designs.length,
    samplingPlans: plans.length,
    recommendations: recommendations.length,
    instruments: instruments.length,
    averageDesignConfidence: designs.length === 0 ? 0 : round(confidenceTotal / designs.length),
  };
}
