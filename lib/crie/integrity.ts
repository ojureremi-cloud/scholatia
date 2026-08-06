/**
 * E-15 Integrity Engine — Mission 004-D (Wave 2).
 *
 * Pure research-integrity helpers for plagiarism, fabrication, and
 * manipulation screening (CRIE Ch. 20). All integrity records are
 * append-only.
 */
import type {
  IntegrityScreenStatus,
  IntegrityScreenType,
  IntegrityScreening,
  IntegrityViolation,
  IntegrityViolationStatus,
  IntegrityViolationType,
  PlagiarismReport,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function integrityScreeningId(label: string): string {
  return `screen-${slugOf(label)}`;
}

export interface IntegrityScreeningInput {
  label: string;
  documentId: string;
  screenType: IntegrityScreenType;
  status?: IntegrityScreenStatus;
  confidenceValue?: number;
}

export function createIntegrityScreening(input: IntegrityScreeningInput): IntegrityScreening {
  const now = nowIso();
  return {
    id: integrityScreeningId(input.label),
    documentId: input.documentId,
    screenType: input.screenType,
    status: input.status ?? 'running',
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export interface PlagiarismReportInput {
  label: string;
  integrityScreeningId: string;
  similarityScore: number;
  matches: string[];
}

export function reportPlagiarism(input: PlagiarismReportInput): PlagiarismReport {
  const now = nowIso();
  return {
    id: `plagiarism-${slugOf(input.label)}`,
    integrityScreeningId: input.integrityScreeningId,
    similarityScore: round(Math.max(0, Math.min(1, input.similarityScore))),
    matches: input.matches,
    createdAt: now,
    updatedAt: now,
  };
}

export interface IntegrityViolationInput {
  label: string;
  integrityScreeningId: string;
  violationType: IntegrityViolationType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status?: IntegrityViolationStatus;
}

export function flagViolation(input: IntegrityViolationInput): IntegrityViolation {
  const now = nowIso();
  return {
    id: `violation-${slugOf(input.label)}`,
    integrityScreeningId: input.integrityScreeningId,
    violationType: input.violationType,
    status: input.status ?? 'flagged',
    description: input.description,
    severity: input.severity,
    createdAt: now,
    updatedAt: now,
  };
}

export interface IntegrityStatistics {
  screenings: number;
  clean: number;
  flagged: number;
  confirmedViolations: number;
}

export function integrityStatistics(
  screenings: readonly IntegrityScreening[],
  violations: readonly IntegrityViolation[] = [],
): IntegrityStatistics {
  const clean = screenings.filter((screening) => screening.status === 'clean').length;
  const flagged = screenings.filter((screening) => screening.status === 'flagged').length;
  const confirmedViolations = violations.filter(
    (violation) => violation.status === 'confirmed',
  ).length;
  return { screenings: screenings.length, clean, flagged, confirmedViolations };
}
