'use client';

import { useMemo } from 'react';
import {
  averageReputationScore,
  completedReviewCount,
  filterRecommendationsByType,
  filterVerificationByEntityType,
  findBestReputationForType,
  integrityResolvedRatio,
  resolveTrustConfidence,
  sortTrustByScore,
  verificationProgress,
} from '@/lib/trust';
import {
  FEATURED_VERIFICATION,
  FOCUS_TRUST_REPORT,
  TRUST_PORTFOLIO,
  TRUST_VERIFICATION_RECORDS,
} from '@/constants/placeholder-trust';
import type {
  BadgeAward,
  IntegrityEvent,
  RecommendationEngineReport,
  ReputationReport,
  ReviewerAssignment,
  TrustConfidence,
  TrustEntityType,
  TrustPortfolio,
  TrustRecommendation,
  TrustRecommendationType,
  TrustVerificationStatus,
  VerificationRecord,
} from '@/types/trust';

type TrustFeatured = {
  verification: VerificationRecord | undefined;
  reputation: ReputationReport | undefined;
  badge: BadgeAward | undefined;
  assignment: ReviewerAssignment | undefined;
  integrityEvent: IntegrityEvent | undefined;
  recommendation: TrustRecommendation | undefined;
};

type UseTrustResult = {
  portfolio: TrustPortfolio;
  statistics: TrustPortfolio['statistics'];
  analytics: TrustPortfolio['analytics'];
  reputationReports: ReputationReport[];
  verificationRecords: VerificationRecord[];
  focusReport: ReputationReport;
  focusTrustScore: ReputationReport['trustScore'];
  featured: TrustFeatured;
  recommendationEngine: RecommendationEngineReport;
  integrityRatio: number;
  resolvedIntegrity: number;
  completedReviews: number;
  topReputations: ReputationReport[];
  verificationProgressOf: (record: VerificationRecord) => number;
  recordsForEntityType: (entityType: TrustEntityType) => VerificationRecord[];
  recommendationsByType: (type: TrustRecommendationType) => TrustRecommendation[];
  sortedByScore: <T extends { score: number }>(items: readonly T[]) => T[];
  trustConfidenceFor: (score: number) => TrustConfidence;
  averageScore: number;
  bestReputationForType: (entityType: TrustEntityType) => ReputationReport | undefined;
  verificationStatusOf: (entityId: string) => TrustVerificationStatus | undefined;
  activeAssignments: ReviewerAssignment[];
};

export default function useTrust(): UseTrustResult {
  return useMemo(() => {
    const portfolio = TRUST_PORTFOLIO;
    const focusReport = FOCUS_TRUST_REPORT;
    const featured: TrustFeatured = {
      verification: FEATURED_VERIFICATION,
      reputation: portfolio.reputation[0],
      badge: portfolio.badgeAwards[0],
      assignment: portfolio.peerReview.assignments[0],
      integrityEvent: portfolio.integrity.events[0],
      recommendation: portfolio.recommendations.recommendations[0],
    };

    const activeAssignments = portfolio.peerReview.assignments.filter((assignment) =>
      ['invited', 'accepted', 'in-progress'].includes(assignment.status)
    );

    return {
      portfolio,
      statistics: portfolio.statistics,
      analytics: portfolio.analytics,
      reputationReports: portfolio.reputation,
      verificationRecords: TRUST_VERIFICATION_RECORDS,
      focusReport,
      focusTrustScore: focusReport.trustScore,
      featured,
      recommendationEngine: portfolio.recommendations,
      integrityRatio: integrityResolvedRatio(portfolio.integrity.events),
      resolvedIntegrity: portfolio.integrity.resolvedEvents,
      completedReviews: completedReviewCount(portfolio.peerReview.assignments),
      topReputations: [...portfolio.reputation]
        .sort((a, b) => b.trustScore.overall - a.trustScore.overall)
        .slice(0, 4),
      verificationProgressOf: (record) => verificationProgress(record),
      recordsForEntityType: (entityType) => filterVerificationByEntityType(TRUST_VERIFICATION_RECORDS, entityType),
      recommendationsByType: (type) => filterRecommendationsByType(portfolio.recommendations.recommendations, type),
      sortedByScore: (items) => sortTrustByScore(items),
      trustConfidenceFor: (score) => resolveTrustConfidence(score),
      averageScore: averageReputationScore(portfolio.reputation),
      bestReputationForType: (entityType) => findBestReputationForType(portfolio.reputation, entityType),
      verificationStatusOf: (entityId) =>
        TRUST_VERIFICATION_RECORDS.find((record) => record.entityId === entityId)?.status,
      activeAssignments,
    };
  }, []);
}
