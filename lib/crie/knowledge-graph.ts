/**
 * E-03 Knowledge Graph Engine — Mission 004-D (Wave 2).
 *
 * Pure RKG helpers over the 12 entity classes and 40 predicates (CRIE Ch. 9,
 * §61.2). Nodes carry stable CRIE-IDs, provenance, calibrated confidence, and
 * lifecycle state; relations are typed semantic edges with strength.
 */
import type {
  ConfidenceScore,
  CrieIdRef,
  EntityLifecycleState,
  KGEntity,
  KGEntityClass,
  KGRelation,
  KGRelationPredicate,
  KGScopeType,
  KnowledgeGraph,
  ProvenanceRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function kgNodeId(label: string): string {
  return `kg-${slugOf(label)}`;
}

export function crieIdRef(entityId: string, entityClass: KGEntityClass): CrieIdRef {
  return { crieId: entityId, entityClass };
}

export interface KGEntityInput {
  label: string;
  entityClass: KGEntityClass;
  attributes?: Record<string, unknown>;
  provenance: ProvenanceRef;
  confidenceValue?: number;
  lifecycleState?: EntityLifecycleState;
}

export function createKGEntity(input: KGEntityInput): KGEntity {
  const now = nowIso();
  return {
    id: kgNodeId(input.label),
    crieId: kgNodeId(input.label),
    entityClass: input.entityClass,
    attributes: input.attributes ?? {},
    provenance: [input.provenance],
    confidence: confidence(input.confidenceValue ?? 0.5),
    lifecycleState: input.lifecycleState ?? 'proposed',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function kgRelationId(label: string): string {
  return `kgr-${slugOf(label)}`;
}

export interface KGRelationInput {
  label: string;
  subject: CrieIdRef;
  object: CrieIdRef;
  predicate: KGRelationPredicate;
  strength?: number;
  confidenceValue?: number;
  provenance: ProvenanceRef;
}

export function createKGRelation(input: KGRelationInput): KGRelation {
  const now = nowIso();
  return {
    id: kgRelationId(input.label),
    subject: input.subject,
    object: input.object,
    predicate: input.predicate,
    strength: round(Math.max(0, Math.min(1, input.strength ?? 0.5))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    provenance: input.provenance,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function createKnowledgeGraph(
  scopeType: KGScopeType,
  scopeId: string,
  entities: KGEntity[] = [],
  relations: KGRelation[] = [],
): KnowledgeGraph {
  const now = nowIso();
  return {
    id: `kg-${scopeType}-${slugOf(scopeId)}`,
    scopeType,
    scopeId,
    entities,
    relations,
    currentVersion: 1,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function entitiesForGraph(
  graph: KnowledgeGraph,
  entityClass?: KGEntityClass,
): KGEntity[] {
  return entityClass
    ? graph.entities.filter((entity) => entity.entityClass === entityClass)
    : graph.entities;
}

export function relationsForEntity(graph: KnowledgeGraph, entityId: string): KGRelation[] {
  return graph.relations.filter(
    (relation) => relation.subject.crieId === entityId || relation.object.crieId === entityId,
  );
}

export function entityConfidence(graph: KnowledgeGraph, entityId: string): ConfidenceScore | undefined {
  const entity = graph.entities.find((candidate) => candidate.crieId === entityId);
  return entity?.confidence;
}

export interface GraphStatistics {
  entityCount: number;
  relationCount: number;
  byClass: Partial<Record<KGEntityClass, number>>;
  averageConfidence: number;
}

export function graphStatistics(graph: KnowledgeGraph): GraphStatistics {
  const byClass: Partial<Record<KGEntityClass, number>> = {};
  let confidenceTotal = 0;
  for (const entity of graph.entities) {
    byClass[entity.entityClass] = (byClass[entity.entityClass] ?? 0) + 1;
    confidenceTotal += entity.confidence.value;
  }
  return {
    entityCount: graph.entities.length,
    relationCount: graph.relations.length,
    byClass,
    averageConfidence:
      graph.entities.length === 0 ? 0 : round(confidenceTotal / graph.entities.length),
  };
}
