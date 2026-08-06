/**
 * E-14 Decision Engine — Mission 004-D (Wave 2).
 *
 * Pure decision-intelligence helpers over `Decision`, `DecisionOption`, and
 * `DecisionRecord` (CRIE Ch. 65; fspec §2.12). The accountable human
 * authority is preserved (Article VIII): CRIE frames, scores, and records
 * decisions, but never decides for the researcher.
 */
import type {
  ConfidenceScore,
  Decision,
  DecisionOption,
  DecisionRecord,
  ResearcherRef,
} from '@/types/crie';
import { DECISION_CAPABILITIES } from '@/types/crie';
import { clamp, confidence, nowIso, round, slugOf } from './utils';

export function decisionId(label: string): string {
  return `decision-${slugOf(label)}`;
}

export interface DecisionInput {
  label: string;
  authority: ResearcherRef;
  frame: string;
  objectives: string[];
  constraints: string[];
}

export function frameDecision(input: DecisionInput): Decision {
  const now = nowIso();
  return {
    id: decisionId(input.label),
    authority: { username: input.authority.username, name: input.authority.name },
    frame: input.frame,
    objectives: input.objectives,
    constraints: input.constraints,
    options: [],
    decisionRecord: { chosenOptionId: '', rationale: '', expectedOutcomes: [] },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function decisionOptionId(label: string): string {
  return `option-${slugOf(label)}`;
}

export interface DecisionOptionInput {
  label: string;
  description: string;
  tradeoffs?: string[];
}

export function decisionOption(input: DecisionOptionInput): DecisionOption {
  return {
    id: decisionOptionId(input.label),
    description: input.description,
    score: 0,
    tradeoffs: input.tradeoffs ?? [],
  };
}

export function addOption(decision: Decision, option: DecisionOption): Decision {
  const now = nowIso();
  return {
    ...decision,
    options: [...decision.options, option],
    updatedAt: now,
    version: decision.version + 1,
  };
}

export function scoreOption(option: DecisionOption, score: number): DecisionOption {
  return { ...option, score: round(clamp(score, 0, 1)) };
}

export function evaluateDecision(
  decision: Decision,
  scores: Record<string, number>,
): Decision {
  const now = nowIso();
  return {
    ...decision,
    options: decision.options.map((option) => {
      const score = scores[option.id];
      return score === undefined ? option : scoreOption(option, score);
    }),
    updatedAt: now,
    version: decision.version + 1,
  };
}

export function bestOption(decision: Decision): DecisionOption | undefined {
  if (decision.options.length === 0) return undefined;
  return [...decision.options].sort((a, b) => b.score - a.score)[0];
}

export function rankOptions(decision: Decision): DecisionOption[] {
  return [...decision.options].sort(
    (a, b) => b.score - a.score || a.tradeoffs.length - b.tradeoffs.length,
  );
}

export function recordDecision(
  decision: Decision,
  chosenOptionId: string,
  rationale: string,
  expectedOutcomes: string[] = [],
): DecisionRecord {
  return {
    chosenOptionId,
    rationale,
    expectedOutcomes,
  };
}

export function finalizeDecision(
  decision: Decision,
  record: DecisionRecord,
): Decision {
  const now = nowIso();
  return { ...decision, decisionRecord: record, updatedAt: now, version: decision.version + 1 };
}

export function trackOutcome(record: DecisionRecord, trackedOutcome: string): DecisionRecord {
  return { ...record, trackedOutcome };
}

export function decisionsFor(
  decisions: readonly Decision[],
  username: string,
): Decision[] {
  return decisions.filter((decision) => decision.authority.username === username);
}

export interface DecisionStatistics {
  total: number;
  framed: number;
  recorded: number;
  tracked: number;
}

export function decisionStatistics(decisions: readonly Decision[]): DecisionStatistics {
  const recorded = decisions.filter((decision) => decision.decisionRecord.chosenOptionId !== '').length;
  const tracked = decisions.filter((decision) => decision.decisionRecord.trackedOutcome !== undefined).length;
  return { total: decisions.length, framed: decisions.length, recorded, tracked };
}

/** The five decision-intelligence capability groups (CRIE Ch. 65). */
export const CRIE_DECISION_CAPABILITIES = DECISION_CAPABILITIES;

export function optionConfidence(option: DecisionOption): ConfidenceScore {
  return confidence(option.score);
}
