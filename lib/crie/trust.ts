/**
 * E-23 Trust Engine — Mission 004-D (Wave 2).
 *
 * Pure, derived-only trust helpers over the RKG and the platform verification
 * signals (CRIE Ch. 11; fspec Ch. 12). Trust is always computed, never stored:
 * every `TrustScore` carries the rule that explains its derivation. CRIE
 * composes the platform Trust & Verification module by reference
 * (`types/trust.ts`, `lib/trust.ts`); it never duplicates verification logic.
 */
import type {
  EntityLifecycleState,
  KGEntity,
  KGRelation,
  TrustScore,
} from '@/types/crie';
import type { TrustEntityType, VerificationEvidence } from '@/types/trust';
import { average, clamp, confidence, nowIso, round, slugOf } from './utils';

export function trustScoreId(label: string): string {
  return `trust-${slugOf(label)}`;
}

const LIFECYCLE_TRUST: Record<EntityLifecycleState, number> = {
  proposed: 0.3,
  confirmed: 0.85,
  deprecated: 0.1,
  superseded: 0.15,
};

/** Base derived trust of an entity from its calibrated confidence + lifecycle. */
export function entityBaseTrust(entity: KGEntity): number {
  return round(clamp(entity.confidence.value * 0.7 + LIFECYCLE_TRUST[entity.lifecycleState] * 0.3, 0, 1));
}

export function deriveEntityTrust(
  entity: KGEntity,
  derivedAt = nowIso(),
): TrustScore {
  return {
    subjectType: 'entity',
    subjectId: entity.crieId,
    trust: entityBaseTrust(entity),
    confidence: entity.confidence,
    rule: `Base entity trust from calibrated confidence (${entity.confidence.value}) and lifecycle state (${entity.lifecycleState}).`,
    derivedAt,
  };
}

export function deriveRelationTrust(
  relation: KGRelation,
  derivedAt = nowIso(),
): TrustScore {
  const trust = round(clamp(relation.strength * 0.6 + relation.confidence.value * 0.4, 0, 1));
  return {
    subjectType: 'relation',
    subjectId: relation.id,
    trust,
    confidence: relation.confidence,
    rule: `Relation trust from semantic strength (${relation.strength}) and calibrated confidence (${relation.confidence.value}).`,
    derivedAt,
  };
}

// ---------------------------------------------------------------------------
// Verification contribution (derived from platform signals, never stored)
// ---------------------------------------------------------------------------

const EVIDENCE_CONTRIBUTION: Record<VerificationEvidence['status'], number> = {
  verified: 1,
  'in-review': 0.5,
  pending: 0.4,
  failed: 0,
};

/** Contribution of one verification evidence record to a trust score. */
export function verificationContribution(evidence: VerificationEvidence): number {
  return EVIDENCE_CONTRIBUTION[evidence.status];
}

export function deriveTrustFromVerification(
  entityType: TrustEntityType,
  entityId: string,
  evidence: readonly VerificationEvidence[],
  base = 0.5,
  derivedAt = nowIso(),
): TrustScore {
  const contributions = evidence.map(verificationContribution);
  const verifiedShare = contributions.length === 0 ? 0 : average(contributions);
  const trust = round(clamp(base * 0.5 + verifiedShare * 0.5, 0, 1));
  return {
    subjectType: 'entity',
    subjectId: entityId,
    trust,
    confidence: confidence(trust),
    rule: `Trust derived from base score (${base}) and ${contributions.length} verification evidence records (${round(verifiedShare)}).`,
    derivedAt,
  };
}

// ---------------------------------------------------------------------------
// Propagation, combination, freshness
// ---------------------------------------------------------------------------

export function trustFor(
  scores: readonly TrustScore[],
  subjectId: string,
): TrustScore | undefined {
  return scores.find((score) => score.subjectId === subjectId);
}

export function averageTrust(scores: readonly TrustScore[]): number {
  return round(average(scores.map((score) => score.trust)));
}

export function combineTrust(
  scores: readonly TrustScore[],
  label: string,
  derivedAt = nowIso(),
): TrustScore {
  const trust = averageTrust(scores);
  const confidenceValues = scores.map((score) => score.confidence.value);
  return {
    subjectType: scores[0]?.subjectType ?? 'entity',
    subjectId: slugOf(label),
    trust,
    confidence: confidence(trust, confidenceValues.length > 0 ? `mean source confidence ${round(average(confidenceValues))}` : undefined),
    rule: `Aggregate trust over ${scores.length} derived source scores.`,
    derivedAt,
  };
}

/** Propagate relation trust back onto an entity (average of its edges). */
export function propagatedEntityTrust(
  entity: KGEntity,
  relationScores: readonly TrustScore[],
  derivedAt = nowIso(),
): TrustScore {
  const entityScore = entityBaseTrust(entity);
  const connected = relationScores.filter(
    (score) => score.subjectType === 'relation' && score.trust > 0,
  );
  const trust =
    connected.length === 0
      ? entityScore
      : round(clamp(entityScore * 0.5 + averageTrust(connected) * 0.5, 0, 1));
  return {
    subjectType: 'entity',
    subjectId: entity.crieId,
    trust,
    confidence: entity.confidence,
    rule: `Entity trust propagated from base score (${entityScore}) and ${connected.length} connected relation scores.`,
    derivedAt,
  };
}

/** Linear freshness decay of a derived score (never authoritative). */
export function trustFreshness(score: TrustScore, at: string, halfLifeDays = 180): number {
  const ageDays = (Date.parse(at) - Date.parse(score.derivedAt)) / 86_400_000;
  if (ageDays <= 0) return 1;
  return round(clamp(Math.pow(0.5, ageDays / halfLifeDays), 0, 1));
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface TrustStatistics {
  total: number;
  entities: number;
  relations: number;
  averageTrust: number;
  high: number;
}

export function trustStatistics(scores: readonly TrustScore[]): TrustStatistics {
  const entities = scores.filter((score) => score.subjectType === 'entity').length;
  const relations = scores.filter((score) => score.subjectType === 'relation').length;
  const high = scores.filter((score) => score.trust >= 0.6).length;
  return {
    total: scores.length,
    entities,
    relations,
    averageTrust: averageTrust(scores),
    high,
  };
}
