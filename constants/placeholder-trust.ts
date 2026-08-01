import type {
  AcademicIdentityReport,
  AcademicMilestone,
  AcademicMilestoneType,
  AcademicTimelineEntry,
  AffiliationRecord,
  BadgeAward,
  BadgeDefinition,
  BadgeTier,
  CitationSuggestion,
  ConferenceFitRecommendation,
  ConferenceQualityIndex,
  EditorialReputation,
  IntegrityEvent,
  IntegrityTimelineEntry,
  InstitutionalReputation,
  JournalFitRecommendation,
  JournalQualityIndex,
  OrcidRecord,
  PeerReviewInfrastructureReport,
  PeerReviewModel,
  RecommendedCollaborator,
  RecommendationEngineReport,
  ReputationFactor,
  ReputationReport,
  ResearchImpactScore,
  ResearchIntegrityReport,
  ReviewHistoryEntry,
  ReviewerAnalytics,
  ReviewerAssignment,
  ReviewerReputation,
  ReviewerRecommendation,
  SuggestedGrant,
  TrustAnalytics,
  TrustConfidence,
  TrustEntityType,
  TrustPortfolio,
  TrustRecommendation,
  TrustRecommendationType,
  TrustStatistics,
  TrustVerificationStatus,
  VerificationCheck,
  VerificationEngineSummary,
  VerificationRecord,
} from '@/types/trust';
import type { JournalProfile } from '@/types/identity';
import type { Institution } from '@/types/institution';
import type { Publisher } from '@/types/publisher';
import type { ConferenceRecord } from '@/types/conference';
import type { ResearcherProfile } from '@/types/researcher';
import type { ResearchTimelineEntryType } from '@/types/researcher';
import type { PublicationEntry } from '@/constants/placeholder-profile';
import type { Manuscript } from '@/types/manuscript';
import type { FundingOpportunity } from '@/types/funding';
import {
  averageScores,
  buildTrustScoreBreakdown,
  resolveBadgeTier,
  resolveTrustConfidence,
} from '@/lib/trust';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { PUBLISHERS } from '@/constants/placeholder-publishers';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';
import { WORKSPACE_PUBLICATIONS } from '@/constants/placeholder-research';

/**
 * Placeholder data for the Trust, Verification & Reputation Engine
 * (Scholatia Phase 1.9C).
 *
 * The Trust module is the credibility layer of the ecosystem. It does NOT own
 * its own records — every verification record, reputation report, badge award,
 * peer review assignment, integrity event, ORCID link, affiliation, milestone,
 * and recommendation is derived from the existing placeholder modules
 * (researchers, institutions, journals, conferences, publishers, manuscripts,
 * funding, and workspace publications) and references the original source
 * identity (a SAID, journal id, conference id, publisher id, ORCID iD, or DOI)
 * so no data is duplicated.
 */

const CURRENT_DATE = '2026-07-31';

/** The platform focus researcher whose identity the trust surfaces personalise. */
export const FOCUS_RESEARCHER: ResearcherProfile = RESEARCHERS[0];

/** The reviewer pool the peer review infrastructure draws from. */
export const REVIEWER_POOL: ResearcherProfile[] = RESEARCHERS.slice(0, 6);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clampScore(value: number): number {
  return Math.max(5, Math.min(100, Math.round(value)));
}

function tally(values: readonly string[]): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/** Maps the shared institution verification status string to a trust status. */
function resolveRecordStatus(verificationStatus: string, trustScore: number): TrustVerificationStatus {
  if (verificationStatus === 'Trusted') return 'trusted';
  if (verificationStatus === 'Verified' || verificationStatus === 'Accredited' || verificationStatus === 'Government Recognised') {
    return trustScore >= 90 ? 'trusted' : 'verified';
  }
  if (verificationStatus === 'Pending' || verificationStatus === 'Email Verified' || verificationStatus === 'Domain Verified' || verificationStatus === 'Document Verified') {
    return 'pending';
  }
  return trustScore >= 75 ? 'verified' : 'pending';
}

function mapReviewModel(model: string): PeerReviewModel {
  if (model.includes('Double')) return 'double-blind';
  if (model.includes('Single')) return 'single-blind';
  if (model.includes('Transparent')) return 'transparent-review';
  if (model.includes('Post')) return 'post-publication-review';
  if (model.includes('Open')) return 'open-review';
  return 'double-blind';
}

function mapMilestoneType(type: ResearchTimelineEntryType): AcademicMilestoneType {
  switch (type) {
    case 'Education':
      return 'phd';
    case 'Employment':
      return 'professorship';
    case 'Grant':
      return 'first-grant';
    case 'Publication':
      return 'first-publication';
    case 'Award':
      return 'award';
    case 'Certification':
      return 'fellowship';
    case 'Conference':
      return 'keynote';
    case 'Leadership':
      return 'editorial-appointment';
    case 'Project':
    case 'Milestone':
      return 'award';
    default:
      return 'award';
  }
}

/** Derives a trust confidence level from a 0-100 score. */
function confidenceFromScore(score: number): TrustConfidence {
  return resolveTrustConfidence(score);
}

// ---------------------------------------------------------------------------
// Verification Engine
// ---------------------------------------------------------------------------

function buildResearcherVerification(researcher: ResearcherProfile): VerificationRecord {
  const status = researcher.verification.verified ? 'verified' : 'pending';
  const verifiedAt = researcher.verification.lastVerified ?? researcher.identity.memberSince;
  return {
    id: `verification-researcher-${researcher.username}`,
    entityType: 'researcher',
    entityId: researcher.identity.said,
    entityName: researcher.displayName,
    status: researcher.verification.trustScore >= 90 ? 'trusted' : status,
    verificationLevel: researcher.identity.verificationLevel,
    verifiedAt,
    verifiedBy: researcher.position.institution,
    summary: `${researcher.displayName} verified through institutional affiliation with ${researcher.position.institution}.`,
    checks: ([
      {
        id: `verification-researcher-${researcher.username}-email`,
        label: 'Institutional email',
        status: 'verified',
        weight: 0.2,
        verifiedAt,
        evidence: [researcher.contact.professionalEmail],
      },
      {
        id: `verification-researcher-${researcher.username}-identity`,
        label: 'Government-issued identity',
        status: 'verified',
        weight: 0.25,
        verifiedAt,
      },
      {
        id: `verification-researcher-${researcher.username}-affiliation`,
        label: 'Affiliation confirmed',
        status: 'verified',
        weight: 0.25,
        verifiedAt,
        evidence: [researcher.position.institution],
      },
      {
        id: `verification-researcher-${researcher.username}-orcid`,
        label: 'ORCID iD linked',
        status: researcher.identity.orcid ? 'verified' : 'not-started',
        weight: 0.15,
        verifiedAt,
        evidence: researcher.identity.orcid ? [researcher.identity.orcid] : undefined,
      },
      {
        id: `verification-researcher-${researcher.username}-publications`,
        label: 'Publication records cross-checked',
        status: researcher.relationships.publications.length > 0 ? 'verified' : 'pending',
        weight: 0.15,
        verifiedAt,
        evidence: [`${researcher.relationships.publications.length} records matched to DOI metadata`],
      },
    ] satisfies VerificationCheck[]).map((check, checkIndex) => ({
      ...check,
      id: `${check.id}-${checkIndex}`,
    })),
  };
}

const VERIFICATION_STATUS_OVERRIDES: Record<string, TrustVerificationStatus> = {};

function buildJournalVerification(journal: JournalProfile): VerificationRecord {
  return {
    id: `verification-journal-${journal.journalId}`,
    entityType: 'journal',
    entityId: journal.journalId,
    entityName: journal.journalTitle,
    status: VERIFICATION_STATUS_OVERRIDES[journal.journalId] ?? resolveRecordStatus(journal.verificationStatus, journal.trustScore),
    verificationLevel: 8,
    verifiedAt: '2026-05-10',
    verifiedBy: journal.publisher ?? 'Scholatia Trust Office',
    summary: `${journal.journalTitle} verified against ISSN metadata, indexing registries, and editorial governance.`,
    checks: [
      { id: `verification-journal-${journal.journalId}-issn`, label: 'ISSN registered', status: journal.issn ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-05-10', evidence: journal.issn ? [journal.issn] : undefined },
      { id: `verification-journal-${journal.journalId}-indexing`, label: 'Indexing services confirmed', status: journal.indexingServices.length > 0 ? 'verified' : 'not-started', weight: 0.25, verifiedAt: '2026-05-10', evidence: journal.indexingServices.slice(0, 3) },
      { id: `verification-journal-${journal.journalId}-editorial`, label: 'Editorial board verified', status: journal.editors.length > 0 ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-05-10', evidence: journal.editors.slice(0, 2) },
      { id: `verification-journal-${journal.journalId}-governance`, label: 'Publishing governance reviewed', status: journal.reviewModel ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-05-10', evidence: [journal.reviewModel] },
    ],
  };
}

function buildConferenceVerification(conference: ConferenceRecord): VerificationRecord {
  return {
    id: `verification-conference-${conference.conferenceId}`,
    entityType: 'conference',
    entityId: conference.conferenceId,
    entityName: conference.title,
    status: resolveRecordStatus(conference.verificationStatus, conference.trustScore),
    verificationLevel: 7,
    verifiedAt: '2026-06-01',
    verifiedBy: conference.institution ?? 'Scholatia Trust Office',
    summary: `${conference.title} verified through organiser identity, venue, and programme governance.`,
    checks: [
      { id: `verification-conference-${conference.conferenceId}-organiser`, label: 'Organising institution verified', status: conference.organisers.length > 0 ? 'verified' : 'pending', weight: 0.3, verifiedAt: '2026-06-01' },
      { id: `verification-conference-${conference.conferenceId}-committee`, label: 'Committee transparency', status: conference.committee.length > 0 ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-06-01' },
      { id: `verification-conference-${conference.conferenceId}-venue`, label: 'Venue confirmed', status: conference.venue ? 'verified' : 'not-started', weight: 0.2, verifiedAt: '2026-06-01', evidence: conference.venue ? [conference.venue] : undefined },
      { id: `verification-conference-${conference.conferenceId}-proceedings`, label: 'Proceedings / DOI readiness', status: 'pending', weight: 0.25, verifiedAt: '2026-06-01' },
    ],
  };
}

function buildInstitutionVerification(institution: Institution): VerificationRecord {
  return {
    id: `verification-institution-${institution.said}`,
    entityType: 'institution',
    entityId: institution.said,
    entityName: institution.profile.institutionName,
    status: resolveRecordStatus(institution.profile.verificationStatus, institution.profile.trustScore),
    verificationLevel: 9,
    verifiedAt: institution.profile.lastVerifiedAt ?? '2026-04-20',
    verifiedBy: institution.profile.accreditation ?? 'National Accreditation Body',
    summary: `${institution.profile.institutionName} verified through official documentation and accreditation records.`,
    checks: [
      { id: `verification-institution-${institution.said}-domain`, label: 'Official domain verified', status: 'verified', weight: 0.25, verifiedAt: '2026-04-20', evidence: institution.profile.website ? [institution.profile.website] : undefined },
      { id: `verification-institution-${institution.said}-documents`, label: 'Official documents reviewed', status: 'verified', weight: 0.25, verifiedAt: '2026-04-20', evidence: institution.profile.officialDocuments.slice(0, 2).map((doc) => doc.label) },
      { id: `verification-institution-${institution.said}-accreditation`, label: 'Accreditation confirmed', status: institution.accreditations.length > 0 ? 'verified' : 'pending', weight: 0.3, verifiedAt: '2026-04-20', evidence: institution.accreditations.slice(0, 2).map((acc) => `${acc.body} (${acc.awardedYear})`) },
      { id: `verification-institution-${institution.said}-representative`, label: 'Official representative', status: 'verified', weight: 0.2, verifiedAt: '2026-04-20' },
    ],
  };
}

function buildPublisherVerification(publisher: Publisher): VerificationRecord {
  return {
    id: `verification-publisher-${publisher.id}`,
    entityType: 'publisher',
    entityId: publisher.id,
    entityName: publisher.name,
    status: resolveRecordStatus(publisher.verificationStatus, publisher.trustScore),
    verificationLevel: 9,
    verifiedAt: '2026-06-20',
    verifiedBy: publisher.headquarters,
    summary: `${publisher.name} verified through company records, governance, and publishing output audits.`,
    checks: [
      { id: `verification-publisher-${publisher.id}-registry`, label: 'Registered business records', status: 'verified', weight: 0.3, verifiedAt: '2026-06-20', evidence: [publisher.country] },
      { id: `verification-publisher-${publisher.id}-governance`, label: 'Publishing governance', status: publisher.policies.length > 0 ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-06-20', evidence: publisher.policies.slice(0, 2).map((policy) => policy.name) },
      { id: `verification-publisher-${publisher.id}-output`, label: 'Publication output audited', status: publisher.metrics.articlesPublished > 0 ? 'verified' : 'pending', weight: 0.25, verifiedAt: '2026-06-20', evidence: [`${publisher.metrics.articlesPublished} articles audited`] },
      { id: `verification-publisher-${publisher.id}-integrity`, label: 'Research integrity policy', status: publisher.policies.some((policy) => policy.type === 'Research Integrity' || policy.type === 'Ethics') ? 'verified' : 'pending', weight: 0.2, verifiedAt: '2026-06-20' },
    ],
  };
}

export const TRUST_VERIFICATION_RECORDS: VerificationRecord[] = [
  ...RESEARCHERS.map((researcher) => buildResearcherVerification(researcher)),
  ...JOURNALS.map((journal) => buildJournalVerification(journal)),
  ...CONFERENCES.map((conference) => buildConferenceVerification(conference)),
  ...INSTITUTIONS.map((institution) => buildInstitutionVerification(institution)),
  ...PUBLISHERS.map((publisher) => buildPublisherVerification(publisher)),
];

export const TRUST_VERIFICATION_SUMMARY: VerificationEngineSummary = {
  totalRecords: TRUST_VERIFICATION_RECORDS.length,
  verified: TRUST_VERIFICATION_RECORDS.filter((record) => record.status === 'verified').length,
  trusted: TRUST_VERIFICATION_RECORDS.filter((record) => record.status === 'trusted').length,
  pending: TRUST_VERIFICATION_RECORDS.filter((record) => record.status === 'pending').length,
  revoked: TRUST_VERIFICATION_RECORDS.filter((record) => record.status === 'revoked').length,
  byEntityType: (['researcher', 'institution', 'journal', 'conference', 'publisher'] as TrustEntityType[]).map(
    (entityType) => {
      const records = TRUST_VERIFICATION_RECORDS.filter((record) => record.entityType === entityType);
      return {
        entityType,
        total: records.length,
        verified: records.filter((record) => record.status === 'verified').length,
        trusted: records.filter((record) => record.status === 'trusted').length,
      };
    }
  ),
};

export const FEATURED_VERIFICATION: VerificationRecord =
  TRUST_VERIFICATION_RECORDS.find((record) => record.entityType === 'researcher') ?? TRUST_VERIFICATION_RECORDS[0];

// ---------------------------------------------------------------------------
// Reputation Engine
// ---------------------------------------------------------------------------

function researcherReputationFactors(researcher: ResearcherProfile): ReputationFactor[] {
  const impactScore = clampScore(researcher.impact.hIndex * 3 + Math.log10(Math.max(1, researcher.impact.citationMetrics.totalCitations)) * 12);
  const reviewActivity = clampScore(Math.min(40, researcher.verification.badges.length * 5) + researcher.portfolio.totalManuscripts * 3);
  const editorialService = clampScore(Math.min(30, researcher.editorialAppointments.length) * 30);
  return [
    { id: 'verification', label: 'Verification level', score: clampScore(researcher.verification.identityScore), weight: 0.25, description: 'Evidence-backed identity checks.' },
    { id: 'publication-record', label: 'Publication record', score: impactScore, weight: 0.25, description: 'Outputs, citations, and h-index.' },
    { id: 'peer-review-activity', label: 'Peer review activity', score: reviewActivity, weight: 0.15, description: 'Completed reviews and invitations accepted.' },
    { id: 'editorial-service', label: 'Editorial service', score: editorialService, weight: 0.1, description: 'Editorial board and handling appointments.' },
    { id: 'research-integrity', label: 'Research integrity', score: 90, weight: 0.15, description: 'Clean integrity record and compliance.' },
    { id: 'community', label: 'Community contributions', score: clampScore(Math.min(60, researcher.network.followers) * 0.5 + researcher.volunteerExperience.length * 15), weight: 0.1, description: 'Mentoring, service, and engagement.' },
  ];
}

function buildResearcherImpact(researcher: ResearcherProfile, index: number): ResearchImpactScore {
  const total = researcher.impact.citationMetrics.totalCitations;
  const hIndex = researcher.impact.hIndex;
  const percentile = clampScore(90 - index * 3);
  const recent = researcher.impact.citationMetrics.citationsByYear.slice(-5);
  const citationVelocity = recent.length ? Math.round(recent.reduce((sum, entry) => sum + entry.citations, 0) / Math.max(1, recent.length)) : 0;
  return {
    totalCitations: total,
    hIndex,
    i10Index: researcher.impact.i10Index,
    percentile,
    citationVelocity,
    fieldWeightedCitationImpact: Math.round((total / Math.max(1, hIndex) / 10) * 10) / 10,
    score: clampScore(hIndex * 3 + Math.log10(Math.max(1, total)) * 10 + percentile * 0.2),
    trend: 6 + (index % 10),
  };
}

function buildEditorialReputation(researcher: ResearcherProfile): EditorialReputation {
  const appointments = researcher.editorialAppointments;
  return {
    editorId: researcher.identity.said,
    name: researcher.displayName,
    roles: appointments.slice(0, 3).map((appointment) => appointment.role),
    manuscriptsHandled: 40 + researcher.portfolio.totalManuscripts * 6,
    decisionsMade: 60 + researcher.portfolio.totalManuscripts * 4,
    avgDaysToDecision: 45,
    acceptanceRate: 38,
    reputationScore: clampScore(researcher.verification.trustScore + 4),
    integrityComplaints: 0,
    journalsServed: appointments.slice(0, 3).map((appointment) => appointment.journal),
  };
}

function buildReviewerReputation(researcher: ResearcherProfile, index: number, completedReviews: number): ReviewerReputation {
  const qualityScore = clampScore(78 + (index % 6) * 3);
  const punctuality = clampScore(80 - index * 2);
  return {
    reviewerId: researcher.identity.said,
    name: researcher.displayName,
    reviewsCompleted: completedReviews,
    reviewsAccepted: Math.round(completedReviews * 1.08),
    averageReviewLength: 1400 + (index % 5) * 220,
    medianTurnaroundDays: Math.max(8, 24 - index * 2),
    punctualityScore: punctuality,
    qualityScore,
    reputationScore: clampScore(researcher.verification.trustScore * 0.5 + qualityScore * 0.3 + punctuality * 0.2),
    expertiseMatch: clampScore(70 + index * 4),
    conflictsAvoided: 2 + (index % 5),
    journalsServed: researcher.relationships.journals.slice(0, 3).map((journal) => journal.title),
  };
}

const TRUST_REVIEWER_REPUTATIONS: ReviewerReputation[] = REVIEWER_POOL.map((researcher, index) =>
  buildReviewerReputation(researcher, index, 45 + index * 9)
);

export const TRUST_RESEARCHER_REPORTS: ReputationReport[] = RESEARCHERS.map((researcher, index) => {
  const reviewerReputation = REVIEWER_POOL.includes(researcher) ? TRUST_REVIEWER_REPUTATIONS[index] : undefined;
  return {
    id: `reputation-researcher-${researcher.username}`,
    entityType: 'researcher',
    entityId: researcher.identity.said,
    entityName: researcher.displayName,
    trustScore: buildTrustScoreBreakdown(
      researcherReputationFactors(researcher),
      `${researcher.displayName} maintains a verified identity with a ${researcher.impact.hIndex}-index publication record across ${researcher.position.faculty}.`
    ),
    researchImpact: buildResearcherImpact(researcher, index),
    editorialReputation: researcher.editorialAppointments.length > 0 ? buildEditorialReputation(researcher) : undefined,
    reviewerReputation,
    summary: researcher.biography.academicSummary,
  };
});

function buildJournalQualityIndex(journal: JournalProfile): JournalQualityIndex {
  const impactFactor = journal.impactMetrics?.impactFactor ?? 0;
  const hIndex = journal.impactMetrics?.hIndex ?? 0;
  const acceptanceRate = journal.editorialDecisionStats?.acceptanceRate ?? journal.analytics?.acceptanceRate ?? 40;
  const rejectionRate = journal.editorialDecisionStats?.rejectionRate ?? 55;
  const avgDays = journal.editorialDecisionStats?.avgDaysToFirstDecision ?? journal.analytics?.medianDaysToFirstDecision ?? 45;
  const scaledImpact = Math.min(100, impactFactor * 18);
  const indexingScore = Math.min(100, journal.indexingServices.length * 18);
  const qualityIndex = clampScore(
    journal.trustScore * 0.4 + scaledImpact * 0.25 + (100 - acceptanceRate) * 0.15 + indexingScore * 0.1 + Math.min(20, hIndex) * 0.5
  );
  return {
    journalId: journal.journalId,
    name: journal.journalTitle,
    qualityIndex,
    impactFactor: impactFactor || undefined,
    fiveYearImpactFactor: journal.impactMetrics?.fiveYearImpactFactor,
    hIndex,
    totalCitations: journal.impactMetrics?.totalCitations ?? 0,
    acceptanceRate,
    rejectionRate,
    avgDaysToFirstDecision: avgDays,
    indexingServices: journal.indexingServices,
    quartile: journal.impactMetrics?.quartile,
    trustScore: journal.trustScore,
  };
}

function buildConferenceQualityIndex(conference: ConferenceRecord, index: number): ConferenceQualityIndex {
  const acceptanceRate = conference.analytics.acceptanceRate;
  const paperCount = conference.analytics.paperCount;
  const qualityIndex = clampScore(
    conference.trustScore * 0.5 + (100 - acceptanceRate) * 0.2 + Math.min(100, paperCount) * 0.15 + Math.min(100, conference.committee.length * 8) * 0.15
  );
  return {
    conferenceId: conference.conferenceId,
    name: conference.title,
    qualityIndex,
    acceptanceRate,
    hIndex: Math.round(paperCount / 6),
    citations: conference.analytics.totalAccepted * 18,
    submissions: conference.analytics.totalSubmissions,
    attendeeSatisfaction: conference.analytics.participantSatisfaction ?? 84,
    repeatSubmissionRate: clampScore(35 + (qualityIndex % 30)),
    committeeSize: conference.committee.length,
    yearsActive: 3 + (index % 9),
  };
}

function buildInstitutionalReputation(institution: Institution, index: number): InstitutionalReputation {
  const hIndex = institution.analytics.hIndex;
  const citations = institution.analytics.citations;
  const reputationScore = clampScore(
    institution.profile.trustScore * 0.5 + Math.min(100, hIndex * 2) * 0.25 + Math.min(100, citations / 150) * 0.25
  );
  return {
    institutionId: institution.said,
    name: institution.profile.institutionName,
    researchOutputs: institution.analytics.researchOutputs,
    publications: institution.analytics.publications,
    citations,
    hIndex,
    fieldWeightedImpact: Math.round((citations / Math.max(1, hIndex) / 9) * 10) / 10,
    reputationScore,
    rankings: institution.rankings.slice(0, 3).map((ranking) => ({
      source: ranking.source,
      rank: ranking.rank,
      year: ranking.year,
      totalRanked: ranking.totalRanked,
    })),
    peerEndorsements: 40 + (index % 30),
  };
}

export const TRUST_REPUTATION_REPORTS: ReputationReport[] = [
  ...TRUST_RESEARCHER_REPORTS,
  ...JOURNALS.map((journal) => {
    const quality = buildJournalQualityIndex(journal);
    return {
      id: `reputation-journal-${journal.journalId}`,
      entityType: 'journal' as const,
      entityId: journal.journalId,
      entityName: journal.journalTitle,
      trustScore: buildTrustScoreBreakdown(
        [
          { id: 'indexing', label: 'Indexing & visibility', score: clampScore(journal.indexingServices.length * 20), weight: 0.2, description: 'Coverage in recognized registries.' },
          { id: 'editorial-governance', label: 'Editorial governance', score: clampScore(journal.editors.length * 18), weight: 0.25, description: 'Verified editorial board.' },
          { id: 'review-quality', label: 'Review quality', score: clampScore(journal.reviewModel === 'Double Blind' ? 88 : 78), weight: 0.25, description: 'Blind review rigour.' },
          { id: 'integrity', label: 'Research integrity', score: clampScore(journal.policy?.plagiarismPolicy ? 90 : 70), weight: 0.3, description: 'Plagiarism and ethics policy.' },
        ],
        `${journal.journalTitle} is ${journal.verificationStatus.toLowerCase()} with ${journal.impactMetrics?.quartile ?? 'an unranked'} citation profile.`
      ),
      journalQuality: quality,
      summary: journal.aimsAndScope ?? journal.editorialPolicy ?? '',
    };
  }),
  ...CONFERENCES.map((conference, index) => {
    const quality = buildConferenceQualityIndex(conference, index);
    return {
      id: `reputation-conference-${conference.conferenceId}`,
      entityType: 'conference' as const,
      entityId: conference.conferenceId,
      entityName: conference.title,
      trustScore: buildTrustScoreBreakdown(
        [
          { id: 'organiser', label: 'Organiser verification', score: conference.trustScore, weight: 0.4, description: 'Organising institution identity.' },
          { id: 'committee', label: 'Committee transparency', score: clampScore(Math.min(30, conference.committee.length) * 30), weight: 0.3, description: 'Public scientific committee.' },
          { id: 'submissions', label: 'Selectivity', score: clampScore(100 - conference.analytics.acceptanceRate), weight: 0.3, description: 'Acceptance rate signal.' },
        ],
        `${conference.title} achieves a ${quality.qualityIndex}/100 Conference Quality Index with ${conference.analytics.totalAccepted} accepted papers.`
      ),
      conferenceQuality: quality,
      summary: conference.description ?? conference.theme ?? '',
    };
  }),
  ...INSTITUTIONS.map((institution, index) => {
    const reputation = buildInstitutionalReputation(institution, index);
    return {
      id: `reputation-institution-${institution.said}`,
      entityType: 'institution' as const,
      entityId: institution.said,
      entityName: institution.profile.institutionName,
      trustScore: buildTrustScoreBreakdown(
        [
          { id: 'accreditation', label: 'Accreditation', score: institution.profile.trustScore, weight: 0.35, description: 'Accreditation body status.' },
          { id: 'research-output', label: 'Research output', score: clampScore(Math.min(100, reputation.publications / 8)), weight: 0.3, description: 'Publications and citations.' },
          { id: 'governance', label: 'Governance', score: clampScore(Math.min(60, institution.administrativeUnits.length) * 15), weight: 0.2, description: 'Institutional structure.' },
          { id: 'partnerships', label: 'Partnerships', score: clampScore(Math.min(100, institution.partnerships.length * 12)), weight: 0.15, description: 'Verified partnerships.' },
        ],
        `${institution.profile.institutionName} holds an institutional reputation of ${reputation.reputationScore}/100 across ${institution.profile.academicDisciplines.length} disciplines.`
      ),
      institutionalReputation: reputation,
      summary: institution.profile.mission ?? institution.profile.description ?? '',
    };
  }),
  ...PUBLISHERS.map((publisher) => {
    const integrityScore = publisher.policies.some((policy) => policy.type === 'Research Integrity' || policy.type === 'Ethics') ? 92 : 72;
    return {
      id: `reputation-publisher-${publisher.id}`,
      entityType: 'publisher' as const,
      entityId: publisher.id,
      entityName: publisher.name,
      trustScore: buildTrustScoreBreakdown(
        [
          { id: 'governance', label: 'Governance', score: publisher.trustScore, weight: 0.35, description: 'Publishing governance and registry.' },
          { id: 'integrity', label: 'Research integrity', score: integrityScore, weight: 0.3, description: 'Integrity and ethics policies.' },
          { id: 'transparency', label: 'Transparency', score: clampScore(publisher.openAccess ? 92 : 78), weight: 0.2, description: 'Open access and pricing.' },
          { id: 'output', label: 'Output quality', score: clampScore(Math.min(100, publisher.metrics.articlesPublished / 60)), weight: 0.15, description: 'Audited publishing output.' },
        ],
        `${publisher.name} is ${publisher.verificationStatus.toLowerCase()} with ${publisher.metrics.journals} journals under verified governance.`
      ),
      summary: publisher.mission ?? publisher.description,
    };
  }),
];

export const FOCUS_TRUST_REPORT: ReputationReport = TRUST_RESEARCHER_REPORTS[0];

export const FEATURED_REPUTATION: ReputationReport = TRUST_REPUTATION_REPORTS[0];

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export const TRUST_BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'verified-researcher', name: 'Verified Researcher', description: 'Academic identity verified through evidence-backed checks.', icon: '🔬', criteria: ['Identity verified', 'Affiliation confirmed', 'Publication records cross-checked'], entityType: 'researcher', tier: 'gold' },
  { id: 'verified-institution', name: 'Verified Institution', description: 'Institution verified against official records and accreditation.', icon: '🏛️', criteria: ['Official domain', 'Accreditation confirmed', 'Representative verified'], entityType: 'institution', tier: 'gold' },
  { id: 'verified-journal', name: 'Verified Journal', description: 'Journal verified against ISSN metadata and indexing registries.', icon: '📚', criteria: ['ISSN registered', 'Editorial board verified', 'Indexing confirmed'], entityType: 'journal', tier: 'gold' },
  { id: 'verified-publisher', name: 'Verified Publisher', description: 'Publisher verified through governance and output audits.', icon: '🏢', criteria: ['Registered records', 'Integrity policy', 'Output audited'], entityType: 'publisher', tier: 'gold' },
  { id: 'verified-conference', name: 'Verified Conference', description: 'Conference verified through organiser identity and programme governance.', icon: '🎪', criteria: ['Organiser verified', 'Committee transparent', 'Venue confirmed'], entityType: 'conference', tier: 'gold' },
  { id: 'top-reviewer', name: 'Top Reviewer', description: 'Recognised for consistently high-quality, punctual peer review.', icon: '⭐', criteria: ['High review quality', 'On-time completion', 'Clean conflict record'], entityType: 'reviewer', tier: 'platinum' },
  { id: 'outstanding-editor', name: 'Outstanding Editor', description: 'Distinguished editorial service with fair, fast decisions.', icon: '📝', criteria: ['Editorial appointments', 'Fast decisions', 'No integrity complaints'], entityType: 'researcher', tier: 'platinum' },
  { id: 'highly-cited', name: 'Highly Cited', description: 'Research with sustained citation impact above cohort percentile.', icon: '📈', criteria: ['Top citation percentile', 'High h-index', 'Field-weighted impact'], entityType: 'researcher', tier: 'platinum' },
  { id: 'open-science-champion', name: 'Open Science Champion', description: 'Leads transparent, reproducible, and openly available research.', icon: '🌍', criteria: ['Open access outputs', 'Data sharing', 'Transparent methods'], entityType: 'any', tier: 'gold' },
  { id: 'trusted-vendor', name: 'Trusted Vendor', description: 'Vendor that passes rigorous service and reliability audits.', icon: '🛡️', criteria: ['Passed audit', 'Reliable delivery', 'Verified operations'], entityType: 'vendor', tier: 'gold' },
];

const highlyCitedResearchers = [...RESEARCHERS]
  .sort((a, b) => b.impact.hIndex - a.impact.hIndex)
  .slice(0, 4);

const topReviewers = [...TRUST_REVIEWER_REPUTATIONS]
  .sort((a, b) => b.reputationScore - a.reputationScore)
  .slice(0, 3);

function awardFor(
  id: string,
  badge: BadgeDefinition,
  entityId: string,
  entityName: string,
  entityType: BadgeAward['entityType'],
  score: number,
  awardedAt: string
): BadgeAward {
  return {
    id,
    badgeId: badge.id,
    title: badge.name,
    entityId,
    entityName,
    entityType,
    tier: resolveBadgeTier(score),
    awardedAt,
    criteriaMet: badge.criteria,
  };
}

export const TRUST_BADGE_AWARDS: BadgeAward[] = [
  ...RESEARCHERS.filter((researcher) => researcher.verification.verified).slice(0, 10).map((researcher) =>
    awardFor(
      `badge-verified-researcher-${researcher.username}`,
      TRUST_BADGE_DEFINITIONS[0],
      researcher.identity.said,
      researcher.displayName,
      'researcher',
      researcher.verification.trustScore,
      researcher.verification.lastVerified ?? '2026-01-15'
    )
  ),
  ...INSTITUTIONS.filter((institution) => institution.accreditations.length > 0).slice(0, 4).map((institution) =>
    awardFor(
      `badge-verified-institution-${institution.said}`,
      TRUST_BADGE_DEFINITIONS[1],
      institution.said,
      institution.profile.institutionName,
      'institution',
      institution.profile.trustScore,
      institution.profile.lastVerifiedAt ?? '2026-02-01'
    )
  ),
  ...JOURNALS.filter((journal) => journal.verificationStatus === 'Verified' || journal.verificationStatus === 'Trusted').slice(0, 5).map((journal) =>
    awardFor(
      `badge-verified-journal-${journal.journalId}`,
      TRUST_BADGE_DEFINITIONS[2],
      journal.journalId,
      journal.journalTitle,
      'journal',
      journal.trustScore,
      '2026-03-01'
    )
  ),
  ...PUBLISHERS.filter((publisher) => publisher.verificationStatus === 'Trusted').slice(0, 3).map((publisher) =>
    awardFor(
      `badge-verified-publisher-${publisher.id}`,
      TRUST_BADGE_DEFINITIONS[3],
      publisher.id,
      publisher.name,
      'publisher',
      publisher.trustScore,
      '2026-03-15'
    )
  ),
  ...CONFERENCES.filter((conference) => conference.verificationStatus === 'Verified' || conference.verificationStatus === 'Trusted').slice(0, 4).map((conference) =>
    awardFor(
      `badge-verified-conference-${conference.conferenceId}`,
      TRUST_BADGE_DEFINITIONS[4],
      conference.conferenceId,
      conference.title,
      'conference',
      conference.trustScore,
      '2026-04-01'
    )
  ),
  ...topReviewers.map((reviewer) =>
    awardFor(
      `badge-top-reviewer-${reviewer.reviewerId}`,
      TRUST_BADGE_DEFINITIONS[5],
      reviewer.reviewerId,
      reviewer.name,
      'reviewer',
      reviewer.reputationScore,
      '2026-05-01'
    )
  ),
  ...RESEARCHERS.filter((researcher) => researcher.editorialAppointments.length > 0).slice(0, 3).map((researcher) =>
    awardFor(
      `badge-outstanding-editor-${researcher.username}`,
      TRUST_BADGE_DEFINITIONS[6],
      researcher.identity.said,
      researcher.displayName,
      'researcher',
      researcher.verification.trustScore + 2,
      '2026-05-10'
    )
  ),
  ...highlyCitedResearchers.map((researcher) =>
    awardFor(
      `badge-highly-cited-${researcher.username}`,
      TRUST_BADGE_DEFINITIONS[7],
      researcher.identity.said,
      researcher.displayName,
      'researcher',
      clampScore(Math.min(100, researcher.impact.hIndex * 3)),
      '2026-06-01'
    )
  ),
  awardFor('badge-open-science-champion-focus', TRUST_BADGE_DEFINITIONS[8], FOCUS_RESEARCHER.identity.said, FOCUS_RESEARCHER.displayName, 'researcher', 94, '2026-06-15'),
  awardFor('badge-trusted-vendor-press', TRUST_BADGE_DEFINITIONS[9], 'SCHOLATIA-PRESS', 'Scholatia Press', 'vendor', 96, '2026-06-20'),
];

export const FEATURED_BADGE_AWARD: BadgeAward = TRUST_BADGE_AWARDS[0];

// ---------------------------------------------------------------------------
// Peer Review Infrastructure
// ---------------------------------------------------------------------------

export const TRUST_REVIEWER_ASSIGNMENTS: ReviewerAssignment[] = (() => {
  const assignments: ReviewerAssignment[] = [];
  MANUSCRIPTS.forEach((manuscript: Manuscript) => {
    manuscript.submissions.forEach((submission) => {
      submission.rounds.forEach((round) => {
        round.comments.forEach((comment, commentIndex) => {
          const reviewer = REVIEWER_POOL[(assignments.length + commentIndex) % REVIEWER_POOL.length];
          const status: ReviewerAssignment['status'] =
            round.status === 'completed'
              ? 'completed'
              : round.status === 'in-progress'
                ? 'in-progress'
                : 'invited';
          assignments.push({
            id: `assignment-${comment.id}`,
            manuscriptId: manuscript.id,
            manuscriptTitle: manuscript.title,
            journalId: submission.journalId,
            journalName: submission.journalTitle,
            reviewerId: reviewer.identity.said,
            reviewerName: reviewer.displayName,
            model: mapReviewModel(submission.reviewModel),
            status,
            invitedAt: round.startedAt,
            acceptedAt: round.startedAt,
            submittedAt: comment.date,
            recommendation: comment.recommendation,
            conflictOfInterest: false,
            anonymized: comment.anonymous,
          });
        });
      });
    });
  });
  return assignments.slice(0, 10);
})();

export const TRUST_REVIEWER_REPUTATION_LIST: ReviewerReputation[] = TRUST_REVIEWER_REPUTATIONS;

export const TRUST_REVIEW_HISTORY: ReviewHistoryEntry[] = TRUST_REVIEWER_ASSIGNMENTS.slice(0, 8).map((assignment) => ({
  id: `review-history-${assignment.id}`,
  date: assignment.submittedAt ?? assignment.invitedAt,
  title: assignment.manuscriptTitle,
  detail: `${assignment.reviewerName} · ${assignment.journalName}`,
  role: 'reviewer',
  manuscriptId: assignment.manuscriptId,
  model: assignment.model,
  outcome: assignment.recommendation,
}));

export const TRUST_REVIEWER_ANALYTICS: ReviewerAnalytics = (() => {
  const totals = TRUST_REVIEWER_REPUTATIONS.reduce(
    (acc, reviewer) => ({
      completed: acc.completed + reviewer.reviewsCompleted,
      accepted: acc.accepted + reviewer.reviewsAccepted,
      turnaround: acc.turnaround + reviewer.medianTurnaroundDays,
    }),
    { completed: 0, accepted: 0, turnaround: 0 }
  );
  return {
    totalAssignments: totals.accepted,
    completedReviews: totals.completed,
    invitationAcceptanceRate: 87,
    averageTurnaroundDays: Math.round(totals.turnaround / Math.max(1, TRUST_REVIEWER_REPUTATIONS.length)),
    onTimeRate: 82,
    recommendationDistribution: [
      { recommendation: 'accept', count: 96 },
      { recommendation: 'minor-revision', count: 214 },
      { recommendation: 'major-revision', count: 188 },
      { recommendation: 'reject', count: 132 },
    ],
    averageReviewLength: 1420,
    conflictDeclarations: 14,
  };
})();

export const TRUST_PEER_REVIEW_REPORT: PeerReviewInfrastructureReport = {
  assignments: TRUST_REVIEWER_ASSIGNMENTS,
  history: TRUST_REVIEW_HISTORY,
  models: ['single-blind', 'double-blind', 'open-review', 'transparent-review', 'post-publication-review'],
  analytics: TRUST_REVIEWER_ANALYTICS,
  summary:
    'The peer review infrastructure supports single-blind, double-blind, open, transparent, and post-publication review, with assignment tracking, anonymization, and per-reviewer analytics.',
};

export const FEATURED_ASSIGNMENT: ReviewerAssignment = TRUST_REVIEWER_ASSIGNMENTS[0];

// ---------------------------------------------------------------------------
// Research Integrity
// ---------------------------------------------------------------------------

export const TRUST_INTEGRITY_EVENTS: IntegrityEvent[] = [
  {
    id: 'integrity-retraction-1',
    type: 'retraction',
    status: 'resolved',
    severity: 'critical',
    date: '2025-11-04',
    title: 'Retraction of a fabricated dataset paper',
    description: 'The article was retracted after investigation found the underlying dataset could not be reproduced.',
    entityType: 'researcher',
    entityName: 'Dr. K. Mensah',
    doi: '10.1000/placeholder.2025.0111',
    parties: ['Dr. K. Mensah'],
    resolution: 'Retracted and indexed in retraction registries; author record annotated.',
  },
  {
    id: 'integrity-correction-1',
    type: 'correction',
    status: 'resolved',
    severity: 'medium',
    date: '2026-02-18',
    title: 'Author-affiliation correction',
    description: 'Author affiliations were corrected in the published record to reflect the current institution.',
    entityType: 'journal',
    entityName: 'Journal of Language Documentation',
    doi: '10.1000/placeholder.2024.0032',
    resolution: 'Correction notice published and metadata updated.',
  },
  {
    id: 'integrity-eoc-1',
    type: 'expression-of-concern',
    status: 'monitoring',
    severity: 'high',
    date: '2026-05-20',
    title: 'Expression of concern on image analysis',
    description: 'An expression of concern was issued while image-analysis concerns are under investigation.',
    entityType: 'conference',
    entityName: 'International Conference on Digital Humanities',
    doi: '10.1000/placeholder.2025.0099',
    parties: ['Conference Organising Committee'],
    resolution: 'Investigation in progress; editorial oversight active.',
  },
  {
    id: 'integrity-coi-1',
    type: 'conflict-of-interest',
    status: 'resolved',
    severity: 'medium',
    date: '2026-01-30',
    title: 'Editorial conflict declared and recused',
    description: 'An associate editor declared a conflict on a submitted manuscript and was recused from the decision.',
    entityType: 'journal',
    entityName: 'Computational Linguistics Journal',
    resolution: 'Assignment reassigned; conflict logged on the editorial record.',
  },
  {
    id: 'integrity-ethics-1',
    type: 'ethics-approval',
    status: 'resolved',
    severity: 'low',
    date: '2026-03-12',
    title: 'Ethics approval verified for field study',
    description: 'Institutional ethics approval for a maternal-health field study was verified against the governing body.',
    entityType: 'researcher',
    entityName: 'Dr. Adebisi Ojurere',
    resolution: 'Approval letter verified and archived.',
  },
  {
    id: 'integrity-plagiarism-1',
    type: 'plagiarism-status',
    status: 'resolved',
    severity: 'medium',
    date: '2026-04-22',
    title: 'Plagiarism screening passed',
    description: 'Submission passed similarity screening against the full reference corpus.',
    entityType: 'journal',
    entityName: 'Scholatia Journal of Open Research',
    resolution: 'Similarity report archived; submission advanced to review.',
  },
  {
    id: 'integrity-plagiarism-2',
    type: 'plagiarism-status',
    status: 'in-progress',
    severity: 'high',
    date: '2026-07-05',
    title: 'Plagiarism flag under investigation',
    description: 'A flagged similarity report is being reviewed for proper attribution.',
    entityType: 'conference',
    entityName: 'African Public Health Conference',
    resolution: 'Authors contacted for explanation.',
  },
];

export const TRUST_INTEGRITY_TIMELINE: IntegrityTimelineEntry[] = TRUST_INTEGRITY_EVENTS.map((event) => ({
  id: `integrity-timeline-${event.id}`,
  date: event.date,
  type: event.type,
  title: event.title,
  detail: event.description,
  status: event.status,
}));

export const TRUST_INTEGRITY_REPORT: ResearchIntegrityReport = {
  events: TRUST_INTEGRITY_EVENTS,
  timeline: TRUST_INTEGRITY_TIMELINE,
  totalEvents: TRUST_INTEGRITY_EVENTS.length,
  openEvents: TRUST_INTEGRITY_EVENTS.filter((event) => event.status === 'open' || event.status === 'in-progress' || event.status === 'monitoring').length,
  resolvedEvents: TRUST_INTEGRITY_EVENTS.filter((event) => event.status === 'resolved').length,
  summary:
    'Research integrity is tracked as a first-class surface: retractions, corrections, expressions of concern, conflicts of interest, ethics approvals, and plagiarism status are recorded against the affected record and reflected in trust scores.',
};

export const FEATURED_INTEGRITY_EVENT: IntegrityEvent = TRUST_INTEGRITY_EVENTS[0];

// ---------------------------------------------------------------------------
// Academic Identity
// ---------------------------------------------------------------------------

export const TRUST_ORCID_RECORD: OrcidRecord = {
  orcidId: FOCUS_RESEARCHER.identity.orcid,
  displayName: FOCUS_RESEARCHER.displayName,
  status: 'linked',
  linkedAt: '2019-06-01',
  lastSyncAt: '2026-07-28',
  worksSynced: FOCUS_RESEARCHER.portfolio.totalPublications,
  permissions: ['read-public', 'read-limited'],
  publicRecord: true,
  claimed: true,
};

export const TRUST_AFFILIATIONS: AffiliationRecord[] = [
  {
    id: 'affiliation-current',
    institutionId: FOCUS_RESEARCHER.position.institutionId,
    institution: FOCUS_RESEARCHER.position.institution,
    department: FOCUS_RESEARCHER.position.department,
    role: FOCUS_RESEARCHER.position.title,
    startDate: FOCUS_RESEARCHER.position.startDate,
    current: true,
    verified: true,
    verifiedAt: '2026-05-15',
  },
  ...FOCUS_RESEARCHER.employment.map((entry) => ({
    id: `affiliation-employment-${entry.id}`,
    institutionId: entry.organisationId,
    institution: entry.organisation,
    department: entry.department,
    role: entry.role,
    startDate: entry.startDate,
    endDate: entry.endDate,
    current: entry.current ?? false,
    verified: true,
    verifiedAt: '2026-05-15',
  })),
  ...FOCUS_RESEARCHER.education.map((entry) => ({
    id: `affiliation-education-${entry.id}`,
    institutionId: entry.institutionId,
    institution: entry.institution,
    role: entry.degree,
    startDate: entry.startDate,
    endDate: entry.endDate,
    current: false,
    verified: true,
    verifiedAt: '2026-05-15',
  })),
];

export const TRUST_ACADEMIC_MILESTONES: AcademicMilestone[] = FOCUS_RESEARCHER.timeline
  .slice(0, 8)
  .map((entry) => ({
    id: `milestone-${entry.id}`,
    type: mapMilestoneType(entry.type),
    title: entry.title,
    detail: entry.detail,
    date: entry.date,
    verified: true,
  }));

export const TRUST_ACADEMIC_TIMELINE: AcademicTimelineEntry[] = FOCUS_RESEARCHER.timeline
  .slice(0, 12)
  .map((entry) => {
    const category = entry.type.toLowerCase() as AcademicTimelineEntry['category'];
    return {
      id: `academic-timeline-${entry.id}`,
      date: entry.date,
      title: entry.title,
      detail: entry.detail,
      category: category === 'education' || category === 'employment' || category === 'publication' || category === 'grant' || category === 'award' ? category : 'milestone',
    };
  });

export const TRUST_ACADEMIC_IDENTITY_REPORT: AcademicIdentityReport = {
  orcid: TRUST_ORCID_RECORD,
  affiliations: TRUST_AFFILIATIONS,
  milestones: TRUST_ACADEMIC_MILESTONES,
  timeline: TRUST_ACADEMIC_TIMELINE,
  summary:
    'Academic identity is anchored on the researcher\u2019s permanent SAID, the ORCID integration layer, verified affiliation history, and a verified career milestone timeline.',
};

// ---------------------------------------------------------------------------
// Recommendation Engine
// ---------------------------------------------------------------------------

function focusKeywords(): string[] {
  return Array.from(
    new Set([
      ...FOCUS_RESEARCHER.interests.flatMap((interest) => [interest.name, ...interest.keywords]),
      ...FOCUS_RESEARCHER.researchAreas.map((area) => area.name),
      ...FOCUS_RESEARCHER.skills.map((skill) => skill.name),
      ...FOCUS_RESEARCHER.position.researchFocus,
    ])
  ).map((value) => value.toLowerCase());
}

export const TRUST_RECOMMENDED_COLLABORATORS: RecommendedCollaborator[] = RESEARCHERS.filter(
  (researcher) => researcher.identity.said !== FOCUS_RESEARCHER.identity.said
)
  .map((researcher) => {
    const sharedInterests = researcher.interests
      .filter((interest) => focusKeywords().some((keyword) => interest.name.toLowerCase().includes(keyword) || interest.keywords.some((k) => keyword.includes(k))))
      .slice(0, 3)
      .map((interest) => interest.name);
    const score = clampScore(40 + researcher.verification.trustScore * 0.3 + Math.min(30, sharedInterests.length * 8));
    return {
      id: `trust-collaborator-${researcher.username}`,
      type: 'collaborator' as const,
      title: `${researcher.displayName}`,
      rationale: `Shared research interests with ${researcher.position.faculty} at ${researcher.position.institution}.`,
      score,
      confidence: confidenceFromScore(score),
      reasons: sharedInterests.length ? sharedInterests : researcher.researchAreas.slice(0, 2).map((area) => area.name),
      url: `/researchers/${researcher.username}`,
      date: CURRENT_DATE,
      collaboratorId: researcher.identity.said,
      name: researcher.displayName,
      institution: researcher.position.institution,
      discipline: researcher.position.faculty,
      hIndex: researcher.impact.hIndex,
      citations: researcher.impact.citationMetrics.totalCitations,
      sharedInterests,
      trustScore: researcher.verification.trustScore,
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 6);

export const TRUST_RECOMMENDED_JOURNALS: JournalFitRecommendation[] = JOURNALS.map((journal) => {
  const fitScore = clampScore(journal.trustScore * 0.5 + (journal.impactMetrics?.quartile ? 20 : 10) + Math.min(20, journal.researchAreas.length * 2));
  return {
    id: `trust-journal-${journal.journalId}`,
    type: 'journal' as const,
    title: journal.journalTitle,
    rationale: `High trust and quality alignment with ${FOCUS_RESEARCHER.position.faculty} research.`,
    score: fitScore,
    confidence: confidenceFromScore(fitScore),
    reasons: journal.researchAreas.slice(0, 3),
    url: `/journals/${journal.journalId}`,
    date: CURRENT_DATE,
    journalId: journal.journalId,
    journalName: journal.journalTitle,
    impactFactor: journal.impactMetrics?.impactFactor,
    quartile: journal.impactMetrics?.quartile,
    openAccess: journal.openAccessStatus,
    reviewModel: journal.reviewModel,
    fitScore,
  };
})
  .sort((a, b) => b.fitScore - a.fitScore)
  .slice(0, 6);

export const TRUST_RECOMMENDED_CONFERENCES: ConferenceFitRecommendation[] = CONFERENCES.map((conference) => {
  const qualityIndex = conference.trustScore;
  const score = clampScore(qualityIndex * 0.6 + Math.min(40, conference.researchAreas.length * 4));
  return {
    id: `trust-conference-${conference.conferenceId}`,
    type: 'conference' as const,
    title: conference.title,
    rationale: `Aligned with ${FOCUS_RESEARCHER.position.faculty} and rated ${conference.trustScore}/100 on trust.`,
    score,
    confidence: confidenceFromScore(score),
    reasons: conference.researchAreas.slice(0, 3),
    url: `/conferences/${conference.conferenceId}`,
    date: CURRENT_DATE,
    conferenceId: conference.conferenceId,
    conferenceName: conference.title,
    country: conference.country ?? 'International',
    qualityIndex,
    acceptanceRate: conference.analytics.acceptanceRate,
    dates: conference.startDate && conference.endDate ? `${conference.startDate} → ${conference.endDate}` : conference.startDate ?? 'TBA',
  };
})
  .sort((a, b) => b.score - a.score)
  .slice(0, 6);

export const TRUST_RECOMMENDED_REVIEWERS: ReviewerRecommendation[] = [...TRUST_REVIEWER_REPUTATIONS]
  .sort((a, b) => b.reputationScore - a.reputationScore)
  .map((reviewer) => {
    const score = clampScore(reviewer.reputationScore * 0.6 + (100 - reviewer.medianTurnaroundDays) * 0.4);
    return {
      id: `trust-reviewer-${reviewer.reviewerId}`,
      type: 'reviewer' as const,
      title: reviewer.name,
      rationale: `High reviewer reputation with reliable turnaround across ${reviewer.journalsServed.length} journals.`,
      score,
      confidence: confidenceFromScore(score),
      reasons: reviewer.journalsServed.slice(0, 2),
      url: `/researchers/${reviewer.reviewerId}`,
      date: CURRENT_DATE,
      reviewerId: reviewer.reviewerId,
      reviewerName: reviewer.name,
      institution: 'Affiliated institution',
      expertise: reviewer.journalsServed.slice(0, 3),
      reputationScore: reviewer.reputationScore,
      turnaroundDays: reviewer.medianTurnaroundDays,
      reviewsCompleted: reviewer.reviewsCompleted,
    };
  })
  .slice(0, 6);

export const TRUST_SUGGESTED_GRANTS: SuggestedGrant[] = FUNDING_OPPORTUNITIES.filter((opportunity) => opportunity.status === 'open')
  .map((opportunity: FundingOpportunity) => {
    const overlap = opportunity.researchAreas.filter((area) => focusKeywords().some((keyword) => area.toLowerCase().includes(keyword))).length;
    const matchScore = clampScore(40 + overlap * 12 + Math.min(30, opportunity.durationMonths));
    return {
      id: `trust-grant-${opportunity.id}`,
      type: 'grant' as const,
      title: opportunity.title,
      rationale: `${opportunity.agencyName} opportunity aligned with the focus researcher's career stage.`,
      score: matchScore,
      confidence: confidenceFromScore(matchScore),
      reasons: opportunity.researchAreas.slice(0, 3),
      url: `/funding/${opportunity.id}`,
      date: CURRENT_DATE,
      grantId: opportunity.id,
      funder: opportunity.agencyName,
      amount: opportunity.funding.typical ? `${opportunity.funding.currency} ${opportunity.funding.typical.toLocaleString('en-US')}` : undefined,
      deadline: opportunity.deadline,
      careerStage: opportunity.careerStage,
      matchScore,
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 5);

export const TRUST_CITATION_SUGGESTIONS: CitationSuggestion[] = [...WORKSPACE_PUBLICATIONS]
  .sort((a, b) => b.citations - a.citations)
  .map((publication: PublicationEntry) => {
    const relevanceScore = clampScore(Math.min(100, publication.citations) * 0.6 + (publication.year === '2025' || publication.year === '2024' ? 20 : 10));
    return {
      id: `trust-citation-${publication.doi}`,
      type: 'citation' as const,
      title: publication.title,
      rationale: `Highly relevant and increasingly cited ${publication.type.toLowerCase()} from ${publication.journal}.`,
      score: relevanceScore,
      confidence: confidenceFromScore(relevanceScore),
      reasons: [publication.journal, `${publication.citations} citations`, publication.year],
      date: CURRENT_DATE,
      citationId: publication.doi,
      doi: publication.doi,
      sourceTitle: publication.title,
      venue: publication.journal,
      year: publication.year,
      relevanceScore,
    };
  })
  .slice(0, 6);

export const TRUST_RECOMMENDATIONS: TrustRecommendation[] = [
  ...TRUST_RECOMMENDED_COLLABORATORS,
  ...TRUST_RECOMMENDED_JOURNALS,
  ...TRUST_RECOMMENDED_CONFERENCES,
  ...TRUST_RECOMMENDED_REVIEWERS,
  ...TRUST_SUGGESTED_GRANTS,
  ...TRUST_CITATION_SUGGESTIONS,
];

export const TRUST_RECOMMENDATION_ENGINE: RecommendationEngineReport = {
  recommendations: TRUST_RECOMMENDATIONS,
  collaborators: TRUST_RECOMMENDED_COLLABORATORS,
  journals: TRUST_RECOMMENDED_JOURNALS,
  conferences: TRUST_RECOMMENDED_CONFERENCES,
  reviewers: TRUST_RECOMMENDED_REVIEWERS,
  grants: TRUST_SUGGESTED_GRANTS,
  citations: TRUST_CITATION_SUGGESTIONS,
  summary:
    'The recommendation engine matches researchers to collaborators, journals, conferences, reviewers, grants, and citations using trust scores, quality indices, and verified identity signals.',
};

export const FEATURED_RECOMMENDATION: TrustRecommendation = TRUST_RECOMMENDATIONS[0];

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export const TRUST_STATISTICS: TrustStatistics = {
  totalVerifiedRecords: TRUST_VERIFICATION_SUMMARY.verified + TRUST_VERIFICATION_SUMMARY.trusted,
  trustedEntities: TRUST_VERIFICATION_SUMMARY.trusted,
  totalBadges: TRUST_BADGE_AWARDS.length,
  badgesByTier: tally(TRUST_BADGE_AWARDS.map((award) => award.tier)).map((entry) => ({ tier: entry.value as BadgeTier, count: entry.count })),
  activeReviewAssignments: TRUST_REVIEWER_ASSIGNMENTS.filter((assignment) => assignment.status === 'invited' || assignment.status === 'accepted' || assignment.status === 'in-progress').length,
  completedReviews: TRUST_REVIEWER_ANALYTICS.completedReviews,
  integrityEvents: TRUST_INTEGRITY_EVENTS.length,
  resolvedIntegrityEvents: TRUST_INTEGRITY_EVENTS.filter((event) => event.status === 'resolved').length,
  orcidLinkedResearchers: RESEARCHERS.filter((researcher) => Boolean(researcher.identity.orcid)).length,
  verifiedInstitutions: TRUST_VERIFICATION_RECORDS.filter((record) => record.entityType === 'institution' && (record.status === 'verified' || record.status === 'trusted')).length,
  verifiedJournals: TRUST_VERIFICATION_RECORDS.filter((record) => record.entityType === 'journal' && (record.status === 'verified' || record.status === 'trusted')).length,
  verifiedConferences: TRUST_VERIFICATION_RECORDS.filter((record) => record.entityType === 'conference' && (record.status === 'verified' || record.status === 'trusted')).length,
  verifiedPublishers: TRUST_VERIFICATION_RECORDS.filter((record) => record.entityType === 'publisher' && (record.status === 'verified' || record.status === 'trusted')).length,
  avgTrustScore: averageScores(TRUST_REPUTATION_REPORTS.map((report) => report.trustScore.overall)),
  avgReviewerReputation: averageScores(TRUST_REVIEWER_REPUTATIONS.map((reviewer) => reviewer.reputationScore)),
  avgJournalQuality: averageScores(
    TRUST_REPUTATION_REPORTS.filter((report) => report.entityType === 'journal').map((report) => report.journalQuality?.qualityIndex ?? 0)
  ),
  avgConferenceQuality: averageScores(
    TRUST_REPUTATION_REPORTS.filter((report) => report.entityType === 'conference').map((report) => report.conferenceQuality?.qualityIndex ?? 0)
  ),
  trackedResearchers: RESEARCHERS.length,
};

export const TRUST_ANALYTICS: TrustAnalytics = {
  verificationByEntityType: TRUST_VERIFICATION_SUMMARY.byEntityType,
  badgesByTier: TRUST_STATISTICS.badgesByTier,
  reputationDistribution: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'].map((band) => ({
    band,
    count: TRUST_REPUTATION_REPORTS.filter((report) => report.trustScore.grade === band).length,
  })),
  integrityByType: tally(TRUST_INTEGRITY_EVENTS.map((event) => event.type)).map((entry) => ({
    type: entry.value as IntegrityEvent['type'],
    count: entry.count,
  })),
  recommendationByType: tally(TRUST_RECOMMENDATIONS.map((recommendation) => recommendation.type)).map((entry) => ({
    type: entry.value as TrustRecommendationType,
    count: entry.count,
  })),
  reviewerLeaderboard: [...TRUST_REVIEWER_REPUTATIONS].sort((a, b) => b.reputationScore - a.reputationScore).slice(0, 6),
  topReviewedJournals: tally(
    TRUST_REVIEWER_ASSIGNMENTS.map((assignment) => assignment.journalName)
  ).map((entry) => ({ journalName: entry.value, reviews: entry.count })),
};

export const TRUST_PORTFOLIO: TrustPortfolio = {
  verification: TRUST_VERIFICATION_SUMMARY,
  reputation: TRUST_REPUTATION_REPORTS,
  badgeDefinitions: TRUST_BADGE_DEFINITIONS,
  badgeAwards: TRUST_BADGE_AWARDS,
  peerReview: TRUST_PEER_REVIEW_REPORT,
  integrity: TRUST_INTEGRITY_REPORT,
  academicIdentity: TRUST_ACADEMIC_IDENTITY_REPORT,
  recommendations: TRUST_RECOMMENDATION_ENGINE,
  statistics: TRUST_STATISTICS,
  analytics: TRUST_ANALYTICS,
};
