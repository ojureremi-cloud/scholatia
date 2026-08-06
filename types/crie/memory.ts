/**
 * CRIE memory types (fspec §2.13, §4.5).
 *
 * The unified multi-scale memory architecture (CRIE Ch. 63): eight memory
 * types (short-term, long-term, institutional, research, learner, contextual,
 * episodic, semantic), provenance-bearing `MemoryItem`s with access policies,
 * queries, explainable consolidation, and export. Memory access is always
 * consent-gated (P9, P10).
 */
import type {
  Auditable,
  ProvenanceRef,
  ResearcherRef,
  Versioned,
} from './base';
import type { ContextPackRef } from './context';

/** The 8 memory types (CRIE Ch. 63). */
export type MemoryTypeId =
  | 'short-term'
  | 'long-term'
  | 'institutional'
  | 'research'
  | 'learner'
  | 'contextual'
  | 'episodic'
  | 'semantic';

export const MEMORY_TYPE_IDS: readonly MemoryTypeId[] = [
  'short-term',
  'long-term',
  'institutional',
  'research',
  'learner',
  'contextual',
  'episodic',
  'semantic',
];

export const CRIE_MEMORY_TYPE_LABELS: Record<MemoryTypeId, string> = {
  'short-term': 'Short-term',
  'long-term': 'Long-term',
  institutional: 'Institutional',
  research: 'Research',
  learner: 'Learner',
  contextual: 'Contextual',
  episodic: 'Episodic',
  semantic: 'Semantic',
};

/** What an actor may read/write within a memory store. */
export type MemoryAccessLevel = 'read' | 'write' | 'read-write' | 'none';

/** Memory access declaration used by agents and the memory engine. */
export interface MemoryAccess {
  memoryTypes: MemoryTypeId[];
  level: MemoryAccessLevel;
  scopeId?: string;
}

/** A provenance-bearing memory record with type and access policy. */
export interface MemoryItem extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  memoryType: MemoryTypeId;
  content: string;
  provenance: ProvenanceRef;
  accessPolicy: string;
  relevance?: number;
  expiresAt?: string; // retention policy
}

/** A query over memory within access control. */
export interface MemoryQuery {
  memoryType?: MemoryTypeId;
  semanticFilter?: string;
  episodicWindow?: { from: string; to: string };
  context?: ContextPackRef;
  limit: number;
}

/** An explainable consolidation event between memory types. */
export interface ConsolidationEvent extends Auditable {
  id: string;
  fromType: 'episodic' | 'short-term';
  toType: 'semantic' | 'long-term';
  memoryItemIds: string[];
  rule: string; // explainable
}

/** A portable memory export (right-to-be-forgotten compliant). */
export interface MemoryExport {
  owner: ResearcherRef;
  exportedAt: string;
  memoryType: MemoryTypeId;
  items: MemoryItem[];
}

/** Specific past experiences. */
export interface EpisodicMemory extends MemoryItem {
  memoryType: 'episodic';
  happenedAt: string;
  contextRef?: ContextPackRef;
}

/** Generalised knowledge over the RKG. */
export interface SemanticMemory extends MemoryItem {
  memoryType: 'semantic';
  sourceMemoryItemIds: string[];
}

/** Bounded operative context of the active session. */
export interface ShortTermMemory extends MemoryItem {
  memoryType: 'short-term';
  sessionId: string;
}

/** The researcher's persistent cognitive store. */
export interface LongTermMemory extends MemoryItem {
  memoryType: 'long-term';
}

/** The institution's governed memory (IKOS). */
export interface InstitutionalMemory extends MemoryItem {
  memoryType: 'institutional';
  institutionId: string;
}

/** The memory of a single research project. */
export interface ResearchMemory extends MemoryItem {
  memoryType: 'research';
  researchEntityId: string;
}

/** The learner's state and progress. */
export interface LearnerMemory extends MemoryItem {
  memoryType: 'learner';
}

/** Situation-bound memory of why items were relevant. */
export interface ContextualMemory extends MemoryItem {
  memoryType: 'contextual';
  contextPackId: string;
}
