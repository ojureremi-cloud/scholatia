/**
 * CRIE publication, journal & conference types (fspec §2.10).
 *
 * `PublicationPlan` is a publication strategy and stewardship plan;
 * `SubmissionPackage` is a submission-ready package; `JournalProfile` and
 * `JournalMatch` support journal fit assessment, and `ConferenceMatch`
 * conference fit (CRIE Chs. 26–28).
 */
import type {
  Auditable,
  ConfidenceScore,
  ProvenanceRef,
  ResearcherRef,
  Versioned,
} from './base';

export type PublicationTargetType = 'journal' | 'conference' | 'preprint' | 'book';

export type PublicationPlanStatus = 'drafting' | 'targeting' | 'submission-ready' | 'submitted' | 'published';

/** A publication strategy and stewardship plan. */
export interface PublicationPlan extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  owner: ResearcherRef;
  targetType: PublicationTargetType;
  status: PublicationPlanStatus;
  targets: string[];
}

export type PackageStatus = 'assembling' | 'ready' | 'submitted' | 'withdrawn';

/** A submission-ready package (manuscript, cover letter, metadata). */
export interface SubmissionPackage extends Auditable, Versioned {
  id: string;
  publicationPlanId: string;
  packageStatus: PackageStatus;
  manuscriptId?: string;
  coverLetter?: string;
  metadata: Record<string, unknown>;
  readiness: ReadinessCheck[];
}

export interface ReadinessCheck {
  key: string;
  passed: boolean;
  detail: string;
}

/** A journal profile for fit assessment. */
export interface JournalProfile extends Auditable {
  id: string;
  journalId: string; // canonical reference
  scope: string[];
  metrics: Record<string, unknown>;
}

/** A journal fit assessment. */
export interface JournalMatch extends Auditable {
  id: string;
  publicationPlanId: string;
  journalProfileId: string;
  fitScore: number; // 0..1
  confidence: ConfidenceScore;
  rationale: string;
}

/** A conference fit assessment. */
export interface ConferenceMatch extends Auditable {
  id: string;
  researchEntityId: string;
  conferenceId: string; // canonical reference
  fitScore: number; // 0..1
  confidence: ConfidenceScore;
  rationale: string;
  provenance: ProvenanceRef;
}
