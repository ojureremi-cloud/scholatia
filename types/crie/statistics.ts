/**
 * CRIE statistics & analysis types (fspec §2.7).
 *
 * `StatisticalPlan`, `PowerAnalysis`, `AnalysisPlan`, `AnalysisResult`, and
 * `StatisticalReport` cover the statistical design, power, analysis, and
 * reporting lifecycle (CRIE Ch. 21).
 */
import type { Auditable, ConfidenceScore } from './base';

export type AnalysisMethod =
  | 'descriptive'
  | 'regression'
  | 'logistic'
  | 'mixed-effects'
  | 'survival'
  | 'bayesian'
  | 'structural-equation'
  | 'machine-learning'
  | 'qualitative-thematic'
  | 'non-parametric';

/** A statistical design and analysis plan. */
export interface StatisticalPlan extends Auditable {
  id: string;
  studyDesignId: string;
  analysisMethod: AnalysisMethod;
  assumptions: Record<string, unknown>;
  primaryOutcome: string;
  secondaryOutcomes: string[];
}

/** A statistical power analysis. */
export interface PowerAnalysis extends Auditable {
  id: string;
  statisticalPlanId: string;
  effectSize: number;
  alpha: number;
  power: number;
  requiredSampleSize: number;
}

/** The operational analysis plan. */
export interface AnalysisPlan extends Auditable {
  id: string;
  statisticalPlanId: string;
  steps: string[];
}

/** The result of an analysis, with interpretation. */
export interface AnalysisResult extends Auditable {
  id: string;
  analysisPlanId: string;
  datasetId?: string;
  result: Record<string, unknown>;
  interpretation: string;
  confidence: ConfidenceScore;
}

export type ReportFormat = 'apa' | 'numbered' | 'summary';

/** A reporting-ready statistical summary. */
export interface StatisticalReport extends Auditable {
  id: string;
  analysisResultId: string;
  reportFormat: ReportFormat;
  summary: string;
  confidence: ConfidenceScore;
}
