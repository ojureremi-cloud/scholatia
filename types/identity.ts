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
  | 'Academy'
  | 'Polytechnic'
  | 'Research Institute'
  | 'Professional School'
  | 'Government Research Centre'
  | 'Library'
  | 'Think Tank'
  | 'Research Network'
  | 'International Education Organisation';

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
  'International Education Organisation',
];
