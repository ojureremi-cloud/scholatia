/**
 * E-07 Context Engine — Mission 004-D (Wave 2).
 *
 * Pure context-assembly helpers over `ContextPack` and `ContextElement`
 * (CRIE Ch. 5). Packs are bounded, weighted, provenance-bearing, and
 * budget-checked before use.
 */
import type {
  ContextElement,
  ContextKind,
  ContextPack,
  ProvenanceRef,
} from '@/types/crie';
import { average, confidence, nowIso, round, slugOf } from './utils';

export function contextPackId(label: string): string {
  return `ctx-${slugOf(label)}`;
}

export interface ContextElementInput {
  label: string;
  sourceType: string;
  sourceId: string;
  relevanceWeight: number;
  content: string;
  provenance: ProvenanceRef;
  confidenceValue?: number;
}

export function contextElement(input: ContextElementInput): ContextElement {
  return {
    id: `ctx-el-${slugOf(input.label)}`,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    relevanceWeight: round(Math.max(0, Math.min(1, input.relevanceWeight))),
    confidence: confidence(input.confidenceValue ?? 0.5),
    content: input.content,
    provenance: input.provenance,
  };
}

export interface ContextPackInput {
  label: string;
  contextKind: ContextKind;
  elements?: ContextElement[];
  budgetLimit?: number;
  researchEntityId?: string;
  sessionId?: string;
}

export function createContextPack(input: ContextPackInput): ContextPack {
  const now = nowIso();
  const budgetLimit = input.budgetLimit ?? 1;
  return {
    id: contextPackId(input.label),
    researchEntityId: input.researchEntityId,
    sessionId: input.sessionId,
    contextKind: input.contextKind,
    elements: input.elements ?? [],
    budgetUsed: 0,
    budgetLimit,
    createdAt: now,
    updatedAt: now,
  };
}

/** Assemble a pack from candidate elements within its budget. */
export function assembleContext(pack: ContextPack, elements: readonly ContextElement[]): ContextPack {
  const sorted = [...elements].sort((a, b) => b.relevanceWeight - a.relevanceWeight);
  const selected: ContextElement[] = [];
  let budgetUsed = 0;
  for (const element of sorted) {
    if (budgetUsed + element.relevanceWeight > pack.budgetLimit) break;
    selected.push(element);
    budgetUsed += element.relevanceWeight;
  }
  const now = nowIso();
  return {
    ...pack,
    elements: selected,
    budgetUsed: round(budgetUsed),
    updatedAt: now,
  };
}

export function contextPackForSession(
  packs: readonly ContextPack[],
  sessionId: string,
): ContextPack[] {
  return packs.filter((pack) => pack.sessionId === sessionId);
}

export function contextBudgetUsage(pack: ContextPack): number {
  return round(pack.budgetUsed / pack.budgetLimit);
}

export interface ContextStatistics {
  total: number;
  byKind: Partial<Record<ContextKind, number>>;
  averageElements: number;
  averageRelevance: number;
}

export function contextStatistics(packs: readonly ContextPack[]): ContextStatistics {
  const byKind: Partial<Record<ContextKind, number>> = {};
  const elementCounts: number[] = [];
  const relevanceValues: number[] = [];
  for (const pack of packs) {
    byKind[pack.contextKind] = (byKind[pack.contextKind] ?? 0) + 1;
    elementCounts.push(pack.elements.length);
    relevanceValues.push(...pack.elements.map((element) => element.relevanceWeight));
  }
  return {
    total: packs.length,
    byKind,
    averageElements: round(average(elementCounts)),
    averageRelevance: round(average(relevanceValues)),
  };
}
