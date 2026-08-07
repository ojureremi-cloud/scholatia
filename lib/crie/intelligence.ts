/**
 * E-37 Intelligence Engine — Mission 008.
 *
 * The orchestration pipeline that composes the pure CRIE engines (CRIE Chs.
 * 43, 65): knowledge → memory → reasoning → evidence → recommendation →
 * decision → analytics, augmented by the intelligence engines (graph
 * reasoning, semantic search, research recommendations, decision support,
 * analytics intelligence, research assistant). It derives an aggregate
 * `IntelligenceReport`; it owns no records and never decides (Article VIII).
 */
import type {
  IntelligenceIndicator,
  IntelligencePipelineInput,
  IntelligenceReport,
  IntelligenceStage,
  IntelligenceStageResult,
  ResearchEntity,
  ResearchRecommendation,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';
import { graphStatistics } from './knowledge-graph';
import { recommendNextStep } from './research-recommendations';
import { indicatorsFromAnalytics, strongestIndicators } from './analytics-intelligence';
import { answersForEntity, rankAnswers } from './research-assistant';

export function intelligenceReportId(label: string): string {
  return `intel-report-${slugOf(label)}`;
}

export const INTELLIGENCE_STAGES: readonly IntelligenceStage[] = [
  'knowledge',
  'memory',
  'reasoning',
  'evidence',
  'recommendation',
  'decision',
  'analytics',
];

// ---------------------------------------------------------------------------
// Stage results
// ---------------------------------------------------------------------------

export function stageResult(
  stage: IntelligenceStage,
  ok: boolean,
  detail: string,
  producedIds: string[] = [],
): IntelligenceStageResult {
  return { stage, ok, detail, producedIds };
}

export function stagesFromInput(input: IntelligencePipelineInput): IntelligenceStageResult[] {
  const knowledgeStats = graphStatistics(input.graph);
  return [
    stageResult(
      'knowledge',
      input.graph.entities.length > 0,
      `${knowledgeStats.entityCount} entity(ies), ${knowledgeStats.relationCount} relation(s)`,
      input.graph.entities.map((entity) => entity.crieId),
    ),
    stageResult(
      'memory',
      input.memoryItems.length > 0,
      `${input.memoryItems.length} memory item(s)`,
      input.memoryItems.map((item) => item.id),
    ),
    stageResult(
      'reasoning',
      input.traces.length > 0,
      `${input.traces.length} reasoning trace(s)`,
      input.traces.map((trace) => trace.id),
    ),
    stageResult(
      'evidence',
      input.traces.some((trace) => trace.steps.some((step) => step.evidenceChainIds.length > 0)),
      `evidence chains found on ${input.traces.filter((trace) => trace.conclusion).length} trace(s)`,
      input.traces
        .flatMap((trace) => trace.steps.flatMap((step) => step.evidenceChainIds))
        .filter((id, index, all) => all.indexOf(id) === index),
    ),
    stageResult(
      'recommendation',
      input.recommendations.length > 0,
      `${input.recommendations.length} recommendation(s)`,
      input.recommendations.map((recommendation) => recommendation.id),
    ),
    stageResult(
      'decision',
      input.decisions.length > 0,
      `${input.decisions.length} decision(s)`,
      input.decisions.map((decision) => decision.id),
    ),
    stageResult(
      'analytics',
      input.analyticsList.length > 0,
      `${input.analyticsList.length} analytics snapshot(s)`,
      input.analyticsList.map((analytics) => analytics.scopeId),
    ),
  ];
}

// ---------------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------------

function derivedConfidenceOf(stages: readonly IntelligenceStageResult[]): number {
  if (stages.length === 0) return 0;
  const okCount = stages.filter((stage) => stage.ok).length;
  return round(okCount / stages.length);
}

/** Derive indicators from the pipeline input (best snapshot per scope). */
export function deriveIndicators(input: IntelligencePipelineInput): IntelligenceIndicator[] {
  if (input.analyticsList.length === 0) return [];
  const latest = input.analyticsList[input.analyticsList.length - 1];
  const previous = input.analyticsList.length > 1 ? input.analyticsList[input.analyticsList.length - 2] : undefined;
  return indicatorsFromAnalytics(latest, previous);
}

/** Derive the base research recommendation for the entity, if present. */
export function deriveRecommendation(
  entity: ResearchEntity | undefined,
): ResearchRecommendation[] {
  const derived: ResearchRecommendation[] = [];
  if (entity) derived.push(recommendNextStep(entity));
  return derived;
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export interface IntelligencePipelineResult {
  report: IntelligenceReport;
  stages: IntelligenceStageResult[];
}

/** Run the intelligence pipeline over the composed inputs. */
export function intelligencePipeline(
  input: IntelligencePipelineInput,
  entity?: ResearchEntity,
): IntelligencePipelineResult {
  const now = nowIso();
  const stages = stagesFromInput(input);
  const indicators = deriveIndicators(input);
  const recommendations = deriveRecommendation(entity);
  const answers = rankAnswers(answersForEntity(input.answers ?? [], input.researchEntityId));
  const report: IntelligenceReport = {
    id: intelligenceReportId(input.researchEntityId),
    owner: { username: input.owner.username, name: input.owner.name },
    researchEntityId: input.researchEntityId,
    stages,
    indicators: strongestIndicators(indicators, 5),
    answers,
    recommendations,
    generatedAt: now,
    confidence: confidence(
      derivedConfidenceOf(stages),
      `derived from ${stages.filter((stage) => stage.ok).length}/${stages.length} pipeline stages`,
    ),
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  return { report, stages };
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface IntelligenceStatistics {
  reports: number;
  averageConfidence: number;
  totalRecommendations: number;
  averageIndicators: number;
}

export function intelligenceStatistics(
  reports: readonly IntelligenceReport[],
): IntelligenceStatistics {
  const confidenceTotal = reports.reduce((sum, report) => sum + report.confidence.value, 0);
  const recommendationsTotal = reports.reduce(
    (sum, report) => sum + report.recommendations.length,
    0,
  );
  const indicatorsTotal = reports.reduce((sum, report) => sum + report.indicators.length, 0);
  return {
    reports: reports.length,
    averageConfidence: reports.length === 0 ? 0 : round(confidenceTotal / reports.length),
    totalRecommendations: recommendationsTotal,
    averageIndicators: reports.length === 0 ? 0 : round(indicatorsTotal / reports.length),
  };
}
