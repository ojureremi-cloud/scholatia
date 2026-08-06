/**
 * E-02 Reasoning Engine — Mission 004-D (Wave 2).
 *
 * Pure multi-paradigm reasoning helpers (symbolic, probabilistic, causal,
 * graph, educational, research). Every computation produces a fully
 * explainable `ReasoningTrace` (CRIE Ch. 11, Ch. 64).
 */
import type {
  Conclusion,
  ReasoningParadigm,
  ReasoningStep,
  ReasoningStepType,
  ReasoningTrace,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function reasoningTraceId(label: string): string {
  return `rt-${slugOf(label)}`;
}

export function reasoningStep(
  order: number,
  stepType: ReasoningStepType,
  detail: string,
  evidenceChainIds: string[] = [],
): ReasoningStep {
  return { order, stepType, detail, evidenceChainIds };
}

export interface ReasoningTraceInput {
  researchEntityId: string;
  paradigm: ReasoningParadigm;
  steps?: ReasoningStep[];
  sessionId?: string;
  conclusion?: Conclusion;
  confidenceValue?: number;
  refusals?: string[];
}

export function createReasoningTrace(input: ReasoningTraceInput): ReasoningTrace {
  const now = nowIso();
  return {
    id: reasoningTraceId(input.researchEntityId),
    researchEntityId: input.researchEntityId,
    sessionId: input.sessionId,
    paradigm: input.paradigm,
    steps: input.steps ?? [],
    conclusion: input.conclusion,
    confidence: confidence(input.confidenceValue ?? 0.5),
    refusals: input.refusals,
    createdAt: now,
    updatedAt: now,
  };
}

export function tracesForEntity(
  traces: readonly ReasoningTrace[],
  researchEntityId: string,
): ReasoningTrace[] {
  return traces.filter((trace) => trace.researchEntityId === researchEntityId);
}

export function tracesByParadigm(
  traces: readonly ReasoningTrace[],
  paradigm: ReasoningParadigm,
): ReasoningTrace[] {
  return traces.filter((trace) => trace.paradigm === paradigm);
}

export interface ReasoningStatistics {
  total: number;
  byParadigm: Partial<Record<ReasoningParadigm, number>>;
  averageConfidence: number;
  withConclusion: number;
  refusals: number;
}

export function reasoningStatistics(traces: readonly ReasoningTrace[]): ReasoningStatistics {
  const byParadigm: Partial<Record<ReasoningParadigm, number>> = {};
  let confidenceTotal = 0;
  let withConclusion = 0;
  let refusals = 0;
  for (const trace of traces) {
    byParadigm[trace.paradigm] = (byParadigm[trace.paradigm] ?? 0) + 1;
    confidenceTotal += trace.confidence.value;
    if (trace.conclusion) withConclusion += 1;
    if (trace.refusals && trace.refusals.length > 0) refusals += trace.refusals.length;
  }
  return {
    total: traces.length,
    byParadigm,
    averageConfidence: traces.length === 0 ? 0 : round(confidenceTotal / traces.length),
    withConclusion,
    refusals,
  };
}
