/**
 * E-05 Evidence Engine — Mission 004-D (Wave 2).
 *
 * Pure evidence helpers over `EvidenceRecord`, `Claim`, `EvidenceAssessment`,
 * `Contradiction`, and `Retraction` (CRIE Ch. 14). Every claim is bound to
 * evidence with a verdict and strength; retractions propagate (P3).
 */
import type {
  AssessmentVerdict,
  Claim,
  ClaimType,
  Contradiction,
  ContradictionSeverity,
  EvidenceAssessment,
  EvidenceRecord,
  EvidenceType,
  ProvenanceRef,
} from '@/types/crie';
import { average, confidence, nowIso, round, slugOf } from './utils';

export function evidenceRecordId(label: string): string {
  return `evidence-${slugOf(label)}`;
}

export interface EvidenceRecordInput {
  label: string;
  evidenceType: EvidenceType;
  summary: string;
  provenance: ProvenanceRef;
  confidenceValue?: number;
  researchEntityId?: string;
  documentId?: string;
}

export function createEvidenceRecord(input: EvidenceRecordInput): EvidenceRecord {
  const now = nowIso();
  return {
    id: evidenceRecordId(input.label),
    evidenceType: input.evidenceType,
    summary: input.summary,
    provenance: input.provenance,
    confidence: confidence(input.confidenceValue ?? 0.5),
    researchEntityId: input.researchEntityId,
    documentId: input.documentId,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function claimId(label: string): string {
  return `claim-${slugOf(label)}`;
}

export interface ClaimInput {
  label: string;
  claimType: ClaimType;
  statement: string;
  confidenceValue?: number;
  documentChunkId?: string;
}

export function createClaim(input: ClaimInput): Claim {
  const now = nowIso();
  return {
    id: claimId(input.label),
    documentChunkId: input.documentChunkId,
    claimType: input.claimType,
    statement: input.statement,
    confidence: confidence(input.confidenceValue ?? 0.5),
    lifecycleState: 'proposed',
    evidenceChains: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function assessEvidence(
  claimIdValue: string,
  evidenceRecordIdValue: string,
  assessment: AssessmentVerdict,
  strength: number,
): EvidenceAssessment {
  return {
    claimId: claimIdValue,
    evidenceRecordId: evidenceRecordIdValue,
    assessment,
    strength: round(Math.max(0, Math.min(1, strength))),
  };
}

export function assessmentsForClaim(
  assessments: readonly EvidenceAssessment[],
  claimIdValue: string,
): EvidenceAssessment[] {
  return assessments.filter((assessment) => assessment.claimId === claimIdValue);
}

export function verdictFor(assessments: readonly EvidenceAssessment[]): AssessmentVerdict | undefined {
  if (assessments.length === 0) return undefined;
  const refutes = assessments.filter((assessment) => assessment.assessment === 'refutes');
  const contradicts = assessments.filter((assessment) => assessment.assessment === 'contradicts');
  const supports = assessments.filter((assessment) => assessment.assessment === 'supports');
  if (refutes.length > 0) return 'refutes';
  if (contradicts.length > supports.length) return 'contradicts';
  if (supports.length > 0) return 'supports';
  return 'neutral';
}

export function contradictionId(label: string): string {
  return `contradiction-${slugOf(label)}`;
}

export interface ContradictionInput {
  label: string;
  claimA: string;
  claimB: string;
  severity: ContradictionSeverity;
}

export function createContradiction(input: ContradictionInput): Contradiction {
  const now = nowIso();
  return {
    id: contradictionId(input.label),
    claimA: input.claimA,
    claimB: input.claimB,
    severity: input.severity,
    resolutionState: 'open',
    createdAt: now,
    updatedAt: now,
  };
}

export function contradictionForClaim(
  contradictions: readonly Contradiction[],
  claimIdValue: string,
): Contradiction[] {
  return contradictions.filter(
    (contradiction) =>
      contradiction.claimA === claimIdValue || contradiction.claimB === claimIdValue,
  );
}

export interface ClaimStatistics {
  total: number;
  byType: Partial<Record<ClaimType, number>>;
  averageConfidence: number;
  supported: number;
  refuted: number;
}

export function claimStatistics(
  claims: readonly Claim[],
  assessments: readonly EvidenceAssessment[] = [],
): ClaimStatistics {
  const byType: Partial<Record<ClaimType, number>> = {};
  let supported = 0;
  let refuted = 0;
  for (const claim of claims) {
    byType[claim.claimType] = (byType[claim.claimType] ?? 0) + 1;
    const verdict = verdictFor(assessmentsForClaim(assessments, claim.id));
    if (verdict === 'supports') supported += 1;
    if (verdict === 'refutes') refuted += 1;
  }
  return {
    total: claims.length,
    byType,
    averageConfidence: average(claims.map((claim) => claim.confidence.value)),
    supported,
    refuted,
  };
}
