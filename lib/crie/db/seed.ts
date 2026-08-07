import type { CrieRecord } from '@/types/crie';
import * as P from '@/constants/placeholder-crie';
import { getCrieDatabaseAdapter } from './adapter';
import { addToIndex } from './indexes';
import { isSeeded, markSeeded } from './store';
import { nowIso } from './utils';

/**
 * CRIE dev seed (Mission 004-F).
 *
 * Loads the Wave 1/2 placeholder constants once into the in-memory store so the
 * repository/services layer reads live rows instead of constants. The constants
 * in `constants/placeholder-crie.ts` are dev-seed-only and must not be imported
 * by the API/UI paths — server components consume the store through
 * `lib/crie/access.ts` and server pages pass runtime snapshots to client
 * components.
 */

const SEED_AT = '2026-08-04T12:00:00.000Z';

type SeedRow = Record<string, unknown> & { id: string };

function insert(table: string, entries: readonly SeedRow[]): void {
  for (const entry of entries) {
    const owner = entry.owner as { username?: string } | undefined;
    const label = typeof entry.label === 'string' ? entry.label : undefined;
    const title = typeof entry.title === 'string' ? entry.title : label;
    const crieId = typeof entry.crieId === 'string' ? entry.crieId : entry.id;
    getCrieDatabaseAdapter().write(table, {
      id: entry.id,
      crieId,
      version: typeof entry.version === 'number' ? entry.version : 1,
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : SEED_AT,
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : SEED_AT,
      deletedAt: null,
      owner: owner?.username,
      title,
      value: entry,
    } as CrieRecord);
  }
}

function index(entries: { table: string; crieId: string; entityId: string; title: string; description?: string; facet?: string }[]): void {
  for (const entry of entries) {
    addToIndex({ ...entry, entityClass: entry.facet ?? entry.table, confidence: 0.7 });
  }
}

export function seedCrie(): void {
  if (isSeeded()) return;

  // Research entities and lifecycle
  insert('crie_entities', P.CRIE_ENTITIES as unknown as SeedRow[]);

  // Knowledge graph
  insert('crie_kg_entities', P.CRIE_KG_ENTITIES as unknown as SeedRow[]);
  insert('crie_kg_relations', P.CRIE_KG_RELATIONS as unknown as SeedRow[]);

  // Context
  insert('crie_context_packs', P.CRIE_CONTEXT_PACKS as unknown as SeedRow[]);
  insert('crie_context_elements', P.CRIE_CONTEXT_ELEMENTS as unknown as SeedRow[]);

  // Sessions, goals, messages
  insert('crie_sessions', [P.CRIE_SESSION] as unknown as SeedRow[]);
  insert('crie_session_goals', P.CRIE_SESSION_GOALS as unknown as SeedRow[]);
  insert('crie_session_messages', P.CRIE_SESSION_MESSAGES as unknown as SeedRow[]);

  // Memory
  insert('crie_memory_items', P.CRIE_MEMORY_ITEMS as unknown as SeedRow[]);

  // Claims, evidence, contradictions
  insert('crie_claims', [P.CRIE_CLAIM_1, P.CRIE_CLAIM_2] as unknown as SeedRow[]);
  insert('crie_evidence_records', [P.CRIE_EVIDENCE_1, P.CRIE_EVIDENCE_2] as unknown as SeedRow[]);
  insert('crie_evidence_assessments', P.CRIE_EVIDENCE_ASSESSMENTS as unknown as SeedRow[]);
  insert('crie_contradictions', [P.CRIE_CONTRADICTION] as unknown as SeedRow[]);

  // References and citations
  insert('crie_references', [P.CRIE_REFERENCE_1, P.CRIE_REFERENCE_2] as unknown as SeedRow[]);
  insert('crie_citations', P.CRIE_CITATIONS as unknown as SeedRow[]);
  insert('crie_citation_contexts', P.CRIE_CITATION_CONTEXTS as unknown as SeedRow[]);

  // Literature, gaps, novelty
  insert('crie_literature_searches', [P.CRIE_LITERATURE_SEARCH] as unknown as SeedRow[]);
  insert('crie_research_gaps', [P.CRIE_RESEARCH_GAP] as unknown as SeedRow[]);
  insert('crie_novelty_assessments', [P.CRIE_NOVELTY_ASSESSMENT] as unknown as SeedRow[]);

  // Analytics and recommendations
  insert('crie_analytics_records', [P.CRIE_RESEARCH_ANALYTICS] as unknown as SeedRow[]);
  insert('crie_recommendations', [P.CRIE_RECOMMENDATION] as unknown as SeedRow[]);

  // Governance: consent, policy audit, ethics, refusal
  insert('crie_consent_records', [P.CRIE_CONSENT_RECORD] as unknown as SeedRow[]);
  insert('crie_policy_audit', [P.CRIE_AUDIT_RECORD] as unknown as SeedRow[]);
  insert('crie_ethics_reviews', [P.CRIE_ETHICS_REVIEW] as unknown as SeedRow[]);
  insert('crie_ethics_decisions', [P.CRIE_ETHICS_DECISION] as unknown as SeedRow[]);
  insert('crie_refusals', [P.CRIE_REFUSAL] as unknown as SeedRow[]);

  // Orchestration
  insert('crie_orchestration_plans', [P.CRIE_ORCHESTRATION_PLAN] as unknown as SeedRow[]);
  const orchestration = P.CRIE_ORCHESTRATION_PLAN;
  const taskRows = orchestration.tasks.map((task, step) => ({
    id: task.id ?? `crie-orch-task-${step}`,
    planId: orchestration.id,
    step,
    agentId: task.agentId,
    status: task.status,
    requiresApproval: task.requiresApproval,
  }));
  insert('crie_agent_tasks', taskRows);

  // Agents referenced by the orchestration plan
  const agentIds = [
    ...new Set(
      orchestration.tasks
        .map((task) => (task.agentId ? String(task.agentId) : null))
        .filter((id): id is string => id !== null),
    ),
  ];
  insert(
    'crie_agents',
    agentIds.map((agentId) => ({
      id: agentId,
      crieId: `crie-agent-${agentId.toLowerCase()}`,
      agentId,
      name: `CRIE Agent ${agentId}`,
      status: 'ready',
      createdAt: SEED_AT,
    })),
  );

  // Publication, grants, career, learning, writing, supervision, mentorship
  insert('crie_publication_plans', [P.CRIE_PUBLICATION_PLAN] as unknown as SeedRow[]);
  insert('crie_journal_matches', [P.CRIE_JOURNAL_MATCH] as unknown as SeedRow[]);
  insert('crie_conference_matches', [P.CRIE_CONFERENCE_MATCH] as unknown as SeedRow[]);
  insert('crie_grant_opportunities', [P.CRIE_GRANT_OPPORTUNITY] as unknown as SeedRow[]);
  insert('crie_grant_proposals', [P.CRIE_GRANT_PROPOSAL] as unknown as SeedRow[]);
  insert('crie_career_goals', [P.CRIE_CAREER_GOAL] as unknown as SeedRow[]);
  insert('crie_career_signals', [P.CRIE_CAREER_SIGNAL] as unknown as SeedRow[]);
  insert('crie_learner_states', [P.CRIE_LEARNER_STATE] as unknown as SeedRow[]);
  insert('crie_learning_recommendations', [P.CRIE_LEARNING_RECOMMENDATION] as unknown as SeedRow[]);
  insert('crie_writing_drafts', [P.CRIE_WRITING_DRAFT] as unknown as SeedRow[]);
  insert('crie_supervision_records', [P.CRIE_SUPERVISION_RECORD] as unknown as SeedRow[]);
  insert('crie_mentorship_guidance', [P.CRIE_MENTORSHIP_GUIDANCE] as unknown as SeedRow[]);
  insert('crie_mentoring_sessions', [P.CRIE_MENTORING_SESSION] as unknown as SeedRow[]);

  // Workspace + panes + open documents
  insert('crie_workspaces', [
    { id: 'workspace-ojuri', crieId: 'crie-workspace-ojuri', researcher: 'ojuri', researcherName: 'Ojuri', createdAt: SEED_AT, updatedAt: SEED_AT },
  ]);
  insert('crie_workspace_panes', [
    { id: 'pane-documents', workspaceId: 'workspace-ojuri', paneKind: 'documents', title: 'Documents', open: true, createdAt: SEED_AT, updatedAt: SEED_AT },
    { id: 'pane-memory', workspaceId: 'workspace-ojuri', paneKind: 'memory', title: 'Memory', open: true, createdAt: SEED_AT, updatedAt: SEED_AT },
    { id: 'pane-conversation', workspaceId: 'workspace-ojuri', paneKind: 'conversation', title: 'Conversation', open: true, createdAt: SEED_AT, updatedAt: SEED_AT },
  ]);

  // Institutions + assets
  insert('crie_enterprise_models', [
    {
      id: 'em-ui-001',
      crieId: 'crie-enterprise-ui-001',
      institutionId: 'INST-UI-001',
      strategicGoals: ['Research excellence', 'Open scholarship'],
      strengthAreas: ['Knowledge graphs', 'Digital scholarship'],
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ]);
  insert('crie_institutional_assets', [
    {
      id: 'asset-ui-kg',
      crieId: 'crie-asset-ui-kg',
      institutionId: 'INST-UI-001',
      assetKind: 'repository',
      title: 'Research knowledge graph corpus',
      accessClass: 'institution',
      consentScope: ['research-analytics'],
      curator: 'ojuri',
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ]);

  // Federation
  insert('crie_federation_contracts', [
    {
      id: 'fed-contract-001',
      crieId: 'crie-fed-contract-001',
      institutionId: 'INST-UI-001',
      memberInstitutionId: 'INST-OTHER-002',
      contractType: 'aggregate-analytics',
      status: 'active',
      dataScope: ['publication-meta'],
      consentScope: ['aggregate'],
      sovereigntyClauses: ['No raw researcher data', 'Aggregate results only'],
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ]);
  insert('crie_federation_exchanges', [
    {
      id: 'fed-exchange-001',
      crieId: 'crie-fed-exchange-001',
      federationContractId: 'fed-contract-001',
      exchangeType: 'aggregate',
      payloadRef: 'aggregate-publication-metrics',
      consentScope: ['aggregate'],
      confidence: { value: 0.8, band: 'high' },
      createdAt: SEED_AT,
    },
  ]);
  insert('crie_member_sovereignty', [
    {
      id: 'sovereignty-ui-001',
      institutionId: 'INST-UI-001',
      governingContractIds: ['fed-contract-001'],
      reservedRights: ['withdraw', 'audit'],
      sharedSignals: ['publication-meta'],
      neverShared: ['individual-identities'],
      createdAt: SEED_AT,
      updatedAt: SEED_AT,
    },
  ]);

  // Trust scores + verification evidence
  insert('crie_trust_scores', [
    { id: 'trust-ojuri', crieId: 'crie-trust-ojuri', entityType: 'researcher', entityId: 'ojuri', entityName: 'Ojuri', score: 0.8, confidence: 0.75, sourceCount: 4, createdAt: SEED_AT, updatedAt: SEED_AT },
    { id: 'trust-ui', crieId: 'crie-trust-ui', entityType: 'institution', entityId: 'INST-UI-001', entityName: 'University of Ibadan', score: 0.9, confidence: 0.85, sourceCount: 6, createdAt: SEED_AT, updatedAt: SEED_AT },
  ]);

  // SAID identities derived from the identity engine conventions
  insert('crie_said_identities', [
    { id: 'said-ojuri', crieId: 'crie-said-ojuri', principalKind: 'researcher', principalId: 'ojuri', principalName: 'Ojuri', saidHash: 'said-ojuri', verified: true, createdAt: SEED_AT, updatedAt: SEED_AT },
    { id: 'said-ui', crieId: 'crie-said-ui', principalKind: 'institution', principalId: 'INST-UI-001', principalName: 'University of Ibadan', saidHash: 'said-ui', verified: true, createdAt: SEED_AT, updatedAt: SEED_AT },
  ]);

  // Search index over the main searchable collections
  index([
    ...P.CRIE_ENTITIES.map((entity) => ({
      table: 'crie_entities',
      crieId: `crie-entity-${entity.id}`,
      entityId: entity.id,
      title: entity.title,
      description: entity.model?.stage,
      facet: entity.kind,
    })),
    ...P.CRIE_KG_ENTITIES.map((entity) => ({
      table: 'crie_kg_entities',
      crieId: entity.crieId,
      entityId: entity.id,
      title: entity.crieId,
      facet: entity.entityClass,
    })),
    ...P.CRIE_MEMORY_ITEMS.map((item) => ({
      table: 'crie_memory_items',
      crieId: `crie-memory-${item.id}`,
      entityId: item.id,
      title: item.content,
      facet: item.memoryType,
    })),
    ...P.CRIE_REFERENCE_1 && [{
      table: 'crie_references',
      crieId: `crie-reference-${P.CRIE_REFERENCE_1.id}`,
      entityId: P.CRIE_REFERENCE_1.id,
      title: P.CRIE_REFERENCE_1.title ?? P.CRIE_REFERENCE_1.identifier,
      facet: 'reference',
    }],
  ]);

  markSeeded();
}

export function ensureCrieSeeded(): void {
  if (!isSeeded()) {
    seedCrie();
  }
}

export const crieSeedTimestamp = nowIso();
