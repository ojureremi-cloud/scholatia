/**
 * CRIE research integrity types (fspec §2.8).
 *
 * Screening for plagiarism, fabrication, and manipulation of evidence
 * (CRIE Ch. 20). All integrity records are append-only.
 */
import type { Auditable, ConfidenceScore } from './base';

export type IntegrityScreenType =
  | 'plagiarism'
  | 'fabrication'
  | 'data-manipulation'
  | 'citation-integrity'
  | 'image-integrity';

export type IntegrityScreenStatus = 'running' | 'clean' | 'flagged' | 'confirmed';

/** A screening for plagiarism, fabrication, or manipulation. */
export interface IntegrityScreening extends Auditable {
  id: string;
  documentId: string;
  screenType: IntegrityScreenType;
  status: IntegrityScreenStatus;
  confidence: ConfidenceScore;
}

/** A plagiarism detection report. */
export interface PlagiarismReport extends Auditable {
  id: string;
  integrityScreeningId: string;
  similarityScore: number; // 0..1
  matches: string[];
}

export type IntegrityViolationType =
  | 'plagiarism'
  | 'fabrication'
  | 'falsification'
  | 'data-manipulation'
  | 'authorship-dispute';

export type IntegrityViolationStatus = 'flagged' | 'confirmed' | 'investigating' | 'resolved';

/** A flagged or confirmed integrity violation. */
export interface IntegrityViolation extends Auditable {
  id: string;
  integrityScreeningId: string;
  violationType: IntegrityViolationType;
  status: IntegrityViolationStatus;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
