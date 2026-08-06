/**
 * CRIE writing types (fspec §2.9).
 *
 * `WritingDraft` and `WritingRevision` capture provenance-bearing drafting
 * with citation control; `StyleProfile` holds a writing style profile
 * (CRIE Ch. 23).
 */
import type {
  Auditable,
  ConfidenceScore,
  ProvenanceRef,
  ResearcherRef,
  Versioned,
} from './base';

export type WritingDraftType =
  | 'section'
  | 'abstract'
  | 'introduction'
  | 'methods'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'cover-letter'
  | 'manuscript';

/** A draft section/artefact with provenance and citation control. */
export interface WritingDraft extends Auditable, Versioned {
  id: string;
  documentId?: string;
  researchEntityId: string;
  author: ResearcherRef;
  draftType: WritingDraftType;
  title: string;
  content: string;
  wordCount: number;
  citations: string[];
  provenance: ProvenanceRef;
}

/** A revision of a draft. */
export interface WritingRevision extends Auditable {
  id: string;
  writingDraftId: string;
  revisionOrder: number;
  changes: string;
  appliedBy: ResearcherRef;
}

/** A writing style profile. */
export interface StyleProfile extends Auditable {
  id: string;
  researcher: ResearcherRef;
  tone: string;
  voice: string;
  citationStyle: string;
  preferences: Record<string, unknown>;
  confidence: ConfidenceScore;
}
