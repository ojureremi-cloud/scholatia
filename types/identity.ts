export type AccountCategory = 'Individual' | 'Organisation';

export type IndividualAccountType =
  | 'Student'
  | 'Researcher'
  | 'Lecturer'
  | 'Professor'
  | 'Academic Staff'
  | 'Industry Professional'
  | 'Reviewer'
  | 'Editor'
  | 'Mentor';

export type OrganisationAccountType =
  | 'Institution'
  | 'University'
  | 'College'
  | 'Academy'
  | 'Polytechnic'
  | 'Research Institute'
  | 'Library'
  | 'Journal'
  | 'Conference'
  | 'Publisher'
  | 'Funding Organisation'
  | 'Professional Association'
  | 'Government Agency'
  | 'Industry Partner'
  | 'Employer'
  | 'Recruiter';

export type AccountType = IndividualAccountType | OrganisationAccountType;

export type RoleType =
  | 'Student'
  | 'Researcher'
  | 'Lecturer'
  | 'Professor'
  | 'Academic Staff'
  | 'University Administrator'
  | 'Institution Administrator'
  | 'Journal Editor'
  | 'Reviewer'
  | 'Conference Organizer'
  | 'Publisher'
  | 'Funding Organisation'
  | 'Professional Association'
  | 'Government Agency'
  | 'Research Institute'
  | 'Academy'
  | 'College'
  | 'Polytechnic'
  | 'University'
  | 'Library'
  | 'Industry Partner'
  | 'Employer'
  | 'Recruiter'
  | 'System Administrator'
  | 'Super Administrator';

export type AcademicLevel = 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Professional' | 'Researcher' | 'Other';

export type InstitutionType =
  | 'Institution'
  | 'University'
  | 'College'
  | 'Polytechnic'
  | 'Academy'
  | 'Research Institute'
  | 'Government Research Centre'
  | 'Professional School'
  | 'Library'
  | 'Think Tank'
  | 'Funding Organisation'
  | 'Professional Association'
  | 'Publisher'
  | 'Research Network'
  | 'Innovation Hub'
  | 'Training Centre'
  | 'International Organisation';

export enum VerificationLevel {
  Unverified = 0,
  EmailVerified = 1,
  IdentityVerified = 2,
  InstitutionVerified = 3,
  OrganisationVerified = 4,
  ORCIDLinked = 5,
  PublicationVerified = 6,
  PeerReviewed = 7,
  Trusted = 8,
  VerifiedExpert = 9,
}

export type TrustFactor =
  | 'Academic verification'
  | 'Publication history'
  | 'Peer review activity'
  | 'Editorial service'
  | 'Conference participation'
  | 'Institution affiliation'
  | 'Research integrity'
  | 'Community contributions'
  | 'Verification level'
  | 'Professional endorsements';

export type ProfilePrivacy = 'Public' | 'Institution Only' | 'Connections' | 'Private' | 'Custom';

export type ProfileView = 'Public Profile' | 'Private Profile' | 'Institution View' | 'Recruiter View' | 'Publisher View' | 'Journal View' | 'Conference View' | 'API View';

export interface ProfileLink {
  label: string;
  href: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface EmploymentEntry {
  organisation: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface PublicationSummary {
  totalArticles: number;
  totalCitations: number;
  hIndex?: number;
  recentImpact?: string;
}

export interface TrustMetrics {
  trustScore: number;
  verificationScore: number;
  identityConfidence: number;
  institutionConfidence: number;
  publicationConfidence: number;
  contributionScore: number;
  communityReputation: number;
  academicReputation: number;
}

export interface StudentProfile {
  academicLevel: AcademicLevel;
  programme?: string;
  department?: string;
  expectedGraduationYear?: number;
  institutionId?: string;
  studentIdentityBadge?: string;
}

export interface ScholatiaAcademicIdentity {
  said: string;
  displayName: string;
  accountCategory: AccountCategory;
  accountType: AccountType;
  roles: RoleType[];
  verificationLevel: VerificationLevel;
  trustScore?: number;
  affiliatedInstitution?: string;
  institutionType?: InstitutionType;
  studentProfile?: StudentProfile;
  joinedAt: string;
  lastVerifiedAt?: string;
  isVerified: boolean;
}

export interface SAIDProfile {
  said: string;
  displayName: string;
  accountCategory: AccountCategory;
  accountType: AccountType;
  roles: RoleType[];
  verificationLevel: VerificationLevel;
  biography?: string;
  professionalSummary?: string;
  academicSummary?: string;
  researchInterests: string[];
  keywords: string[];
  disciplines: string[];
  fieldsOfStudy: string[];
  education: EducationEntry[];
  employmentHistory: EmploymentEntry[];
  institutionHistory: string[];
  professionalMembership: string[];
  projects: string[];
  awards: string[];
  patents: string[];
  datasets: string[];
  software: string[];
  books: string[];
  bookChapters: string[];
  conferencePapers: string[];
  journalArticles: string[];
  preprints: string[];
  technicalReports: string[];
  grants: string[];
  teachingExperience: string[];
  courses: string[];
  supervision: string[];
  skills: string[];
  languages: string[];
  certifications: string[];
  volunteerActivities: string[];
  socialLinks: ProfileLink[];
  academicLinks: ProfileLink[];
  privacy: ProfilePrivacy;
  visibleTo: ProfileView[];
  trustMetrics: TrustMetrics;
  publicationSummary: PublicationSummary;
  orcid?: string;
  country?: string;
  department?: string;
  institution?: string;
  profilePhotoUrl?: string;
  qrCodeValue?: string;
  publicUrl?: string;
  shortUrl?: string;
  isPublic: boolean;
}

export type ConferenceEventType = 'International Conference' | 'National Conference' | 'Regional Conference' | 'Symposium' | 'Workshop' | 'Seminar' | 'Colloquium' | 'Summer School' | 'Winter School' | 'Bootcamp' | 'Hackathon' | 'Research Meeting' | 'Doctoral Consortium' | 'Poster Session' | 'Webinar' | 'Virtual Conference' | 'Hybrid Conference' | 'Training Programme' | 'Executive Education';

export type ConferenceRegistrationAudience = 'Researchers' | 'Students' | 'Institutions' | 'Publishers' | 'Sponsors' | 'Exhibitors' | 'Guests' | 'Media' | 'Mentors';

export type ConferenceSubmissionType = 'Abstract' | 'Full Paper' | 'Poster' | 'Workshop Proposal' | 'Tutorial Proposal' | 'Panel Proposal' | 'Demo' | 'Dataset' | 'Software';

export type ConferenceCommitteeRole = 'Conference Chair' | 'Co-Chair' | 'Programme Chair' | 'Technical Chair' | 'Publication Chair' | 'Finance Chair' | 'Integrity Chair' | 'Local Organising Committee' | 'Scientific Committee' | 'Review Committee' | 'Session Chairs' | 'Student Volunteers';

export type JournalPublicationType = 'Journal' | 'Book' | 'Book Series' | 'Conference Proceedings' | 'Edited Volume' | 'Magazine' | 'Newsletter' | 'Technical Report' | 'Working Paper' | 'Preprint Server';

export type JournalSubmissionType = 'Research Article' | 'Review Article' | 'Short Communication' | 'Case Study' | 'Editorial' | 'Letter' | 'Perspective' | 'Commentary' | 'Dataset' | 'Software Paper' | 'Protocol' | 'Book Review';

export type ReviewModel = 'Single Blind' | 'Double Blind' | 'Open Review' | 'Transparent Review' | 'Post Publication Review';

export type OpenAccessStatus = 'Open Access' | 'Hybrid' | 'Subscription' | 'Diamond' | 'Gold' | 'Green' | 'Bronze';

export type PublicationWorkflowStage = 'Submission' | 'Editorial Screening' | 'Reviewer Assignment' | 'Peer Review' | 'Decision' | 'Revision' | 'Acceptance' | 'Copyediting' | 'Typesetting' | 'Proofreading' | 'Publication' | 'Archiving';

export interface ConferenceCommitteeMember {
  role: ConferenceCommitteeRole;
  name: string;
  affiliation?: string;
  email?: string;
}

export interface ConferenceRegistrationOption {
  audience: ConferenceRegistrationAudience;
  fee?: string;
  deadline?: string;
  status: 'Open' | 'Closed' | 'Limited' | 'Upcoming';
}

export interface ConferenceSubmissionOption {
  type: ConferenceSubmissionType;
  deadline?: string;
  required: boolean;
}

export interface ConferenceProfile {
  conferenceId: string;
  conferenceCode: string;
  title: string;
  shortTitle?: string;
  eventType: ConferenceEventType;
  theme?: string;
  subTheme?: string;
  description?: string;
  objectives?: string[];
  venue?: string;
  virtualPlatform?: string;
  country?: string;
  city?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
  language?: string;
  posterImage?: string;
  logo?: string;
  organisers: string[];
  sponsors: string[];
  partners: string[];
  registrationStatus: 'Open' | 'Closed' | 'Limited' | 'Upcoming' | 'Draft';
  submissionStatus: 'Open' | 'Closed' | 'Limited' | 'Upcoming' | 'Draft';
  verificationStatus: InstitutionVerificationStatus;
  trustScore: number;
  researchAreas: string[];
  keywords: string[];
  committee: ConferenceCommitteeMember[];
  registrations: ConferenceRegistrationOption[];
  submissions: ConferenceSubmissionOption[];
  speakers: string[];
  schedule?: string[];
  registrationUrl?: string;
  submissionUrl?: string;
  website?: string;
}

export interface EditorialStructureMember {
  role: string;
  name: string;
  affiliation?: string;
}

export type JournalArticleStatus =
  | 'Draft'
  | 'Editorial Screening'
  | 'Under Review'
  | 'In Revision'
  | 'Accepted'
  | 'Rejected'
  | 'In Production'
  | 'Published';

export interface ArticleSummary {
  title: string;
  authors: string[];
  status: JournalArticleStatus;
}

export interface IssueSummary {
  issueNumber: string;
  year: string;
  status: 'Published' | 'Upcoming';
}

export interface VolumeSummary {
  volumeNumber: string;
  year: string;
  status: 'Published' | 'Upcoming';
}

export type JournalQuartile = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface JournalImpactMetrics {
  impactFactor?: number;
  fiveYearImpactFactor?: number;
  citeScore?: number;
  sjr?: number;
  snip?: number;
  hIndex?: number;
  totalCitations?: number;
  totalDownloads?: number;
  quartile?: JournalQuartile;
}

export interface JournalIndexingRecord {
  service: string;
  status: 'Indexed' | 'In Review' | 'Not Indexed';
}

export interface CallForPapers {
  id: string;
  title: string;
  theme: string;
  deadline: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  submissionTypes: JournalSubmissionType[];
  targetIssue?: string;
  guestEditor?: string;
  description?: string;
}

export interface PublicationQueueEntry {
  id: string;
  title: string;
  authors: string[];
  stage: PublicationWorkflowStage;
  doi?: string;
  issue?: string;
  scheduledPublication?: string;
}

export interface IssueScheduleEntry {
  id: string;
  issueNumber: string;
  volume?: string;
  year: string;
  publicationDate: string;
  status: 'Planned' | 'In Production' | 'Published';
  theme?: string;
  articles?: number;
}

export interface EditorialDecisionStatistics {
  submitted: number;
  underReview: number;
  inRevision: number;
  accepted: number;
  rejected: number;
  inProduction: number;
  published: number;
  acceptanceRate: number;
  rejectionRate: number;
  avgDaysToFirstDecision: number;
  avgDaysToAcceptance: number;
}

export interface JournalPolicy {
  articleProcessingCharges?: string;
  submissionFee?: string;
  embargoPeriod?: string;
  licensing?: string;
  copyright?: string;
  plagiarismPolicy?: string;
  dataPolicy?: string;
  ethicsPolicy?: string;
  appealsPolicy?: string;
  conflictsOfInterestPolicy?: string;
  preprintsPolicy?: string;
}

export interface JournalAnalytics {
  annualSubmissions: number;
  annualPublications: number;
  acceptanceRate?: number;
  rejectionRate?: number;
  totalDownloads?: number;
  totalCitations?: number;
  altmetricScore?: number;
  googleScholarRank?: string;
  medianDaysToFirstDecision?: number;
  medianDaysToAcceptance?: number;
}

export interface JournalRelationship {
  id: string;
  title: string;
  detail?: string;
}

export interface JournalRelationships {
  manuscripts: JournalRelationship[];
  datasets: JournalRelationship[];
  projects: JournalRelationship[];
  authors: JournalRelationship[];
  institutions: JournalRelationship[];
  grants: JournalRelationship[];
  publications: JournalRelationship[];
}

export interface JournalIssueRef {
  journal: JournalProfile;
  issue: IssueSummary;
}

export interface JournalVolumeRef {
  journal: JournalProfile;
  volume: VolumeSummary;
}

export interface JournalArticleRef {
  journal: JournalProfile;
  article: ArticleSummary;
}

export interface JournalCallForPapersRef {
  journal: JournalProfile;
  call: CallForPapers;
}

export interface JournalReviewerRef {
  journal: JournalProfile;
  reviewer: string;
}

export interface JournalPortfolioStatistics {
  totalJournals: number;
  openAccessJournals: number;
  hybridJournals: number;
  subscriptionJournals: number;
  diamondJournals: number;
  goldJournals: number;
  publishedArticles: number;
  acceptedArticles: number;
  underReviewArticles: number;
  inRevisionArticles: number;
  rejectedArticles: number;
  inProductionArticles: number;
  activeCallsForPapers: number;
  totalSubmissions: number;
  avgTrustScore: number;
}

export interface JournalPortfolioAnalytics {
  totalJournals: number;
  totalArticles: number;
  totalPublished: number;
  totalSubmissions: number;
  totalAccepted: number;
  totalRejected: number;
  totalDownloads: number;
  totalCitations: number;
  averageAcceptanceRate: number;
  averageRejectionRate: number;
  averageImpactFactor: number;
  highestImpactJournal?: string;
  mostCitedJournal?: string;
}

export interface JournalProfile {
  journalId: string;
  journalTitle: string;
  shortTitle?: string;
  issn?: string;
  eissn?: string;
  publicationType: JournalPublicationType;
  publisher?: string;
  institution?: string;
  country?: string;
  language?: string;
  discipline?: string;
  researchAreas: string[];
  aimsAndScope?: string;
  editorialPolicy?: string;
  openAccessStatus: OpenAccessStatus;
  publicationFrequency?: string;
  reviewModel: ReviewModel;
  indexingServices: string[];
  website?: string;
  verificationStatus: InstitutionVerificationStatus;
  trustScore: number;
  editorialStructure: EditorialStructureMember[];
  submissionTypes: JournalSubmissionType[];
  peerReviewModes: ReviewModel[];
  workflow: PublicationWorkflowStage[];
  editors: string[];
  reviewBoard: string[];
  productionTeam: string[];
  publishingStaff: string[];
  articles: ArticleSummary[];
  issues: IssueSummary[];
  volumes: VolumeSummary[];
  latestIssue?: string;
  doiPrefix?: string;
  impactMetrics?: JournalImpactMetrics;
  indexingRecords?: JournalIndexingRecord[];
  callsForPapers?: CallForPapers[];
  publicationQueue?: PublicationQueueEntry[];
  issueSchedule?: IssueScheduleEntry[];
  editorialDecisionStats?: EditorialDecisionStatistics;
  policy?: JournalPolicy;
  analytics?: JournalAnalytics;
}

export type InstitutionVerificationStatus = 'Pending' | 'Email Verified' | 'Domain Verified' | 'Document Verified' | 'Government Recognised' | 'Accredited' | 'Verified' | 'Trusted';

export interface InstitutionAffiliation {
  personId: string;
  name: string;
  role: string;
  current: boolean;
  previous: boolean;
  startDate?: string;
  endDate?: string;
  primary: boolean;
  institutionId?: string;
  department?: string;
}

export interface InstitutionVerificationRecord {
  type: 'Email' | 'Domain' | 'Document' | 'Government' | 'Accreditation' | 'Representative';
  status: InstitutionVerificationStatus;
  verifiedAt?: string;
  details?: string;
}

export interface InstitutionProfile {
  institutionId: string;
  institutionName: string;
  shortName?: string;
  acronym?: string;
  institutionType: InstitutionType;
  country?: string;
  stateProvince?: string;
  city?: string;
  website?: string;
  officialEmail?: string;
  officialPhone?: string;
  logo?: string;
  bannerImage?: string;
  description?: string;
  mission?: string;
  vision?: string;
  history?: string;
  accreditation?: string;
  ranking?: string;
  researchAreas: string[];
  academicDisciplines: string[];
  campusLocations: string[];
  socialMedia: ProfileLink[];
  officialDocuments: ProfileLink[];
  verificationStatus: InstitutionVerificationStatus;
  trustScore: number;
  verificationHistory: InstitutionVerificationRecord[];
  faculties: string[];
  schools: string[];
  colleges: string[];
  departments: string[];
  researchCentres: string[];
  institutes: string[];
  libraries: string[];
  administrativeUnits: string[];
  campuses: string[];
  affiliations: InstitutionAffiliation[];
  studentCount?: number;
  facultyCount?: number;
  programCount?: number;
  foundedYear?: number;
  lastVerifiedAt?: string;
}

export const INDIVIDUAL_ACCOUNT_TYPES: IndividualAccountType[] = [
  'Student',
  'Researcher',
  'Lecturer',
  'Professor',
  'Academic Staff',
  'Industry Professional',
  'Reviewer',
  'Editor',
  'Mentor',
];

export const ORGANISATION_ACCOUNT_TYPES: OrganisationAccountType[] = [
  'Institution',
  'University',
  'College',
  'Academy',
  'Polytechnic',
  'Research Institute',
  'Library',
  'Journal',
  'Conference',
  'Publisher',
  'Funding Organisation',
  'Professional Association',
  'Government Agency',
  'Industry Partner',
  'Employer',
  'Recruiter',
];

export const VERIFICATION_LEVEL_LABELS: Record<VerificationLevel, string> = {
  [VerificationLevel.Unverified]: 'Unverified',
  [VerificationLevel.EmailVerified]: 'Email Verified',
  [VerificationLevel.IdentityVerified]: 'Identity Verified',
  [VerificationLevel.InstitutionVerified]: 'Institution Verified',
  [VerificationLevel.OrganisationVerified]: 'Organisation Verified',
  [VerificationLevel.ORCIDLinked]: 'ORCID Linked',
  [VerificationLevel.PublicationVerified]: 'Publication Verified',
  [VerificationLevel.PeerReviewed]: 'Peer Reviewed',
  [VerificationLevel.Trusted]: 'Trusted',
  [VerificationLevel.VerifiedExpert]: 'Verified Expert',
};

export const TRUST_FACTORS: TrustFactor[] = [
  'Academic verification',
  'Publication history',
  'Peer review activity',
  'Editorial service',
  'Conference participation',
  'Institution affiliation',
  'Research integrity',
  'Community contributions',
  'Verification level',
  'Professional endorsements',
];

export const INSTITUTION_TYPES: InstitutionType[] = [
  'Institution',
  'University',
  'College',
  'Academy',
  'Polytechnic',
  'Research Institute',
  'Professional School',
  'Government Research Centre',
  'Library',
  'Think Tank',
  'Research Network',
  'International Organisation',
];

export const CONFERENCE_EVENT_TYPES: ConferenceEventType[] = [
  'International Conference',
  'National Conference',
  'Regional Conference',
  'Symposium',
  'Workshop',
  'Seminar',
  'Colloquium',
  'Summer School',
  'Winter School',
  'Bootcamp',
  'Hackathon',
  'Research Meeting',
  'Doctoral Consortium',
  'Poster Session',
  'Webinar',
  'Virtual Conference',
  'Hybrid Conference',
  'Training Programme',
  'Executive Education',
];

export const CONFERENCE_REGISTRATION_AUDIENCES: ConferenceRegistrationAudience[] = [
  'Researchers',
  'Students',
  'Institutions',
  'Publishers',
  'Sponsors',
  'Exhibitors',
  'Guests',
  'Media',
  'Mentors',
];

export const CONFERENCE_SUBMISSION_TYPES: ConferenceSubmissionType[] = [
  'Abstract',
  'Full Paper',
  'Poster',
  'Workshop Proposal',
  'Tutorial Proposal',
  'Panel Proposal',
  'Demo',
  'Dataset',
  'Software',
];

export const CONFERENCE_COMMITTEE_ROLES: ConferenceCommitteeRole[] = [
  'Conference Chair',
  'Co-Chair',
  'Programme Chair',
  'Technical Chair',
  'Publication Chair',
  'Finance Chair',
  'Integrity Chair',
  'Local Organising Committee',
  'Scientific Committee',
  'Review Committee',
  'Session Chairs',
  'Student Volunteers',
];

export const JOURNAL_PUBLICATION_TYPES: JournalPublicationType[] = [
  'Journal',
  'Book',
  'Book Series',
  'Conference Proceedings',
  'Edited Volume',
  'Magazine',
  'Newsletter',
  'Technical Report',
  'Working Paper',
  'Preprint Server',
];

export const JOURNAL_SUBMISSION_TYPES: JournalSubmissionType[] = [
  'Research Article',
  'Review Article',
  'Short Communication',
  'Case Study',
  'Editorial',
  'Letter',
  'Perspective',
  'Commentary',
  'Dataset',
  'Software Paper',
  'Protocol',
  'Book Review',
];

export const REVIEW_MODELS: ReviewModel[] = [
  'Single Blind',
  'Double Blind',
  'Open Review',
  'Transparent Review',
  'Post Publication Review',
];
