/**
 * E-20 Patent Engine — Mission 004-D (Wave 2).
 *
 * Pure patent helpers over `PatentDisclosure` and `PatentabilityAssessment`
 * (CRIE Ch. 30). Patentability is derived with calibrated confidence.
 */
import type {
  DisclosureStatus,
  PatentabilityAssessment,
  PatentDisclosure,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function patentDisclosureId(label: string): string {
  return `patent-${slugOf(label)}`;
}

export interface PatentabilityAssessmentInput {
  noveltyScore: number;
  nonObviousnessScore: number;
  industrialApplicability: boolean;
  priorArtReferences: string[];
  confidenceValue?: number;
}

export function assessPatentability(input: PatentabilityAssessmentInput): PatentabilityAssessment {
  return {
    noveltyScore: round(Math.max(0, Math.min(1, input.noveltyScore))),
    nonObviousnessScore: round(Math.max(0, Math.min(1, input.nonObviousnessScore))),
    industrialApplicability: input.industrialApplicability,
    priorArtReferences: input.priorArtReferences,
    confidence: confidence(input.confidenceValue ?? 0.5),
  };
}

export interface PatentDisclosureInput {
  label: string;
  researchEntityId: string;
  inventor: ResearcherRef;
  title: string;
  assessment: PatentabilityAssessment;
  disclosureStatus?: DisclosureStatus;
}

export function createPatentDisclosure(input: PatentDisclosureInput): PatentDisclosure {
  const now = nowIso();
  return {
    id: patentDisclosureId(input.label),
    researchEntityId: input.researchEntityId,
    inventor: input.inventor,
    title: input.title,
    disclosureStatus: input.disclosureStatus ?? 'draft',
    patentability: input.assessment,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface PatentStatistics {
  disclosures: number;
  filed: number;
  averageNovelty: number;
}

export function patentStatistics(
  disclosures: readonly PatentDisclosure[],
): PatentStatistics {
  const noveltyTotal = disclosures.reduce(
    (sum, disclosure) => sum + disclosure.patentability.noveltyScore,
    0,
  );
  return {
    disclosures: disclosures.length,
    filed: disclosures.filter((disclosure) => disclosure.disclosureStatus === 'filed').length,
    averageNovelty: disclosures.length === 0 ? 0 : round(noveltyTotal / disclosures.length),
  };
}
