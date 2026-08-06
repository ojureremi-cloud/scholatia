/**
 * E-13 Statistics Engine — Mission 004-D (Wave 2).
 *
 * Pure statistical-planning and analysis helpers over `StatisticalPlan`,
 * `PowerAnalysis`, `AnalysisPlan`, `AnalysisResult`, and `StatisticalReport`
 * (CRIE Ch. 21). Includes a power-analysis sample-size approximation and
 * reporting formatting.
 */
import type {
  AnalysisMethod,
  AnalysisPlan,
  AnalysisResult,
  PowerAnalysis,
  ReportFormat,
  StatisticalPlan,
  StatisticalReport,
} from '@/types/crie';
import { confidence, nowIso, slugOf } from './utils';

export function statisticalPlanId(label: string): string {
  return `stat-plan-${slugOf(label)}`;
}

export interface StatisticalPlanInput {
  label: string;
  studyDesignId: string;
  analysisMethod: AnalysisMethod;
  primaryOutcome: string;
  secondaryOutcomes?: string[];
  assumptions?: Record<string, unknown>;
}

export function createStatisticalPlan(input: StatisticalPlanInput): StatisticalPlan {
  const now = nowIso();
  return {
    id: statisticalPlanId(input.label),
    studyDesignId: input.studyDesignId,
    analysisMethod: input.analysisMethod,
    primaryOutcome: input.primaryOutcome,
    secondaryOutcomes: input.secondaryOutcomes ?? [],
    assumptions: input.assumptions ?? {},
    createdAt: now,
    updatedAt: now,
  };
}

/** Standard-normal quantile (Abramowitz–Stegun approximation). */
function standardNormalQuantile(p: number): number {
  const t = Math.sqrt(-2 * Math.log(Math.max(p, 1e-10)));
  return (
    t -
    (2.515517 + 0.802853 * t + 0.010328 * t * t) /
      (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t)
  );
}

/** Approximate required sample size for a two-sided comparison (CRIE Ch. 21). */
export function requiredSampleSize(
  effectSize: number,
  alpha = 0.05,
  power = 0.8,
): number {
  const zAlpha = standardNormalQuantile(1 - alpha / 2);
  const zBeta = standardNormalQuantile(power);
  const effect = Math.max(effectSize, 0.01);
  return Math.ceil(Math.pow((zAlpha + zBeta) / effect, 2));
}

export interface PowerAnalysisInput {
  label: string;
  statisticalPlanId: string;
  effectSize: number;
  alpha?: number;
  power?: number;
}

export function powerFor(input: PowerAnalysisInput): PowerAnalysis {
  const now = nowIso();
  const alpha = input.alpha ?? 0.05;
  const power = input.power ?? 0.8;
  return {
    id: `power-${slugOf(input.label)}`,
    statisticalPlanId: input.statisticalPlanId,
    effectSize: input.effectSize,
    alpha,
    power,
    requiredSampleSize: requiredSampleSize(input.effectSize, alpha, power),
    createdAt: now,
    updatedAt: now,
  };
}

export function analysisPlanId(label: string): string {
  return `analysis-plan-${slugOf(label)}`;
}

export interface AnalysisPlanInput {
  label: string;
  statisticalPlanId: string;
  steps: string[];
}

export function createAnalysisPlan(input: AnalysisPlanInput): AnalysisPlan {
  const now = nowIso();
  return {
    id: analysisPlanId(input.label),
    statisticalPlanId: input.statisticalPlanId,
    steps: input.steps,
    createdAt: now,
    updatedAt: now,
  };
}

export interface AnalysisResultInput {
  label: string;
  analysisPlanId: string;
  result: Record<string, unknown>;
  interpretation: string;
  datasetId?: string;
  confidenceValue?: number;
}

export function recordAnalysisResult(input: AnalysisResultInput): AnalysisResult {
  const now = nowIso();
  return {
    id: `result-${slugOf(input.label)}`,
    analysisPlanId: input.analysisPlanId,
    datasetId: input.datasetId,
    result: input.result,
    interpretation: input.interpretation,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export interface StatisticalReportInput {
  label: string;
  analysisResultId: string;
  reportFormat: ReportFormat;
  summary: string;
  confidenceValue?: number;
}

export function reportResults(input: StatisticalReportInput): StatisticalReport {
  const now = nowIso();
  return {
    id: `report-${slugOf(input.label)}`,
    analysisResultId: input.analysisResultId,
    reportFormat: input.reportFormat,
    summary: input.summary,
    confidence: confidence(input.confidenceValue ?? 0.5),
    createdAt: now,
    updatedAt: now,
  };
}

export interface StatisticsSummary {
  statisticalPlans: number;
  powerAnalyses: number;
  analysisPlans: number;
  results: number;
  reports: number;
}

export function statisticsSummary(
  plans: readonly StatisticalPlan[],
  powerAnalyses: readonly PowerAnalysis[] = [],
  analysisPlans: readonly AnalysisPlan[] = [],
  results: readonly AnalysisResult[] = [],
  reports: readonly StatisticalReport[] = [],
): StatisticsSummary {
  return {
    statisticalPlans: plans.length,
    powerAnalyses: powerAnalyses.length,
    analysisPlans: analysisPlans.length,
    results: results.length,
    reports: reports.length,
  };
}
