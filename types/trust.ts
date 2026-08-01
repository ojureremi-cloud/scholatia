import type { VerificationLevel } from '@/types/identity';

/**
 * The Trust, Verification & Reputation Engine of the Scholatia ecosystem
 * (Scholatia Phase 1.9C).
 *
 * The Trust module is the credibility layer of the platform. It does NOT
 * introduce a new lifecycle stage and does NOT own its own records; it
 * observes, verifies, and scores the identities and venues that other modules
 * own — Researchers, Institutions, Journals, Conferences, Publishers, and
 * Reviewers. Every verification record, reputation score, badge award, peer
 * review assignment, integrity event, academic identity link, and
 * recommendation here references the original source identity (a SAID, a
 * journal id, a conference id, a publisher id, an ORCID iD, or a DOI) so
 * nothing is duplicated.
 */

// ---------------------------------------------------------------------------
// Verification Engine
// ---------------------------------------------------------------------------

/** The entity kinds the verification engine can certify. */
export type TrustEntityType =
  | 'researcher'
  | 'institution'
  | 'journal'
  | 'conference'
  | 'publisher'
  | 'reviewer';

/** Overall lifecycle state of a verification record. */
export type TrustVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'trusted'
  | 'revoked';

/** A single piece of evidence that contributes to a verification record. */
export interface VerificationEvidence {
  id: string;
  label: string;
  detail?: string;
  status: 'verified' | 'pending' | 'in-review' | 'failed';
  verifiedAt?: string;
  /** Provider or source of the evidence (institutional email, ORCID, registry...). */
  provider?: string;
}

/** A step in the verification flow with a weighted contribution. */
export interface VerificationCheck {
  id: string;
  label: string;
  detail?: string;
  status: 'verified' | 'pending' | 'in-review' | 'not-started';
  weight: number;
  verifiedAt?: string;
  /** Short descriptors of the evidence that satisfied the check. */
  evidence?: string[];
}

/** A verification record for a single researcher / venue / publisher. */
export interface VerificationRecord {
  id: string;
  entityType: TrustEntityType;
  entityId: string;
  entityName: string;
  status: TrustVerificationStatus;
  verificationLevel: VerificationLevel;
  checks: VerificationCheck[];
  verifiedAt?: string;
  expiresAt?: string;
  verifiedBy?: string;
  summary: string;
}

/** Rollup of every verification record in the engine. */
export interface VerificationEngineSummary {
  totalRecords: number;
  verified: number;
  trusted: number;
  pending: number;
  revoked: number;
  byEntityType: {
    entityType: TrustEntityType;
    total: number;
    verified: number;
    trusted: number;
  }[];
}

// ---------------------------------------------------------------------------
// Reputation Engine
// ---------------------------------------------------------------------------

/** Entity kinds the reputation engine can score. */
export type ReputationEntityType = TrustEntityType;

/** A single weighted contribution to a trust score. */
export interface ReputationFactor {
  id: string;
  label: string;
  /** 0-100 factor score. */
  score: number;
  /** 0-1 relative weight used in the overall computation. */
  weight: number;
  description?: string;
}

/** Letter-grade trust band used to communicate a score at a glance. */
export type TrustScoreGrade =
  | 'AAA'
  | 'AA'
  | 'A'
  | 'BBB'
  | 'BB'
  | 'B'
  | 'CCC'
  | 'CC'
  | 'C'
  | 'D';

/** The breakdown behind a trust score. */
export interface TrustScoreBreakdown {
  /** Overall weighted score, 0-100. */
  overall: number;
  status: string;
  grade: TrustScoreGrade;
  factors: ReputationFactor[];
  summary: string;
}

/** Research impact score for a researcher. */
export interface ResearchImpactScore {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  /** 0-100 percentile within the researcher cohort. */
  percentile: number;
  /** Citations per year over the last five years. */
  citationVelocity: number;
  /** Field-weighted citation impact (FWCI), centered at 1.0. */
  fieldWeightedCitationImpact: number;
  /** 0-100 composite impact score. */
  score: number;
  /** 12-month trend in percent. */
  trend: number;
}

/** Reviewer reputation for a single reviewer. */
export interface ReviewerReputation {
  reviewerId: string;
  name: string;
  reviewsCompleted: number;
  reviewsAccepted: number;
  averageReviewLength: number;
  medianTurnaroundDays: number;
  punctualityScore: number;
  qualityScore: number;
  reputationScore: number;
  expertiseMatch: number;
  conflictsAvoided: number;
  journalsServed: string[];
}

/** Editorial reputation for an editor. */
export interface EditorialReputation {
  editorId: string;
  name: string;
  roles: string[];
  manuscriptsHandled: number;
  decisionsMade: number;
  avgDaysToDecision: number;
  acceptanceRate: number;
  reputationScore: number;
  integrityComplaints: number;
  journalsServed: string[];
}

/** Institutional reputation for a university / research institute. */
export interface InstitutionalReputation {
  institutionId: string;
  name: string;
  researchOutputs: number;
  publications: number;
  citations: number;
  hIndex: number;
  fieldWeightedImpact: number;
  reputationScore: number;
  rankings: { source: string; rank: number; year: number; totalRanked?: number }[];
  peerEndorsements: number;
}

/** Conference Quality Index (CQI) for a conference. */
export interface ConferenceQualityIndex {
  conferenceId: string;
  name: string;
  /** 0-100 composite quality index. */
  qualityIndex: number;
  acceptanceRate: number;
  hIndex: number;
  citations: number;
  submissions: number;
  attendeeSatisfaction: number;
  repeatSubmissionRate: number;
  committeeSize: number;
  yearsActive: number;
}

/** Journal Quality Index (JQI) for a journal. */
export interface JournalQualityIndex {
  journalId: string;
  name: string;
  /** 0-100 composite quality index. */
  qualityIndex: number;
  impactFactor?: number;
  fiveYearImpactFactor?: number;
  hIndex: number;
  totalCitations: number;
  acceptanceRate: number;
  rejectionRate: number;
  avgDaysToFirstDecision: number;
  indexingServices: string[];
  quartile?: string;
  trustScore: number;
}

/** The aggregate reputation surface for a single scored entity. */
export interface ReputationReport {
  id: string;
  entityType: ReputationEntityType;
  entityId: string;
  entityName: string;
  trustScore: TrustScoreBreakdown;
  researchImpact?: ResearchImpactScore;
  editorialReputation?: EditorialReputation;
  institutionalReputation?: InstitutionalReputation;
  conferenceQuality?: ConferenceQualityIndex;
  journalQuality?: JournalQualityIndex;
  reviewerReputation?: ReviewerReputation;
  summary: string;
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

/** Every badge the engine can award. */
export type BadgeId =
  | 'verified-researcher'
  | 'verified-institution'
  | 'verified-journal'
  | 'verified-publisher'
  | 'verified-conference'
  | 'top-reviewer'
  | 'outstanding-editor'
  | 'highly-cited'
  | 'open-science-champion'
  | 'trusted-vendor';

/** Badge seniority tiers. */
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

/** Static definition of a badge: naming, criteria, and target audience. */
export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  criteria: string[];
  entityType?: TrustEntityType | 'vendor' | 'any';
  tier: BadgeTier;
}

/** A badge actually awarded to a specific entity. */
export interface BadgeAward {
  id: string;
  badgeId: BadgeId;
  title: string;
  entityId: string;
  entityName: string;
  entityType: TrustEntityType | 'vendor';
  tier: BadgeTier;
  awardedAt: string;
  criteriaMet: string[];
  expiresAt?: string;
}

// ---------------------------------------------------------------------------
// Peer Review Infrastructure
// ---------------------------------------------------------------------------

/** Supported peer review models. */
export type PeerReviewModel =
  | 'single-blind'
  | 'double-blind'
  | 'open-review'
  | 'transparent-review'
  | 'post-publication-review';

/** Recommendation a reviewer can issue on a manuscript. */
export type ReviewRecommendation =
  | 'accept'
  | 'minor-revision'
  | 'major-revision'
  | 'reject'
  | 'withdraw';

/** Lifecycle state of a review assignment. */
export type ReviewAssignmentStatus =
  | 'invited'
  | 'accepted'
  | 'declined'
  | 'in-progress'
  | 'submitted'
  | 'withdrawn'
  | 'completed';

/** A reviewer assignment against a manuscript, with model and outcome. */
export interface ReviewerAssignment {
  id: string;
  manuscriptId: string;
  manuscriptTitle: string;
  journalId: string;
  journalName: string;
  reviewerId: string;
  reviewerName: string;
  model: PeerReviewModel;
  status: ReviewAssignmentStatus;
  invitedAt: string;
  acceptedAt?: string;
  dueDate?: string;
  submittedAt?: string;
  recommendation?: ReviewRecommendation;
  conflictOfInterest?: boolean;
  anonymized?: boolean;
}

/** A single entry in a reviewer's (or editor's) review history. */
export interface ReviewHistoryEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  role: 'reviewer' | 'editor' | 'author';
  manuscriptId?: string;
  model: PeerReviewModel;
  outcome?: ReviewRecommendation;
}

/** Analytics for a reviewer pool. */
export interface ReviewerAnalytics {
  totalAssignments: number;
  completedReviews: number;
  invitationAcceptanceRate: number;
  averageTurnaroundDays: number;
  onTimeRate: number;
  recommendationDistribution: { recommendation: ReviewRecommendation; count: number }[];
  averageReviewLength: number;
  conflictDeclarations: number;
}

/** Aggregate root of the peer review infrastructure. */
export interface PeerReviewInfrastructureReport {
  assignments: ReviewerAssignment[];
  history: ReviewHistoryEntry[];
  models: PeerReviewModel[];
  analytics: ReviewerAnalytics;
  summary: string;
}

// ---------------------------------------------------------------------------
// Research Integrity
// ---------------------------------------------------------------------------

/** The kinds of integrity events the engine tracks. */
export type IntegrityEventType =
  | 'retraction'
  | 'correction'
  | 'expression-of-concern'
  | 'conflict-of-interest'
  | 'ethics-approval'
  | 'plagiarism-status';

/** Resolution state of an integrity event. */
export type IntegrityStatus =
  | 'open'
  | 'resolved'
  | 'in-progress'
  | 'monitoring'
  | 'not-applicable';

/** Severity of an integrity event. */
export type IntegritySeverity = 'low' | 'medium' | 'high' | 'critical';

/** A single integrity event, always referencing the affected record. */
export interface IntegrityEvent {
  id: string;
  type: IntegrityEventType;
  status: IntegrityStatus;
  severity: IntegritySeverity;
  date: string;
  title: string;
  description: string;
  entityType?: TrustEntityType;
  entityId?: string;
  entityName?: string;
  doi?: string;
  parties?: string[];
  resolution?: string;
}

/** A chronological integrity entry for the timeline surface. */
export interface IntegrityTimelineEntry {
  id: string;
  date: string;
  type: IntegrityEventType;
  title: string;
  detail: string;
  status: IntegrityStatus;
}

/** Aggregate root of the research integrity surface. */
export interface ResearchIntegrityReport {
  events: IntegrityEvent[];
  timeline: IntegrityTimelineEntry[];
  totalEvents: number;
  openEvents: number;
  resolvedEvents: number;
  summary: string;
}

// ---------------------------------------------------------------------------
// Academic Identity
// ---------------------------------------------------------------------------

/** Connection state of an ORCID iD. */
export type OrcidIntegrationStatus = 'linked' | 'pending' | 'not-linked' | 'expired' | 'revoked';

/** ORCID integration layer record. */
export interface OrcidRecord {
  orcidId: string;
  displayName: string;
  status: OrcidIntegrationStatus;
  linkedAt?: string;
  lastSyncAt?: string;
  worksSynced: number;
  permissions: string[];
  publicRecord: boolean;
  claimed: boolean;
}

/** An affiliation entry within a researcher's affiliation history. */
export interface AffiliationRecord {
  id: string;
  institutionId?: string;
  institution: string;
  department?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  verified: boolean;
  verifiedAt?: string;
}

/** Career milestone types. */
export type AcademicMilestoneType =
  | 'first-publication'
  | 'phd'
  | 'professorship'
  | 'first-grant'
  | 'editorial-appointment'
  | 'fellowship'
  | 'award'
  | 'patent'
  | 'keynote'
  | 'citation-milestone';

/** A verified career milestone. */
export interface AcademicMilestone {
  id: string;
  type: AcademicMilestoneType;
  title: string;
  detail: string;
  date: string;
  verified: boolean;
}

/** A chronological academic timeline entry. */
export interface AcademicTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  category: 'education' | 'employment' | 'publication' | 'grant' | 'award' | 'milestone';
}

/** Aggregate root of the academic identity surface. */
export interface AcademicIdentityReport {
  orcid: OrcidRecord;
  affiliations: AffiliationRecord[];
  milestones: AcademicMilestone[];
  timeline: AcademicTimelineEntry[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Recommendation Engine
// ---------------------------------------------------------------------------

/** The kinds of recommendations the trust engine produces. */
export type TrustRecommendationType =
  | 'collaborator'
  | 'journal'
  | 'conference'
  | 'reviewer'
  | 'grant'
  | 'citation';

/** Confidence level for a recommendation. */
export type TrustConfidence = 'high' | 'medium' | 'low';

/** Base trust recommendation against a specific source record. */
export interface TrustRecommendation {
  id: string;
  type: TrustRecommendationType;
  title: string;
  rationale: string;
  /** 0-100 overall recommendation strength. */
  score: number;
  confidence: TrustConfidence;
  reasons: string[];
  url?: string;
  date: string;
}

/** Recommended research collaborator. */
export interface RecommendedCollaborator extends TrustRecommendation {
  type: 'collaborator';
  collaboratorId: string;
  name: string;
  institution: string;
  discipline: string;
  hIndex: number;
  citations: number;
  sharedInterests: string[];
  trustScore: number;
}

/** Journal fit recommendation. */
export interface JournalFitRecommendation extends TrustRecommendation {
  type: 'journal';
  journalId: string;
  journalName: string;
  impactFactor?: number;
  quartile?: string;
  openAccess: string;
  reviewModel: string;
  fitScore: number;
}

/** Conference fit recommendation. */
export interface ConferenceFitRecommendation extends TrustRecommendation {
  type: 'conference';
  conferenceId: string;
  conferenceName: string;
  country: string;
  qualityIndex: number;
  acceptanceRate: number;
  dates: string;
}

/** Recommended reviewer. */
export interface ReviewerRecommendation extends TrustRecommendation {
  type: 'reviewer';
  reviewerId: string;
  reviewerName: string;
  institution: string;
  expertise: string[];
  reputationScore: number;
  turnaroundDays: number;
  reviewsCompleted: number;
}

/** Suggested grant opportunity. */
export interface SuggestedGrant extends TrustRecommendation {
  type: 'grant';
  grantId: string;
  funder: string;
  amount?: string;
  deadline: string;
  careerStage: string;
  matchScore: number;
}

/** Suggested citation. */
export interface CitationSuggestion extends TrustRecommendation {
  type: 'citation';
  citationId: string;
  doi?: string;
  sourceTitle: string;
  venue: string;
  year: string;
  relevanceScore: number;
}

/** Aggregate root of the recommendation engine. */
export interface RecommendationEngineReport {
  recommendations: TrustRecommendation[];
  collaborators: RecommendedCollaborator[];
  journals: JournalFitRecommendation[];
  conferences: ConferenceFitRecommendation[];
  reviewers: ReviewerRecommendation[];
  grants: SuggestedGrant[];
  citations: CitationSuggestion[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

/** Statistic-card level aggregates for the module. */
export interface TrustStatistics {
  totalVerifiedRecords: number;
  trustedEntities: number;
  totalBadges: number;
  badgesByTier: { tier: BadgeTier; count: number }[];
  activeReviewAssignments: number;
  completedReviews: number;
  integrityEvents: number;
  resolvedIntegrityEvents: number;
  orcidLinkedResearchers: number;
  verifiedInstitutions: number;
  verifiedJournals: number;
  verifiedConferences: number;
  verifiedPublishers: number;
  avgTrustScore: number;
  avgReviewerReputation: number;
  avgJournalQuality: number;
  avgConferenceQuality: number;
  trackedResearchers: number;
}

/** Analytical tallies across every trust surface. */
export interface TrustAnalytics {
  verificationByEntityType: {
    entityType: TrustEntityType;
    total: number;
    verified: number;
    trusted: number;
  }[];
  badgesByTier: { tier: BadgeTier; count: number }[];
  reputationDistribution: { band: string; count: number }[];
  integrityByType: { type: IntegrityEventType; count: number }[];
  recommendationByType: { type: TrustRecommendationType; count: number }[];
  reviewerLeaderboard: ReviewerReputation[];
  topReviewedJournals: { journalName: string; reviews: number }[];
}

/**
 * Aggregate root of the module: every verification record, reputation report,
 * badge definition and award, peer review assignment and history, integrity
 * event, academic identity record, recommendation surface, plus the statistics
 * and analytics that summarize it all.
 */
export interface TrustPortfolio {
  verification: VerificationEngineSummary;
  reputation: ReputationReport[];
  badgeDefinitions: BadgeDefinition[];
  badgeAwards: BadgeAward[];
  peerReview: PeerReviewInfrastructureReport;
  integrity: ResearchIntegrityReport;
  academicIdentity: AcademicIdentityReport;
  recommendations: RecommendationEngineReport;
  statistics: TrustStatistics;
  analytics: TrustAnalytics;
}
