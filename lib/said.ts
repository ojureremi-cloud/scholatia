import { VerificationLevel, type ProfilePrivacy, type ProfileView, type SAIDProfile, type TrustMetrics } from '@/types/identity';

export const SAID_PREFIX = 'SAID';
export const SAID_FORMAT = 'SAID-0000-0000-0000';

export const DEFAULT_TRUST_METRICS: TrustMetrics = {
  trustScore: 70,
  verificationScore: 60,
  identityConfidence: 65,
  institutionConfidence: 60,
  publicationConfidence: 55,
  contributionScore: 50,
  communityReputation: 58,
  academicReputation: 62,
};

export const PROFILE_PRIVACY_OPTIONS: ProfilePrivacy[] = ['Public', 'Institution Only', 'Connections', 'Private', 'Custom'];

export const PROFILE_VIEW_OPTIONS: ProfileView[] = [
  'Public Profile',
  'Private Profile',
  'Institution View',
  'Recruiter View',
  'Publisher View',
  'Journal View',
  'Conference View',
  'API View',
];

export function createSaidIdentifier(index: number): string {
  const value = index.toString().padStart(12, '0');
  return `${SAID_PREFIX}-${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
}

export function createResearchProfile(overrides: Partial<SAIDProfile> = {}): SAIDProfile {
  return {
    said: createSaidIdentifier(1),
    displayName: 'Scholatia Member',
    accountCategory: 'Individual',
    accountType: 'Researcher',
    roles: ['Researcher'],
    verificationLevel: VerificationLevel.EmailVerified,
    biography: 'A verified academic member of the Scholatia network.',
    professionalSummary: 'Research-focused profile with scholarly contributions and verified institutional links.',
    academicSummary: 'Committed to advancing academic visibility across education, research, and collaboration.',
    researchInterests: ['Knowledge graphs', 'Academic identity'],
    keywords: ['scholarly infrastructure', 'identity'],
    disciplines: ['Computer Science'],
    fieldsOfStudy: ['Digital Humanities'],
    education: [],
    employmentHistory: [],
    institutionHistory: [],
    professionalMembership: [],
    projects: [],
    awards: [],
    patents: [],
    datasets: [],
    software: [],
    books: [],
    bookChapters: [],
    conferencePapers: [],
    journalArticles: [],
    preprints: [],
    technicalReports: [],
    grants: [],
    teachingExperience: [],
    courses: [],
    supervision: [],
    skills: [],
    languages: [],
    certifications: [],
    volunteerActivities: [],
    socialLinks: [],
    academicLinks: [],
    privacy: 'Public',
    visibleTo: ['Public Profile', 'API View'],
    trustMetrics: DEFAULT_TRUST_METRICS,
    publicationSummary: { totalArticles: 0, totalCitations: 0 },
    publicUrl: 'https://scholatia.org/profile',
    shortUrl: '/p/said',
    qrCodeValue: 'SAID-0000-0000-0000',
    isPublic: true,
    ...overrides,
  };
}
