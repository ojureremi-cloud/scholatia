/**
 * CRIE decision intelligence types (fspec §2.12, §4.7).
 *
 * `Recommendation` is a recommended next best action with justification;
 * `Decision` is a framed decision with objectives, options, and a recorded
 * rationale. The accountable human authority is preserved (Article VIII;
 * CRIE Ch. 65).
 */
import type {
  Auditable,
  ConfidenceScore,
  ResearcherRef,
  Versioned,
} from './base';

/** Five DI capability groups (CRIE Ch. 65). */
export type DecisionCapability =
  | 'recommendation'
  | 'optimisation'
  | 'prediction'
  | 'planning'
  | 'institutional-decision-support';

export const DECISION_CAPABILITIES: readonly DecisionCapability[] = [
  'recommendation',
  'optimisation',
  'prediction',
  'planning',
  'institutional-decision-support',
];

export type RecommendationStatus = 'proposed' | 'accepted' | 'dismissed' | 'overridden';

/** A recommended next best action with justification. */
export interface Recommendation extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  kind: DecisionCapability;
  target: string;
  summary: string;
  explanation: RecommendationExplanation;
  confidence: ConfidenceScore;
  status: RecommendationStatus;
}

/** The explainable rationale of a recommendation. */
export interface RecommendationExplanation {
  reasons: string[];
  alternatives: string[];
  evidenceChainIds: string[];
  tradeoffs: string[];
}

/** A decision with objectives, options, and rationale. */
export interface Decision extends Auditable, Versioned {
  id: string;
  authority: ResearcherRef; // the accountable human (Article VIII)
  frame: string;
  objectives: string[];
  constraints: string[];
  options: DecisionOption[];
  decisionRecord: DecisionRecord;
}

export interface DecisionOption {
  id: string;
  description: string;
  score: number; // 0..1
  tradeoffs: string[];
}

export interface DecisionRecord {
  chosenOptionId: string;
  rationale: string;
  expectedOutcomes: string[];
  trackedOutcome?: string;
}
