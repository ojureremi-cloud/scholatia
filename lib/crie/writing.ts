/**
 * E-16 Writing Engine — Mission 004-D (Wave 2).
 *
 * Pure writing helpers over `WritingDraft`, `WritingRevision`, and
 * `StyleProfile` (CRIE Ch. 23). Drafts are provenance-bearing and citation-
 * controlled; revisions are append-only.
 */
import type {
  ProvenanceRef,
  ResearcherRef,
  StyleProfile,
  WritingDraft,
  WritingDraftType,
  WritingRevision,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function writingDraftId(label: string): string {
  return `draft-${slugOf(label)}`;
}

export interface WritingDraftInput {
  label: string;
  researchEntityId: string;
  author: ResearcherRef;
  draftType: WritingDraftType;
  title: string;
  content: string;
  provenance: ProvenanceRef;
  documentId?: string;
  citations?: string[];
}

export function createWritingDraft(input: WritingDraftInput): WritingDraft {
  const now = nowIso();
  return {
    id: writingDraftId(input.label),
    documentId: input.documentId,
    researchEntityId: input.researchEntityId,
    author: input.author,
    draftType: input.draftType,
    title: input.title,
    content: input.content,
    wordCount: wordCountOf(input.content),
    citations: input.citations ?? [],
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function wordCountOf(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

export interface WritingRevisionInput {
  label: string;
  writingDraftId: string;
  revisionOrder: number;
  changes: string;
  appliedBy: ResearcherRef;
}

export function reviseDraft(input: WritingRevisionInput): WritingRevision {
  const now = nowIso();
  return {
    id: `revision-${slugOf(input.label)}`,
    writingDraftId: input.writingDraftId,
    revisionOrder: input.revisionOrder,
    changes: input.changes,
    appliedBy: input.appliedBy,
    createdAt: now,
    updatedAt: now,
  };
}

export interface StyleProfileInput {
  label: string;
  researcher: ResearcherRef;
  tone: string;
  voice: string;
  citationStyle: string;
  preferences?: Record<string, unknown>;
  confidenceValue?: number;
}

export function createStyleProfile(input: StyleProfileInput): StyleProfile {
  const now = nowIso();
  return {
    id: `style-${slugOf(input.label)}`,
    researcher: input.researcher,
    tone: input.tone,
    voice: input.voice,
    citationStyle: input.citationStyle,
    preferences: input.preferences ?? {},
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export interface WritingStatistics {
  drafts: number;
  revisions: number;
  styleProfiles: number;
  averageWordCount: number;
}

export function writingStatistics(
  drafts: readonly WritingDraft[],
  revisions: readonly WritingRevision[] = [],
  styleProfiles: readonly StyleProfile[] = [],
): WritingStatistics {
  const wordTotal = drafts.reduce((sum, draft) => sum + draft.wordCount, 0);
  return {
    drafts: drafts.length,
    revisions: revisions.length,
    styleProfiles: styleProfiles.length,
    averageWordCount: drafts.length === 0 ? 0 : Math.round(wordTotal / drafts.length),
  };
}
