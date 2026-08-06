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
