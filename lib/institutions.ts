import type { InstitutionProfile, InstitutionType, InstitutionVerificationRecord, InstitutionVerificationStatus } from '@/types/identity';

export const INSTITUTION_TYPES: InstitutionType[] = [
  'University',
  'College',
  'Polytechnic',
  'Academy',
  'Research Institute',
  'Government Research Centre',
  'Professional School',
  'Library',
  'Think Tank',
  'Funding Organisation',
  'Professional Association',
  'Publisher',
  'Research Network',
  'Innovation Hub',
  'Training Centre',
  'International Organisation',
];

export const INSTITUTION_VERIFICATION_STATUSES: InstitutionVerificationStatus[] = [
  'Pending',
  'Email Verified',
  'Domain Verified',
  'Document Verified',
  'Government Recognised',
  'Accredited',
  'Verified',
  'Trusted',
];

export function createInstitutionProfile(overrides: Partial<InstitutionProfile> = {}): InstitutionProfile {
  return {
    institutionId: 'INST-001',
    institutionName: 'Scholatia Partner Institution',
    shortName: 'SPI',
    acronym: 'SPI',
    institutionType: 'University',
    country: 'United Kingdom',
    city: 'London',
    website: 'https://example.edu',
    officialEmail: 'contact@example.edu',
    description: 'A globally connected academic institution on the Scholatia network.',
    mission: 'Advance research, teaching, and scholarly collaboration.',
    vision: 'Create a trusted academic environment for the next generation.',
    history: 'Founded on excellence in research and teaching.',
    accreditation: 'Recognised by national and international quality bodies.',
    ranking: 'Top 200',
    researchAreas: ['Artificial Intelligence', 'Education'],
    academicDisciplines: ['Computer Science', 'Education'],
    campusLocations: ['Main Campus'],
    socialMedia: [],
    officialDocuments: [],
    verificationStatus: 'Verified',
    trustScore: 82,
    verificationHistory: [],
    faculties: ['Faculty of Science'],
    schools: ['School of Computing'],
    colleges: [],
    departments: ['Department of Computer Science'],
    researchCentres: ['Research Lab'],
    institutes: [],
    libraries: ['Main Library'],
    administrativeUnits: ['Registry'],
    campuses: ['Main Campus'],
    affiliations: [],
    studentCount: 12000,
    facultyCount: 850,
    programCount: 42,
    foundedYear: 1950,
    lastVerifiedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createInstitutionVerificationRecord(type: InstitutionVerificationRecord['type']): InstitutionVerificationRecord {
  return {
    type,
    status: 'Verified',
    verifiedAt: new Date().toISOString(),
    details: 'Verified through the Scholatia institution workflow.',
  };
}
