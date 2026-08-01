import type {
  ProfileLink,
  VerificationLevel,
} from '@/types/identity';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Researcher Identity Domain Model (Scholatia Phase 1.4).
 *
 * The Researcher module is the identity layer at the heart of the Scholatia
 * ecosystem. Every researcher owns a permanent scholarly identity (SAID) and a
 * personal academic website (e.g. `ojuri.scholatia.com`). Every other platform
 * module — Projects, Datasets, Manuscripts, Journals, Conferences, Institutions,
 * Publishers, Funding, Marketplace, Intelligence — connects back to these
 * researcher identities.
 *
 * This model embeds the existing SAID architecture (`VerificationLevel`,
 * SAIDProfile) and the existing `ResearchLifecycleEngine`, and layers the full
 * researcher ecosystem on top: position, biography, education, employment,
 * memberships, awards, honors, certifications, skills, languages, social links,
 * academic network, research timeline, research portfolio, metrics, academic
 * impact, visibility, teaching, supervision, editorial appointments, conference
 * participation, grants, patents, innovations, startups, media coverage, public
 * engagement, community service, volunteer experience, availability, contact,
 * verification, analytics, and cross-module relationships.
 */

export type ResearcherPositionType =
  | 'Distinguished Professor'
  | 'Professor'
  | 'Associate Professor'
  | 'Assistant Professor'
  | 'Senior Lecturer'
  | 'Lecturer'
  | 'Principal Investigator'
  | 'Senior Research Scientist'
  | 'Research Scientist'
  | 'Postdoctoral Researcher'
  | 'Research Fellow'
  | 'Research Associate'
  | 'Research Assistant'
  | 'PhD Candidate'
  | 'Graduate Researcher'
  | 'Industry Researcher'
  | 'Emeritus Professor'
  | 'Visiting Professor';

export type ResearcherEmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Visiting'
  | 'Adjunct'
  | 'Emeritus'
  | 'Fellowship';

/**
 * The persistent academic identity record for a researcher. Embeds the SAID
 * identifier and the existing ORCID / scholarly identifier vocabulary.
 */
export interface AcademicIdentity {
  /** Scholatia Academic Identity (SAID) identifier. */
  said: string;
  displayName: string;
  firstName: string;
  lastName: string;
  orcid: string;
  googleScholar?: string;
  scopusAuthorId?: string;
  webOfScienceResearcherId?: string;
  crossref?: string;
  loop?: string;
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  memberSince: string;
}

export interface AcademicPosition {
  title: ResearcherPositionType;
  institution: string;
  institutionId?: string;
  faculty: string;
  department: string;
  country: string;
  city?: string;
  employmentType: ResearcherEmploymentType;
  startDate: string;
  endDate?: string;
  current: boolean;
  researchFocus: string[];
}

export interface AcademicBiography {
  professionalSummary: string;
  academicSummary: string;
  shortBiography: string;
  fullBiography: string;
  areasOfExpertise: string[];
}

export interface EducationHistory {
  id: string;
  institution: string;
  institutionId?: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  country?: string;
  description?: string;
  honors?: string[];
}

export interface EmploymentHistory {
  id: string;
  organisation: string;
  organisationId?: string;
  role: string;
  department?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface ProfessionalMembership {
  id: string;
  organisation: string;
  role: string;
  type: string;
  since: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface Award {
  id: string;
  title: string;
  organisation: string;
  year: string;
  category?: string;
  description?: string;
}

export interface Honor {
  id: string;
  title: string;
  organisation: string;
  year: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface ResearchInterest {
  id: string;
  name: string;
  category: string;
  keywords: string[];
}

export interface ResearchArea {
  id: string;
  name: string;
  description?: string;
  publications: number;
  citations: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  endorsements?: number;
}

export type LanguageProficiency =
  | 'Native'
  | 'Fluent'
  | 'Professional Working'
  | 'Conversational'
  | 'Basic';

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  description?: string;
}

export interface SocialLinks {
  linkedin?: string;
  personalWebsite?: string;
  twitter?: string;
  github?: string;
  researchGate?: string;
  academia?: string;
  blog?: string;
  youtube?: string;
  orcid?: string;
  others: ProfileLink[];
}

export interface AcademicCollaborator {
  id: string;
  name: string;
  institution: string;
  role?: string;
  researchAreas: string[];
  jointPublications: number;
  yearsActive?: string;
  username?: string;
}

export interface AcademicNetwork {
  collaborators: AcademicCollaborator[];
  institutionalPartners: string[];
  professionalNetwork: number;
  followers: number;
  following: number;
  coAuthors: number;
}

export type ResearchTimelineEntryType =
  | 'Education'
  | 'Employment'
  | 'Publication'
  | 'Grant'
  | 'Award'
  | 'Project'
  | 'Milestone'
  | 'Certification'
  | 'Conference'
  | 'Leadership';

export interface ResearchTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: ResearchTimelineEntryType;
  stageId?: ResearchLifecycleStageId;
}

export interface ResearchPortfolio {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalDatasets: number;
  totalManuscripts: number;
  totalPublications: number;
  journalArticles: number;
  conferencePapers: number;
  books: number;
  bookChapters: number;
  preprints: number;
  technicalReports: number;
  totalPatents: number;
  software: number;
  teachingCourses: number;
  supervisedStudents: number;
}

export interface ResearchMetrics {
  totalPublications: number;
  totalCitations: number;
  totalDownloads: number;
  totalReads: number;
  totalFollowers: number;
  totalCollaborators: number;
  totalProjects: number;
  totalGrants: number;
  totalAwards: number;
  totalPatents: number;
  totalDatasets: number;
}

export interface CitationYearEntry {
  year: string;
  citations: number;
}

export interface CitationMetrics {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  citationsByYear: CitationYearEntry[];
  mostCitedWork?: string;
}

export interface AltmetricMetrics {
  score: number;
  mentions: number;
  news: number;
  blogs: number;
  twitter: number;
  facebook: number;
  policy: number;
  wikipedia: number;
  patents: number;
  mendeley: number;
  dimensions: number;
}

export interface CollaborationMetrics {
  totalCollaborators: number;
  totalCoAuthors: number;
  institutionalPartners: number;
  internationalCollaborations: number;
  collaborationCountries: string[];
  avgCollaboratorsPerPaper?: number;
}

export interface AcademicImpact {
  citationMetrics: CitationMetrics;
  altmetricMetrics: AltmetricMetrics;
  collaborationMetrics: CollaborationMetrics;
  hIndex: number;
  i10Index: number;
  downloads: number;
  reads: number;
}

export interface ReferrerEntry {
  name: string;
  count: number;
}

export interface ResearchVisibility {
  visibilityScore: number;
  profileViews: number;
  monthlyVisitors?: number;
  monthlyDownloads?: number;
  searchAppearances?: number;
  countriesReached?: number;
  topReferrers?: ReferrerEntry[];
}

export interface TeachingCourse {
  id: string;
  title: string;
  code?: string;
  level: string;
  institution: string;
  department: string;
  yearsTaught: string;
  students: number;
  rating?: number;
  description?: string;
}

export interface TeachingPortfolio {
  courses: TeachingCourse[];
  totalCourses: number;
  currentCourses: number;
  totalStudents: number;
  teachingExperience: string;
  teachingAwards?: string[];
}

export interface SupervisedStudent {
  id: string;
  name: string;
  level: 'PhD' | 'Masters' | 'Undergraduate' | 'Postdoctoral' | 'Research Assistant';
  thesisTitle?: string;
  institution: string;
  period: string;
  status: 'Current' | 'Completed';
  outcome?: string;
  coSupervisor?: string;
}

export interface SupervisionPortfolio {
  students: SupervisedStudent[];
  currentPhd: number;
  completedPhd: number;
  currentMasters: number;
  completedMasters: number;
  totalSupervised: number;
}

export interface EditorialAppointment {
  id: string;
  role: string;
  journal: string;
  publisher?: string;
  since: string;
  until?: string;
  status: 'Active' | 'Past';
  scope?: string;
}

export type ConferenceParticipationRole =
  | 'Keynote Speaker'
  | 'Invited Speaker'
  | 'Paper Presenter'
  | 'Session Chair'
  | 'Organising Committee'
  | 'Reviewer'
  | 'Panelist'
  | 'Attendee';

export interface ConferenceParticipation {
  id: string;
  conference: string;
  conferenceId?: string;
  year: string;
  role: ConferenceParticipationRole;
  paperTitle?: string;
  city?: string;
  country?: string;
}

export type GrantRole =
  | 'Principal Investigator'
  | 'Co-Investigator'
  | 'Collaborator'
  | 'Fellow'
  | 'Research Assistant';

export interface GrantParticipation {
  id: string;
  title: string;
  funder: string;
  amount: string;
  role: GrantRole;
  status: 'Active' | 'Completed' | 'Pending';
  period: string;
  description?: string;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  patentNumber: string;
  country: string;
  year: string;
  status: 'Granted' | 'Pending' | 'Provisional';
  description?: string;
}

export interface Innovation {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  status: 'Prototype' | 'Commercialised' | 'Research' | 'Licensed';
  impact?: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  founded: string;
  sector: string;
  stage: string;
  fundingRaised?: string;
  website?: string;
}

export interface MediaCoverage {
  id: string;
  outlet: string;
  headline: string;
  date: string;
  type: string;
  url?: string;
}

export interface PublicEngagement {
  id: string;
  title: string;
  format: string;
  date: string;
  audience?: string;
  description?: string;
  reach?: number;
}

export interface CommunityService {
  id: string;
  role: string;
  organisation: string;
  since: string;
  status: 'Active' | 'Past';
  description?: string;
}

export interface VolunteerExperience {
  id: string;
  organisation: string;
  role: string;
  period: string;
  description?: string;
}

export interface Availability {
  openToCollaboration: boolean;
  openToSupervision: boolean;
  openToMentoring: boolean;
  openToReviewing: boolean;
  openToConsulting: boolean;
  availableForSpeaking: boolean;
  responseTime?: string;
  preferredContact?: string;
  notes?: string;
}

export interface ContactInformation {
  email: string;
  professionalEmail: string;
  phone?: string;
  office?: string;
  institutionAddress?: string;
  city?: string;
  country: string;
  timezone?: string;
}

export type VerificationStepStatus = 'verified' | 'pending' | 'not-started';

export interface IdentityVerification {
  verified: boolean;
  verificationLevel: VerificationLevel;
  verificationStatus: string;
  identityScore: number;
  trustScore: number;
  visibilityScore: number;
  badges: string[];
  verifiedAt?: string;
  lastVerified?: string;
  verificationSteps: {
    label: string;
    status: VerificationStepStatus;
    detail?: string;
  }[];
  academicAchievements: string[];
}

export interface RecentActivityEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: string;
}

export interface ProfileCompletion {
  score: number;
  totalFields: number;
  completedFields: number;
  remainingFields: string[];
}

export interface PublicationTrendPoint {
  period: string;
  publications: number;
}

export interface ResearcherAnalytics {
  profileViews: number;
  downloads: number;
  reads: number;
  citations: number;
  followers: number;
  collaborators: number;
  publicationTrend: PublicationTrendPoint[];
  citationTrend: CitationYearEntry[];
  popularPublications?: { title: string; views: number }[];
  topCountries?: { country: string; views: number }[];
  analyticsPeriod?: string;
}

export interface ResearcherRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

export interface ResearcherRelationships {
  projects: ResearcherRelationshipRef[];
  datasets: ResearcherRelationshipRef[];
  manuscripts: ResearcherRelationshipRef[];
  publications: ResearcherRelationshipRef[];
  journals: ResearcherRelationshipRef[];
  conferences: ResearcherRelationshipRef[];
  grants: ResearcherRelationshipRef[];
  awards: ResearcherRelationshipRef[];
  collaborators: ResearcherRelationshipRef[];
  institutions: ResearcherRelationshipRef[];
}

/**
 * The enriched researcher aggregate. This is the personal academic homepage
 * record — `ojuri.scholatia.com` today maps to `/researchers/ojuri`.
 */
export interface ResearcherProfile {
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline?: string;
  country: string;
  identity: AcademicIdentity;
  position: AcademicPosition;
  biography: AcademicBiography;
  interests: ResearchInterest[];
  researchAreas: ResearchArea[];
  education: EducationHistory[];
  employment: EmploymentHistory[];
  memberships: ProfessionalMembership[];
  awards: Award[];
  honors: Honor[];
  certifications: Certification[];
  skills: Skill[];
  languages: Language[];
  socialLinks: SocialLinks;
  network: AcademicNetwork;
  timeline: ResearchTimelineEntry[];
  portfolio: ResearchPortfolio;
  metrics: ResearchMetrics;
  impact: AcademicImpact;
  visibility: ResearchVisibility;
  teaching: TeachingPortfolio;
  supervision: SupervisionPortfolio;
  editorialAppointments: EditorialAppointment[];
  conferenceParticipation: ConferenceParticipation[];
  grantParticipation: GrantParticipation[];
  patents: Patent[];
  innovations: Innovation[];
  startups: Startup[];
  mediaCoverage: MediaCoverage[];
  publicEngagement: PublicEngagement[];
  communityService: CommunityService[];
  volunteerExperience: VolunteerExperience[];
  availability: Availability;
  contact: ContactInformation;
  verification: IdentityVerification;
  analytics: ResearcherAnalytics;
  relationships: ResearcherRelationships;
  recentActivity: RecentActivityEntry[];
  profileCompletion: ProfileCompletion;
}

export interface InstitutionDistributionEntry {
  institution: string;
  country?: string;
  count: number;
}

export interface CountryDistributionEntry {
  country: string;
  count: number;
}

export interface DisciplineDistributionEntry {
  discipline: string;
  count: number;
}

export interface ResearchInterestGroupEntry {
  interest: string;
  count: number;
}

export interface ResearcherStatistics {
  totalResearchers: number;
  totalCountries: number;
  totalInstitutions: number;
  totalDisciplines: number;
  totalPublications: number;
  totalCitations: number;
  totalProjects: number;
  totalDatasets: number;
  verifiedResearchers: number;
  avgTrustScore: number;
  totalFollowers: number;
  totalCollaborators: number;
}

/**
 * A researcher lifecycle coverage row, derived from the canonical
 * `ResearchLifecycleEngine`. Researchers own work at every lifecycle stage; the
 * module never redefines the lifecycle itself.
 */
export interface ResearcherLifecycleCoverage {
  stageId: ResearchLifecycleStageId;
  name: string;
  description: string;
  icon: string;
  order: number;
  completionPercentage: number;
  previousStage: string | null;
  nextStage: string | null;
}
