/**
 * E-11 Literature Engine — Mission 004-D (Wave 2).
 *
 * Pure literature helpers: structured search, screening, summarisation,
 * research-gap identification, novelty assessment, and literature
 * recommendations (CRIE Chs. 15–17). All derived, never authoritative.
 */
import type {
  GapAssessment,
  GapSignal,
  GapStatus,
  GapType,
  LiteratureRecommendation,
  LiteratureRecommendationKind,
  LiteratureSearch,
  LiteratureSearchStatus,
  LiteratureSummary,
  NoveltyAssessment,
  NoveltySignal,
  ProvenanceRef,
  ResearchGap,
  ResearcherRef,
  ScreeningDecision,
  ScreeningVerdict,
  SearchQuery,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function literatureSearchId(label: string): string {
  return `search-${slugOf(label)}`;
}

export interface LiteratureSearchInput {
  label: string;
  researcher: ResearcherRef;
  researchEntityId?: string;
  queries?: SearchQuery[];
  status?: LiteratureSearchStatus;
}

export function createLiteratureSearch(input: LiteratureSearchInput): LiteratureSearch {
  const now = nowIso();
  return {
    id: literatureSearchId(input.label),
    researcher: input.researcher,
    researchEntityId: input.researchEntityId,
    status: input.status ?? 'planned',
    queries: input.queries ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function searchQuery(
  queryText: string,
  filters: Record<string, unknown> = {},
): SearchQuery {
  return { id: `query-${slugOf(queryText)}`, queryText, filters };
}

export interface ScreeningDecisionInput {
  label: string;
  literatureSearchId: string;
  documentId: string;
  decision: ScreeningVerdict;
  rationale: string;
}

export function screeningDecision(input: ScreeningDecisionInput): ScreeningDecision {
  const now = nowIso();
  return {
    id: `screen-${slugOf(input.label)}`,
    literatureSearchId: input.literatureSearchId,
    documentId: input.documentId,
    decision: input.decision,
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface LiteratureSummaryInput {
  label: string;
  literatureSearchId: string;
  summary: string;
  coveredDocumentIds: string[];
  confidenceValue?: number;
  provenance: ProvenanceRef[];
}

export function summarizeLiterature(input: LiteratureSummaryInput): LiteratureSummary {
  const now = nowIso();
  return {
    id: `lit-summary-${slugOf(input.label)}`,
    literatureSearchId: input.literatureSearchId,
    summary: input.summary,
    coveredDocumentIds: input.coveredDocumentIds,
    confidence: confidence(input.confidenceValue ?? 0.5),
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
  };
}

export function researchGapId(label: string): string {
  return `gap-${slugOf(label)}`;
}

export interface ResearchGapInput {
  label: string;
  gapType: GapType;
  statement: string;
  researchEntityId?: string;
  status?: GapStatus;
}

export function createResearchGap(input: ResearchGapInput): ResearchGap {
  const now = nowIso();
  return {
    id: researchGapId(input.label),
    researchEntityId: input.researchEntityId,
    gapType: input.gapType,
    status: input.status ?? 'candidate',
    statement: input.statement,
    createdAt: now,
    updatedAt: now,
  };
}

export interface GapAssessmentInput {
  label: string;
  researchGapId: string;
  strength: number;
  confidenceValue?: number;
  evidenceRecordIds?: string[];
}

export function assessGap(input: GapAssessmentInput): GapAssessment {
  const now = nowIso();
  return {
    id: `gap-assess-${slugOf(input.label)}`,
    researchGapId: input.researchGapId,
    strength: round(Math.max(0, Math.min(1, input.strength))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    evidenceRecordIds: input.evidenceRecordIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function gapSignal(
  researchGapIdValue: string,
  kind: string,
  weight: number,
  evidenceRecordId: string,
): GapSignal {
  return {
    id: `gap-signal-${slugOf(kind)}`,
    researchGapId: researchGapIdValue,
    kind,
    weight: round(Math.max(0, Math.min(1, weight))),
    evidenceRecordId,
  };
}

export interface NoveltyAssessmentInput {
  label: string;
  researchEntityId: string;
  noveltyScore: number;
  confidenceValue?: number;
  documentId?: string;
  rationale: string;
}

export function assessNovelty(input: NoveltyAssessmentInput): NoveltyAssessment {
  const now = nowIso();
  return {
    id: `novelty-${slugOf(input.label)}`,
    researchEntityId: input.researchEntityId,
    documentId: input.documentId,
    noveltyScore: round(Math.max(0, Math.min(1, input.noveltyScore))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export function noveltySignal(
  noveltyAssessmentId: string,
  kind: string,
  weight: number,
  evidenceRecordId: string,
): NoveltySignal {
  return {
    id: `novelty-signal-${slugOf(kind)}`,
    noveltyAssessmentId,
    kind,
    weight: round(Math.max(0, Math.min(1, weight))),
    evidenceRecordId,
  };
}

export interface LiteratureRecommendationInput {
  label: string;
  literatureSearchId: string;
  researchEntityId: string;
  documentId: string;
  recommendationKind: LiteratureRecommendationKind;
  relevance: number;
  rationale: string;
}

export function recommendLiterature(input: LiteratureRecommendationInput): LiteratureRecommendation {
  const now = nowIso();
  return {
    id: `lit-rec-${slugOf(input.label)}`,
    literatureSearchId: input.literatureSearchId,
    researchEntityId: input.researchEntityId,
    documentId: input.documentId,
    recommendationKind: input.recommendationKind,
    relevance: round(Math.max(0, Math.min(1, input.relevance))),
    rationale: input.rationale,
    createdAt: now,
    updatedAt: now,
  };
}

export interface LiteratureStatistics {
  searches: number;
  gaps: number;
  confirmedGaps: number;
  noveltyAssessments: number;
  recommendations: number;
}

export function literatureStatistics(
  searches: readonly LiteratureSearch[],
  gaps: readonly ResearchGap[],
  noveltyAssessments: readonly NoveltyAssessment[] = [],
  recommendations: readonly LiteratureRecommendation[] = [],
): LiteratureStatistics {
  return {
    searches: searches.length,
    gaps: gaps.length,
    confirmedGaps: gaps.filter((gap) => gap.status === 'confirmed').length,
    noveltyAssessments: noveltyAssessments.length,
    recommendations: recommendations.length,
  };
}
