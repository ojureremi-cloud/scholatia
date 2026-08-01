import type { InstitutionProfile, InstitutionVerificationStatus } from '@/types/identity';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * The organisational backbone of the Scholatia scholarly ecosystem.
 *
 * The Institutions module is the platform-wide layer under which every other
 * lifecycle stage operates: institutions verify SAIDs, host research projects,
 * employ researchers, accredit journals and conferences, and fund research. This
 * module does NOT introduce a new lifecycle stage; instead it reuses the
 * canonical `ResearchLifecycleEngine` and supports every existing stage.
 */

export interface Campus {
  id: string;
  name: string;
  city: string;
  country: string;
  address?: string;
  establishedYear?: number;
  areaHectares?: number;
  faculties: string[];
  facilities: string[];
  studentCount?: number;
  academicStaffCount?: number;
  coordinates?: { latitude: number; longitude: number };
}

export interface Faculty {
  id: string;
  name: string;
  shortName?: string;
  dean: string;
  establishedYear?: number;
  departments: string[];
  programmes: string[];
  studentCount?: number;
  academicStaffCount?: number;
  researchFocus: string[];
}

export interface School {
  id: string;
  name: string;
  shortName?: string;
  director: string;
  establishedYear?: number;
  focusAreas: string[];
  programmeCount?: number;
  studentCount?: number;
}

export interface Department {
  id: string;
  name: string;
  facultyId?: string;
  facultyName?: string;
  head: string;
  establishedYear?: number;
  researchAreas: string[];
  programmes: string[];
  academicStaffCount?: number;
  studentCount?: number;
  laboratories: string[];
}

export interface ResearchCentre {
  id: string;
  name: string;
  acronym?: string;
  director: string;
  establishedYear?: number;
  researchThemes: string[];
  staffCount?: number;
  activeProjects?: number;
  publications?: number;
  fundingAwarded?: number;
  description?: string;
  website?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  director: string;
  establishedYear?: number;
  focusAreas: string[];
  equipment: string[];
  capacity?: number;
  accessLevel: 'Open' | 'Restricted' | 'Controlled' | 'Private';
}

export interface AdministrativeUnit {
  id: string;
  name: string;
  director: string;
  responsibilities: string[];
  staffCount?: number;
  reportsTo?: string;
}

export interface InstitutionStatistics {
  students: number;
  faculty: number;
  staff: number;
  internationalStudents: number;
  alumni?: number;
  programmes: number;
  faculties: number;
  departments: number;
  researchCentres: number;
  laboratories: number;
  campuses: number;
  postgraduates?: number;
  undergraduates?: number;
  acceptanceRate?: number;
  graduationRate?: number;
}

export interface InstitutionRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

/**
 * A single cross-module reference (project, publication, dataset, journal,
 * conference, researcher, grant, or partner) connected to an institution.
 */
export type InstitutionRelationship = InstitutionRelationshipRef;

/**
 * Grouped cross-module relationships, following the same pattern as
 * `ConferenceRelationships` and `JournalRelationships` so the institutions
 * module reuses the existing relationship vocabulary.
 */
export interface InstitutionRelationships {
  projects: InstitutionRelationship[];
  publications: InstitutionRelationship[];
  manuscripts: InstitutionRelationship[];
  datasets: InstitutionRelationship[];
  journals: InstitutionRelationship[];
  conferences: InstitutionRelationship[];
  researchers: InstitutionRelationship[];
  grants: InstitutionRelationship[];
  partners: InstitutionRelationship[];
}

export interface InstitutionAnalytics {
  institutionId: string;
  researchOutputs: number;
  publications: number;
  citations: number;
  hIndex: number;
  journalsConnected: number;
  conferencePapers: number;
  datasetsPublished: number;
  activeProjects: number;
  completedProjects: number;
  activeGrants: number;
  totalFunding: number;
  researchers: number;
  internationalPartners: number;
  collaborations: number;
  publicationTrend: { period: string; publications: number }[];
}

export interface InstitutionRanking {
  id: string;
  source: string;
  year: number;
  category: string;
  rank: number;
  totalRanked?: number;
  percentile?: number;
  score?: number;
  region?: string;
  note?: string;
}

export interface InstitutionAccreditation {
  id: string;
  body: string;
  country?: string;
  status:
    | 'Accredited'
    | 'Provisionally Accredited'
    | 'Pending'
    | 'Under Review'
    | 'Revoked';
  awardedYear: number;
  expiresYear?: number;
  scope: string;
  certification?: string;
}

export interface InstitutionFunding {
  id: string;
  source: string;
  type:
    | 'Grant'
    | 'Endowment'
    | 'Government Allocation'
    | 'Industry'
    | 'Philanthropy'
    | 'Tuition'
    | 'Research Contract';
  amount: number;
  currency: string;
  year: number;
  description?: string;
}

export interface InstitutionMembership {
  id: string;
  organisation: string;
  role?: string;
  sinceYear?: number;
  status: 'Active' | 'Inactive' | 'Pending';
  description?: string;
}

export interface InstitutionContact {
  id: string;
  label: string;
  value: string;
  type: 'Email' | 'Phone' | 'Address' | 'Website' | 'Social' | 'Other';
  primary?: boolean;
}

export interface InstitutionTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type:
    | 'Founded'
    | 'Campus'
    | 'Accreditation'
    | 'Ranking'
    | 'Partnership'
    | 'Research'
    | 'Leadership'
    | 'Award';
}

export interface InstitutionResearchOutput {
  id: string;
  title: string;
  type:
    | 'Journal Article'
    | 'Conference Paper'
    | 'Dataset'
    | 'Report'
    | 'Patent'
    | 'Software'
    | 'Book'
    | 'Preprint';
  year: number;
  authors: string[];
  venue?: string;
  citations?: number;
  doi?: string;
  fundingSource?: string;
}

export interface InstitutionPortfolioStatistics {
  totalInstitutions: number;
  totalCountries: number;
  totalUniversities: number;
  totalResearchInstitutes: number;
  totalStudents: number;
  totalFaculty: number;
  totalCampuses: number;
  totalFaculties: number;
  totalDepartments: number;
  totalResearchCentres: number;
  totalLaboratories: number;
  totalPublications: number;
  totalResearchers: number;
  totalGrants: number;
  totalPartnerships: number;
  verifiedInstitutions: number;
  accreditedInstitutions: number;
  avgTrustScore: number;
}

/**
 * A lifecycle coverage row for the institution platform, derived from the
 * canonical `ResearchLifecycleEngine`. Institutions support every lifecycle
 * stage; the platform never redefines the lifecycle itself.
 */
export interface InstitutionLifecycleCoverage {
  stageId: ResearchLifecycleStageId;
  name: string;
  description: string;
  icon: string;
  order: number;
  completionPercentage: number;
  previousStage: string | null;
  nextStage: string | null;
}

/**
 * The enriched institution aggregate. Embeds the existing `InstitutionProfile`
 * (the identity, verification, and trust record already built in the
 * Institution Management & Verification Platform) and layers the full
 * institutional ecosystem on top: campuses, faculties, departments, research
 * centres, laboratories, statistics, rankings, accreditations, research
 * outputs, cross-module relationships, funding, memberships, contacts, and a
 * timeline.
 */
export interface Institution {
  /** Scholatia Academic Identity (SAID) identifier for the institution. */
  said: string;
  /** Emoji or placeholder logo mark; replaced by uploaded assets later. */
  logo: string;
  country: string;
  profile: InstitutionProfile;
  campuses: Campus[];
  faculties: Faculty[];
  schools: School[];
  departments: Department[];
  researchCentres: ResearchCentre[];
  laboratories: Laboratory[];
  administrativeUnits: AdministrativeUnit[];
  statistics: InstitutionStatistics;
  rankings: InstitutionRanking[];
  accreditations: InstitutionAccreditation[];
  researchOutputs: InstitutionResearchOutput[];
  publications: InstitutionRelationship[];
  journals: InstitutionRelationship[];
  conferences: InstitutionRelationship[];
  datasets: InstitutionRelationship[];
  researchers: InstitutionRelationship[];
  grants: InstitutionFunding[];
  funding: InstitutionFunding[];
  partnerships: InstitutionRelationship[];
  memberships: InstitutionMembership[];
  contacts: InstitutionContact[];
  timeline: InstitutionTimelineEntry[];
  analytics: InstitutionAnalytics;
  relationships: InstitutionRelationships;
  verificationStatus: InstitutionVerificationStatus;
}
