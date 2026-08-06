/**
 * CRIE documents, citations & references types (fspec §2.5).
 *
 * A `Document` is a provenance-bearing ingested artefact (paper, thesis,
 * dataset, protocol); it is chunked into `DocumentChunk` passages with tables
 * and figures. `Reference` is a resolved bibliographic identity (DOI, ORCID,
 * URL, ISBN, handle) and `Citation` a typed, provenance-bearing edge between a
 * citing document and a reference (CRIE Chs. 12–13).
 */
import type {
  Auditable,
  ConfidenceScore,
  ProvenanceRef,
  ResearcherRef,
  Versioned,
} from './base';

export type DocumentKind =
  | 'paper'
  | 'thesis'
  | 'dataset'
  | 'protocol'
  | 'grant'
  | 'patent'
  | 'book'
  | 'code'
  | 'note';

/** A provenance-bearing ingested artefact. */
export interface Document extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  kind: DocumentKind;
  title: string;
  format: string;
  researchEntityId?: string;
  chunks: DocumentChunk[];
  extraction: ExtractionRecord[];
}

/** A passage-level unit of a document. */
export interface DocumentChunk {
  id: string;
  documentId: string;
  position: number;
  content: string;
  sourceVersion: number;
}

/** A table extracted from a document. */
export interface DocumentTable {
  id: string;
  documentId: string;
  chunkId?: string;
  caption?: string;
  structure: Record<string, unknown>;
}

/** A figure extracted from a document. */
export interface DocumentFigure {
  id: string;
  documentId: string;
  chunkId?: string;
  caption?: string;
  figureType?: string;
}

/** A record of an extraction operation with method and confidence. */
export interface ExtractionRecord extends Auditable {
  id: string;
  documentId: string;
  method: string;
  confidence: ConfidenceScore;
}

/** A conversion of a document between formats. */
export interface FormatConversion extends Auditable {
  id: string;
  documentId: string;
  fromFormat: string;
  toFormat: string;
  convertedAt: string;
}

export type ReferenceIdentifierKind = 'doi' | 'orcid' | 'url' | 'isbn' | 'handle';

/** A resolved bibliographic identity. */
export interface Reference extends Auditable {
  id: string;
  identifierKind: ReferenceIdentifierKind;
  identifier: string;
  title?: string;
  authors?: string[];
  venue?: string;
  year?: number;
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
}

export type CitationStyle =
  | 'apa'
  | 'mla'
  | 'chicago'
  | 'harvard'
  | 'ieee'
  | 'vancouver'
  | 'nature'
  | 'generic';

/** A typed citation edge with provenance. */
export interface Citation extends Auditable, Versioned {
  id: string;
  citingDocumentId: string;
  referenceId: string;
  citationStyle: CitationStyle;
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
}

/** The purpose of a citation. */
export type CitationIntent =
  | 'support'
  | 'contrast'
  | 'background'
  | 'method'
  | 'extension';

/** The passage and claim motivating a citation edge. */
export interface CitationContext extends Auditable {
  id: string;
  citationId: string;
  chunkId: string;
  intent: CitationIntent;
  quote?: string;
  note?: string;
}
