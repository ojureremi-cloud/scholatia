/**
 * CRIE server read access — Mission 004-F (Wave 4).
 *
 * The read surface used by the CRIE pages. The in-memory store is seeded once
 * from the placeholder constants (dev seed only — `lib/crie/db/seed.ts` is the
 * single importer of `constants/placeholder-crie.ts`). These accessors expose
 * the original domain objects (`row.value`) to server components so the runtime
 * import graph never touches the placeholder constants directly. Write paths go
 * through the permission-enforcing services and the `/api/crie/**` routes.
 */
import type {
  CareerGoal,
  CareerSignal,
  Citation,
  CitationContext,
  Claim,
  ContextElement,
  ContextPack,
  Contradiction,
  EnterpriseCognitiveModel,
  EthicsDecision,
  EthicsReview,
  EvidenceAssessment,
  EvidenceRecord,
  FederationContract,
  GovernedExchange,
  InstitutionalKnowledgeAsset,
  KGEntity,
  KGRelation,
  KnowledgeGraph,
  LearnerState,
  LiteratureSearch,
  MemberSovereignty,
  MemoryItem,
  MentorshipGuidance,
  NoveltyAssessment,
  OrchestrationPlan,
  PublicationPlan,
  Recommendation,
  Reference,
  ResearchAnalytics,
  ResearchEntity,
  ResearchGap,
  ResearchSession,
  SessionMessage,
  SupervisionRecord,
  WritingDraft,
} from '@/types/crie';
import { ensureCrieSeeded } from './db/seed';
import { getCrieStore, tableOf } from './db/store';
import { nowIso } from './utils';
import type { CrieRecord } from '@/types/crie';

function valuesOf(table: string): CrieRecord[] {
  ensureCrieSeeded();
  return [...tableOf(getCrieStore(), table).values()]
    .filter((row) => !row.deletedAt)
    .map((row) => ((row as CrieRecord).value as CrieRecord) ?? (row as CrieRecord));
}

function firstValueOf<T>(table: string): T | undefined {
  return valuesOf(table)[0] as T | undefined;
}

/** All research entities (the canonical CRIE cognitive objects). */
export function crieEntities(): ResearchEntity[] {
  return valuesOf('crie_entities') as unknown as ResearchEntity[];
}

/** A research entity by id (undefined when unknown). */
export function crieEntity(id: string): ResearchEntity | undefined {
  return crieEntities().find((entity) => entity.id === id);
}

/** The knowledge graph (entities + relations). */
export function crieGraph(): KnowledgeGraph {
  const entities = valuesOf('crie_kg_entities') as unknown as KGEntity[];
  const relations = valuesOf('crie_kg_relations') as unknown as KGRelation[];
  const now = nowIso();
  return {
    id: 'crie-kg-default',
    scopeType: 'researcher',
    scopeId: crieCurrentResearcher().username,
    entities,
    relations,
    currentVersion: 1,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/** All memory items. */
export function crieMemoryItems(): MemoryItem[] {
  return valuesOf('crie_memory_items') as unknown as MemoryItem[];
}

/** A memory item by id (undefined when unknown). */
export function crieMemoryItem(id: string): MemoryItem | undefined {
  return crieMemoryItems().find((item) => item.id === id);
}

/** The current orchestration plan (agents + tasks). */
export function crieOrchestrationPlan(): OrchestrationPlan | undefined {
  return firstValueOf<OrchestrationPlan>('crie_orchestration_plans');
}

/** The canonical research session. */
export function crieSession(): ResearchSession | undefined {
  return firstValueOf<ResearchSession>('crie_sessions');
}

/** Session messages for the canonical session. */
export function crieSessionMessages(): SessionMessage[] {
  return valuesOf('crie_session_messages') as unknown as SessionMessage[];
}

/** Context packs (assembled micro/standard context). */
export function crieContextPacks(): ContextPack[] {
  return valuesOf('crie_context_packs') as unknown as ContextPack[];
}

/** The current recommendation. */
export function crieRecommendation(): Recommendation | undefined {
  return firstValueOf<Recommendation>('crie_recommendations');
}

/** Evidence records. */
export function crieEvidence(): EvidenceRecord[] {
  return valuesOf('crie_evidence_records') as unknown as EvidenceRecord[];
}

/** Evidence assessments (per claim/record verdicts). */
export function crieEvidenceAssessments(): EvidenceAssessment[] {
  return valuesOf('crie_evidence_assessments') as unknown as EvidenceAssessment[];
}

/** Contradictions between claims. */
export function crieContradictions(): Contradiction[] {
  return valuesOf('crie_contradictions') as unknown as Contradiction[];
}

/** Citation records. */
export function crieCitations(): Citation[] {
  return valuesOf('crie_citations') as unknown as Citation[];
}

/** Analytics records. */
export function crieAnalytics(): ResearchAnalytics[] {
  return valuesOf('crie_analytics_records') as unknown as ResearchAnalytics[];
}

/** The canonical CRIE demo researcher (owner of seeded entities). */
export function crieCurrentResearcher(): { username: string; name?: string } {
  const first = crieEntities()[0];
  const owner = first?.owner as { username?: string; name?: string } | string | undefined;
  if (owner && typeof owner === 'object' && owner.username) return { username: owner.username, name: owner.name };
  if (owner && typeof owner === 'string') return { username: owner };
  return { username: 'ojuri' };
}

// ---------------------------------------------------------------------------
// Governance, integrity, knowledge bases
// ---------------------------------------------------------------------------

/** Claims (knowledge integrity). */
export function crieClaims(): Claim[] {
  return valuesOf('crie_claims') as unknown as Claim[];
}

/** References (bibliography). */
export function crieReferences(): Reference[] {
  return valuesOf('crie_references') as unknown as Reference[];
}

/** Citation contexts. */
export function crieCitationContexts(): CitationContext[] {
  return valuesOf('crie_citation_contexts') as unknown as CitationContext[];
}

/** Literature searches. */
export function crieLiteratureSearches(): LiteratureSearch[] {
  return valuesOf('crie_literature_searches') as unknown as LiteratureSearch[];
}

/** Research gaps. */
export function crieResearchGaps(): ResearchGap[] {
  return valuesOf('crie_research_gaps') as unknown as ResearchGap[];
}

/** Novelty assessments. */
export function crieNoveltyAssessments(): NoveltyAssessment[] {
  return valuesOf('crie_novelty_assessments') as unknown as NoveltyAssessment[];
}

/** Career goals. */
export function crieCareerGoals(): CareerGoal[] {
  return valuesOf('crie_career_goals') as unknown as CareerGoal[];
}

/** Career signals. */
export function crieCareerSignals(): CareerSignal[] {
  return valuesOf('crie_career_signals') as unknown as CareerSignal[];
}

/** Learner states. */
export function crieLearnerStates(): LearnerState[] {
  return valuesOf('crie_learner_states') as unknown as LearnerState[];
}

/** Writing drafts. */
export function crieWritingDrafts(): WritingDraft[] {
  return valuesOf('crie_writing_drafts') as unknown as WritingDraft[];
}

/** Publication plans. */
export function criePublicationPlans(): PublicationPlan[] {
  return valuesOf('crie_publication_plans') as unknown as PublicationPlan[];
}

/** Supervision records. */
export function crieSupervisionRecords(): SupervisionRecord[] {
  return valuesOf('crie_supervision_records') as unknown as SupervisionRecord[];
}

/** Mentorship guidance records. */
export function crieMentorshipGuidance(): MentorshipGuidance[] {
  return valuesOf('crie_mentorship_guidance') as unknown as MentorshipGuidance[];
}

/** Ethics reviews. */
export function crieEthicsReviews(): EthicsReview[] {
  return valuesOf('crie_ethics_reviews') as unknown as EthicsReview[];
}

/** Ethics decisions. */
export function crieEthicsDecisions(): EthicsDecision[] {
  return valuesOf('crie_ethics_decisions') as unknown as EthicsDecision[];
}

/** Context elements (micro-context pool). */
export function crieContextElements(): ContextElement[] {
  return valuesOf('crie_context_elements') as unknown as ContextElement[];
}

// ---------------------------------------------------------------------------
// Institutions, federation
// ---------------------------------------------------------------------------

/** The enterprise cognitive model row for the current institution. */
export function crieEnterpriseModel(): EnterpriseCognitiveModel | undefined {
  return firstValueOf<EnterpriseCognitiveModel>('crie_enterprise_models');
}

/** Institutional knowledge assets (IKOS). */
export function crieInstitutionalAssets(): InstitutionalKnowledgeAsset[] {
  return valuesOf('crie_institutional_assets') as unknown as InstitutionalKnowledgeAsset[];
}

/** Federation contracts. */
export function crieFederationContracts(): FederationContract[] {
  return valuesOf('crie_federation_contracts') as unknown as FederationContract[];
}

/** Federation exchanges. */
export function crieFederationExchanges(): GovernedExchange[] {
  return valuesOf('crie_federation_exchanges') as unknown as GovernedExchange[];
}

/** Member sovereignty record for the current institution. */
export function crieMemberSovereignty(): MemberSovereignty | undefined {
  return firstValueOf<MemberSovereignty>('crie_member_sovereignty');
}
