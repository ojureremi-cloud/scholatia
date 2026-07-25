export type AccountCategory = 'Individual' | 'Organisation';

export type IndividualAccountType =
  | 'Student'
  | 'Researcher'
  | 'Lecturer'
  | 'Professor'
  | 'Industry Professional'
  | 'Reviewer'
  | 'Editor'
  | 'Mentor';

export type OrganisationAccountType =
  | 'Institution'
  | 'Journal'
  | 'Conference'
  | 'Publisher'
  | 'Funding Organisation'
  | 'Professional Association';

export type AccountType = IndividualAccountType | OrganisationAccountType;

export type RoleType =
  | 'Student'
  | 'Researcher'
  | 'Lecturer'
  | 'Professor'
  | 'Reviewer'
  | 'Editor'
  | 'Author'
  | 'Mentor'
  | 'Conference Participant'
  | 'Institution Administrator'
  | 'Journal Administrator'
  | 'Publisher'
  | 'Funding Organisation Administrator'
  | 'Professional Association Administrator';

export type InstitutionType =
  | 'University'
  | 'College of Education'
  | 'Polytechnic'
  | 'Institute'
  | 'Academy'
  | 'Research Centre'
  | 'Laboratory'
  | 'Teaching Hospital'
  | 'Professional School'
  | 'Think Tank'
  | 'Government Research Organisation'
  | 'International Education Organisation';

export enum VerificationLevel {
  Unverified = 0,
  EmailVerified = 1,
  PhoneVerified = 2,
  InstitutionVerified = 3,
  IdentityVerified = 4,
  ResearchVerified = 5,
  FullyTrusted = 6,
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
  joinedAt: string;
  lastVerifiedAt?: string;
  isVerified: boolean;
}

export const INDIVIDUAL_ACCOUNT_TYPES: IndividualAccountType[] = [
  'Student',
  'Researcher',
  'Lecturer',
  'Professor',
  'Industry Professional',
  'Reviewer',
  'Editor',
  'Mentor',
];

export const ORGANISATION_ACCOUNT_TYPES: OrganisationAccountType[] = [
  'Institution',
  'Journal',
  'Conference',
  'Publisher',
  'Funding Organisation',
  'Professional Association',
];

export const VERIFICATION_LEVEL_LABELS: Record<VerificationLevel, string> = {
  [VerificationLevel.Unverified]: 'Unverified',
  [VerificationLevel.EmailVerified]: 'Email Verified',
  [VerificationLevel.PhoneVerified]: 'Phone Verified',
  [VerificationLevel.InstitutionVerified]: 'Institution Verified',
  [VerificationLevel.IdentityVerified]: 'Identity Verified',
  [VerificationLevel.ResearchVerified]: 'Research Verified',
  [VerificationLevel.FullyTrusted]: 'Fully Trusted Scholatia Member',
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
  'University',
  'College of Education',
  'Polytechnic',
  'Institute',
  'Academy',
  'Research Centre',
  'Laboratory',
  'Teaching Hospital',
  'Professional School',
  'Think Tank',
  'Government Research Organisation',
  'International Education Organisation',
];
