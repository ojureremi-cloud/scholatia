import type {
  BadgeTier,
  IntegrityEvent,
  IntegrityEventType,
  IntegrityStatus,
  PeerReviewModel,
  ReputationFactor,
  ReputationReport,
  ReviewRecommendation,
  ReviewerAssignment,
  TrustConfidence,
  TrustEntityType,
  TrustRecommendation,
  TrustScoreBreakdown,
  TrustScoreGrade,
  TrustVerificationStatus,
  VerificationRecord,
} from '@/types/trust';

/**
 * Trust, Verification & Reputation utilities (Scholatia Phase 1.9C).
 *
 * The Trust module is the credibility layer of the ecosystem. It does NOT own
 * records — it verifies, scores, and certifies the Researchers, Institutions,
 * Journals, Conferences, Publishers, and Reviewers owned by the other modules.
 * These utilities are pure, strongly typed helpers that operate on the trust
 * surfaces (verification records, reputation reports, badges, peer review,
 * integrity, academic identity, and recommendations) so the placeholder data
 * and the page never re-implement scoring, ranking, or banding logic by hand.
 */

/** Numeric backing for a recommendation / signal confidence level. */
export const TRUST_CONFIDENCE_RANK: Record<TrustConfidence, number> = {
  high: 90,
  medium: 65,
  low: 40,
};

/** Resolves a 0-100 score into a recommendation confidence level. */
export function resolveTrustConfidence(score: number): TrustConfidence {
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/** Maps a trust verification status to a display label. */
export const TRUST_STATUS_LABELS: Record<TrustVerificationStatus, string> = {
  unverified: 'Unverified',
  pending: 'Verification pending',
  verified: 'Verified',
  trusted: 'Trusted',
  revoked: 'Verification revoked',
};

/** Resolves a 0-100 score into a trust status label. */
export function resolveTrustStatus(score: number): string {
  if (score >= 90) return 'Trusted';
  if (score >= 75) return 'Verified';
  if (score >= 50) return 'Verification pending';
  return 'Unverified';
}

/**
 * Resolves a 0-100 score into an agency-style credit grade, used to
 * communicate a reputation score at a glance.
 */
export function resolveTrustGrade(score: number): TrustScoreGrade {
  if (score >= 90) return 'AAA';
  if (score >= 82) return 'AA';
  if (score >= 74) return 'A';
  if (score >= 66) return 'BBB';
  if (score >= 58) return 'BB';
  if (score >= 50) return 'B';
  if (score >= 42) return 'CCC';
  if (score >= 34) return 'CC';
  if (score >= 25) return 'C';
  return 'D';
}

/** Resolves a 0-100 score into a badge tier. */
export function resolveBadgeTier(score: number): BadgeTier {
  if (score >= 90) return 'platinum';
  if (score >= 75) return 'gold';
  if (score >= 55) return 'silver';
  return 'bronze';
}

/** Average of any collection of scores (empty-safe). */
export function averageScores(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/** Computes a weighted trust score from reputation factors (weights need not sum to 1). */
export function computeWeightedScore(factors: readonly ReputationFactor[]): number {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);
  return Math.max(0, Math.min(100, Math.round(weighted / totalWeight)));
}

/** Builds a complete trust score breakdown from factors and a summary line. */
export function buildTrustScoreBreakdown(
  factors: readonly ReputationFactor[],
  summary: string
): TrustScoreBreakdown {
  const overall = computeWeightedScore(factors);
  return {
    overall,
    status: resolveTrustStatus(overall),
    grade: resolveTrustGrade(overall),
    factors: [...factors],
    summary,
  };
}

/** Sorts any score-bearing records by descending score. */
export function sortTrustByScore<T extends { score: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.score - a.score);
}

/** Keeps only recommendations of a given type. */
export function filterRecommendationsByType<T extends TrustRecommendation>(
  recommendations: readonly T[],
  type: TrustRecommendation['type']
): T[] {
  return recommendations.filter((recommendation) => recommendation.type === type);
}

/** Keeps only verification records for a given entity type. */
export function filterVerificationByEntityType(
  records: readonly VerificationRecord[],
  entityType: TrustEntityType
): VerificationRecord[] {
  return records.filter((record) => record.entityType === entityType);
}

/** Fraction of checks satisfied on a verification record (0-100). */
export function verificationProgress(record: VerificationRecord): number {
  const completed = record.checks.filter((check) => check.status === 'verified').length;
  return record.checks.length ? Math.round((completed / record.checks.length) * 100) : 0;
}

/** Number of completed (submitted or completed) review assignments. */
export function completedReviewCount(assignments: readonly ReviewerAssignment[]): number {
  return assignments.filter(
    (assignment) => assignment.status === 'submitted' || assignment.status === 'completed'
  ).length;
}

/** Resolves the display label for a peer review model. */
export function resolvePeerReviewModelLabel(model: PeerReviewModel): string {
  const labels: Record<PeerReviewModel, string> = {
    'single-blind': 'Single Blind',
    'double-blind': 'Double Blind',
    'open-review': 'Open Review',
    'transparent-review': 'Transparent Review',
    'post-publication-review': 'Post-Publication Review',
  };
  return labels[model];
}

/** Resolves the display label for a review recommendation. */
export function resolveReviewRecommendationLabel(
  recommendation: ReviewRecommendation
): string {
  const labels: Record<ReviewRecommendation, string> = {
    accept: 'Accept',
    'minor-revision': 'Minor Revision',
    'major-revision': 'Major Revision',
    reject: 'Reject',
    withdraw: 'Withdraw',
  };
  return labels[recommendation];
}

/** Resolves the display label for an integrity event type. */
export function resolveIntegrityTypeLabel(type: IntegrityEventType): string {
  const labels: Record<IntegrityEventType, string> = {
    retraction: 'Retraction',
    correction: 'Correction',
    'expression-of-concern': 'Expression of Concern',
    'conflict-of-interest': 'Conflict of Interest',
    'ethics-approval': 'Ethics Approval',
    'plagiarism-status': 'Plagiarism Status',
  };
  return labels[type];
}

/** Resolves the display label for an integrity status. */
export function resolveIntegrityStatusLabel(status: IntegrityStatus): string {
  const labels: Record<IntegrityStatus, string> = {
    open: 'Open',
    resolved: 'Resolved',
    'in-progress': 'In Progress',
    monitoring: 'Monitoring',
    'not-applicable': 'N/A',
  };
  return labels[status];
}

/** Ratio of resolved integrity events, expressed as 0-100. */
export function integrityResolvedRatio(events: readonly IntegrityEvent[]): number {
  const resolved = events.filter((event) => event.status === 'resolved').length;
  return events.length ? Math.round((resolved / events.length) * 100) : 0;
}

/** Tally of integrity events by type. */
export function tallyIntegrityByType(
  events: readonly IntegrityEvent[]
): { type: IntegrityEventType; count: number }[] {
  const counts = new Map<IntegrityEventType, number>();
  for (const event of events) {
    counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

/** Average trust score across a collection of reputation reports. */
export function averageReputationScore(reports: readonly ReputationReport[]): number {
  return averageScores(reports.map((report) => report.trustScore.overall));
}

/** The strongest reputation report for a given entity type, if any. */
export function findBestReputationForType(
  reports: readonly ReputationReport[],
  entityType: TrustEntityType
): ReputationReport | undefined {
  return reports
    .filter((report) => report.entityType === entityType)
    .sort((a, b) => b.trustScore.overall - a.trustScore.overall)[0];
}
