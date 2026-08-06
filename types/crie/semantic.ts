/**
 * CRIE semantic intelligence types (fspec §2.4, §4.3).
 *
 * `SemanticAnnotation` extracts meaning over structured content, `Concept`
 * models an abstract scholarly idea, `EntityMention` ties a span to an RKG
 * entity, and `Embedding`/`SemanticIndex` support retrieval. The semantic
 * index is refreshable and never authoritative (CRIE Ch. 10).
 */
import type {
  Auditable,
  ConfidenceScore,
  CrieIdRef,
  ProvenanceRef,
} from './base';

export type AnnotationType =
  | 'entity'
  | 'concept'
  | 'relation'
  | 'claim'
  | 'method'
  | 'hypothesis'
  | 'evidence'
  | 'generic';

/** A meaning extraction over structured content. */
export interface SemanticAnnotation extends Auditable {
  id: string;
  chunkId: string;
  annotationType: AnnotationType;
  entityRef?: CrieIdRef;
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
}

/** An abstract scholarly idea (theory, phenomenon, method, construct, field). */
export interface Concept extends Auditable {
  id: string;
  conceptKey: string;
  label: string;
  definition?: string;
  broaderConceptId?: string;
  narrowerConceptIds: string[];
}

/** A span referencing an entity in content. */
export interface EntityMention extends Auditable {
  id: string;
  chunkId: string;
  entityRef: CrieIdRef;
  startOffset: number;
  endOffset: number;
  surfaceForm: string;
  confidence: ConfidenceScore;
}

/** A dense representation for semantic retrieval. */
export interface Embedding {
  id: string;
  subjectType: string;
  subjectId: string;
  model: string;
  dimension: number;
  vector: readonly number[];
  provenance: ProvenanceRef;
}

/** The index over embeddings and annotations. */
export interface SemanticIndex {
  id: string;
  graphId: string;
  indexKind: 'embedding' | 'annotation' | 'hybrid';
  entries: string[];
  refreshedAt: string;
  model: string;
}
