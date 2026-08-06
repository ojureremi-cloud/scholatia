/**
 * CRIE DTO contracts (fspec §4.8, Ch. 11).
 *
 * Stable input/output contracts consumed across surfaces, following the
 * `IN-###` identifier convention (CRIE Appendix A). AI integration is
 * derived-first, governed, and labelled; every consequential output is
 * explainable and dismissible.
 */
import type { ConfidenceScore, ProvenanceRef } from './base';
import type { ContextKind } from './context';
import type { AgentId } from './agents';
import type { DecisionCapability, RecommendationExplanation } from './decision';
import type { ReasoningParadigm } from './reasoning';
import type { MemoryItem, MemoryTypeId } from './memory';

/** Context supply (IN-101). */
export interface ContextPackDto {
  contextKind: ContextKind;
  elements: { ref: string; relevance: number; confidence: ConfidenceScore }[];
  budgetUsed: number;
  provenanceRefs: string[];
}

/** Reasoning output (IN-105). */
export interface ReasoningOutputDto {
  traceId: string;
  conclusion: string;
  confidence: ConfidenceScore;
  paradigm: ReasoningParadigm;
  evidenceChainIds: string[];
  refusals?: string[]; // Article X
}

/** Recommendation output (IN-106). */
export interface RecommendationDto {
  recommendationId: string;
  kind: DecisionCapability;
  summary: string;
  explanation: RecommendationExplanation;
  confidence: ConfidenceScore;
  dismissible: boolean;
}

/** Agent report (IN-107). */
export interface AgentReportDto {
  taskId: string;
  agentId: AgentId;
  status: string;
  result?: unknown;
  provenance: ProvenanceRef;
  openIssues: string[];
  requiresHumanApproval: boolean;
}

/** Search output (IN-108). */
export interface SearchOutputDto {
  query: string;
  results: SearchResultDto[];
  generatedAt: string;
}

export interface SearchResultDto {
  ref: string;
  title: string;
  sourceType: string;
  relevance: number;
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
}

/** Evidence output (IN-109). */
export interface EvidenceOutputDto {
  claimId: string;
  supporting: EvidenceOutputItem[];
  contradicting: EvidenceOutputItem[];
  unresolved: EvidenceOutputItem[];
}

export interface EvidenceOutputItem {
  evidenceRecordId: string;
  assessment: 'supports' | 'contradicts' | 'neutral' | 'refutes';
  strength: number;
  provenance: ProvenanceRef;
}

/** Citation output (IN-110). */
export interface CitationOutputDto {
  references: CitationRefOutput[];
  formatted: string;
  style: string;
}

export interface CitationRefOutput {
  referenceId: string;
  identifier: string;
  title?: string;
  confidence: ConfidenceScore;
}

/** Memory write (IN-111). */
export interface MemoryWriteInput {
  memoryType: MemoryTypeId;
  content: string;
  accessPolicy: string;
  provenance: ProvenanceRef;
}

/** Memory read (IN-112). */
export interface MemoryReadOutput {
  items: MemoryItem[];
  accessDenied: string[];
}

/** Memory recall (IN-113). */
export interface MemoryRecallOutput {
  items: MemoryItem[];
  contextPackId: string;
}

/** Memory consolidation (IN-114). */
export interface MemoryConsolidationOutput {
  eventId: string;
  rule: string;
  promotedItemIds: string[];
}

/** Memory forget/export (IN-115). */
export interface MemoryExportOutput {
  exportedAt: string;
  items: MemoryItem[];
  format: 'json' | 'markdown';
}

/** Decision record output (IN-116). */
export interface DecisionRecordDto {
  decisionId: string;
  accountableHuman: string;
  chosenOptionId: string;
  rationale: string;
  trackedOutcome?: string;
}
