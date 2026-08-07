import type { NextRequest } from 'next/server';
import { addOption, decisionOption, evaluateDecision, frameDecision } from '@/lib/crie/decision';
import {
  assessRisk,
  decisionSupportAnalysis,
  decisionSupportStatistics,
  optionProsCons,
} from '@/lib/crie/decision-support';
import { crieErrorResponse, jsonCrie, readBodyObject, requirePrincipal } from '@/lib/crie/http';
import { CrieValidationError } from '@/lib/crie/db/errors';

function stringOf(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function arrayOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function numberOf(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function objectOf(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: NextRequest) {
  try {
    const principal = await requirePrincipal(request);
    const body = await readBodyObject(request);
    const label = stringOf(body.label).trim();
    const frame = stringOf(body.frame).trim();
    if (!label || !frame) {
      throw new CrieValidationError({ label: 'label is required.', frame: 'frame is required.' });
    }
    const objectives = arrayOf(body.objectives).map((value) => stringOf(value)).filter((value) => value.length > 0);
    const constraints = arrayOf(body.constraints).map((value) => stringOf(value)).filter((value) => value.length > 0);
    const rawOptions = arrayOf(body.options).map((value) => objectOf(value));
    if (rawOptions.length === 0) {
      throw new CrieValidationError({ options: 'At least one decision option is required.' });
    }
    const authority = { username: principal.username ?? 'ojuri', name: principal.name };
    let decision = frameDecision({ label, authority, frame, objectives, constraints });
    for (const raw of rawOptions) {
      decision = addOption(
        decision,
        decisionOption({
          label: stringOf(raw.label),
          description: stringOf(raw.description),
          tradeoffs: arrayOf(raw.tradeoffs).map((value) => stringOf(value)),
        }),
      );
    }
    const scoresRaw = body.scores;
    if (typeof scoresRaw === 'object' && scoresRaw !== null && !Array.isArray(scoresRaw)) {
      const scores: Record<string, number> = {};
      for (const [optionId, value] of Object.entries(scoresRaw as Record<string, unknown>)) {
        const score = numberOf(value);
        if (score !== undefined) scores[optionId] = score;
      }
      if (Object.keys(scores).length > 0) decision = evaluateDecision(decision, scores);
    }
    const prosCons = arrayOf(body.prosCons)
      .map((value) => objectOf(value))
      .map((raw) =>
        optionProsCons(
          stringOf(raw.optionId),
          arrayOf(raw.pros).map((item) => stringOf(item)),
          arrayOf(raw.cons).map((item) => stringOf(item)),
        ),
      );
    const risks = arrayOf(body.risks)
      .map((value) => objectOf(value))
      .map((raw) =>
        assessRisk({
          optionId: stringOf(raw.optionId),
          factors: arrayOf(raw.factors).map((item) => stringOf(item)),
          riskScore: numberOf(raw.riskScore),
        }),
      );
    const analysis = decisionSupportAnalysis({
      label: `${label}-analysis`,
      decision,
      prosCons,
      risks,
      missingEvidenceList: [],
    });
    return jsonCrie({
      decision: { id: decision.id, options: decision.options },
      analysis,
      statistics: decisionSupportStatistics([analysis]),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
