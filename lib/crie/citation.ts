/**
 * E-26 Citation Engine — Mission 004-D (Wave 2).
 *
 * Pure citation helpers over `Reference`, `Citation`, and `CitationContext`
 * (CRIE Ch. 13). Citations are typed edges with provenance; rendering follows
 * the requested `CitationStyle`.
 */
import type {
  Citation,
  CitationContext,
  CitationIntent,
  CitationStyle,
  ProvenanceRef,
  Reference,
  ReferenceIdentifierKind,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function referenceId(label: string): string {
  return `ref-${slugOf(label)}`;
}

export interface ReferenceInput {
  label: string;
  identifierKind: ReferenceIdentifierKind;
  identifier: string;
  title?: string;
  authors?: string[];
  venue?: string;
  year?: number;
  confidenceValue?: number;
  provenance: ProvenanceRef;
}

export function createReference(input: ReferenceInput): Reference {
  const now = nowIso();
  return {
    id: referenceId(input.label),
    identifierKind: input.identifierKind,
    identifier: input.identifier,
    title: input.title,
    authors: input.authors,
    venue: input.venue,
    year: input.year,
    confidence: confidence(input.confidenceValue ?? 0.5),
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
  };
}

export interface CitationInput {
  label: string;
  citingDocumentId: string;
  referenceId: string;
  citationStyle: CitationStyle;
  confidenceValue?: number;
  provenance: ProvenanceRef;
}

export function createCitation(input: CitationInput): Citation {
  const now = nowIso();
  return {
    id: `citation-${slugOf(input.label)}`,
    citingDocumentId: input.citingDocumentId,
    referenceId: input.referenceId,
    citationStyle: input.citationStyle,
    confidence: confidence(input.confidenceValue ?? 0.5),
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface CitationContextInput {
  label: string;
  citationId: string;
  chunkId: string;
  intent: CitationIntent;
  quote?: string;
  note?: string;
}

export function addCitationContext(input: CitationContextInput): CitationContext {
  const now = nowIso();
  return {
    id: `citation-context-${slugOf(input.label)}`,
    citationId: input.citationId,
    chunkId: input.chunkId,
    intent: input.intent,
    quote: input.quote,
    note: input.note,
    createdAt: now,
    updatedAt: now,
  };
}

export function citationsForDocument(
  citations: readonly Citation[],
  documentId: string,
): Citation[] {
  return citations.filter((citation) => citation.citingDocumentId === documentId);
}

export function renderCitation(reference: Reference, style: CitationStyle): string {
  const authors = reference.authors?.length ? reference.authors.join(', ') : 'Unknown';
  const year = reference.year ? ` (${reference.year})` : '';
  const title = reference.title ? ` ${reference.title}.` : '';
  const venue = reference.venue ? ` ${reference.venue}.` : '';
  switch (style) {
    case 'apa':
      return `${authors}${year}.${title}${venue}`;
    case 'ieee':
      return `[1] ${authors}, \u201C${reference.title ?? reference.identifier},\u201D${venue}${year}.`;
    case 'harvard':
      return `${authors}${year}, ${reference.title ?? reference.identifier}, ${venue ?? ''}`;
    default:
      return `${authors}${year}. ${reference.title ?? reference.identifier}.${venue}`;
  }
}

export interface CitationStatistics {
  references: number;
  citations: number;
  contexts: number;
  byIntent: Partial<Record<CitationIntent, number>>;
}

export function citationStatistics(
  references: readonly Reference[],
  citations: readonly Citation[] = [],
  contexts: readonly CitationContext[] = [],
): CitationStatistics {
  const byIntent: Partial<Record<CitationIntent, number>> = {};
  for (const context of contexts) {
    byIntent[context.intent] = (byIntent[context.intent] ?? 0) + 1;
  }
  return {
    references: references.length,
    citations: citations.length,
    contexts: contexts.length,
    byIntent,
  };
}
