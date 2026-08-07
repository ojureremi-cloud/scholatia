/**
 * E-31 Graph Reasoning Engine — Mission 008.
 *
 * Pure multi-hop reasoning helpers over the RKG (CRIE Chs. 9, 61): shortest
 * paths, entity similarity, relationship discovery, and trust propagation.
 * Every derived value is explainable (P11) and never authoritative.
 */
import type {
  EntitySimilarity,
  GraphPath,
  KGEntityClass,
  KGRelationPredicate,
  KnowledgeGraph,
  RelationshipDiscovery,
  TrustPropagation,
} from '@/types/crie';
import { clamp, confidence, round, slugOf } from './utils';
import { entityBaseTrust } from './trust';

export function graphPathId(label: string): string {
  return `graph-path-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Shortest paths
// ---------------------------------------------------------------------------

function entityById(graph: KnowledgeGraph, crieId: string) {
  return graph.entities.find((entity) => entity.crieId === crieId);
}

export function adjacency(
  graph: KnowledgeGraph,
  crieId: string,
): { neighbourId: string; relationId: string; predicate: KGRelationPredicate }[] {
  return graph.relations
    .filter(
      (relation) => relation.subject.crieId === crieId || relation.object.crieId === crieId,
    )
    .map((relation) =>
      relation.subject.crieId === crieId
        ? { neighbourId: relation.object.crieId, relationId: relation.id, predicate: relation.predicate }
        : { neighbourId: relation.subject.crieId, relationId: relation.id, predicate: relation.predicate },
    );
}

/** Breadth-first shortest path between two entities (CRIE Ch. 12.3). */
export function shortestPath(
  graph: KnowledgeGraph,
  fromCrieId: string,
  toCrieId: string,
): GraphPath | undefined {
  if (fromCrieId === toCrieId) return undefined;
  const predecessor = new Map<string, { prev: string; relationId: string; predicate: KGRelationPredicate }>();
  const queue: string[] = [fromCrieId];
  const visited = new Set<string>([fromCrieId]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const step of adjacency(graph, current)) {
      if (visited.has(step.neighbourId)) continue;
      visited.add(step.neighbourId);
      predecessor.set(step.neighbourId, {
        prev: current,
        relationId: step.relationId,
        predicate: step.predicate,
      });
      if (step.neighbourId === toCrieId) {
        const edges: { relationId: string; predicate: KGRelationPredicate }[] = [];
        const nodeIds: string[] = [toCrieId];
        let cursor = toCrieId;
        while (cursor !== fromCrieId) {
          const stepBack = predecessor.get(cursor);
          if (!stepBack) break;
          edges.unshift({ relationId: stepBack.relationId, predicate: stepBack.predicate });
          nodeIds.unshift(stepBack.prev);
          cursor = stepBack.prev;
        }
        const nodes = nodeIds
          .map((crieId) => {
            const entity = entityById(graph, crieId);
            return entity ? { crieId, entityClass: entity.entityClass } : undefined;
          })
          .filter((node): node is { crieId: string; entityClass: KGEntityClass } => node !== undefined);
        return {
          id: graphPathId(`${fromCrieId}-to-${toCrieId}`),
          fromCrieId,
          toCrieId,
          nodes,
          edges,
          length: edges.length,
          confidence: confidence(clamp(0.8 - edges.length * 0.1, 0.2, 0.8), `shortest path of ${edges.length} edge(s)`),
        };
      }
      queue.push(step.neighbourId);
    }
  }
  return undefined;
}

/** All reachable paths from a start entity within a hop budget. */
export function pathsFrom(
  graph: KnowledgeGraph,
  fromCrieId: string,
  maxHops: number,
): GraphPath[] {
  const paths: GraphPath[] = [];
  const queue: { crieId: string; edges: { relationId: string; predicate: KGRelationPredicate }[] }[] = [
    { crieId: fromCrieId, edges: [] },
  ];
  const visited = new Set<string>([fromCrieId]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const step of adjacency(graph, current.crieId)) {
      if (visited.has(step.neighbourId)) continue;
      const edges = [...current.edges, { relationId: step.relationId, predicate: step.predicate }];
      const path = shortestPath(graph, fromCrieId, step.neighbourId);
      if (path) paths.push(path);
      if (edges.length < maxHops) {
        visited.add(step.neighbourId);
        queue.push({ crieId: step.neighbourId, edges });
      }
    }
  }
  return paths.sort((a, b) => a.length - b.length);
}

// ---------------------------------------------------------------------------
// Entity similarity
// ---------------------------------------------------------------------------

/** Jaccard-style similarity over shared neighbours and predicates. */
export function entitySimilarity(
  graph: KnowledgeGraph,
  entityA: string,
  entityB: string,
): EntitySimilarity | undefined {
  if (entityA === entityB) return undefined;
  const neighboursA = adjacency(graph, entityA);
  const neighboursB = adjacency(graph, entityB);
  const idsA = new Set(neighboursA.map((step) => step.neighbourId));
  const idsB = new Set(neighboursB.map((step) => step.neighbourId));
  const sharedNeighbourIds = [...idsA].filter((id) => idsB.has(id));
  const predicatesA = new Set(neighboursA.map((step) => step.predicate));
  const predicatesB = new Set(neighboursB.map((step) => step.predicate));
  const sharedPredicates = [...predicatesA].filter((predicate) => predicatesB.has(predicate));
  const neighbourUnion = new Set([...idsA, ...idsB]);
  const predicateUnion = new Set([...predicatesA, ...predicatesB]);
  const neighbourScore = neighbourUnion.size === 0 ? 0 : sharedNeighbourIds.length / neighbourUnion.size;
  const predicateScore = predicateUnion.size === 0 ? 0 : sharedPredicates.length / predicateUnion.size;
  const similarity = round(neighbourScore * 0.6 + predicateScore * 0.4);
  return {
    entityA,
    entityB,
    similarity,
    sharedPredicates,
    sharedNeighbourIds,
    confidence: confidence(similarity, `shared ${sharedNeighbourIds.length} neighbour(s) and ${sharedPredicates.length} predicate(s)`),
  };
}

/** Ranked list of the most similar entities to a given entity. */
export function similarEntities(
  graph: KnowledgeGraph,
  entityCrieId: string,
  limit = 5,
): EntitySimilarity[] {
  const results = graph.entities
    .map((entity) => entitySimilarity(graph, entityCrieId, entity.crieId))
    .filter((similarity): similarity is EntitySimilarity => similarity !== undefined)
    .sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, Math.max(0, limit));
}

// ---------------------------------------------------------------------------
// Relationship discovery
// ---------------------------------------------------------------------------

export function discoveryId(label: string): string {
  return `discovery-${slugOf(label)}`;
}

/** Discover a plausible predicate between two entities via a shared hop. */
export function discoverRelationship(
  graph: KnowledgeGraph,
  subjectCrieId: string,
  objectCrieId: string,
  predicate: KGRelationPredicate,
  viaEntityId?: string,
): RelationshipDiscovery | undefined {
  if (subjectCrieId === objectCrieId) return undefined;
  const direct = graph.relations.find(
    (relation) =>
      (relation.subject.crieId === subjectCrieId && relation.object.crieId === objectCrieId) ||
      (relation.subject.crieId === objectCrieId && relation.object.crieId === subjectCrieId),
  );
  if (direct) return undefined;
  const hops = adjacency(graph, viaEntityId ?? '');
  const bridging = hops.find((step) => step.neighbourId === subjectCrieId || step.neighbourId === objectCrieId);
  const strength = bridging ? 0.6 : 0.4;
  return {
    id: discoveryId(`${subjectCrieId}-${predicate}-${objectCrieId}`),
    subjectCrieId,
    objectCrieId,
    predicate,
    viaEntityId: viaEntityId ?? '',
    strength,
    confidence: confidence(strength, `predicate ${predicate} via shared hop`),
    rationale: viaEntityId
      ? `Both entities connect through ${viaEntityId}; inferred predicate ${predicate}.`
      : `No direct edge; proposed predicate ${predicate} by graph reasoning.`,
  };
}

/** All plausible predicate candidates between two entities. */
export function discoverRelationships(
  graph: KnowledgeGraph,
  subjectCrieId: string,
  objectCrieId: string,
): RelationshipDiscovery[] {
  const discoveries: RelationshipDiscovery[] = [];
  const predicates: KGRelationPredicate[] = [
    'related-to',
    'cites',
    'supports',
    'builds-on',
    'influenced',
    'is-evidence-for',
    'references',
    'analogous-to',
  ];
  for (const predicate of predicates) {
    const discovery = discoverRelationship(graph, subjectCrieId, objectCrieId, predicate);
    if (discovery) discoveries.push(discovery);
  }
  return discoveries.sort((a, b) => b.strength - a.strength);
}

// ---------------------------------------------------------------------------
// Trust propagation
// ---------------------------------------------------------------------------

export function propagationId(label: string): string {
  return `prop-${slugOf(label)}`;
}

/** Propagate base entity trust across the graph within a hop budget. */
export function propagateTrust(
  graph: KnowledgeGraph,
  sourceCrieId: string,
  maxHops = 2,
): TrustPropagation[] {
  const source = entityById(graph, sourceCrieId);
  if (!source) return [];
  const baseTrust = entityBaseTrust(source);
  const queue: { crieId: string; hops: number; trust: number; rule: string }[] = [
    { crieId: sourceCrieId, hops: 0, trust: baseTrust, rule: `base trust of ${baseTrust}` },
  ];
  const propagated = new Map<string, TrustPropagation>();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const step of adjacency(graph, current.crieId)) {
      if (step.neighbourId === sourceCrieId) continue;
      const relation = graph.relations.find((candidate) => candidate.id === step.relationId);
      const edgeWeight = relation ? relation.strength * relation.confidence.value : 0.5;
      const trust = round(clamp(current.trust * (0.5 + edgeWeight * 0.5), 0, 1));
      const rule = `${current.rule} → edge ${step.predicate} (weight ${round(edgeWeight)})`;
      const existing = propagated.get(step.neighbourId);
      if (!existing || existing.trust < trust) {
        propagated.set(step.neighbourId, {
          id: propagationId(`${sourceCrieId}-to-${step.neighbourId}`),
          sourceCrieId,
          targetCrieId: step.neighbourId,
          trust,
          pathLength: current.hops + 1,
          confidence: confidence(trust, rule),
          rule,
        });
      }
      if (current.hops + 1 < maxHops) {
        queue.push({ crieId: step.neighbourId, hops: current.hops + 1, trust, rule });
      }
    }
  }
  return [...propagated.values()].sort((a, b) => b.trust - a.trust);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface GraphReasoningStatistics {
  paths: number;
  discoveries: number;
  propagations: number;
  averagePathLength: number;
  averageSimilarity: number;
}

export function graphReasoningStatistics(input: {
  paths: readonly GraphPath[];
  discoveries: readonly RelationshipDiscovery[];
  propagations: readonly TrustPropagation[];
  similarities?: readonly EntitySimilarity[];
}): GraphReasoningStatistics {
  const totalLength = input.paths.reduce((sum, path) => sum + path.length, 0);
  const averageSimilarity = (input.similarities ?? []).reduce((sum, similarity) => sum + similarity.similarity, 0);
  const similarityCount = input.similarities?.length ?? 0;
  return {
    paths: input.paths.length,
    discoveries: input.discoveries.length,
    propagations: input.propagations.length,
    averagePathLength: input.paths.length === 0 ? 0 : round(totalLength / input.paths.length),
    averageSimilarity: similarityCount === 0 ? 0 : round(averageSimilarity / similarityCount),
  };
}
