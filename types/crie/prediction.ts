/**
 * CRIE prediction types (fspec §2.12).
 *
 * `Prediction` is a forecast with calibrated uncertainty; `Forecast` is the
 * time-bounded statement of a prediction; `PredictiveModel` is a registered
 * model with evaluation (CRIE Ch. 37). All predictions are append-only and
 * carry calibrated uncertainty.
 */
import type { Auditable, ConfidenceScore, ResearcherRef } from './base';

/** A forecast with calibrated uncertainty. */
export interface Prediction extends Auditable {
  id: string;
  modelId: string;
  horizon: string;
  inputs: Record<string, unknown>;
  outcome?: unknown;
  uncertainty: ConfidenceScore;
  counterfactual?: Record<string, unknown>;
}

/** The time-bounded statement of a prediction. */
export interface Forecast extends Auditable {
  id: string;
  predictionId: string;
  statement: string;
  validFrom: string;
  validUntil: string;
  confidence: ConfidenceScore;
}

export type PredictiveModelKind =
  | 'regression'
  | 'classification'
  | 'time-series'
  | 'survival'
  | 'causal'
  | 'heuristic';

/** A registered predictive model. */
export interface PredictiveModel extends Auditable {
  id: string;
  owner: ResearcherRef;
  modelKind: PredictiveModelKind;
  version: number;
  evaluation: Record<string, unknown>;
}

/** Calibrated uncertainty attached to a prediction. */
export interface CalibratedUncertainty {
  confidence: ConfidenceScore;
  interval?: { lower: number; upper: number };
}
