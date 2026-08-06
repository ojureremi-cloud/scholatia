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
  ContextPack,
  KGEntity,
  KGRelation,
  KnowledgeGraph,
  MemoryItem,
  OrchestrationPlan,
  Recommendation,
  ResearchEntity,
  ResearchSession,
  SessionMessage,
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
export function crieEvidence(): unknown[] {
  return valuesOf('crie_evidence_records');
}

/** Citation records. */
export function crieCitations(): unknown[] {
  return valuesOf('crie_citations');
}

/** Analytics records. */
export function crieAnalytics(): unknown[] {
  return valuesOf('crie_analytics_records');
}

/** The canonical CRIE demo researcher (owner of seeded entities). */
export function crieCurrentResearcher(): { username: string; name?: string } {
  const first = crieEntities()[0];
  const owner = first?.owner as { username?: string; name?: string } | string | undefined;
  if (owner && typeof owner === 'object' && owner.username) return { username: owner.username, name: owner.name };
  if (owner && typeof owner === 'string') return { username: owner };
  return { username: 'ojuri' };
}
