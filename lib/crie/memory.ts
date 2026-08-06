/**
 * E-15 Memory Engine — Mission 004-D (Wave 2).
 *
 * Pure helpers over the unified multi-scale memory (CRIE Ch. 63; fspec Ch. 13):
 * eight memory types, provenance-bearing `MemoryItem`s with access policies,
 * consent-gated recall, explainable consolidation, retention/expiry, and
 * portable export. Memory access is always consent-gated (P9, P10).
 */
import type {
  ConsolidationEvent,
  ContextPackRef,
  ContextualMemory,
  EpisodicMemory,
  InstitutionalMemory,
  LearnerMemory,
  LongTermMemory,
  MemoryAccess,
  MemoryExport,
  MemoryItem,
  MemoryQuery,
  MemoryTypeId,
  ProvenanceRef,
  ResearchMemory,
  ResearcherRef,
  SemanticMemory,
  ShortTermMemory,
} from '@/types/crie';
import { clamp, nowIso, round, slugOf } from './utils';

export function memoryItemId(label: string): string {
  return `mem-${slugOf(label)}`;
}

export interface MemoryItemInput {
  label: string;
  owner: ResearcherRef;
  memoryType: MemoryTypeId;
  content: string;
  provenance: ProvenanceRef;
  accessPolicy: string;
  relevance?: number;
  expiresAt?: string;
}

export function writeMemory(input: MemoryItemInput): MemoryItem {
  const now = nowIso();
  return {
    id: memoryItemId(input.label),
    owner: { username: input.owner.username, name: input.owner.name },
    memoryType: input.memoryType,
    content: input.content,
    provenance: input.provenance,
    accessPolicy: input.accessPolicy,
    relevance: input.relevance !== undefined ? round(clamp(input.relevance, 0, 1)) : undefined,
    expiresAt: input.expiresAt,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export interface EpisodicMemoryInput extends MemoryItemInput {
  memoryType: 'episodic';
  happenedAt: string;
  contextRef?: ContextPackRef;
}

export function writeEpisodic(input: EpisodicMemoryInput): EpisodicMemory {
  return { ...writeMemory(input), memoryType: 'episodic', happenedAt: input.happenedAt, contextRef: input.contextRef };
}

export interface SemanticMemoryInput extends MemoryItemInput {
  memoryType: 'semantic';
  sourceMemoryItemIds: string[];
}

export function writeSemantic(input: SemanticMemoryInput): SemanticMemory {
  return { ...writeMemory(input), memoryType: 'semantic', sourceMemoryItemIds: input.sourceMemoryItemIds };
}

export interface ShortTermMemoryInput extends MemoryItemInput {
  memoryType: 'short-term';
  sessionId: string;
}

export function writeShortTerm(input: ShortTermMemoryInput): ShortTermMemory {
  return { ...writeMemory(input), memoryType: 'short-term', sessionId: input.sessionId };
}

export interface LongTermMemoryInput extends MemoryItemInput {
  memoryType: 'long-term';
}

export function writeLongTerm(input: LongTermMemoryInput): LongTermMemory {
  return { ...writeMemory(input), memoryType: 'long-term' };
}

export interface InstitutionalMemoryInput extends MemoryItemInput {
  memoryType: 'institutional';
  institutionId: string;
}

export function writeInstitutional(input: InstitutionalMemoryInput): InstitutionalMemory {
  return { ...writeMemory(input), memoryType: 'institutional', institutionId: input.institutionId };
}

export interface ResearchMemoryInput extends MemoryItemInput {
  memoryType: 'research';
  researchEntityId: string;
}

export function writeResearch(input: ResearchMemoryInput): ResearchMemory {
  return { ...writeMemory(input), memoryType: 'research', researchEntityId: input.researchEntityId };
}

export interface LearnerMemoryInput extends MemoryItemInput {
  memoryType: 'learner';
}

export function writeLearner(input: LearnerMemoryInput): LearnerMemory {
  return { ...writeMemory(input), memoryType: 'learner' };
}

export interface ContextualMemoryInput extends MemoryItemInput {
  memoryType: 'contextual';
  contextPackId: string;
}

export function writeContextual(input: ContextualMemoryInput): ContextualMemory {
  return { ...writeMemory(input), memoryType: 'contextual', contextPackId: input.contextPackId };
}

// ---------------------------------------------------------------------------
// Recall
// ---------------------------------------------------------------------------

function memoryTokens(content: string): string[] {
  return slugOf(content).split('-').filter(Boolean);
}

export function recall(items: readonly MemoryItem[], query: MemoryQuery): MemoryItem[] {
  const tokens = query.semanticFilter ? memoryTokens(query.semanticFilter) : [];
  let results = items.filter((item) => !item.deletedAt);
  if (query.memoryType) {
    results = results.filter((item) => item.memoryType === query.memoryType);
  }
  if (query.episodicWindow) {
    const { from, to } = query.episodicWindow;
    results = results.filter((item) => {
      const happenedAt = (item as EpisodicMemory).happenedAt;
      if (!happenedAt) return false;
      return happenedAt >= from && happenedAt <= to;
    });
  }
  if (query.context) {
    results = results.filter(
      (item) => (item as ContextualMemory).contextPackId === query.context?.contextPackId,
    );
  }
  if (tokens.length > 0) {
    results = results.filter((item) => {
      const itemTokens = memoryTokens(item.content);
      return tokens.some((token) => itemTokens.includes(token));
    });
  }
  return [...results]
    .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
    .slice(0, query.limit);
}

export function recallByType(items: readonly MemoryItem[], memoryType: MemoryTypeId): MemoryItem[] {
  return items.filter((item) => !item.deletedAt && item.memoryType === memoryType);
}

export function recallForContext(
  items: readonly MemoryItem[],
  contextPackId: string,
): ContextualMemory[] {
  return items.filter(
    (item): item is ContextualMemory =>
      !item.deletedAt &&
      item.memoryType === 'contextual' &&
      (item as ContextualMemory).contextPackId === contextPackId,
  );
}

// ---------------------------------------------------------------------------
// Access control (consent-gated)
// ---------------------------------------------------------------------------

export function canAccess(item: MemoryItem, access: MemoryAccess): boolean {
  if (item.deletedAt) return false;
  if (access.level === 'none') return false;
  if (!access.memoryTypes.includes(item.memoryType)) return false;
  if (item.accessPolicy === 'private' && access.level === 'read') return false;
  return true;
}

export function canWrite(item: MemoryItem, access: MemoryAccess): boolean {
  return access.level === 'read-write' && access.memoryTypes.includes(item.memoryType);
}

export function filterAccessible(
  items: readonly MemoryItem[],
  access: MemoryAccess,
): MemoryItem[] {
  return items.filter((item) => canAccess(item, access));
}

// ---------------------------------------------------------------------------
// Consolidation, export, retention
// ---------------------------------------------------------------------------

export function consolidationId(label: string): string {
  return `consolidation-${slugOf(label)}`;
}

export interface ConsolidationInput {
  label: string;
  fromType: 'episodic' | 'short-term';
  toType: 'semantic' | 'long-term';
  memoryItemIds: string[];
  rule: string;
}

/** Create an explainable consolidation between memory types (CRIE Ch. 63). */
export function consolidate(input: ConsolidationInput): ConsolidationEvent {
  const now = nowIso();
  return {
    id: consolidationId(input.label),
    fromType: input.fromType,
    toType: input.toType,
    memoryItemIds: input.memoryItemIds,
    rule: input.rule,
    createdAt: now,
    updatedAt: now,
  };
}

export function exportMemory(input: {
  owner: ResearcherRef;
  memoryType: MemoryTypeId;
  items: MemoryItem[];
}): MemoryExport {
  return {
    owner: { username: input.owner.username, name: input.owner.name },
    exportedAt: nowIso(),
    memoryType: input.memoryType,
    items: input.items,
  };
}

/** Soft-delete a memory item (right-to-be-forgotten; hard deletes prohibited). */
export function forget(item: MemoryItem): MemoryItem {
  const now = nowIso();
  return { ...item, deletedAt: now, updatedAt: now, version: item.version + 1 };
}

export function bumpVersion(item: MemoryItem): MemoryItem {
  const now = nowIso();
  return { ...item, updatedAt: now, version: item.version + 1 };
}

export function expired(items: readonly MemoryItem[], at = nowIso()): MemoryItem[] {
  return items.filter((item) => item.expiresAt !== undefined && item.expiresAt <= at);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface MemoryStatistics {
  total: number;
  byType: Partial<Record<MemoryTypeId, number>>;
  averageRelevance: number;
  expiredCount: number;
}

export function memoryStatistics(
  items: readonly MemoryItem[],
  at = nowIso(),
): MemoryStatistics {
  const byType: Partial<Record<MemoryTypeId, number>> = {};
  let relevanceTotal = 0;
  let relevanceCount = 0;
  let expiredCount = 0;
  for (const item of items) {
    byType[item.memoryType] = (byType[item.memoryType] ?? 0) + 1;
    if (item.relevance !== undefined) {
      relevanceTotal += item.relevance;
      relevanceCount += 1;
    }
    if (item.expiresAt !== undefined && item.expiresAt <= at) expiredCount += 1;
  }
  return {
    total: items.length,
    byType,
    averageRelevance: relevanceCount === 0 ? 0 : round(relevanceTotal / relevanceCount),
    expiredCount,
  };
}
