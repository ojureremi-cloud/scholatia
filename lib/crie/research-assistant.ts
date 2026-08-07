/**
 * E-36 Research Assistant Engine — Mission 008.
 *
 * Pure research-assistant helpers that answer research questions and assemble
 * a derived `ResearchAssistantReport` (CRIE Ch. 41): grounded answers with
 * evidence chains and citations, plus gaps and open questions. All answers
 * are derived and never authoritative.
 */
import type {
  EvidenceRecord,
  MissingEvidence,
  ResearchAnswer,
  ResearchAssistantReport,
  ResearchRecommendation,
  ResearcherRef,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function researchAnswerId(label: string): string {
  return `answer-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

export interface ResearchAnswerInput {
  label: string;
  researchEntityId: string;
  question: string;
  summary: string;
  evidenceRecordIds: string[];
  citations?: string[];
  openQuestions?: string[];
  confidenceValue?: number;
}

export function createResearchAnswer(input: ResearchAnswerInput): ResearchAnswer {
  const now = nowIso();
  return {
    id: researchAnswerId(input.label),
    researchEntityId: input.researchEntityId,
    question: input.question,
    summary: input.summary,
    evidenceChainIds: input.evidenceRecordIds,
    citations: input.citations ?? [],
    confidence: confidence(input.confidenceValue ?? 0.5),
    openQuestions: input.openQuestions ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Count how many evidence records ground an answer (provenance by construction, P3). */
export function groundingStrength(answer: ResearchAnswer): number {
  return answer.evidenceChainIds.length;
}

export function answersForEntity(
  answers: readonly ResearchAnswer[],
  researchEntityId: string,
): ResearchAnswer[] {
  return answers.filter((answer) => answer.researchEntityId === researchEntityId);
}

export function rankAnswers(answers: readonly ResearchAnswer[]): ResearchAnswer[] {
  return [...answers].sort(
    (a, b) => b.confidence.value - a.confidence.value || groundingStrength(b) - groundingStrength(a),
  );
}

// ---------------------------------------------------------------------------
// Report assembly
// ---------------------------------------------------------------------------

export interface ResearchAssistantReportInput {
  label: string;
  owner: ResearcherRef;
  researchEntityId: string;
  answers: ResearchAnswer[];
  recommendations: ResearchRecommendation[];
  gaps?: MissingEvidence[];
  evidenceRecords?: readonly EvidenceRecord[];
}

/** Assemble the derived research-assistant report. */
export function researchAssistantReport(
  input: ResearchAssistantReportInput,
): ResearchAssistantReport {
  const now = nowIso();
  const evidenceIds = new Set((input.evidenceRecords ?? []).map((record) => record.id));
  const supportedAnswers = input.answers.filter((answer) =>
    answer.evidenceChainIds.every((id) => evidenceIds.has(id)),
  );
  const averageConfidence = averageOf([
    ...input.answers.map((answer) => answer.confidence.value),
    ...input.recommendations.map((recommendation) => recommendation.confidence.value),
  ]);
  return {
    id: researchAssistantReportId(input.label),
    owner: { username: input.owner.username, name: input.owner.name },
    researchEntityId: input.researchEntityId,
    answers: supportedAnswers,
    recommendations: input.recommendations,
    gaps: input.gaps ?? [],
    generatedAt: now,
    confidence: confidence(averageConfidence, `aggregate over ${input.answers.length} answer(s) and ${input.recommendations.length} recommendation(s)`),
    createdAt: now,
    updatedAt: now,
  };
}

export function researchAssistantReportId(label: string): string {
  return `assistant-report-${slugOf(label)}`;
}

export function reportForEntity(
  reports: readonly ResearchAssistantReport[],
  researchEntityId: string,
): ResearchAssistantReport[] {
  return reports.filter((report) => report.researchEntityId === researchEntityId);
}

export function latestReport(
  reports: readonly ResearchAssistantReport[],
  researchEntityId: string,
): ResearchAssistantReport | undefined {
  const matching = reportForEntity(reports, researchEntityId);
  if (matching.length === 0) return undefined;
  return matching.sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))[matching.length - 1];
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

function averageOf(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export interface ResearchAssistantStatistics {
  answers: number;
  recommendations: number;
  gaps: number;
  averageConfidence: number;
}

export function researchAssistantStatistics(
  report: ResearchAssistantReport,
): ResearchAssistantStatistics {
  return {
    answers: report.answers.length,
    recommendations: report.recommendations.length,
    gaps: report.gaps.length,
    averageConfidence: averageOf([
      ...report.answers.map((answer) => answer.confidence.value),
      ...report.recommendations.map((recommendation) => recommendation.confidence.value),
    ]),
  };
}
