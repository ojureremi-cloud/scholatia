/**
 * CRIE Knowledge Graph & RKG types (fspec §2.3, §4.3).
 *
 * The Research Knowledge Graph (RKG) is the semantic spine of scholarly
 * knowledge (CRIE Chs. 9, 61). `KGEntity` nodes carry a stable CRIE-ID, one of
 * the 12 entity classes, provenance, calibrated confidence, and a lifecycle
 * state. `KGRelation` edges are typed semantic relationships. Trust and
 * confidence propagate over this graph; versions support time-travel queries.
 */
import type {
  Auditable,
  ConfidenceScore,
  CrieIdRef,
  EntityLifecycleState,
  ProvenanceRef,
  Versioned,
} from './base';

/** The 12 RKG entity classes (CRIE §61.2). */
export type KGEntityClass =
  | 'people'
  | 'organisations'
  | 'works'
  | 'venues'
  | 'concepts'
  | 'claims'
  | 'evidence'
  | 'methods'
  | 'grants'
  | 'events'
  | 'places'
  | 'terms';

export const KG_ENTITY_CLASSES: readonly KGEntityClass[] = [
  'people',
  'organisations',
  'works',
  'venues',
  'concepts',
  'claims',
  'evidence',
  'methods',
  'grants',
  'events',
  'places',
  'terms',
];

export const CRIE_KG_ENTITY_CLASS_LABELS: Record<KGEntityClass, string> = {
  people: 'People',
  organisations: 'Organisations',
  works: 'Works',
  venues: 'Venues',
  concepts: 'Concepts',
  claims: 'Claims',
  evidence: 'Evidence',
  methods: 'Methods',
  grants: 'Grants',
  events: 'Events',
  places: 'Places',
  terms: 'Terms',
};

export const CRIE_KG_ENTITY_CLASS_ICONS: Record<KGEntityClass, string> = {
  people: '🧑‍🏫',
  organisations: '🏛️',
  works: '📜',
  venues: '🎓',
  concepts: '🧬',
  claims: '💬',
  evidence: '🧾',
  methods: '🔧',
  grants: '💰',
  events: '📅',
  places: '📍',
  terms: '🏷️',
};

/** The scope of a knowledge graph container. */
export type KGScopeType = 'researcher' | 'institution' | 'global';

/** The graph container holding entities, relations, and versions. */
export interface KnowledgeGraph extends Auditable, Versioned {
  id: string;
  scopeType: KGScopeType;
  scopeId: string;
  entities: KGEntity[];
  relations: KGRelation[];
  currentVersion: number;
}

/** A typed node carrying identity (CRIE-ID), attributes, provenance, confidence. */
export interface KGEntity extends Auditable, Versioned {
  id: string;
  crieId: string; // stable CRIE-ID
  entityClass: KGEntityClass;
  attributes: Record<string, unknown>;
  provenance: ProvenanceRef[];
  confidence: ConfidenceScore;
  lifecycleState: EntityLifecycleState;
}

export type KGRelationPredicate =
  | 'authored'
  | 'co-authored'
  | 'edited'
  | 'compiled'
  | 'supervised'
  | 'published-in'
  | 'part-of'
  | 'chapter-of'
  | 'volume-of'
  | 'cites'
  | 'is-cited-by'
  | 'references'
  | 'is-referenced-by'
  | 'supports'
  | 'contradicts'
  | 'is-evidence-for'
  | 'is-evidence-against'
  | 'refutes'
  | 'is-a'
  | 'instance-of'
  | 'subsumes'
  | 'related-to'
  | 'analogous-to'
  | 'uses-method'
  | 'employs-instrument'
  | 'applies-analysis'
  | 'affiliated-with'
  | 'employed-by'
  | 'member-of'
  | 'funded-by'
  | 'preceded-by'
  | 'followed-by'
  | 'concurrent-with'
  | 'predates'
  | 'influenced'
  | 'builds-on'
  | 'extends'
  | 'replicates'
  | 'governed-by'
  | 'operated-by'
  | 'hosted-by';

export const KGRelationPredicates: readonly KGRelationPredicate[] = [
  'authored',
  'co-authored',
  'edited',
  'compiled',
  'supervised',
  'published-in',
  'part-of',
  'chapter-of',
  'volume-of',
  'cites',
  'is-cited-by',
  'references',
  'is-referenced-by',
  'supports',
  'contradicts',
  'is-evidence-for',
  'is-evidence-against',
  'refutes',
  'is-a',
  'instance-of',
  'subsumes',
  'related-to',
  'analogous-to',
  'uses-method',
  'employs-instrument',
  'applies-analysis',
  'affiliated-with',
  'employed-by',
  'member-of',
  'funded-by',
  'preceded-by',
  'followed-by',
  'concurrent-with',
  'predates',
  'influenced',
  'builds-on',
  'extends',
  'replicates',
  'governed-by',
  'operated-by',
  'hosted-by',
];

/** A typed semantic relationship with subject, predicate, object, strength. */
export interface KGRelation extends Auditable, Versioned {
  id: string;
  subject: CrieIdRef;
  object: CrieIdRef;
  predicate: KGRelationPredicate;
  strength: number; // 0..1
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
  validFrom?: string;
  validTo?: string;
}

/** The immutable record of source, actor, timestamp, method, version, basis, consent. */
export interface KGProvenance {
  source: string; // work, dataset, or system
  actor: string;
  timestamp: string;
  method: 'extraction' | 'inference' | 'human-curation';
  sourceVersion: number;
  basis?: string; // evidence record id
  consentClass: string; // access class
}

/** A reproducible state of the graph supporting time-travel queries. */
export interface GraphVersion extends Auditable {
  id: string;
  graphId: string;
  version: number;
  snapshotAt: string;
  entityIds: string[];
  relationIds: string[];
  provenance: ProvenanceRef;
}

/** A duplicate-resolution event preserving merged provenance. */
export interface EntityResolution extends Auditable {
  id: string;
  graphId: string;
  keptEntity: CrieIdRef;
  mergedEntities: CrieIdRef[];
  rationale: string;
}

/** A detected cluster of related scholarship. */
export interface GraphCommunity {
  id: string;
  graphId: string;
  entityIds: string[];
  detectionVersion: number;
  cohesion?: number; // 0..1
}

/** An entity connecting otherwise distant communities. */
export interface GraphBridge {
  id: string;
  entityId: string;
  communityAId: string;
  communityBId: string;
  bridgeScore: number; // 0..1
}

/** The propagated epistemic weight of an entity or relation. */
export interface TrustScore {
  subjectType: 'entity' | 'relation';
  subjectId: string;
  trust: number; // 0..1
  confidence: ConfidenceScore;
  rule: string;
  derivedAt: string;
}

/** An index entry over graph entities for retrieval. */
export interface KGIndexEntry {
  id: string;
  graphId: string;
  entityId: string;
  crieId: string;
  terms: string[];
  embeddingRef?: string;
  freshness: number;
}
