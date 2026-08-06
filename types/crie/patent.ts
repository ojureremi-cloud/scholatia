/**
 * CRIE patent types (fspec §2.10).
 *
 * `PatentDisclosure` is a patent disclosure with patentability sensing
 * (CRIE Ch. 30).
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
  Versioned,
} from './base';

export type DisclosureStatus = 'draft' | 'filing-in-progress' | 'filed' | 'abandoned';

/** A patent disclosure with patentability sensing. */
export interface PatentDisclosure extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  inventor: ResearcherRef;
  title: string;
  disclosureStatus: DisclosureStatus;
  patentability: PatentabilityAssessment;
}

/** The derived patentability assessment of a disclosure. */
export interface PatentabilityAssessment {
  noveltyScore: number; // 0..1
  nonObviousnessScore: number; // 0..1
  industrialApplicability: boolean;
  priorArtReferences: string[];
  confidence: ConfidenceScore;
}
