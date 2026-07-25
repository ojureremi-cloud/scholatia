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
