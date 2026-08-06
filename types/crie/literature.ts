/**
 * CRIE literature, gaps & novelty types (fspec §2.6).
 *
 * Structured literature search (`LiteratureSearch`, `SearchQuery`,
 * `ScreeningDecision`, `LiteratureSummary`), research gap identification
 * (`ResearchGap`, `GapAssessment`, `GapSignal`), and novelty assessment
 * (`NoveltyAssessment`, `NoveltySignal`) — all derived, never authoritative
 * (CRIE Chs. 15–17).
 */
import type {
  Auditable,
  ConfidenceScore,
  ProvenanceRef,
  ResearcherRef,
} from './base';

export type LiteratureSearchStatus = 'planned' | 'running' | 'complete';

/** A structured search of scholarly sources. */
export interface LiteratureSearch extends Auditable {
  id: string;
  researcher: ResearcherRef;
  researchEntityId?: string;
  status: LiteratureSearchStatus;
  queries: SearchQuery[];
}

/** The query specification of a search. */
export interface SearchQuery {
  id: string;
  queryText: string;
  filters: Record<string, unknown>;
}

export type ScreeningVerdict = 'include' | 'exclude' | 'pending';

/** A screen decision over a retrieved candidate. */
export interface ScreeningDecision extends Auditable {
  id: string;
  literatureSearchId: string;
  documentId: string;
  decision: ScreeningVerdict;
  rationale: string;
}

/** A summarised body of literature with confidence and provenance. */
export interface LiteratureSummary extends Auditable {
  id: string;
  literatureSearchId: string;
  summary: string;
  coveredDocumentIds: string[];
  confidence: ConfidenceScore;
  provenance: ProvenanceRef[];
}

export type GapType =
  | 'methodological'
  | 'population'
  | 'geographical'
  | 'theoretical'
  | 'evidence'
  | 'technical'
  | 'temporal';

export type GapStatus = 'candidate' | 'confirmed' | 'addressed' | 'closed';

/** An identified gap in the literature. */
export interface ResearchGap extends Auditable {
  id: string;
  researchEntityId?: string;
  gapType: GapType;
  status: GapStatus;
  statement: string;
}

/** The assessment establishing a gap, with evidence. */
export interface GapAssessment extends Auditable {
  id: string;
  researchGapId: string;
  strength: number; // 0..1
  confidence: ConfidenceScore;
  evidenceRecordIds: string[];
}

/** A derived signal contributing to gap detection. */
export interface GapSignal {
  id: string;
  researchGapId: string;
  kind: string;
  weight: number; // 0..1
  evidenceRecordId: string;
}

/** The assessment of novelty of a contribution. */
export interface NoveltyAssessment extends Auditable {
  id: string;
  researchEntityId: string;
  documentId?: string;
  noveltyScore: number; // 0..1
  confidence: ConfidenceScore;
  rationale: string;
}

/** A derived signal contributing to novelty assessment. */
export interface NoveltySignal {
  id: string;
  noveltyAssessmentId: string;
  kind: string;
  weight: number; // 0..1
  evidenceRecordId: string;
}

export type LiteratureRecommendationKind =
  | 'must-read'
  | 'background'
  | 'related'
  | 'gap-filling'
  | 'methods-source';

/** A recommendation drawn from the literature base. */
export interface LiteratureRecommendation extends Auditable {
  id: string;
  literatureSearchId: string;
  researchEntityId: string;
  documentId: string;
  recommendationKind: LiteratureRecommendationKind;
  relevance: number; // 0..1
  rationale: string;
}
