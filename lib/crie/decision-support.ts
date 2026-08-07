/**
 * E-34 Decision Support Engine — Mission 008.
 *
 * Pure decision-support helpers that augment a framed `Decision` (CRIE Ch.
 * 65): option pros/cons, risk assessment, missing-evidence gaps, and a full
 * derived analysis. CRIE supports but never decides; the researcher holds the
 * accountable authority (Article VIII).
 */
import type {
  Decision,
  DecisionOption,
  DecisionRisk,
  DecisionRiskLevel,
  DecisionSupportAnalysis,
  MissingEvidence,
  OptionProsCons,
} from '@/types/crie';
import { confidence, nowIso, round, slugOf } from './utils';

export function decisionSupportId(label: string): string {
  return `decision-support-${slugOf(label)}`;
}

// ---------------------------------------------------------------------------
// Pros / cons
// ---------------------------------------------------------------------------

export function optionProsCons(
  optionId: string,
  pros: string[],
  cons: string[],
): OptionProsCons {
  return { optionId, pros, cons };
}

/** Score an option by the balance of pros vs cons. */
export function prosConsBalance(analysis: OptionProsCons): number {
  const total = analysis.pros.length + analysis.cons.length;
  if (total === 0) return 0;
  return round(analysis.pros.length / total);
}

// ---------------------------------------------------------------------------
// Risk
// ---------------------------------------------------------------------------

export function riskLevelFor(riskScore: number): DecisionRiskLevel {
  if (riskScore >= 0.66) return 'high';
  if (riskScore >= 0.33) return 'medium';
  return 'low';
}

export interface DecisionRiskInput {
  optionId: string;
  factors: string[];
  riskScore?: number;
}

export function assessRisk(input: DecisionRiskInput): DecisionRisk {
  const riskScore = round(input.riskScore ?? 0.5);
  return {
    optionId: input.optionId,
    level: riskLevelFor(riskScore),
    riskScore,
    factors: input.factors,
    confidence: confidence(1 - riskScore, `risk from ${input.factors.length} factor(s)`),
  };
}

export function riskOf(
  risks: readonly DecisionRisk[],
  optionId: string,
): DecisionRisk | undefined {
  return risks.find((risk) => risk.optionId === optionId);
}

// ---------------------------------------------------------------------------
// Missing evidence
// ---------------------------------------------------------------------------

export function missingEvidence(
  question: string,
  whyItMatters: string,
  relatedEvidenceIds: string[] = [],
): MissingEvidence {
  return { question, whyItMatters, relatedEvidenceIds };
}

// ---------------------------------------------------------------------------
// Full analysis
// ---------------------------------------------------------------------------

export interface DecisionSupportInput {
  label: string;
  decision: Decision;
  prosCons: OptionProsCons[];
  risks: DecisionRisk[];
  missingEvidenceList: MissingEvidence[];
}

/** Build the derived support analysis for a framed decision. */
export function decisionSupportAnalysis(input: DecisionSupportInput): DecisionSupportAnalysis {
  const now = nowIso();
  const scored = input.decision.options
    .map((option) => {
      const analysis = input.prosCons.find((candidate) => candidate.optionId === option.id);
      const balance = analysis ? prosConsBalance(analysis) : 0.5;
      const risk = riskOf(input.risks, option.id);
      const riskAdjustment = risk ? 1 - risk.riskScore : 1;
      return { option, score: round(balance * riskAdjustment) };
    })
    .sort((a, b) => b.score - a.score);
  const recommendedOptionId = scored.length > 0 && scored[0].score > 0 ? scored[0].option.id : undefined;
  return {
    id: decisionSupportId(input.label),
    decisionId: input.decision.id,
    prosCons: input.prosCons,
    risks: input.risks,
    missingEvidence: input.missingEvidenceList,
    recommendedOptionId,
    confidence: confidence(
      scored.length > 0 ? scored[0].score : 0.5,
      `recommendation from ${scored.length} scored option(s)`,
    ),
    createdAt: now,
    updatedAt: now,
  };
}

export function analysisForDecision(
  analyses: readonly DecisionSupportAnalysis[],
  decisionId: string,
): DecisionSupportAnalysis | undefined {
  return analyses.find((analysis) => analysis.decisionId === decisionId);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface DecisionSupportStatistics {
  analyses: number;
  options: number;
  highRiskOptions: number;
  missingEvidenceGaps: number;
}

export function decisionSupportStatistics(
  analyses: readonly DecisionSupportAnalysis[],
): DecisionSupportStatistics {
  let options = 0;
  let highRiskOptions = 0;
  let missingEvidenceGaps = 0;
  for (const analysis of analyses) {
    options += analysis.prosCons.length;
    highRiskOptions += analysis.risks.filter((risk) => risk.level === 'high').length;
    missingEvidenceGaps += analysis.missingEvidence.length;
  }
  return { analyses: analyses.length, options, highRiskOptions, missingEvidenceGaps };
}

/** The current best option of an analysis, if any. */
export function bestSupportedOption(
  analysis: DecisionSupportAnalysis,
  decision: Decision,
): DecisionOption | undefined {
  if (!analysis.recommendedOptionId) return undefined;
  return decision.options.find((option) => option.id === analysis.recommendedOptionId);
}
