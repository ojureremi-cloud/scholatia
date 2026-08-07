import type { NextRequest } from 'next/server';
import type {
  EvidenceRecord,
  IntelligencePipelineInput,
  Recommendation,
  ResearchAnswer,
  ResearchEntity,
  ReasoningTrace,
} from '@/types/crie';
import {
  crieAnalytics,
  crieCurrentResearcher,
  crieEntities,
  crieEvidence,
  crieGraph,
  crieMemoryItems,
  crieRecommendation,
} from '@/lib/crie/access';
import { confidence } from '@/lib/crie/utils';
import { createReasoningTrace, reasoningStep, reasoningTraceId } from '@/lib/crie/reasoning';
import { createResearchAnswer } from '@/lib/crie/research-assistant';
import { intelligencePipeline, intelligenceStatistics } from '@/lib/crie/intelligence';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

function deriveTraces(
  entity: ResearchEntity | undefined,
  evidence: readonly EvidenceRecord[],
  recommendation: Recommendation | undefined,
): ReasoningTrace[] {
  if (!entity) return [];
  const firstEvidence = evidence[0];
  return [
    {
      ...createReasoningTrace({
        researchEntityId: entity.id,
        paradigm: 'graph',
        steps: [
          reasoningStep(1, 'premise', `Intelligence pipeline over entity ${entity.id} and its graph neighbourhood.`),
          reasoningStep(2, 'evidence-lookup', 'Evidence records bind every conclusion to a source.', firstEvidence ? [firstEvidence.id] : []),
          reasoningStep(3, 'inference', 'Semantic search and similarity scores rank neighbours by confidence, connectivity, and trust.'),
          reasoningStep(4, 'validation', 'Recommendations are derived and never authoritative.'),
        ],
        conclusion: {
          id: 'conclusion-intelligence',
          statement: recommendation?.summary ?? 'No recommendation is available for this entity.',
          confidence: confidence(recommendation?.confidence.value ?? 0.5),
        },
        confidenceValue: recommendation?.confidence.value ?? 0.5,
      }),
      id: reasoningTraceId(`${entity.id}-intelligence`),
    },
  ];
}

function deriveAnswers(
  entity: ResearchEntity | undefined,
  evidence: readonly EvidenceRecord[],
): ResearchAnswer[] {
  if (!entity) return [];
  return evidence
    .filter((record) => record.researchEntityId === entity.id)
    .slice(0, 6)
    .map((record) =>
      createResearchAnswer({
        label: `evidence-${record.id}`,
        researchEntityId: entity.id,
        question: 'What does this evidence establish for the entity?',
        summary: record.summary,
        evidenceRecordIds: [record.id],
        confidenceValue: record.confidence.value,
      }),
    );
}

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const entities = crieEntities();
    const entity = entities[0];
    const evidence = crieEvidence();
    const recommendation = crieRecommendation();
    const input: IntelligencePipelineInput = {
      researchEntityId: entity?.id ?? '',
      graph: crieGraph(),
      memoryItems: crieMemoryItems(),
      traces: deriveTraces(entity, evidence, recommendation),
      recommendations: recommendation ? [recommendation] : [],
      decisions: [],
      analyticsList: crieAnalytics(),
      answers: deriveAnswers(entity, evidence),
      owner: crieCurrentResearcher(),
    };
    const { report, stages } = intelligencePipeline(input, entity);
    return jsonCrie({
      researchEntityId: report.researchEntityId,
      generatedAt: report.generatedAt,
      confidence: report.confidence,
      stages,
      indicators: report.indicators,
      recommendations: report.recommendations,
      answers: report.answers,
      statistics: intelligenceStatistics([report]),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
