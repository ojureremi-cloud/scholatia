/**
 * CRIE reasoning types (fspec §2.4, §4.4).
 *
 * Multi-paradigm reasoning (symbolic, probabilistic, causal, graph,
 * educational, research) produces fully explainable `ReasoningTrace` records
 * (CRIE Chs. 11, 64). An `Argument` closes premises → inference → conclusion
 * with `EvidenceChain`s that bind every conclusion to evidence and source (P3).
 */
import type { Auditable, ConfidenceScore, Versioned } from './base';

/** Six reasoning paradigms (CRIE Ch. 64). */
export type ReasoningParadigm =
  | 'symbolic'
  | 'probabilistic'
  | 'causal'
  | 'graph'
  | 'educational'
  | 'research';

export const REASONING_PARADIGMS: readonly ReasoningParadigm[] = [
  'symbolic',
  'probabilistic',
  'causal',
  'graph',
  'educational',
  'research',
];

export const CRIE_REASONING_PARADIGM_LABELS: Record<ReasoningParadigm, string> = {
  symbolic: 'Symbolic',
  probabilistic: 'Probabilistic',
  causal: 'Causal',
  graph: 'Graph',
  educational: 'Educational',
  research: 'Research',
};

/** The full, explainable record of a reasoning computation. */
export interface ReasoningTrace extends Auditable {
  id: string;
  researchEntityId: string;
  sessionId?: string;
  paradigm: ReasoningParadigm;
  steps: ReasoningStep[];
  conclusion?: Conclusion;
  confidence: ConfidenceScore;
  refusals?: string[]; // Article X
}

export type ReasoningStepType =
  | 'premise'
  | 'inference'
  | 'evidence-lookup'
  | 'validation';

/** A single step of a reasoning trace. */
export interface ReasoningStep {
  order: number;
  stepType: ReasoningStepType;
  detail: string;
  evidenceChainIds: string[];
}

export type ArgumentType =
  | 'deductive'
  | 'inductive'
  | 'abductive'
  | 'analogical'
  | 'causal-inference';

/** Premises, inference, and conclusions with evidence chains. */
export interface Argument extends Auditable {
  id: string;
  argumentType: ArgumentType;
  premises: Premise[];
  conclusion: Conclusion;
  chain: EvidenceChain[];
}

export interface Premise {
  id: string;
  statement: string;
  source?: string;
}

export interface Conclusion {
  id: string;
  statement: string;
  confidence: ConfidenceScore;
}

/** Closed chain from conclusion to evidence to source (P3). */
export interface EvidenceChain {
  id: string;
  links: { step: string; evidenceRecordId: string; sourceId: string }[];
}

/** A graph of cause–effect structure, separate from correlation. */
export interface CausalModel extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  nodes: CausalNode[];
  edges: CausalEdge[];
}

export interface CausalNode {
  id: string;
  label: string;
  kind: 'cause' | 'effect' | 'confounder' | 'mediator' | 'exogenous';
}

export interface CausalEdge {
  id: string;
  from: string;
  to: string;
  direction: 'positive' | 'negative' | 'unknown';
  strength: number; // 0..1
}
