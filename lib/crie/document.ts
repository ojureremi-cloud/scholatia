/**
 * E-10 Document Engine — Mission 004-D (Wave 2).
 *
 * Pure document helpers over `Document`, `DocumentChunk`, `ExtractionRecord`,
 * and `FormatConversion` (CRIE Ch. 12). Documents are provenance-bearing
 * ingested artefacts, chunked into passage-level units.
 */
import type {
  Document,
  DocumentChunk,
  DocumentKind,
  ExtractionRecord,
  FormatConversion,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function documentId(label: string): string {
  return `doc-${slugOf(label)}`;
}

export interface DocumentInput {
  label: string;
  owner: ResearcherRef;
  kind: DocumentKind;
  title: string;
  format: string;
  researchEntityId?: string;
}

export function createDocument(input: DocumentInput): Document {
  const now = nowIso();
  return {
    id: documentId(input.label),
    owner: input.owner,
    kind: input.kind,
    title: input.title,
    format: input.format,
    researchEntityId: input.researchEntityId,
    chunks: [],
    extraction: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function chunkId(label: string): string {
  return `chunk-${slugOf(label)}`;
}

export function chunkDocument(
  document: Document,
  content: string,
  position: number,
  sourceVersion: number = document.version,
): DocumentChunk {
  return {
    id: chunkId(content),
    documentId: document.id,
    position,
    content,
    sourceVersion,
  };
}

export function addChunk(document: Document, chunk: DocumentChunk): Document {
  const now = nowIso();
  return { ...document, chunks: [...document.chunks, chunk], updatedAt: now };
}

export function extractionRecordId(label: string): string {
  return `extract-${slugOf(label)}`;
}

export interface ExtractionRecordInput {
  label: string;
  documentId: string;
  method: string;
  confidenceValue?: number;
}

export function recordExtraction(input: ExtractionRecordInput): ExtractionRecord {
  const now = nowIso();
  return {
    id: extractionRecordId(input.label),
    documentId: input.documentId,
    method: input.method,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export function documentsFor(
  documents: readonly Document[],
  ownerUsername: string,
): Document[] {
  return documents.filter((document) => document.owner.username === ownerUsername);
}

export function documentWordCount(document: Document): number {
  return document.chunks.reduce(
    (sum, chunk) => sum + chunk.content.split(/\s+/).filter(Boolean).length,
    0,
  );
}

export interface FormatConversionInput {
  label: string;
  documentId: string;
  fromFormat: string;
  toFormat: string;
}

export function convertFormat(input: FormatConversionInput): FormatConversion {
  const now = nowIso();
  return {
    id: `convert-${slugOf(input.label)}`,
    documentId: input.documentId,
    fromFormat: input.fromFormat,
    toFormat: input.toFormat,
    convertedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export interface DocumentStatistics {
  total: number;
  byKind: Partial<Record<DocumentKind, number>>;
  totalChunks: number;
  averageWordCount: number;
}

export function documentStatistics(documents: readonly Document[]): DocumentStatistics {
  const byKind: Partial<Record<DocumentKind, number>> = {};
  let totalChunks = 0;
  let wordTotal = 0;
  for (const document of documents) {
    byKind[document.kind] = (byKind[document.kind] ?? 0) + 1;
    totalChunks += document.chunks.length;
    wordTotal += documentWordCount(document);
  }
  return {
    total: documents.length,
    byKind,
    totalChunks,
    averageWordCount: documents.length === 0 ? 0 : wordTotal / documents.length,
  };
}
