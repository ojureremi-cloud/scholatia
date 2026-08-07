/**
 * CRIE intelligence engine types (fspec §2.12, §4.7; Mission 008).
 *
 * The orchestration layer composes the pure CRIE engines — knowledge graph,
 * memory, reasoning, evidence, trust, recommendation, decision, and analytics
 * (CRIE Chs. 9–16, 36, 43, 65) — into derived-first intelligence surfaces:
 * graph reasoning, semantic search, research recommendations, decision
 * support, analytics intelligence, the research assistant, and the unified
 * intelligence pipeline. All values are derived and never authoritative.
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
  Versioned,
} from './base';
import type { KGEntity, KGEntityClass, KGRelationPredicate, KnowledgeGraph } from './knowledge';
import type { Decision, Recommendation, RecommendationStatus } from './decision';
import type { MemoryItem } from './memory';
import type { ReasoningTrace } from './reasoning';
import type { ResearchAnalytics } from './analytics';

// ---------------------------------------------------------------------------
// Graph reasoning (E-31)
// ---------------------------------------------------------------------------

/** A path through the RKG from one entity to another. */
export interface GraphPath {
  id: string;
  fromCrieId: string;
  toCrieId: string;
  nodes: { crieId: string; entityClass: KGEntityClass }[];
  edges: { relationId: string; predicate: KGRelationPredicate }[];
  length: number;
  confidence: ConfidenceScore;
}
/** The derived similarity between two RKG entities. */
export interface EntitySimilarity {
  entityA: string;
  entityB: string;
  similarity: number; // 0..1
  sharedPredicates: KGRelationPredicate[];
  sharedNeighbourIds: string[];
  confidence: ConfidenceScore;
}

/** A relationship discovered through multi-hop reasoning. */
export interface RelationshipDiscovery {
  id: string;
  subjectCrieId: string;
  objectCrieId: string;
  predicate: KGRelationPredicate;
  viaEntityId: string;
  strength: number; // 0..1
  confidence: ConfidenceScore;
  rationale: string;
}

/** Trust propagated along a graph path (derived, never stored). */
export interface TrustPropagation {
  id: string;
  sourceCrieId: string;
  targetCrieId: string;
  trust: number; // 0..1
  pathLength: number;
  confidence: ConfidenceScore;
  rule: string;
}

// ---------------------------------------------------------------------------
// Semantic search (E-32)
// ---------------------------------------------------------------------------

export type SearchRankingFactorKey =
  | 'token'
  | 'confidence'
  | 'freshness'
  | 'connectivity'
  | 'trust';

/** One explainable factor of a multi-factor rank. */
export interface SearchRankingFactor {
  key: SearchRankingFactorKey;
  weight: number;
  score: number; // 0..1
  contribution: number; // weight * score
}

/** A ranked entity with its factor breakdown. */
export interface RankedEntityResult {
  entity: KGEntity;
  score: number;
  factors: SearchRankingFactor[];
}

/** Per-entity multi-factor score snapshot. */
export interface MultiFactorScore {
  entityCrieId: string;
  total: number;
  factors: SearchRankingFactor[];
}

/** Options controlling multi-factor ranking. */
export interface MultiFactorSearchOptions {
  weights?: Partial<Record<SearchRankingFactorKey, number>>;
  limit?: number;
  minScore?: number;
}

/** Options controlling semantic search over the RKG. */
export interface SemanticSearchOptions {
  limit?: number;
  minConfidence?: number;
  entityClasses?: string[];
}

// ---------------------------------------------------------------------------
// Research recommendations (E-33)
// ---------------------------------------------------------------------------

export type ResearchRecommendationKind =
  | 'next-step'
  | 'evidence-gap'
  | 'literature'
  | 'methodology'
  | 'collaboration'
  | 'funding'
  | 'publication-readiness'
  | 'mentorship';

/** An explainable reason behind a research recommendation. */
export interface RecommendationReason {
  type: 'premise' | 'evidence' | 'inference';
  detail: string;
  sourceIds: string[];
}

/** A derived, grounded next-best action for a research entity. */
export interface ResearchRecommendation extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  researchEntityId: string;
  kind: ResearchRecommendationKind;
  title: string;
  summary: string;
  reasons: RecommendationReason[];
  confidence: ConfidenceScore;
  status: RecommendationStatus;
  evidenceChainIds: string[];
}

export type AssistantRecommendationKind =
  | 'suggested-reading'
  | 'background-context'
  | 'next-question'
  | 'collaborator'
  | 'source-verification'
  | 'method-suggestion';

/** A lightweight suggestion surfaced by the research assistant. */
export interface AssistantRecommendation extends Auditable {
  id: string;
  kind: AssistantRecommendationKind;
  summary: string;
  rationale: string;
  confidence: ConfidenceScore;
  action?: string;
}

// ---------------------------------------------------------------------------
// Decision support (E-34)
// ---------------------------------------------------------------------------

/** Pros and cons of a single decision option. */
export interface OptionProsCons {
  optionId: string;
  pros: string[];
  cons: string[];
}

export type DecisionRiskLevel = 'low' | 'medium' | 'high';

/** A derived risk assessment for a decision option. */
export interface DecisionRisk {
  optionId: string;
  level: DecisionRiskLevel;
  riskScore: number; // 0..1
  factors: string[];
  confidence: ConfidenceScore;
}

/** A gap in the evidence that would inform a decision. */
export interface MissingEvidence {
  question: string;
  whyItMatters: string;
  relatedEvidenceIds: string[];
}

/** The full derived decision-support analysis. */
export interface DecisionSupportAnalysis extends Auditable {
  id: string;
  decisionId: string;
  prosCons: OptionProsCons[];
  risks: DecisionRisk[];
  missingEvidence: MissingEvidence[];
  recommendedOptionId?: string;
  confidence: ConfidenceScore;
}

// ---------------------------------------------------------------------------
// Analytics intelligence (E-35)
// ---------------------------------------------------------------------------

export type IntelligenceIndicatorKey =
  | 'research-output'
  | 'citation-impact'
  | 'collaboration'
  | 'funding'
  | 'progress'
  | 'readiness'
  | 'novelty'
  | 'expertise-match';

/** A derived, cached intelligence indicator (never authoritative). */
export interface IntelligenceIndicator {
  key: IntelligenceIndicatorKey;
  label: string;
  value: number; // 0..1
  change: number; // -1..1 vs previous snapshot
  confidence: ConfidenceScore;
  evidenceVersion: number;
}

// ---------------------------------------------------------------------------
// Research assistant & pipeline (E-36)
// ---------------------------------------------------------------------------

/** An answer produced for a research question. */
export interface ResearchAnswer extends Auditable {
  id: string;
  researchEntityId: string;
  question: string;
  summary: string;
  evidenceChainIds: string[];
  citations: string[];
  confidence: ConfidenceScore;
  openQuestions: string[];
}

/** The assembled research-assistant report. */
export interface ResearchAssistantReport extends Auditable {
  id: string;
  owner: ResearcherRef;
  researchEntityId: string;
  answers: ResearchAnswer[];
  recommendations: ResearchRecommendation[];
  gaps: MissingEvidence[];
  generatedAt: string;
  confidence: ConfidenceScore;
}

/** The stages of the unified intelligence pipeline. */
export type IntelligenceStage =
  | 'knowledge'
  | 'memory'
  | 'reasoning'
  | 'evidence'
  | 'recommendation'
  | 'decision'
  | 'analytics';

/** The result of one pipeline stage. */
export interface IntelligenceStageResult {
  stage: IntelligenceStage;
  ok: boolean;
  detail: string;
  producedIds: string[];
}

/** The inputs the intelligence pipeline composes. */
export interface IntelligencePipelineInput {
  researchEntityId: string;
  graph: KnowledgeGraph;
  memoryItems: MemoryItem[];
  traces: ReasoningTrace[];
  recommendations: Recommendation[];
  decisions: Decision[];
  analyticsList: ResearchAnalytics[];
  answers: ResearchAnswer[];
  owner: ResearcherRef;
}

/** The aggregate intelligence report of the pipeline. */
export interface IntelligenceReport extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  researchEntityId: string;
  stages: IntelligenceStageResult[];
  indicators: IntelligenceIndicator[];
  answers: ResearchAnswer[];
  recommendations: ResearchRecommendation[];
  generatedAt: string;
  confidence: ConfidenceScore;
}
