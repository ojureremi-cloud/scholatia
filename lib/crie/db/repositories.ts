/**
 * CRIE domain repositories — Mission 004-F (Wave 4).
 *
 * One `CrieRepository` per CRIE persistence domain, backed by the in-memory
 * store (`lib/crie/db/store.ts`) and seeded once from the placeholder
 * constants (development seed only). Each definition fixes the update
 * whitelist (never `owner`/`id`/audit fields), the search title/description,
 * the facet, and the calibrated confidence extractor.
 */
import type { CrieRecord, CrieTableDefinition } from '@/types/crie';
import { CrieRepository } from './repository';

interface DefinitionOptions {
  table: string;
  fields: readonly string[];
  titleKey?: string;
  descriptionKey?: string;
  facetKey?: string;
  confidenceKey?: string;
  allowPurge?: boolean;
  searchable?: boolean;
}

function definition(options: DefinitionOptions): CrieTableDefinition {
  const {
    table,
    fields,
    titleKey = 'title',
    descriptionKey,
    facetKey,
    confidenceKey,
    allowPurge = false,
    searchable = true,
  } = options;
  return {
    table,
    fields,
    searchTitle: searchable
      ? (row: CrieRecord) => String(row[titleKey] ?? row.crieId ?? '')
      : undefined,
    searchDescription: descriptionKey
      ? (row: CrieRecord) => {
          const value = row[descriptionKey];
          return value == null ? undefined : String(value);
        }
      : undefined,
    facet: facetKey
      ? (row: CrieRecord) => {
          const value = row[facetKey];
          return value == null ? undefined : String(value);
        }
      : undefined,
    confidenceOf: confidenceKey
      ? (row: CrieRecord) => (typeof row[confidenceKey] === 'number' ? Number(row[confidenceKey]) : 0.5)
      : undefined,
    allowPurge,
  };
}

const nowDesc = [{ field: 'updatedAt', direction: 'desc' as const }];
const createdAsc = [{ field: 'createdAt', direction: 'asc' as const }];

// ---------------------------------------------------------------------------
// Research & projects (crie_entities)
// ---------------------------------------------------------------------------

export const crieEntityDefinition = definition({
  table: 'crie_entities',
  fields: ['title', 'description', 'kind', 'entityType', 'stage', 'discipline', 'owner', 'ownerName', 'model', 'statusVector', 'confidence', 'attributes'],
  descriptionKey: 'stage',
  facetKey: 'kind',
  confidenceKey: 'confidence',
});

export const crieEntityRepository = new CrieRepository({
  definition: crieEntityDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Knowledge Graph (crie_kg_entities, crie_kg_relations)
// ---------------------------------------------------------------------------

export const crieKgEntityDefinition = definition({
  table: 'crie_kg_entities',
  fields: ['label', 'entityClass', 'attributes', 'provenance', 'confidence', 'lifecycleState', 'graphId', 'owner'],
  titleKey: 'label',
  facetKey: 'entityClass',
  confidenceKey: 'confidence',
});

export const crieKgEntityRepository = new CrieRepository({
  definition: crieKgEntityDefinition,
  defaultSort: createdAsc,
});

export const crieKgRelationDefinition = definition({
  table: 'crie_kg_relations',
  fields: ['subject', 'object', 'predicate', 'strength', 'confidence', 'provenance', 'validFrom', 'validTo', 'owner', 'label'],
  titleKey: 'label',
  facetKey: 'predicate',
  confidenceKey: 'confidence',
});

export const crieKgRelationRepository = new CrieRepository({
  definition: crieKgRelationDefinition,
  defaultSort: createdAsc,
});

// ---------------------------------------------------------------------------
// Evidence (crie_evidence_records)
// ---------------------------------------------------------------------------

export const crieEvidenceDefinition = definition({
  table: 'crie_evidence_records',
  fields: ['label', 'evidenceType', 'summary', 'provenance', 'confidenceValue', 'confidence', 'researchEntityId', 'owner', 'status', 'documentId', 'chunkId'],
  titleKey: 'label',
  descriptionKey: 'summary',
  facetKey: 'evidenceType',
  confidenceKey: 'confidenceValue',
});

export const crieEvidenceRepository = new CrieRepository({
  definition: crieEvidenceDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Citations & references (crie_citations)
// ---------------------------------------------------------------------------

export const crieCitationDefinition = definition({
  table: 'crie_citations',
  fields: ['label', 'citingDocumentId', 'referenceId', 'citationStyle', 'confidenceValue', 'confidence', 'provenance', 'intent', 'owner'],
  titleKey: 'label',
  facetKey: 'citationStyle',
  confidenceKey: 'confidenceValue',
});

export const crieCitationRepository = new CrieRepository({
  definition: crieCitationDefinition,
  defaultSort: nowDesc,
});

export const crieReferenceDefinition = definition({
  table: 'crie_references',
  fields: ['title', 'identifierKind', 'identifier', 'authors', 'venue', 'year', 'confidenceValue', 'confidence', 'provenance', 'owner', 'label'],
  titleKey: 'title',
  facetKey: 'identifierKind',
  confidenceKey: 'confidenceValue',
});

export const crieReferenceRepository = new CrieRepository({
  definition: crieReferenceDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Memory (crie_memory_items)
// ---------------------------------------------------------------------------

export const crieMemoryDefinition = definition({
  table: 'crie_memory_items',
  fields: ['memoryType', 'title', 'content', 'accessPolicy', 'relevance', 'expiresAt', 'provenance', 'sessionId', 'researchEntityId', 'happenedAt', 'owner', 'consolidated', 'consolidationId'],
  titleKey: 'content',
  facetKey: 'memoryType',
  confidenceKey: 'relevance',
});

export const crieMemoryRepository = new CrieRepository({
  definition: crieMemoryDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Reasoning (crie_reasoning_traces)
// ---------------------------------------------------------------------------

export const crieReasoningDefinition = definition({
  table: 'crie_reasoning_traces',
  fields: ['label', 'paradigm', 'status', 'conclusion', 'traces', 'arguments', 'confidenceValue', 'confidence', 'researchEntityId', 'owner', 'explanation'],
  titleKey: 'label',
  descriptionKey: 'conclusion',
  facetKey: 'paradigm',
  confidenceKey: 'confidenceValue',
});

export const crieReasoningRepository = new CrieRepository({
  definition: crieReasoningDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Agents (crie_agents)
// ---------------------------------------------------------------------------

export const crieAgentDefinition = definition({
  table: 'crie_agents',
  fields: ['agentId', 'name', 'description', 'status', 'autonomyLevel', 'role', 'capabilities', 'owner'],
  titleKey: 'name',
  descriptionKey: 'description',
  facetKey: 'status',
});

export const crieAgentRepository = new CrieRepository({
  definition: crieAgentDefinition,
  defaultSort: createdAsc,
});

export const crieAgentTaskDefinition = definition({
  table: 'crie_agent_tasks',
  fields: ['step', 'agentId', 'status', 'priority', 'requiresApproval', 'dependencyIds', 'planId', 'owner', 'output'],
  titleKey: 'step',
  facetKey: 'status',
});

export const crieAgentTaskRepository = new CrieRepository({
  definition: crieAgentTaskDefinition,
  defaultSort: createdAsc,
});

// ---------------------------------------------------------------------------
// Recommendations (crie_recommendations)
// ---------------------------------------------------------------------------

export const crieRecommendationDefinition = definition({
  table: 'crie_recommendations',
  fields: ['label', 'kind', 'target', 'summary', 'explanation', 'confidenceValue', 'confidence', 'status', 'owner'],
  titleKey: 'label',
  descriptionKey: 'summary',
  facetKey: 'status',
  confidenceKey: 'confidenceValue',
});

export const crieRecommendationRepository = new CrieRepository({
  definition: crieRecommendationDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Trust (crie_trust_scores)
// ---------------------------------------------------------------------------

export const crieTrustDefinition = definition({
  table: 'crie_trust_scores',
  fields: ['entityType', 'entityId', 'entityName', 'score', 'confidence', 'sourceCount', 'freshness', 'owner'],
  titleKey: 'entityName',
  facetKey: 'entityType',
  confidenceKey: 'confidence',
});

export const crieTrustRepository = new CrieRepository({
  definition: crieTrustDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Institutions (crie_enterprise_models, crie_institutional_assets)
// ---------------------------------------------------------------------------

export const crieEnterpriseModelDefinition = definition({
  table: 'crie_enterprise_models',
  fields: ['institutionId', 'strategicGoals', 'strengthAreas', 'researchEntityIds', 'owner'],
  titleKey: 'institutionId',
  facetKey: 'institutionId',
});

export const crieEnterpriseModelRepository = new CrieRepository({
  definition: crieEnterpriseModelDefinition,
  defaultSort: createdAsc,
});

export const crieInstitutionalAssetDefinition = definition({
  table: 'crie_institutional_assets',
  fields: ['institutionId', 'assetKind', 'title', 'accessClass', 'consentScope', 'curator', 'owner'],
  titleKey: 'title',
  facetKey: 'assetKind',
});

export const crieInstitutionalAssetRepository = new CrieRepository({
  definition: crieInstitutionalAssetDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Federation (crie_federation_contracts)
// ---------------------------------------------------------------------------

export const crieFederationContractDefinition = definition({
  table: 'crie_federation_contracts',
  fields: ['institutionId', 'memberInstitutionId', 'contractType', 'status', 'dataScope', 'consentScope', 'sovereigntyClauses', 'owner'],
  titleKey: 'contractType',
  facetKey: 'status',
});

export const crieFederationContractRepository = new CrieRepository({
  definition: crieFederationContractDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Workspace (crie_workspaces)
// ---------------------------------------------------------------------------

export const crieWorkspaceDefinition = definition({
  table: 'crie_workspaces',
  fields: ['researcher', 'researcherName', 'panes', 'openDocuments', 'owner', 'title'],
  titleKey: 'title',
});

export const crieWorkspaceRepository = new CrieRepository({
  definition: crieWorkspaceDefinition,
  defaultSort: createdAsc,
});

// ---------------------------------------------------------------------------
// Analytics (crie_analytics_records)
// ---------------------------------------------------------------------------

export const crieAnalyticsDefinition = definition({
  table: 'crie_analytics_records',
  fields: ['scope', 'scopeId', 'indicators', 'rollups', 'kpis', 'periodStart', 'periodEnd', 'owner', 'label'],
  titleKey: 'label',
  facetKey: 'scope',
});

export const crieAnalyticsRepository = new CrieRepository({
  definition: crieAnalyticsDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Context (crie_context_packs, crie_context_elements)
// ---------------------------------------------------------------------------

export const crieContextPackDefinition = definition({
  table: 'crie_context_packs',
  fields: ['label', 'contextKind', 'budgetLimit', 'budgetUsed', 'researchEntityId', 'elements'],
  titleKey: 'label',
  facetKey: 'contextKind',
});

export const crieContextPackRepository = new CrieRepository({
  definition: crieContextPackDefinition,
  defaultSort: nowDesc,
});

export const crieContextElementDefinition = definition({
  table: 'crie_context_elements',
  fields: ['label', 'sourceType', 'sourceId', 'relevanceWeight', 'content', 'provenance'],
  titleKey: 'content',
  descriptionKey: 'sourceType',
  facetKey: 'sourceType',
});

export const crieContextElementRepository = new CrieRepository({
  definition: crieContextElementDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Sessions (crie_sessions, crie_session_goals, crie_session_messages)
// ---------------------------------------------------------------------------

export const crieSessionDefinition = definition({
  table: 'crie_sessions',
  fields: ['label', 'researcher', 'workspaceId', 'goals', 'status', 'startedAt'],
  titleKey: 'label',
  facetKey: 'status',
});

export const crieSessionRepository = new CrieRepository({
  definition: crieSessionDefinition,
  defaultSort: nowDesc,
});

export const crieSessionGoalDefinition = definition({
  table: 'crie_session_goals',
  fields: ['label', 'sessionId', 'goalType', 'statement'],
  titleKey: 'label',
  facetKey: 'goalType',
});

export const crieSessionGoalRepository = new CrieRepository({
  definition: crieSessionGoalDefinition,
  defaultSort: createdAsc,
});

export const crieSessionMessageDefinition = definition({
  table: 'crie_session_messages',
  fields: ['sessionId', 'role', 'content', 'at'],
  titleKey: 'content',
  facetKey: 'role',
});

export const crieSessionMessageRepository = new CrieRepository({
  definition: crieSessionMessageDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Integrity (crie_claims, crie_evidence_assessments, crie_contradictions)
// ---------------------------------------------------------------------------

export const crieClaimDefinition = definition({
  table: 'crie_claims',
  fields: ['label', 'claimType', 'statement', 'confidenceValue', 'documentChunkId', 'status'],
  titleKey: 'label',
  descriptionKey: 'statement',
  facetKey: 'claimType',
});

export const crieClaimRepository = new CrieRepository({
  definition: crieClaimDefinition,
  defaultSort: nowDesc,
});

export const crieEvidenceAssessmentDefinition = definition({
  table: 'crie_evidence_assessments',
  fields: ['claimId', 'evidenceRecordId', 'relation', 'strength'],
  searchable: false,
});

export const crieEvidenceAssessmentRepository = new CrieRepository({
  definition: crieEvidenceAssessmentDefinition,
  defaultSort: createdAsc,
});

export const crieContradictionDefinition = definition({
  table: 'crie_contradictions',
  fields: ['label', 'claimA', 'claimB', 'severity'],
  titleKey: 'label',
  facetKey: 'severity',
});

export const crieContradictionRepository = new CrieRepository({
  definition: crieContradictionDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Citations (crie_citation_contexts)
// ---------------------------------------------------------------------------

export const crieCitationContextDefinition = definition({
  table: 'crie_citation_contexts',
  fields: ['label', 'citationId', 'chunkId', 'intent', 'quote'],
  titleKey: 'label',
  facetKey: 'intent',
});

export const crieCitationContextRepository = new CrieRepository({
  definition: crieCitationContextDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Literature (crie_literature_searches, crie_research_gaps, crie_novelty_assessments)
// ---------------------------------------------------------------------------

export const crieLiteratureSearchDefinition = definition({
  table: 'crie_literature_searches',
  fields: ['label', 'researcher', 'researchEntityId', 'status', 'queries'],
  titleKey: 'label',
  facetKey: 'status',
});

export const crieLiteratureSearchRepository = new CrieRepository({
  definition: crieLiteratureSearchDefinition,
  defaultSort: nowDesc,
});

export const crieResearchGapDefinition = definition({
  table: 'crie_research_gaps',
  fields: ['label', 'gapType', 'statement', 'researchEntityId', 'status'],
  titleKey: 'label',
  descriptionKey: 'statement',
  facetKey: 'gapType',
});

export const crieResearchGapRepository = new CrieRepository({
  definition: crieResearchGapDefinition,
  defaultSort: nowDesc,
});

export const crieNoveltyAssessmentDefinition = definition({
  table: 'crie_novelty_assessments',
  fields: ['label', 'researchEntityId', 'documentId', 'noveltyScore', 'confidenceValue', 'rationale'],
  titleKey: 'label',
  facetKey: 'documentId',
});

export const crieNoveltyAssessmentRepository = new CrieRepository({
  definition: crieNoveltyAssessmentDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Governance (crie_consent_records, crie_policy_audit, crie_refusals)
// ---------------------------------------------------------------------------

export const crieConsentRecordDefinition = definition({
  table: 'crie_consent_records',
  fields: ['label', 'researcher', 'consentScope', 'granted', 'revocable', 'grantedAt', 'revokedAt', 'dataUse'],
  titleKey: 'label',
  facetKey: 'consentScope',
});

export const crieConsentRecordRepository = new CrieRepository({
  definition: crieConsentRecordDefinition,
  defaultSort: nowDesc,
});

export const criePolicyAuditDefinition = definition({
  table: 'crie_policy_audit',
  fields: ['label', 'actorType', 'actorId', 'eventType', 'payload', 'researcher'],
  titleKey: 'label',
  facetKey: 'eventType',
});

export const criePolicyAuditRepository = new CrieRepository({
  definition: criePolicyAuditDefinition,
  defaultSort: nowDesc,
});

export const crieRefusalDefinition = definition({
  table: 'crie_refusals',
  fields: ['label', 'researcher', 'refusalReason', 'explanation'],
  titleKey: 'label',
  facetKey: 'refusalReason',
});

export const crieRefusalRepository = new CrieRepository({
  definition: crieRefusalDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Ethics (crie_ethics_reviews, crie_ethics_decisions)
// ---------------------------------------------------------------------------

export const crieEthicsReviewDefinition = definition({
  table: 'crie_ethics_reviews',
  fields: ['label', 'researchEntityId', 'reviewKind', 'status'],
  titleKey: 'label',
  facetKey: 'reviewKind',
});

export const crieEthicsReviewRepository = new CrieRepository({
  definition: crieEthicsReviewDefinition,
  defaultSort: nowDesc,
});

export const crieEthicsDecisionDefinition = definition({
  table: 'crie_ethics_decisions',
  fields: ['label', 'ethicsReviewId', 'decision', 'rationale', 'conditions', 'decidedBy'],
  titleKey: 'label',
  facetKey: 'decision',
});

export const crieEthicsDecisionRepository = new CrieRepository({
  definition: crieEthicsDecisionDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Orchestration (crie_orchestration_plans)
// ---------------------------------------------------------------------------

export const crieOrchestrationPlanDefinition = definition({
  table: 'crie_orchestration_plans',
  fields: ['owner', 'intent', 'sessionId', 'budgets', 'tasks', 'status'],
  titleKey: 'intent',
  facetKey: 'status',
});

export const crieOrchestrationPlanRepository = new CrieRepository({
  definition: crieOrchestrationPlanDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Publication (crie_publication_plans, crie_journal_matches, crie_conference_matches)
// ---------------------------------------------------------------------------

export const criePublicationPlanDefinition = definition({
  table: 'crie_publication_plans',
  fields: ['label', 'researchEntityId', 'owner', 'targetType', 'targets', 'status'],
  titleKey: 'label',
  facetKey: 'targetType',
});

export const criePublicationPlanRepository = new CrieRepository({
  definition: criePublicationPlanDefinition,
  defaultSort: nowDesc,
});

export const crieJournalMatchDefinition = definition({
  table: 'crie_journal_matches',
  fields: ['label', 'publicationPlanId', 'journalProfileId', 'fitScore', 'rationale', 'confidenceValue'],
  titleKey: 'label',
  facetKey: 'journalProfileId',
});

export const crieJournalMatchRepository = new CrieRepository({
  definition: crieJournalMatchDefinition,
  defaultSort: nowDesc,
});

export const crieConferenceMatchDefinition = definition({
  table: 'crie_conference_matches',
  fields: ['label', 'researchEntityId', 'conferenceId', 'fitScore', 'rationale', 'provenance', 'confidenceValue'],
  titleKey: 'label',
  facetKey: 'conferenceId',
});

export const crieConferenceMatchRepository = new CrieRepository({
  definition: crieConferenceMatchDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Grants (crie_grant_opportunities, crie_grant_proposals)
// ---------------------------------------------------------------------------

export const crieGrantOpportunityDefinition = definition({
  table: 'crie_grant_opportunities',
  fields: ['label', 'funder', 'title', 'description', 'deadline', 'amount'],
  titleKey: 'title',
  facetKey: 'funder',
});

export const crieGrantOpportunityRepository = new CrieRepository({
  definition: crieGrantOpportunityDefinition,
  defaultSort: nowDesc,
});

export const crieGrantProposalDefinition = definition({
  table: 'crie_grant_proposals',
  fields: ['label', 'researchEntityId', 'grantOpportunityId', 'lead', 'sections'],
  titleKey: 'label',
  facetKey: 'grantOpportunityId',
});

export const crieGrantProposalRepository = new CrieRepository({
  definition: crieGrantProposalDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Career (crie_career_goals, crie_career_signals)
// ---------------------------------------------------------------------------

export const crieCareerGoalDefinition = definition({
  table: 'crie_career_goals',
  fields: ['label', 'researcher', 'statement', 'horizonMonths', 'goalStatus'],
  titleKey: 'label',
  facetKey: 'goalStatus',
});

export const crieCareerGoalRepository = new CrieRepository({
  definition: crieCareerGoalDefinition,
  defaultSort: nowDesc,
});

export const crieCareerSignalDefinition = definition({
  table: 'crie_career_signals',
  fields: ['label', 'researcher', 'kind', 'statement', 'confidenceValue'],
  titleKey: 'label',
  facetKey: 'kind',
});

export const crieCareerSignalRepository = new CrieRepository({
  definition: crieCareerSignalDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Learning (crie_learner_states, crie_learning_recommendations)
// ---------------------------------------------------------------------------

export const crieLearnerStateDefinition = definition({
  table: 'crie_learner_states',
  fields: ['label', 'researcher', 'mastery', 'misconceptions', 'progress', 'lifecycleStage'],
  titleKey: 'label',
  facetKey: 'lifecycleStage',
});

export const crieLearnerStateRepository = new CrieRepository({
  definition: crieLearnerStateDefinition,
  defaultSort: nowDesc,
});

export const crieLearningRecommendationDefinition = definition({
  table: 'crie_learning_recommendations',
  fields: ['label', 'researcher', 'recommendationKind', 'rationale', 'reasonEvidence', 'learningObjectId', 'confidenceValue'],
  titleKey: 'label',
  facetKey: 'recommendationKind',
});

export const crieLearningRecommendationRepository = new CrieRepository({
  definition: crieLearningRecommendationDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Writing (crie_writing_drafts)
// ---------------------------------------------------------------------------

export const crieWritingDraftDefinition = definition({
  table: 'crie_writing_drafts',
  fields: ['label', 'researchEntityId', 'author', 'draftType', 'title', 'content', 'provenance', 'documentId', 'citations'],
  titleKey: 'title',
  facetKey: 'draftType',
});

export const crieWritingDraftRepository = new CrieRepository({
  definition: crieWritingDraftDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Supervision & mentorship (crie_supervision_records, crie_mentorship_guidance, crie_mentoring_sessions)
// ---------------------------------------------------------------------------

export const crieSupervisionRecordDefinition = definition({
  table: 'crie_supervision_records',
  fields: ['label', 'supervisor', 'researchEntityId', 'startedAt', 'status', 'meetingsHeld'],
  titleKey: 'label',
  facetKey: 'status',
});

export const crieSupervisionRecordRepository = new CrieRepository({
  definition: crieSupervisionRecordDefinition,
  defaultSort: nowDesc,
});

export const crieMentorshipGuidanceDefinition = definition({
  table: 'crie_mentorship_guidance',
  fields: ['label', 'mentor', 'mentee', 'guidanceKind', 'content', 'rationale'],
  titleKey: 'label',
  facetKey: 'guidanceKind',
});

export const crieMentorshipGuidanceRepository = new CrieRepository({
  definition: crieMentorshipGuidanceDefinition,
  defaultSort: nowDesc,
});

export const crieMentoringSessionDefinition = definition({
  table: 'crie_mentoring_sessions',
  fields: ['label', 'mentor', 'mentee', 'heldAt', 'agenda', 'outcomes', 'followUp'],
  titleKey: 'label',
  facetKey: 'mentor',
});

export const crieMentoringSessionRepository = new CrieRepository({
  definition: crieMentoringSessionDefinition,
  defaultSort: nowDesc,
});

// ---------------------------------------------------------------------------
// Workspace (crie_workspace_panes)
// ---------------------------------------------------------------------------

export const crieWorkspacePaneDefinition = definition({
  table: 'crie_workspace_panes',
  fields: ['workspaceId', 'paneKind', 'title', 'open'],
  titleKey: 'title',
  facetKey: 'paneKind',
});

export const crieWorkspacePaneRepository = new CrieRepository({
  definition: crieWorkspacePaneDefinition,
  defaultSort: createdAsc,
});

// ---------------------------------------------------------------------------
// Federation (crie_federation_exchanges, crie_member_sovereignty)
// ---------------------------------------------------------------------------

export const crieFederationExchangeDefinition = definition({
  table: 'crie_federation_exchanges',
  fields: ['federationContractId', 'exchangeType', 'payloadRef', 'consentScope', 'confidence'],
  titleKey: 'exchangeType',
  facetKey: 'exchangeType',
});

export const crieFederationExchangeRepository = new CrieRepository({
  definition: crieFederationExchangeDefinition,
  defaultSort: nowDesc,
});

export const crieMemberSovereigntyDefinition = definition({
  table: 'crie_member_sovereignty',
  fields: ['institutionId', 'governingContractIds', 'reservedRights', 'sharedSignals', 'neverShared'],
  titleKey: 'institutionId',
  facetKey: 'institutionId',
});

export const crieMemberSovereigntyRepository = new CrieRepository({
  definition: crieMemberSovereigntyDefinition,
  defaultSort: createdAsc,
});

// ---------------------------------------------------------------------------
// Identity (crie_said_identities)
// ---------------------------------------------------------------------------

export const crieSaidIdentityDefinition = definition({
  table: 'crie_said_identities',
  fields: ['principalKind', 'principalId', 'principalName', 'saidHash', 'verified'],
  titleKey: 'principalName',
  facetKey: 'principalKind',
});

export const crieSaidIdentityRepository = new CrieRepository({
  definition: crieSaidIdentityDefinition,
  defaultSort: createdAsc,
});
