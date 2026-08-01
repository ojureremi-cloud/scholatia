import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import { createInstitutionProfile } from '@/lib/institutions';
import type { InstitutionProfile } from '@/types/identity';
import type {
  Institution,
  InstitutionAccreditation,
  InstitutionAnalytics,
  InstitutionContact,
  InstitutionFunding,
  InstitutionLifecycleCoverage,
  InstitutionMembership,
  InstitutionPortfolioStatistics,
  InstitutionRanking,
  InstitutionRelationship,
  InstitutionRelationships,
  InstitutionStatistics,
  InstitutionTimelineEntry,
} from '@/types/institution';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS, RESEARCH_TEAM } from '@/constants/placeholder-research';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';

/**
 * Placeholder data for the Institutions Platform.
 *
 * 20 globally distributed universities. Every institution embeds the existing
 * `InstitutionProfile` (identity, verification, trust) and layers the full
 * institutional ecosystem: campuses, faculties, departments, research centres,
 * laboratories, statistics, rankings, accreditations, research outputs,
 * cross-module relationships, grants, funding, memberships, partnerships,
 * contacts, and a timeline.
 *
 * Cross-module references (publications, journals, conferences, datasets,
 * manuscripts, researchers, projects) are sourced from the existing placeholder
 * modules so no data is duplicated and every reference stays live.
 */

const DEFAULT_STATISTICS: InstitutionStatistics = {
  students: 22000,
  faculty: 1250,
  staff: 900,
  internationalStudents: 1800,
  alumni: 85000,
  programmes: 62,
  faculties: 4,
  departments: 10,
  researchCentres: 3,
  laboratories: 4,
  campuses: 1,
  postgraduates: 6500,
  undergraduates: 15500,
  acceptanceRate: 34,
  graduationRate: 81,
};

function profileFor(overrides: Partial<InstitutionProfile>): InstitutionProfile {
  return createInstitutionProfile(overrides);
}

const PUBLICATION_POOL: InstitutionRelationship[] = WORKSPACE_PUBLICATIONS.map((p) => ({
  id: `pub-${p.doi}`,
  title: p.title,
  detail: `${p.journal} · ${p.year}`,
}));

const JOURNAL_POOL: InstitutionRelationship[] = JOURNALS.map((journal) => ({
  id: journal.journalId,
  title: journal.journalTitle,
  detail: journal.country ?? 'International journal',
}));

const CONFERENCE_POOL: InstitutionRelationship[] = CONFERENCES.map((conference) => ({
  id: conference.conferenceId,
  title: conference.shortTitle ?? conference.title,
  detail: `${conference.city ?? 'Location'} · ${conference.startDate ?? conference.conferenceCode}`,
}));

const DATASET_POOL: InstitutionRelationship[] = DATASETS.map((dataset) => ({
  id: dataset.id,
  title: dataset.title,
  detail: dataset.doi,
}));

const MANUSCRIPT_POOL: InstitutionRelationship[] = MANUSCRIPTS.map((manuscript) => ({
  id: manuscript.id,
  title: manuscript.title,
  detail: `Status: ${manuscript.status}`,
}));

const PROJECT_POOL: InstitutionRelationship[] = WORKSPACE_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  detail: `Status: ${project.status}`,
}));

const RESEARCHER_POOL: InstitutionRelationship[] = [
  ...RESEARCH_TEAM.map((member) => ({
    id: `researcher-${member.name.replace(/\s+/g, '-')}`,
    title: member.name,
    detail: member.institution,
  })),
  ...MANUSCRIPTS.flatMap((manuscript) =>
    manuscript.authors.map((author) => ({
      id: author.said,
      title: author.name,
      detail: author.institution,
    }))
  ),
  ...DATASETS.flatMap((dataset) =>
    dataset.contributors.map((contributor) => ({
      id: contributor.said,
      title: contributor.name,
      detail: contributor.institution,
    }))
  ),
].filter(
  (researcher, index, self) => self.findIndex((entry) => entry.id === researcher.id) === index
);

const PARTNER_POOL: InstitutionRelationship[] = [
  { id: 'partner-oxford', title: 'University of Oxford', detail: 'Research partnership' },
  { id: 'partner-cambridge', title: 'University of Cambridge', detail: 'Academic exchange' },
  { id: 'partner-eth', title: 'ETH Zurich', detail: 'Joint research centre' },
  { id: 'partner-nus', title: 'National University of Singapore', detail: 'Strategic alliance' },
  { id: 'partner-uct', title: 'University of Cape Town', detail: 'African research network' },
  { id: 'partner-mit', title: 'Massachusetts Institute of Technology', detail: 'Innovation collaboration' },
  { id: 'partner-harvard', title: 'Harvard University', detail: 'Faculty exchange' },
  { id: 'partner-stanford', title: 'Stanford University', detail: 'Entrepreneurship programme' },
  { id: 'partner-ibadan', title: 'University of Ibadan', detail: 'West African network' },
  { id: 'partner-makerere', title: 'Makerere University', detail: 'East African network' },
  { id: 'partner-ghana', title: 'University of Ghana', detail: 'West African network' },
  { id: 'partner-utokyo', title: 'University of Tokyo', detail: 'Asia-Pacific alliance' },
];

function sliceRotate<T>(items: T[], index: number, count: number): T[] {
  if (items.length === 0) return [];
  const start = (index * 3) % items.length;
  const rotated = [...items.slice(start), ...items.slice(0, start)];
  return rotated.slice(0, Math.min(count, items.length));
}

function buildContacts(institution: Institution): InstitutionContact[] {
  const { profile } = institution;
  return [
    {
      id: 'contact-website',
      label: 'Website',
      value: profile.website ?? 'Website not listed',
      type: 'Website',
      primary: true,
    },
    {
      id: 'contact-email',
      label: 'Official email',
      value: profile.officialEmail ?? 'Email not listed',
      type: 'Email',
    },
    {
      id: 'contact-phone',
      label: 'Official phone',
      value: profile.officialPhone ?? 'Phone not listed',
      type: 'Phone',
    },
    {
      id: 'contact-address',
      label: 'Address',
      value: `${profile.city ?? 'City not listed'}, ${profile.country ?? 'Country not listed'}`,
      type: 'Address',
    },
  ];
}

function publicationTrendFor(index: number) {
  return [2023, 2024, 2025].map((year, offset) => ({
    period: `${year}`,
    publications: 160 + index * 14 + offset * 42,
  }));
}

function buildAnalytics(institution: Institution, index: number): InstitutionAnalytics {
  const conferencePapers = institution.researchOutputs.filter(
    (output) => output.type === 'Conference Paper'
  ).length;
  const citations = institution.researchOutputs.reduce(
    (sum, output) => sum + (output.citations ?? 0),
    0
  );
  const totalFunding =
    institution.funding.reduce((sum, entry) => sum + entry.amount, 0) +
    institution.grants.reduce((sum, entry) => sum + entry.amount, 0);
  const activeGrants = institution.grants.filter((grant) => grant.year >= 2024).length;

  return {
    institutionId: institution.said,
    researchOutputs: institution.researchOutputs.length,
    publications: institution.researchOutputs.length + institution.publications.length,
    citations,
    hIndex: 40 + (index % 15) * 2,
    journalsConnected: institution.journals.length,
    conferencePapers,
    datasetsPublished: institution.datasets.length,
    activeProjects: 40 + index * 2,
    completedProjects: 200 + index * 8,
    activeGrants,
    totalFunding,
    researchers: institution.researchers.length,
    internationalPartners: institution.partnerships.length,
    collaborations: 80 + index * 4,
    publicationTrend: publicationTrendFor(index),
  };
}

function buildRelationships(institution: Institution, index: number): InstitutionRelationships {
  return {
    projects: sliceRotate(PROJECT_POOL, index, 4),
    publications: institution.publications,
    manuscripts: sliceRotate(MANUSCRIPT_POOL, index, 3),
    datasets: institution.datasets,
    journals: institution.journals,
    conferences: institution.conferences,
    researchers: institution.researchers,
    grants: institution.grants.map((grant) => ({
      id: grant.id,
      title: grant.source,
      detail: `${grant.type} · ${grant.year}`,
    })),
    partners: institution.partnerships,
  };
}

function makeInstitution(index: number, overrides: Partial<Institution>): Institution {
  const base: Institution = {
    said: `SAID-INST-${String(index).padStart(4, '0')}`,
    logo: '🏛️',
    country: 'United Kingdom',
    profile: profileFor({}),
    campuses: [],
    faculties: [],
    schools: [],
    departments: [],
    researchCentres: [],
    laboratories: [],
    administrativeUnits: [],
    statistics: { ...DEFAULT_STATISTICS },
    rankings: [],
    accreditations: [],
    researchOutputs: [],
    publications: [],
    journals: [],
    conferences: [],
    datasets: [],
    researchers: [],
    grants: [],
    funding: [],
    partnerships: [],
    memberships: [],
    contacts: [],
    timeline: [],
    analytics: {
      institutionId: `SAID-INST-${String(index).padStart(4, '0')}`,
      researchOutputs: 0,
      publications: 0,
      citations: 0,
      hIndex: 0,
      journalsConnected: 0,
      conferencePapers: 0,
      datasetsPublished: 0,
      activeProjects: 0,
      completedProjects: 0,
      activeGrants: 0,
      totalFunding: 0,
      researchers: 0,
      internationalPartners: 0,
      collaborations: 0,
      publicationTrend: [],
    },
    relationships: {
      projects: [],
      publications: [],
      manuscripts: [],
      datasets: [],
      journals: [],
      conferences: [],
      researchers: [],
      grants: [],
      partners: [],
    },
    verificationStatus: 'Verified',
    ...overrides,
  };

  const enriched: Institution = {
    ...base,
    publications: base.publications.length > 0 ? base.publications : sliceRotate(PUBLICATION_POOL, index, 4),
    journals: base.journals.length > 0 ? base.journals : sliceRotate(JOURNAL_POOL, index, 2),
    conferences: base.conferences.length > 0 ? base.conferences : sliceRotate(CONFERENCE_POOL, index, 2),
    datasets: base.datasets.length > 0 ? base.datasets : sliceRotate(DATASET_POOL, index, 3),
    researchers:
      base.researchers.length > 0 ? base.researchers : sliceRotate(RESEARCHER_POOL, index, 5),
    partnerships:
      base.partnerships.length > 0 ? base.partnerships : sliceRotate(PARTNER_POOL, index, 3),
    contacts: base.contacts.length > 0 ? base.contacts : buildContacts(base),
  };

  const analytics: InstitutionAnalytics = { ...buildAnalytics(enriched, index), ...overrides.analytics };
  const relationships: InstitutionRelationships = buildRelationships(enriched, index);

  return { ...enriched, analytics, relationships };
}

export const INSTITUTIONS: Institution[] = [
  makeInstitution(1, {
    logo: '🎓',
    country: 'Nigeria',
    profile: profileFor({
      institutionId: 'INST-UI-001',
      institutionName: 'University of Ibadan',
      shortName: 'UI',
      acronym: 'UI',
      institutionType: 'University',
      country: 'Nigeria',
      stateProvince: 'Oyo',
      city: 'Ibadan',
      website: 'https://www.ui.edu.ng',
      officialEmail: 'registrar@ui.edu.ng',
      officialPhone: '+234 2 810 1100',
      description: 'The premier and oldest university in Nigeria, renowned for research leadership and academic excellence across the humanities, sciences, and medicine.',
      mission: 'To advance knowledge and learning through research, teaching, and community service.',
      history: 'Founded in 1948 as the University College Ibadan, it attained full university status in 1962.',
      accreditation: 'Accredited by the National Universities Commission (NUC) of Nigeria.',
      ranking: 'Ranked among the top universities in Africa.',
      researchAreas: ['Public Health', 'Tropical Medicine', 'African Studies', 'Agriculture'],
      academicDisciplines: ['Medicine', 'Arts', 'Science', 'Agriculture', 'Social Sciences'],
      campusLocations: ['Main Campus'],
      verificationStatus: 'Verified',
      trustScore: 88,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-10', details: 'Government recognition confirmed.' },
        { type: 'Accreditation', status: 'Accredited', verifiedAt: '2025-09-02', details: 'NUC accreditation active.' },
      ],
      faculties: ['Faculty of Science', 'Faculty of Medicine', 'Faculty of Arts', 'Faculty of Social Sciences'],
      schools: ['School of Public Health'],
      colleges: [],
      departments: ['Department of Computer Science', 'Department of Medicine', 'Department of History', 'Department of Economics'],
      researchCentres: ['Institute for Advanced Medical Research', 'Centre for Child and Adolescent Mental Health'],
      institutes: ['Institute of African Studies'],
      libraries: ['Kenneth Dike Library'],
      administrativeUnits: ['Registry', 'Office of the Registrar'],
      campuses: ['Main Campus'],
      affiliations: [],
      studentCount: 48000,
      facultyCount: 3400,
      programCount: 180,
      foundedYear: 1948,
      lastVerifiedAt: '2025-11-10',
    }),
    campuses: [
      {
        id: 'ui-main',
        name: 'Main Campus',
        city: 'Ibadan',
        country: 'Nigeria',
        address: 'Ojoo Road, Ibadan',
        establishedYear: 1948,
        areaHectares: 1030,
        faculties: ['Faculty of Science', 'Faculty of Medicine', 'Faculty of Arts', 'Faculty of Social Sciences'],
        facilities: ['Kenneth Dike Library', 'University Teaching Hospital', 'Sports Centre', 'Botanical Gardens'],
        studentCount: 46000,
        academicStaffCount: 3300,
        coordinates: { latitude: 7.3775, longitude: 3.947 },
      },
    ],
    faculties: [
      { id: 'ui-fac-science', name: 'Faculty of Science', shortName: 'SCI', dean: 'Prof. A. Adeyemi', establishedYear: 1948, departments: ['Department of Computer Science', 'Department of Chemistry', 'Department of Physics'], programmes: ['Computer Science', 'Chemistry', 'Physics'], studentCount: 6000, academicStaffCount: 450, researchFocus: ['Computing', 'Materials Science', 'Theoretical Physics'] },
      { id: 'ui-fac-medicine', name: 'Faculty of Medicine', shortName: 'MED', dean: 'Prof. O. Bello', establishedYear: 1948, departments: ['Department of Medicine', 'Department of Surgery', 'Department of Public Health'], programmes: ['Medicine and Surgery', 'Public Health', 'Nursing'], studentCount: 4500, academicStaffCount: 700, researchFocus: ['Tropical Medicine', 'Infectious Disease', 'Maternal Health'] },
      { id: 'ui-fac-arts', name: 'Faculty of Arts', shortName: 'ART', dean: 'Prof. T. Okonkwo', establishedYear: 1948, departments: ['Department of History', 'Department of English', 'Department of Linguistics'], programmes: ['History', 'English', 'Linguistics'], studentCount: 3200, academicStaffCount: 320, researchFocus: ['African History', 'Linguistics', 'Cultural Studies'] },
      { id: 'ui-fac-social', name: 'Faculty of Social Sciences', shortName: 'SOC', dean: 'Prof. N. Adebayo', establishedYear: 1962, departments: ['Department of Economics', 'Department of Political Science', 'Department of Sociology'], programmes: ['Economics', 'Political Science', 'Sociology'], studentCount: 5000, academicStaffCount: 380, researchFocus: ['Development Economics', 'Governance', 'Social Policy'] },
    ],
    schools: [{ id: 'ui-sch-ph', name: 'School of Public Health', shortName: 'SPH', director: 'Prof. L. Ogunlade', establishedYear: 1970, focusAreas: ['Epidemiology', 'Health Systems', 'Nutrition'], programmeCount: 8, studentCount: 650 }],
    departments: [
      { id: 'ui-dept-cs', name: 'Department of Computer Science', facultyName: 'Faculty of Science', head: 'Dr. K. Falade', establishedYear: 1975, researchAreas: ['Artificial Intelligence', 'Software Engineering'], programmes: ['BSc Computer Science', 'MSc Computer Science'], academicStaffCount: 45, studentCount: 1200, laboratories: ['AI Research Laboratory'] },
      { id: 'ui-dept-med', name: 'Department of Medicine', facultyName: 'Faculty of Medicine', head: 'Prof. E. Okonkwo', establishedYear: 1955, researchAreas: ['Infectious Diseases', 'Cardiology'], programmes: ['MBBS', 'MD Medicine'], academicStaffCount: 210, studentCount: 900, laboratories: ['Clinical Skills Laboratory'] },
      { id: 'ui-dept-history', name: 'Department of History', facultyName: 'Faculty of Arts', head: 'Dr. S. Nwachukwu', establishedYear: 1950, researchAreas: ['African History', 'Colonial Studies'], programmes: ['BA History', 'MA History'], academicStaffCount: 38, studentCount: 700, laboratories: [] },
      { id: 'ui-dept-econ', name: 'Department of Economics', facultyName: 'Faculty of Social Sciences', head: 'Prof. R. Adebisi', establishedYear: 1960, researchAreas: ['Development Economics', 'Econometrics'], programmes: ['BSc Economics', 'MSc Economics'], academicStaffCount: 60, studentCount: 1600, laboratories: ['Econometrics Laboratory'] },
    ],
    researchCentres: [
      { id: 'ui-centre-iamr', name: 'Institute for Advanced Medical Research', acronym: 'IAMR', director: 'Prof. J. Eze', establishedYear: 2001, researchThemes: ['Malaria', 'Tuberculosis', 'Maternal Health'], staffCount: 120, activeProjects: 18, publications: 640, fundingAwarded: 4200000, description: 'Flagship centre for tropical disease research in West Africa.' },
      { id: 'ui-centre-camh', name: 'Centre for Child and Adolescent Mental Health', acronym: 'CAMH', director: 'Dr. B. Adamu', establishedYear: 2008, researchThemes: ['Child Mental Health', 'Adolescent Psychology'], staffCount: 40, activeProjects: 9, publications: 180, fundingAwarded: 900000, description: 'A multidisciplinary centre for youth mental health research.' },
    ],
    laboratories: [
      { id: 'ui-lab-ai', name: 'AI Research Laboratory', departmentName: 'Department of Computer Science', director: 'Dr. K. Falade', establishedYear: 2016, focusAreas: ['Machine Learning', 'NLP', 'Computer Vision'], equipment: ['GPU Cluster', 'High-performance workstations'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'ui-lab-clinical', name: 'Clinical Skills Laboratory', departmentName: 'Department of Medicine', director: 'Prof. E. Okonkwo', establishedYear: 2005, focusAreas: ['Simulation-based Medical Training'], equipment: ['Simulation Mannequins', 'Patient Monitors'], capacity: 60, accessLevel: 'Restricted' },
      { id: 'ui-lab-econ', name: 'Econometrics Laboratory', departmentName: 'Department of Economics', director: 'Prof. R. Adebisi', establishedYear: 2012, focusAreas: ['Applied Econometrics', 'Microsimulation'], equipment: ['Statistical Workstations', 'Survey Software'], capacity: 50, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'ui-admin-registry', name: 'Registry', director: 'Mrs. F. Okafor', responsibilities: ['Student records', 'Examination administration', 'Graduation processing'], staffCount: 180, reportsTo: 'Vice-Chancellor' },
      { id: 'ui-admin-research', name: 'Office of Research Management', director: 'Prof. M. Salami', responsibilities: ['Grant administration', 'Research ethics', 'Research outputs'], staffCount: 45, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 48000, faculty: 3400, staff: 2600, internationalStudents: 2100, alumni: 260000, programmes: 180, faculties: 13, departments: 90, researchCentres: 12, laboratories: 30, campuses: 1, postgraduates: 16000, undergraduates: 32000, acceptanceRate: 12, graduationRate: 78,
    },
    rankings: [
      { id: 'ui-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1503, percentile: 67, region: 'Africa', note: 'Top-ranked Nigerian university in the QS African band.' },
      { id: 'ui-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 950, totalRanked: 31000, region: 'Global' },
      { id: 'ui-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 801, totalRanked: 1904, region: 'Global' },
    ],
    accreditations: [
      { id: 'ui-acc-nuc', body: 'National Universities Commission', country: 'Nigeria', status: 'Accredited', awardedYear: 1962, scope: 'Full institutional accreditation', certification: 'NUC-UI-1962' },
      { id: 'ui-acc-aaup', body: 'Medical and Dental Council of Nigeria', country: 'Nigeria', status: 'Accredited', awardedYear: 1970, scope: 'Medical education programmes' },
    ],
    researchOutputs: [
      { id: 'ui-out-1', title: 'Malaria burden and control in Ibadan, Nigeria', type: 'Journal Article', year: 2025, authors: ['J. Eze', 'B. Adamu'], venue: 'African Journal of Medicine', citations: 14, doi: '10.1000/ui.2025.0001' },
      { id: 'ui-out-2', title: 'Yoruba language modelling for low-resource NLP', type: 'Conference Paper', year: 2024, authors: ['K. Falade', 'T. Okonkwo'], venue: 'AfricaNLP 2024', citations: 9, doi: '10.1000/ui.2024.0002' },
      { id: 'ui-out-3', title: 'Public health surveillance in urban Nigeria', type: 'Journal Article', year: 2024, authors: ['O. Bello', 'L. Ogunlade'], venue: 'Lancet Regional Health', citations: 21, doi: '10.1000/ui.2024.0003' },
      { id: 'ui-out-4', title: 'Tropical medicine open research corpus', type: 'Dataset', year: 2023, authors: ['B. Adamu', 'M. Salami'], venue: 'Scholatia Data Repository', citations: 7, doi: '10.1000/ui.2023.0004' },
      { id: 'ui-out-5', title: 'Decolonising the African university curriculum', type: 'Book', year: 2023, authors: ['S. Nwachukwu'], venue: 'Ibadan University Press', citations: 12, doi: '10.1000/ui.2023.0005' },
    ],
    grants: [
      { id: 'ui-grant-1', source: 'National Research Fund', type: 'Grant', amount: 1200000, currency: 'USD', year: 2025, description: 'Malaria elimination research consortium.' },
      { id: 'ui-grant-2', source: 'Bill & Melinda Gates Foundation', type: 'Philanthropy', amount: 850000, currency: 'USD', year: 2024, description: 'Maternal and child health intervention trial.' },
    ],
    funding: [
      { id: 'ui-fund-1', source: 'TETFund Allocation', type: 'Government Allocation', amount: 52000000, currency: 'USD', year: 2025, description: 'Annual federal education trust fund allocation.' },
      { id: 'ui-fund-2', source: 'Endowment Fund', type: 'Endowment', amount: 15000000, currency: 'USD', year: 2025, description: 'Accumulated institutional endowment.' },
    ],
    partnerships: [
      { id: 'ui-partner-1', title: 'University of Oxford', detail: 'Tropical medicine research partnership' },
      { id: 'ui-partner-2', title: 'University of Cape Town', detail: 'African research network' },
    ],
    memberships: [
      { id: 'ui-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active', description: 'Regional university association.' },
      { id: 'ui-mem-2', organisation: 'Committee of Vice-Chancellors of Nigerian Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
    ],
    timeline: [
      { id: 'ui-time-1', date: '1948', title: 'Founded', detail: 'Established as University College Ibadan.', type: 'Founded' },
      { id: 'ui-time-2', date: '1962', title: 'Full university status', detail: 'Became the University of Ibadan.', type: 'Leadership' },
      { id: 'ui-time-3', date: '2001', title: 'Medical research flagship', detail: 'Institute for Advanced Medical Research launched.', type: 'Research' },
      { id: 'ui-time-4', date: '2016', title: 'AI laboratory opened', detail: 'First academic AI research laboratory in Nigeria.', type: 'Research' },
      { id: 'ui-time-5', date: '2025', title: 'NUC re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(2, {
    logo: '🏫',
    country: 'Nigeria',
    profile: profileFor({
      institutionId: 'INST-UNILAG-002',
      institutionName: 'University of Lagos',
      shortName: 'UNILAG',
      acronym: 'UNILAG',
      institutionType: 'University',
      country: 'Nigeria',
      stateProvince: 'Lagos',
      city: 'Lagos',
      website: 'https://www.unilag.edu.ng',
      officialEmail: 'info@unilag.edu.ng',
      officialPhone: '+234 1 493 8637',
      description: 'A leading federal research university in Nigeria, known for entrepreneurial education, engineering, law, and management sciences.',
      mission: 'To provide a conducive learning environment and promote research-driven national development.',
      history: 'Established in 1962 as a university for the young nation of Nigeria.',
      accreditation: 'Accredited by the National Universities Commission (NUC).',
      ranking: 'Consistently ranked among the top universities in Nigeria and West Africa.',
      researchAreas: ['Engineering', 'Law', 'Management', 'Nanotechnology', 'Energy'],
      academicDisciplines: ['Engineering', 'Law', 'Business', 'Sciences', 'Social Sciences'],
      campusLocations: ['Akoka Campus', 'Idi-Araba Campus'],
      verificationStatus: 'Verified',
      trustScore: 86,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-10-22', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Engineering', 'Faculty of Law', 'Faculty of Management Sciences', 'Faculty of Science'],
      schools: ['School of Postgraduate Studies'],
      colleges: [],
      departments: ['Department of Electrical Engineering', 'Department of Law', 'Department of Business Administration', 'Department of Chemistry'],
      researchCentres: ['Centre for Nanoscience and Nanotechnology', 'Energy Research Centre'],
      institutes: ['Institute of Maritime Studies'],
      libraries: ['University of Lagos Library'],
      administrativeUnits: ['Registry', 'Entrepreneurship Office'],
      campuses: ['Akoka Campus', 'Idi-Araba Campus'],
      affiliations: [],
      studentCount: 55000,
      facultyCount: 4100,
      programCount: 220,
      foundedYear: 1962,
      lastVerifiedAt: '2025-10-22',
    }),
    campuses: [
      { id: 'unilag-akoka', name: 'Akoka Campus', city: 'Lagos', country: 'Nigeria', address: 'Akoka, Yaba, Lagos', establishedYear: 1962, areaHectares: 802, faculties: ['Faculty of Engineering', 'Faculty of Law', 'Faculty of Management Sciences', 'Faculty of Science'], facilities: ['Main Library', 'Sports Centre', 'Entrepreneurship Hub', 'Innovation Park'], studentCount: 51000, academicStaffCount: 3900, coordinates: { latitude: 6.5172, longitude: 3.3889 } },
      { id: 'unilag-idi-araba', name: 'Idi-Araba Campus', city: 'Lagos', country: 'Nigeria', address: 'Idi-Araba, Mushin', establishedYear: 1970, areaHectares: 120, faculties: [], facilities: ['College of Medicine', 'Teaching Hospital'], studentCount: 4000, academicStaffCount: 600, coordinates: { latitude: 6.5105, longitude: 3.3583 } },
    ],
    faculties: [
      { id: 'unilag-fac-eng', name: 'Faculty of Engineering', shortName: 'ENG', dean: 'Prof. D. Okeke', establishedYear: 1964, departments: ['Department of Electrical Engineering', 'Department of Mechanical Engineering', 'Department of Civil Engineering'], programmes: ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'], studentCount: 7000, academicStaffCount: 500, researchFocus: ['Power Systems', 'Robotics', 'Sustainable Energy'] },
      { id: 'unilag-fac-law', name: 'Faculty of Law', shortName: 'LAW', dean: 'Prof. A. Soyinka', establishedYear: 1964, departments: ['Department of Law', 'Department of International Law'], programmes: ['LLB', 'LLM'], studentCount: 3500, academicStaffCount: 220, researchFocus: ['Commercial Law', 'International Law', 'Legal Technology'] },
      { id: 'unilag-fac-mgt', name: 'Faculty of Management Sciences', shortName: 'MGT', dean: 'Prof. C. Obi', establishedYear: 1965, departments: ['Department of Business Administration', 'Department of Accounting'], programmes: ['Business Administration', 'Accounting', 'Finance'], studentCount: 6500, academicStaffCount: 400, researchFocus: ['Entrepreneurship', 'Corporate Governance', 'Fintech'] },
      { id: 'unilag-fac-sci', name: 'Faculty of Science', shortName: 'SCI', dean: 'Prof. H. Uzo', establishedYear: 1962, departments: ['Department of Chemistry', 'Department of Physics', 'Department of Computer Science'], programmes: ['Chemistry', 'Physics', 'Computer Science'], studentCount: 5500, academicStaffCount: 480, researchFocus: ['Nanotechnology', 'Materials Science', 'Data Science'] },
    ],
    schools: [{ id: 'unilag-sch-pg', name: 'School of Postgraduate Studies', shortName: 'SPGS', director: 'Prof. E. Eze', establishedYear: 1968, focusAreas: ['Doctoral Training', 'Professional Masters'], programmeCount: 140, studentCount: 12000 }],
    departments: [
      { id: 'unilag-dept-ee', name: 'Department of Electrical Engineering', facultyName: 'Faculty of Engineering', head: 'Dr. P. Adepoju', establishedYear: 1964, researchAreas: ['Power Electronics', 'Renewable Energy'], programmes: ['BSc Electrical Engineering', 'MSc Power Systems'], academicStaffCount: 85, studentCount: 2200, laboratories: ['Power Systems Laboratory', 'Embedded Systems Laboratory'] },
      { id: 'unilag-dept-law', name: 'Department of Law', facultyName: 'Faculty of Law', head: 'Prof. R. Adeola', establishedYear: 1964, researchAreas: ['Commercial Law', 'Human Rights'], programmes: ['LLB', 'LLM'], academicStaffCount: 90, studentCount: 1500, laboratories: [] },
      { id: 'unilag-dept-ba', name: 'Department of Business Administration', facultyName: 'Faculty of Management Sciences', head: 'Dr. M. Nwosu', establishedYear: 1965, researchAreas: ['Entrepreneurship', 'Marketing'], programmes: ['BSc Business Administration', 'MBA'], academicStaffCount: 70, studentCount: 2600, laboratories: [] },
      { id: 'unilag-dept-chem', name: 'Department of Chemistry', facultyName: 'Faculty of Science', head: 'Prof. I. Akpan', establishedYear: 1962, researchAreas: ['Nanotechnology', 'Analytical Chemistry'], programmes: ['BSc Chemistry', 'MSc Chemistry'], academicStaffCount: 75, studentCount: 1800, laboratories: ['Nanomaterials Laboratory', 'Analytical Chemistry Laboratory'] },
    ],
    researchCentres: [
      { id: 'unilag-centre-nano', name: 'Centre for Nanoscience and Nanotechnology', acronym: 'CNN', director: 'Prof. I. Akpan', establishedYear: 2010, researchThemes: ['Nanomaterials', 'Drug Delivery', 'Sensors'], staffCount: 80, activeProjects: 15, publications: 520, fundingAwarded: 3800000, description: 'West Africa leading nanoscience research centre.' },
      { id: 'unilag-centre-energy', name: 'Energy Research Centre', acronym: 'ERC', director: 'Dr. P. Adepoju', establishedYear: 2013, researchThemes: ['Renewable Energy', 'Smart Grids'], staffCount: 60, activeProjects: 12, publications: 310, fundingAwarded: 2500000, description: 'Interdisciplinary energy systems research.' },
    ],
    laboratories: [
      { id: 'unilag-lab-power', name: 'Power Systems Laboratory', departmentName: 'Department of Electrical Engineering', director: 'Dr. P. Adepoju', establishedYear: 1985, focusAreas: ['Grid Stability', 'Microgrids'], equipment: ['Simulation Software', 'Power Analysers'], capacity: 45, accessLevel: 'Restricted' },
      { id: 'unilag-lab-nano', name: 'Nanomaterials Laboratory', departmentName: 'Department of Chemistry', director: 'Prof. I. Akpan', establishedYear: 2010, focusAreas: ['Synthesis', 'Characterisation'], equipment: ['SEM', 'XRD', 'Sputter Coater'], capacity: 25, accessLevel: 'Restricted' },
      { id: 'unilag-lab-embedded', name: 'Embedded Systems Laboratory', departmentName: 'Department of Electrical Engineering', director: 'Dr. K. Ogunleye', establishedYear: 2016, focusAreas: ['IoT', 'Robotics'], equipment: ['FPGA Boards', 'Microcontrollers'], capacity: 40, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'unilag-admin-reg', name: 'Registry', director: 'Mr. S. Adebayo', responsibilities: ['Admissions', 'Examinations', 'Records'], staffCount: 200, reportsTo: 'Registrar' },
      { id: 'unilag-admin-ent', name: 'Entrepreneurship Office', director: 'Dr. C. Obi', responsibilities: ['Startup incubation', 'Industry partnerships'], staffCount: 30, reportsTo: 'Deputy Vice-Chancellor' },
    ],
    statistics: {
      students: 55000, faculty: 4100, staff: 3200, internationalStudents: 1500, alumni: 300000, programmes: 220, faculties: 12, departments: 85, researchCentres: 10, laboratories: 28, campuses: 2, postgraduates: 18000, undergraduates: 37000, acceptanceRate: 10, graduationRate: 76,
    },
    rankings: [
      { id: 'unilag-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1503, percentile: 67, region: 'Africa' },
      { id: 'unilag-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 1200, totalRanked: 31000, region: 'Global' },
      { id: 'unilag-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 1201, totalRanked: 1904, region: 'Global' },
    ],
    accreditations: [
      { id: 'unilag-acc-nuc', body: 'National Universities Commission', country: 'Nigeria', status: 'Accredited', awardedYear: 1962, scope: 'Full institutional accreditation', certification: 'NUC-UNILAG-1962' },
      { id: 'unilag-acc-eng', body: 'Council for the Regulation of Engineering in Nigeria', country: 'Nigeria', status: 'Accredited', awardedYear: 1966, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'unilag-out-1', title: 'Nanotechnology-enabled drug delivery systems', type: 'Journal Article', year: 2025, authors: ['I. Akpan', 'P. Adepoju'], venue: 'Journal of Nanoscience', citations: 18, doi: '10.1000/unilag.2025.0001' },
      { id: 'unilag-out-2', title: 'Smart grid integration in West African megacities', type: 'Conference Paper', year: 2024, authors: ['P. Adepoju', 'D. Okeke'], venue: 'IEEE PES Africa 2024', citations: 6, doi: '10.1000/unilag.2024.0002' },
      { id: 'unilag-out-3', title: 'Entrepreneurship education and youth employment in Lagos', type: 'Journal Article', year: 2024, authors: ['C. Obi', 'M. Nwosu'], venue: 'African Journal of Business', citations: 11, doi: '10.1000/unilag.2024.0003' },
      { id: 'unilag-out-4', title: 'Lagos urban energy consumption dataset', type: 'Dataset', year: 2023, authors: ['K. Ogunleye'], venue: 'Scholatia Data Repository', citations: 4, doi: '10.1000/unilag.2023.0004' },
      { id: 'unilag-out-5', title: 'Legal technology and the Nigerian justice system', type: 'Report', year: 2023, authors: ['A. Soyinka'], venue: 'Institute Working Paper Series', citations: 8, doi: '10.1000/unilag.2023.0005' },
    ],
    grants: [
      { id: 'unilag-grant-1', source: 'National Research Fund', type: 'Grant', amount: 950000, currency: 'USD', year: 2025, description: 'Nanomaterials for water purification.' },
      { id: 'unilag-grant-2', source: 'World Bank', type: 'Grant', amount: 2100000, currency: 'USD', year: 2024, description: 'Innovation and entrepreneurship capacity building.' },
    ],
    funding: [
      { id: 'unilag-fund-1', source: 'TETFund Allocation', type: 'Government Allocation', amount: 61000000, currency: 'USD', year: 2025, description: 'Annual federal education trust fund allocation.' },
      { id: 'unilag-fund-2', source: 'Lagos State Government', type: 'Government Allocation', amount: 12000000, currency: 'USD', year: 2025, description: 'State infrastructure support.' },
    ],
    partnerships: [
      { id: 'unilag-partner-1', title: 'MIT', detail: 'Innovation collaboration' },
      { id: 'unilag-partner-2', title: 'University of Cape Town', detail: 'African research network' },
    ],
    memberships: [
      { id: 'unilag-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
      { id: 'unilag-mem-2', organisation: 'African Research Universities Alliance', role: 'Candidate Member', sinceYear: 2020, status: 'Pending' },
    ],
    timeline: [
      { id: 'unilag-time-1', date: '1962', title: 'Founded', detail: 'Established as a federal university in Lagos.', type: 'Founded' },
      { id: 'unilag-time-2', date: '1970', title: 'Medical college campus', detail: 'Idi-Araba campus and College of Medicine opened.', type: 'Campus' },
      { id: 'unilag-time-3', date: '2010', title: 'Nanoscience centre', detail: 'Centre for Nanoscience and Nanotechnology launched.', type: 'Research' },
      { id: 'unilag-time-4', date: '2016', title: 'Innovation park', detail: 'Entrepreneurship hub and innovation park opened.', type: 'Research' },
      { id: 'unilag-time-5', date: '2025', title: 'NUC re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(3, {
    logo: '🦉',
    country: 'Nigeria',
    profile: profileFor({
      institutionId: 'INST-OAU-003',
      institutionName: 'Obafemi Awolowo University',
      shortName: 'OAU',
      acronym: 'OAU',
      institutionType: 'University',
      country: 'Nigeria',
      stateProvince: 'Osun',
      city: 'Ile-Ife',
      website: 'https://www.oauife.edu.ng',
      officialEmail: 'vc@oauife.edu.ng',
      officialPhone: '+234 803 555 7281',
      description: 'A federal research university set in the historic city of Ile-Ife, celebrated for its natural environment, engineering, agriculture, and humanities scholarship.',
      mission: 'To promote learning, research, and service through a well-structured and humane university community.',
      history: 'Founded in 1961 as the University of Ife; renamed Obafemi Awolowo University in 1987.',
      accreditation: 'Accredited by the National Universities Commission (NUC).',
      ranking: 'Among the leading universities in Nigeria and West Africa.',
      researchAreas: ['Computer Science', 'Agriculture', 'African Art', 'Electrical Engineering'],
      academicDisciplines: ['Engineering', 'Agriculture', 'Arts', 'Science', 'Law'],
      campusLocations: ['Main Campus'],
      verificationStatus: 'Verified',
      trustScore: 85,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-09-14', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Technology', 'Faculty of Agriculture', 'Faculty of Arts', 'Faculty of Law'],
      schools: ['School of Postgraduate Studies'],
      colleges: [],
      departments: ['Department of Computer Science and Engineering', 'Department of Agriculture', 'Department of English', 'Department of Law'],
      researchCentres: ['Centre for Energy Research and Development', 'African Studies Centre'],
      institutes: ['Institute of Cultural Studies'],
      libraries: ['Hezekiah Oluwasanmi Library'],
      administrativeUnits: ['Registry', 'Planning and Budgeting Unit'],
      campuses: ['Main Campus'],
      affiliations: [],
      studentCount: 35000,
      facultyCount: 2800,
      programCount: 140,
      foundedYear: 1961,
      lastVerifiedAt: '2025-09-14',
    }),
    campuses: [
      { id: 'oau-main', name: 'Main Campus', city: 'Ile-Ife', country: 'Nigeria', address: 'Ile-Ife, Osun State', establishedYear: 1961, areaHectares: 1131, faculties: ['Faculty of Technology', 'Faculty of Agriculture', 'Faculty of Arts', 'Faculty of Law'], facilities: ['Hezekiah Oluwasanmi Library', 'Great Ife Hall', 'Zoological Garden', 'Staff School'], studentCount: 34000, academicStaffCount: 2700, coordinates: { latitude: 7.5, longitude: 4.55 } },
    ],
    faculties: [
      { id: 'oau-fac-tech', name: 'Faculty of Technology', shortName: 'TECH', dean: 'Prof. B. Adegoke', establishedYear: 1971, departments: ['Department of Computer Science and Engineering', 'Department of Electronic and Electrical Engineering'], programmes: ['Computer Engineering', 'Electronic Engineering'], studentCount: 4500, academicStaffCount: 350, researchFocus: ['Artificial Intelligence', 'Embedded Systems'] },
      { id: 'oau-fac-agri', name: 'Faculty of Agriculture', shortName: 'AGR', dean: 'Prof. S. Balogun', establishedYear: 1961, departments: ['Department of Agriculture', 'Department of Agricultural Economics'], programmes: ['Agriculture', 'Agricultural Economics'], studentCount: 3000, academicStaffCount: 280, researchFocus: ['Crop Science', 'Food Security'] },
      { id: 'oau-fac-arts', name: 'Faculty of Arts', shortName: 'ART', dean: 'Prof. F. Akinwumi', establishedYear: 1961, departments: ['Department of English', 'Department of History', 'Department of Fine Arts'], programmes: ['English', 'History', 'Fine Arts'], studentCount: 2800, academicStaffCount: 260, researchFocus: ['Ife Art School', 'Yoruba Studies'] },
      { id: 'oau-fac-law', name: 'Faculty of Law', shortName: 'LAW', dean: 'Prof. G. Adebayo', establishedYear: 1962, departments: ['Department of Law'], programmes: ['LLB', 'LLM'], studentCount: 1800, academicStaffCount: 140, researchFocus: ['Constitutional Law', 'Jurisprudence'] },
    ],
    schools: [{ id: 'oau-sch-pg', name: 'School of Postgraduate Studies', shortName: 'SPGS', director: 'Prof. W. Ojo', establishedYear: 1970, focusAreas: ['Doctoral Training', 'Research Methods'], programmeCount: 110, studentCount: 9000 }],
    departments: [
      { id: 'oau-dept-cse', name: 'Department of Computer Science and Engineering', facultyName: 'Faculty of Technology', head: 'Dr. A. Oladipo', establishedYear: 1985, researchAreas: ['Machine Learning', 'Software Engineering'], programmes: ['BSc Computer Engineering', 'MSc Artificial Intelligence'], academicStaffCount: 55, studentCount: 1800, laboratories: ['Intelligent Systems Laboratory'] },
      { id: 'oau-dept-agri', name: 'Department of Agriculture', facultyName: 'Faculty of Agriculture', head: 'Dr. R. Adewale', establishedYear: 1961, researchAreas: ['Crop Improvement', 'Soil Science'], programmes: ['BSc Agriculture', 'MSc Agronomy'], academicStaffCount: 90, studentCount: 1500, laboratories: ['Soil Science Laboratory'] },
      { id: 'oau-dept-english', name: 'Department of English', facultyName: 'Faculty of Arts', head: 'Prof. K. Adesina', establishedYear: 1961, researchAreas: ['African Literature', 'Linguistics'], programmes: ['BA English', 'MA Literature'], academicStaffCount: 45, studentCount: 900, laboratories: [] },
      { id: 'oau-dept-law', name: 'Department of Law', facultyName: 'Faculty of Law', head: 'Prof. G. Adebayo', establishedYear: 1962, researchAreas: ['Constitutional Law', 'Human Rights'], programmes: ['LLB', 'LLM'], academicStaffCount: 60, studentCount: 1200, laboratories: [] },
    ],
    researchCentres: [
      { id: 'oau-centre-erd', name: 'Centre for Energy Research and Development', acronym: 'CERD', director: 'Prof. T. Fagbenle', establishedYear: 1990, researchThemes: ['Solar Energy', 'Biomass', 'Energy Efficiency'], staffCount: 70, activeProjects: 14, publications: 460, fundingAwarded: 2200000, description: 'National energy research and testing centre.' },
      { id: 'oau-centre-asc', name: 'African Studies Centre', acronym: 'ASC', director: 'Prof. F. Akinwumi', establishedYear: 1978, researchThemes: ['African Art', 'Cultural Heritage'], staffCount: 25, activeProjects: 6, publications: 190, fundingAwarded: 500000, description: 'Home of the renowned Ife Art School.' },
    ],
    laboratories: [
      { id: 'oau-lab-isl', name: 'Intelligent Systems Laboratory', departmentName: 'Department of Computer Science and Engineering', director: 'Dr. A. Oladipo', establishedYear: 2015, focusAreas: ['Machine Learning', 'Computer Vision'], equipment: ['GPU Workstations', 'Data Servers'], capacity: 35, accessLevel: 'Restricted' },
      { id: 'oau-lab-soil', name: 'Soil Science Laboratory', departmentName: 'Department of Agriculture', director: 'Dr. R. Adewale', establishedYear: 1965, focusAreas: ['Soil Analysis', 'Agronomy'], equipment: ['Spectrophotometers', 'Centrifuges'], capacity: 30, accessLevel: 'Open' },
      { id: 'oau-lab-ee', name: 'Electronics Laboratory', departmentName: 'Department of Computer Science and Engineering', director: 'Dr. O. Fadipe', establishedYear: 1987, focusAreas: ['Embedded Systems', 'IoT'], equipment: ['Oscilloscopes', 'FPGA Kits'], capacity: 50, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'oau-admin-reg', name: 'Registry', director: 'Mr. B. Oyekanmi', responsibilities: ['Records', 'Examinations', 'Graduation'], staffCount: 150, reportsTo: 'Registrar' },
      { id: 'oau-admin-plan', name: 'Planning and Budgeting Unit', director: 'Dr. N. Oke', responsibilities: ['Institutional planning', 'Budget management'], staffCount: 25, reportsTo: 'Vice-Chancellor' },
    ],
    statistics: {
      students: 35000, faculty: 2800, staff: 2300, internationalStudents: 1200, alumni: 210000, programmes: 140, faculties: 12, departments: 78, researchCentres: 8, laboratories: 22, campuses: 1, postgraduates: 11000, undergraduates: 24000, acceptanceRate: 14, graduationRate: 79,
    },
    rankings: [
      { id: 'oau-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1201, totalRanked: 1503, region: 'Africa' },
      { id: 'oau-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 1600, totalRanked: 31000, region: 'Global' },
      { id: 'oau-rank-nupr-2025', source: 'Nigeria University Ranking', year: 2025, category: 'Research Output', rank: 4, totalRanked: 220, region: 'Nigeria' },
    ],
    accreditations: [
      { id: 'oau-acc-nuc', body: 'National Universities Commission', country: 'Nigeria', status: 'Accredited', awardedYear: 1962, scope: 'Full institutional accreditation', certification: 'NUC-OAU-1962' },
      { id: 'oau-acc-eng', body: 'Council for the Regulation of Engineering in Nigeria', country: 'Nigeria', status: 'Accredited', awardedYear: 1975, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'oau-out-1', title: 'Ife bronzes and the history of African art', type: 'Book', year: 2025, authors: ['F. Akinwumi'], venue: 'OAU Press', citations: 22, doi: '10.1000/oau.2025.0001' },
      { id: 'oau-out-2', title: 'Solar-powered microgrids for rural Nigeria', type: 'Journal Article', year: 2024, authors: ['T. Fagbenle', 'B. Adegoke'], venue: 'Renewable Energy Journal', citations: 16, doi: '10.1000/oau.2024.0002' },
      { id: 'oau-out-3', title: 'Yoruba text-to-speech synthesis', type: 'Conference Paper', year: 2024, authors: ['A. Oladipo', 'K. Adesina'], venue: 'AfricaNLP 2024', citations: 10, doi: '10.1000/oau.2024.0003' },
      { id: 'oau-out-4', title: 'West African crop yields open dataset', type: 'Dataset', year: 2023, authors: ['R. Adewale'], venue: 'Scholatia Data Repository', citations: 9, doi: '10.1000/oau.2023.0004' },
      { id: 'oau-out-5', title: 'Constitutional reform and federalism in Nigeria', type: 'Journal Article', year: 2023, authors: ['G. Adebayo'], venue: 'Journal of African Law', citations: 13, doi: '10.1000/oau.2023.0005' },
    ],
    grants: [
      { id: 'oau-grant-1', source: 'African Development Bank', type: 'Grant', amount: 1500000, currency: 'USD', year: 2025, description: 'Solar energy deployment in rural communities.' },
      { id: 'oau-grant-2', source: 'National Research Fund', type: 'Grant', amount: 700000, currency: 'USD', year: 2024, description: 'Low-resource African language technologies.' },
    ],
    funding: [
      { id: 'oau-fund-1', source: 'TETFund Allocation', type: 'Government Allocation', amount: 43000000, currency: 'USD', year: 2025, description: 'Annual federal education trust fund allocation.' },
      { id: 'oau-fund-2', source: 'Alumni Endowment', type: 'Endowment', amount: 9000000, currency: 'USD', year: 2025, description: 'Great Ife alumni endowment fund.' },
    ],
    partnerships: [
      { id: 'oau-partner-1', title: 'University of Ghana', detail: 'West African network' },
      { id: 'oau-partner-2', title: 'University of Cambridge', detail: 'Academic exchange' },
    ],
    memberships: [
      { id: 'oau-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
      { id: 'oau-mem-2', organisation: 'International Association of Universities', role: 'Member', sinceYear: 1965, status: 'Active' },
    ],
    timeline: [
      { id: 'oau-time-1', date: '1961', title: 'Founded', detail: 'Established as the University of Ife.', type: 'Founded' },
      { id: 'oau-time-2', date: '1987', title: 'Renamed', detail: 'Renamed Obafemi Awolowo University.', type: 'Leadership' },
      { id: 'oau-time-3', date: '1990', title: 'Energy centre launched', detail: 'Centre for Energy Research and Development established.', type: 'Research' },
      { id: 'oau-time-4', date: '2015', title: 'AI laboratory opened', detail: 'Intelligent Systems Laboratory launched.', type: 'Research' },
      { id: 'oau-time-5', date: '2024', title: 'National research ranking', detail: 'Ranked fourth nationally for research output.', type: 'Ranking' },
    ],
  }),

  makeInstitution(4, {
    logo: '🏟️',
    country: 'Nigeria',
    profile: profileFor({
      institutionId: 'INST-ABU-004',
      institutionName: 'Ahmadu Bello University',
      shortName: 'ABU',
      acronym: 'ABU',
      institutionType: 'University',
      country: 'Nigeria',
      stateProvince: 'Kaduna',
      city: 'Zaria',
      website: 'https://www.abu.edu.ng',
      officialEmail: 'info@abu.edu.ng',
      officialPhone: '+234 69 552 100',
      description: 'The largest university in Sub-Saharan Africa, with a strong tradition in agriculture, veterinary medicine, engineering, and the applied sciences.',
      mission: 'To advance knowledge and improve the quality of life through teaching, research, and extension services.',
      history: 'Established in 1962 as the Ahmadu Bello University, named after the Sardauna of Sokoto.',
      accreditation: 'Accredited by the National Universities Commission (NUC).',
      ranking: 'Ranked among the leading universities in Nigeria.',
      researchAreas: ['Agriculture', 'Veterinary Medicine', 'Engineering', 'Pharmaceutical Sciences'],
      academicDisciplines: ['Agriculture', 'Medicine', 'Engineering', 'Sciences', 'Social Sciences'],
      campusLocations: ['Samaru Campus', 'Kongo Campus'],
      verificationStatus: 'Verified',
      trustScore: 84,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-08-30', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Agriculture', 'Faculty of Veterinary Medicine', 'Faculty of Engineering', 'Faculty of Pharmaceutical Sciences'],
      schools: ['School of Postgraduate Studies'],
      colleges: [],
      departments: ['Department of Animal Science', 'Department of Veterinary Medicine', 'Department of Mechanical Engineering', 'Department of Pharmacy'],
      researchCentres: ['Centre for Dryland Agriculture', 'National Agricultural Extension Research Centre'],
      institutes: ['Institute for Agricultural Research'],
      libraries: ['Kashim Ibrahim Library'],
      administrativeUnits: ['Registry', 'Academic Planning Unit'],
      campuses: ['Samaru Campus', 'Kongo Campus'],
      affiliations: [],
      studentCount: 60000,
      facultyCount: 4800,
      programCount: 250,
      foundedYear: 1962,
      lastVerifiedAt: '2025-08-30',
    }),
    campuses: [
      { id: 'abu-samaru', name: 'Samaru Campus', city: 'Zaria', country: 'Nigeria', address: 'Samaru, Zaria', establishedYear: 1962, areaHectares: 7030, faculties: ['Faculty of Agriculture', 'Faculty of Veterinary Medicine', 'Faculty of Engineering', 'Faculty of Pharmaceutical Sciences'], facilities: ['Kashim Ibrahim Library', 'Teaching Hospital', 'Botanical Gardens', 'Livestock Farm'], studentCount: 52000, academicStaffCount: 4300, coordinates: { latitude: 11.1541, longitude: 7.6494 } },
      { id: 'abu-kongo', name: 'Kongo Campus', city: 'Zaria', country: 'Nigeria', address: 'Kongo, Zaria', establishedYear: 1965, areaHectares: 320, faculties: [], facilities: ['Faculty of Social Sciences', 'Business School'], studentCount: 8000, academicStaffCount: 700, coordinates: { latitude: 11.0964, longitude: 7.7123 } },
    ],
    faculties: [
      { id: 'abu-fac-agri', name: 'Faculty of Agriculture', shortName: 'AGR', dean: 'Prof. M. Lawal', establishedYear: 1962, departments: ['Department of Animal Science', 'Department of Crop Science'], programmes: ['Agriculture', 'Animal Science'], studentCount: 6000, academicStaffCount: 420, researchFocus: ['Dryland Agriculture', 'Livestock Systems'] },
      { id: 'abu-fac-vet', name: 'Faculty of Veterinary Medicine', shortName: 'VET', dean: 'Prof. Y. Mohammed', establishedYear: 1962, departments: ['Department of Veterinary Medicine'], programmes: ['Veterinary Medicine'], studentCount: 2500, academicStaffCount: 300, researchFocus: ['Veterinary Public Health', 'Animal Disease Control'] },
      { id: 'abu-fac-eng', name: 'Faculty of Engineering', shortName: 'ENG', dean: 'Prof. I. Suleiman', establishedYear: 1964, departments: ['Department of Mechanical Engineering', 'Department of Civil Engineering'], programmes: ['Mechanical Engineering', 'Civil Engineering'], studentCount: 6500, academicStaffCount: 460, researchFocus: ['Mechanical Design', 'Water Resources'] },
      { id: 'abu-fac-pharm', name: 'Faculty of Pharmaceutical Sciences', shortName: 'PHARM', dean: 'Prof. Z. Usman', establishedYear: 1968, departments: ['Department of Pharmacy'], programmes: ['Pharmacy'], studentCount: 3200, academicStaffCount: 280, researchFocus: ['Pharmaceutical Microbiology', 'Natural Products'] },
    ],
    schools: [{ id: 'abu-sch-pg', name: 'School of Postgraduate Studies', shortName: 'SPGS', director: 'Prof. H. Abubakar', establishedYear: 1972, focusAreas: ['Postgraduate Training', 'Research'], programmeCount: 190, studentCount: 16000 }],
    departments: [
      { id: 'abu-dept-anim', name: 'Department of Animal Science', facultyName: 'Faculty of Agriculture', head: 'Dr. S. Bello', establishedYear: 1962, researchAreas: ['Livestock Nutrition', 'Breeding'], programmes: ['BSc Animal Science', 'MSc Animal Science'], academicStaffCount: 60, studentCount: 1800, laboratories: ['Animal Nutrition Laboratory'] },
      { id: 'abu-dept-vet', name: 'Department of Veterinary Medicine', facultyName: 'Faculty of Veterinary Medicine', head: 'Prof. Y. Mohammed', establishedYear: 1962, researchAreas: ['Veterinary Epidemiology', 'Zoonoses'], programmes: ['DVM', 'MSc Veterinary Science'], academicStaffCount: 120, studentCount: 1600, laboratories: ['Clinical Pathology Laboratory'] },
      { id: 'abu-dept-mech', name: 'Department of Mechanical Engineering', facultyName: 'Faculty of Engineering', head: 'Dr. U. Garba', establishedYear: 1964, researchAreas: ['Thermofluids', 'Design'], programmes: ['BSc Mechanical Engineering', 'MSc Mechanical Engineering'], academicStaffCount: 80, studentCount: 2500, laboratories: ['Thermofluids Laboratory'] },
      { id: 'abu-dept-pharm', name: 'Department of Pharmacy', facultyName: 'Faculty of Pharmaceutical Sciences', head: 'Prof. Z. Usman', establishedYear: 1968, researchAreas: ['Pharmaceutical Microbiology', 'Pharmacognosy'], programmes: ['PharmD', 'MSc Pharmacy'], academicStaffCount: 70, studentCount: 1800, laboratories: ['Pharmaceutics Laboratory'] },
    ],
    researchCentres: [
      { id: 'abu-centre-cda', name: 'Centre for Dryland Agriculture', acronym: 'CDA', director: 'Prof. M. Lawal', establishedYear: 2012, researchThemes: ['Climate Resilience', 'Soil Fertility', 'Water Management'], staffCount: 90, activeProjects: 20, publications: 480, fundingAwarded: 5600000, description: 'A World Bank-supported centre of excellence for dryland research.' },
      { id: 'abu-centre-naer', name: 'National Agricultural Extension Research Centre', acronym: 'NAERC', director: 'Dr. S. Bello', establishedYear: 1966, researchThemes: ['Extension Services', 'Rural Innovation'], staffCount: 120, activeProjects: 12, publications: 260, fundingAwarded: 1800000, description: 'National agricultural extension and liaison services.' },
    ],
    laboratories: [
      { id: 'abu-lab-nutr', name: 'Animal Nutrition Laboratory', departmentName: 'Department of Animal Science', director: 'Dr. S. Bello', establishedYear: 1970, focusAreas: ['Feed Analysis', 'Rumen Studies'], equipment: ['Digestion Apparatus', 'Analytical Balances'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'abu-lab-path', name: 'Clinical Pathology Laboratory', departmentName: 'Department of Veterinary Medicine', director: 'Prof. Y. Mohammed', establishedYear: 1965, focusAreas: ['Diagnostic Pathology', 'Microbiology'], equipment: ['Microscopes', 'Autoclaves'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'abu-lab-thermo', name: 'Thermofluids Laboratory', departmentName: 'Department of Mechanical Engineering', director: 'Dr. U. Garba', establishedYear: 1972, focusAreas: ['Heat Transfer', 'Fluid Mechanics'], equipment: ['Wind Tunnels', 'Heat Exchangers'], capacity: 45, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'abu-admin-reg', name: 'Registry', director: 'Mr. A. Bello', responsibilities: ['Admissions', 'Records', 'Examinations'], staffCount: 220, reportsTo: 'Registrar' },
      { id: 'abu-admin-acad', name: 'Academic Planning Unit', director: 'Dr. F. Ibrahim', responsibilities: ['Programme planning', 'Quality assurance'], staffCount: 30, reportsTo: 'Deputy Vice-Chancellor (Academic)' },
    ],
    statistics: {
      students: 60000, faculty: 4800, staff: 3800, internationalStudents: 1800, alumni: 320000, programmes: 250, faculties: 15, departments: 105, researchCentres: 12, laboratories: 35, campuses: 2, postgraduates: 19000, undergraduates: 41000, acceptanceRate: 9, graduationRate: 74,
    },
    rankings: [
      { id: 'abu-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1401, totalRanked: 1503, region: 'Africa' },
      { id: 'abu-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 2200, totalRanked: 31000, region: 'Global' },
      { id: 'abu-rank-agri-2025', source: 'Center for World University Rankings', year: 2025, category: 'Agriculture', rank: 800, totalRanked: 20000, region: 'Global' },
    ],
    accreditations: [
      { id: 'abu-acc-nuc', body: 'National Universities Commission', country: 'Nigeria', status: 'Accredited', awardedYear: 1962, scope: 'Full institutional accreditation', certification: 'NUC-ABU-1962' },
      { id: 'abu-acc-vet', body: 'Veterinary Council of Nigeria', country: 'Nigeria', status: 'Accredited', awardedYear: 1965, scope: 'Veterinary medicine programmes' },
    ],
    researchOutputs: [
      { id: 'abu-out-1', title: 'Climate-resilient maize varieties for the Sahel', type: 'Journal Article', year: 2025, authors: ['M. Lawal', 'S. Bello'], venue: 'Field Crops Research', citations: 20, doi: '10.1000/abu.2025.0001' },
      { id: 'abu-out-2', title: 'Rift Valley fever surveillance in northern Nigeria', type: 'Journal Article', year: 2024, authors: ['Y. Mohammed'], venue: 'Veterinary Sciences', citations: 11, doi: '10.1000/abu.2024.0002' },
      { id: 'abu-out-3', title: 'Dryland soil and hydrology dataset', type: 'Dataset', year: 2024, authors: ['R. Bako'], venue: 'Scholatia Data Repository', citations: 6, doi: '10.1000/abu.2024.0003' },
      { id: 'abu-out-4', title: 'Solar pumping for smallholder irrigation', type: 'Conference Paper', year: 2023, authors: ['U. Garba', 'I. Suleiman'], venue: 'ICERD 2023', citations: 7, doi: '10.1000/abu.2023.0004' },
      { id: 'abu-out-5', title: 'Traditional medicines from the Nigerian pharmacopoeia', type: 'Report', year: 2023, authors: ['Z. Usman'], venue: 'Pharmaceutical Research Report', citations: 5, doi: '10.1000/abu.2023.0005' },
    ],
    grants: [
      { id: 'abu-grant-1', source: 'World Bank Africa Centres of Excellence', type: 'Grant', amount: 6000000, currency: 'USD', year: 2025, description: 'Dryland agriculture centre of excellence.' },
      { id: 'abu-grant-2', source: 'National Research Fund', type: 'Grant', amount: 820000, currency: 'USD', year: 2024, description: 'Veterinary public health programme.' },
    ],
    funding: [
      { id: 'abu-fund-1', source: 'TETFund Allocation', type: 'Government Allocation', amount: 55000000, currency: 'USD', year: 2025, description: 'Annual federal education trust fund allocation.' },
      { id: 'abu-fund-2', source: 'Farm Revenue', type: 'Tuition', amount: 15000000, currency: 'USD', year: 2025, description: 'Agricultural estate and farm income.' },
    ],
    partnerships: [
      { id: 'abu-partner-1', title: 'Makerere University', detail: 'East African network' },
      { id: 'abu-partner-2', title: 'University of Nairobi', detail: 'Agricultural research alliance' },
    ],
    memberships: [
      { id: 'abu-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
      { id: 'abu-mem-2', organisation: 'African Research Universities Alliance', role: 'Member', sinceYear: 2016, status: 'Active' },
    ],
    timeline: [
      { id: 'abu-time-1', date: '1962', title: 'Founded', detail: 'Established as Ahmadu Bello University, Zaria.', type: 'Founded' },
      { id: 'abu-time-2', date: '1965', title: 'Kongo campus opened', detail: 'Second campus established in Zaria.', type: 'Campus' },
      { id: 'abu-time-3', date: '2012', title: 'Dryland centre', detail: 'Centre for Dryland Agriculture launched with World Bank support.', type: 'Research' },
      { id: 'abu-time-4', date: '2016', title: 'ARUA membership', detail: 'Joined the African Research Universities Alliance.', type: 'Partnership' },
      { id: 'abu-time-5', date: '2025', title: 'NUC re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(5, {
    logo: '💠',
    country: 'Nigeria',
    profile: profileFor({
      institutionId: 'INST-CU-005',
      institutionName: 'Covenant University',
      shortName: 'CU',
      acronym: 'CU',
      institutionType: 'University',
      country: 'Nigeria',
      stateProvince: 'Ogun',
      city: 'Ota',
      website: 'https://www.covenantuniversity.edu.ng',
      officialEmail: 'info@covenantuniversity.edu.ng',
      officialPhone: '+234 908 322 6446',
      description: 'A private Christian university with a strong reputation for engineering, management sciences, and entrepreneurship, known for its serene campus and disciplined learning environment.',
      mission: 'To raise a new generation of leaders through holistic, entrepreneurship-driven education.',
      history: 'Founded in 2002 by the Living Faith Church Worldwide.',
      accreditation: 'Accredited by the National Universities Commission (NUC).',
      ranking: 'Ranked among the top private universities in Nigeria.',
      researchAreas: ['Renewable Energy', 'Entrepreneurship', 'Information Technology', 'Leadership'],
      academicDisciplines: ['Engineering', 'Management Sciences', 'Sciences', 'Social Sciences', 'Law'],
      campusLocations: ['Canaanland Campus'],
      verificationStatus: 'Verified',
      trustScore: 83,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-07-19', details: 'Government recognition confirmed.' },
      ],
      faculties: ['College of Engineering', 'College of Management Sciences', 'College of Science and Technology', 'College of Leadership and Development Studies'],
      schools: ['School of Postgraduate Studies'],
      colleges: [],
      departments: ['Department of Electrical Engineering', 'Department of Economics', 'Department of Computer Science', 'Department of Accounting'],
      researchCentres: ['Centre for Renewable Energy and Sustainable Development', 'Centre for Entrepreneurship'],
      institutes: ['Institute for Leadership Studies'],
      libraries: ['Centre for Learning Resources'],
      administrativeUnits: ['Registry', 'Chancellor Office'],
      campuses: ['Canaanland Campus'],
      affiliations: [],
      studentCount: 15000,
      facultyCount: 1400,
      programCount: 80,
      foundedYear: 2002,
      lastVerifiedAt: '2025-07-19',
    }),
    campuses: [
      { id: 'cu-canaanland', name: 'Canaanland Campus', city: 'Ota', country: 'Nigeria', address: 'Km 10 Idiroko Road, Canaan Land, Ota', establishedYear: 2002, areaHectares: 5000, faculties: ['College of Engineering', 'College of Management Sciences', 'College of Science and Technology', 'College of Leadership and Development Studies'], facilities: ['Centre for Learning Resources', 'Canaanland Sports Complex', 'Chapel', 'Innovation Hub'], studentCount: 15000, academicStaffCount: 1400, coordinates: { latitude: 6.6842, longitude: 3.1824 } },
    ],
    faculties: [
      { id: 'cu-fac-eng', name: 'College of Engineering', shortName: 'ENG', dean: 'Prof. E. Adebayo', establishedYear: 2002, departments: ['Department of Electrical Engineering', 'Department of Mechanical Engineering'], programmes: ['Electrical Engineering', 'Mechanical Engineering'], studentCount: 3200, academicStaffCount: 240, researchFocus: ['Renewable Energy', 'Embedded Systems'] },
      { id: 'cu-fac-mgt', name: 'College of Management Sciences', shortName: 'MGT', dean: 'Prof. K. Ogunyemi', establishedYear: 2002, departments: ['Department of Economics', 'Department of Accounting'], programmes: ['Economics', 'Accounting', 'Business Administration'], studentCount: 4200, academicStaffCount: 260, researchFocus: ['Entrepreneurship', 'Financial Markets'] },
      { id: 'cu-fac-st', name: 'College of Science and Technology', shortName: 'CST', dean: 'Prof. F. Okafor', establishedYear: 2002, departments: ['Department of Computer Science', 'Department of Biological Sciences'], programmes: ['Computer Science', 'Biotechnology'], studentCount: 3800, academicStaffCount: 300, researchFocus: ['Artificial Intelligence', 'Bioinformatics'] },
      { id: 'cu-fac-ld', name: 'College of Leadership and Development Studies', shortName: 'LDS', dean: 'Prof. M. Adewale', establishedYear: 2004, departments: [], programmes: ['Leadership Studies', 'Development Studies'], studentCount: 900, academicStaffCount: 120, researchFocus: ['Leadership Ethics', 'Social Development'] },
    ],
    schools: [{ id: 'cu-sch-pg', name: 'School of Postgraduate Studies', shortName: 'SPGS', director: 'Prof. T. Oyelaran', establishedYear: 2008, focusAreas: ['Masters and Doctoral Training'], programmeCount: 60, studentCount: 3500 }],
    departments: [
      { id: 'cu-dept-ee', name: 'Department of Electrical Engineering', facultyName: 'College of Engineering', head: 'Dr. A. Nwankwo', establishedYear: 2002, researchAreas: ['Power Electronics', 'Solar Energy'], programmes: ['BSc Electrical Engineering', 'MSc Renewable Energy'], academicStaffCount: 55, studentCount: 1500, laboratories: ['Solar Energy Laboratory'] },
      { id: 'cu-dept-econ', name: 'Department of Economics', facultyName: 'College of Management Sciences', head: 'Prof. K. Ogunyemi', establishedYear: 2002, researchAreas: ['Development Economics', 'Monetary Policy'], programmes: ['BSc Economics', 'MSc Economics'], academicStaffCount: 50, studentCount: 1800, laboratories: [] },
      { id: 'cu-dept-cs', name: 'Department of Computer Science', facultyName: 'College of Science and Technology', head: 'Dr. C. Eze', establishedYear: 2002, researchAreas: ['Machine Learning', 'Cybersecurity'], programmes: ['BSc Computer Science', 'MSc Data Science'], academicStaffCount: 60, studentCount: 1900, laboratories: ['Cybersecurity Laboratory'] },
      { id: 'cu-dept-acc', name: 'Department of Accounting', facultyName: 'College of Management Sciences', head: 'Dr. O. Bankole', establishedYear: 2003, researchAreas: ['Corporate Governance', 'Auditing'], programmes: ['BSc Accounting', 'MSc Accounting'], academicStaffCount: 45, studentCount: 1600, laboratories: [] },
    ],
    researchCentres: [
      { id: 'cu-centre-resd', name: 'Centre for Renewable Energy and Sustainable Development', acronym: 'CRESD', director: 'Dr. A. Nwankwo', establishedYear: 2010, researchThemes: ['Solar PV', 'Energy Storage', 'Green Buildings'], staffCount: 50, activeProjects: 10, publications: 300, fundingAwarded: 2100000, description: 'Flagship renewable energy research centre in West Africa.' },
      { id: 'cu-centre-ent', name: 'Centre for Entrepreneurship', acronym: 'CE', director: 'Prof. K. Ogunyemi', establishedYear: 2005, researchThemes: ['Startup Incubation', 'SME Policy'], staffCount: 30, activeProjects: 8, publications: 120, fundingAwarded: 600000, description: 'Entrepreneurship incubation and research.' },
    ],
    laboratories: [
      { id: 'cu-lab-solar', name: 'Solar Energy Laboratory', departmentName: 'Department of Electrical Engineering', director: 'Dr. A. Nwankwo', establishedYear: 2010, focusAreas: ['PV Testing', 'Battery Systems'], equipment: ['Solar Simulator', 'PV Analyzers'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'cu-lab-cyber', name: 'Cybersecurity Laboratory', departmentName: 'Department of Computer Science', director: 'Dr. C. Eze', establishedYear: 2016, focusAreas: ['Penetration Testing', 'Network Security'], equipment: ['Secure Sandboxes', 'Firewall Appliances'], capacity: 40, accessLevel: 'Controlled' },
      { id: 'cu-lab-bio', name: 'Biotechnology Laboratory', departmentName: 'Department of Biological Sciences', director: 'Dr. L. Yusuf', establishedYear: 2008, focusAreas: ['Molecular Biology', 'Genomics'], equipment: ['PCR Machines', 'Sequencers'], capacity: 25, accessLevel: 'Restricted' },
    ],
    administrativeUnits: [
      { id: 'cu-admin-reg', name: 'Registry', director: 'Mrs. B. Adeyemi', responsibilities: ['Admissions', 'Records', 'Examinations'], staffCount: 90, reportsTo: 'Registrar' },
      { id: 'cu-admin-acad', name: 'Academic Planning Unit', director: 'Dr. N. Oyelaran', responsibilities: ['Programme accreditation', 'Curriculum'], staffCount: 20, reportsTo: 'Deputy Vice-Chancellor (Academic)' },
    ],
    statistics: {
      students: 15000, faculty: 1400, staff: 1200, internationalStudents: 900, alumni: 60000, programmes: 80, faculties: 4, departments: 35, researchCentres: 4, laboratories: 14, campuses: 1, postgraduates: 3500, undergraduates: 11500, acceptanceRate: 22, graduationRate: 86,
    },
    rankings: [
      { id: 'cu-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1503, region: 'Africa' },
      { id: 'cu-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 3000, totalRanked: 31000, region: 'Global' },
      { id: 'cu-rank-times-2025', source: 'THE Impact Rankings', year: 2025, category: 'SDG Partnerships', rank: 600, totalRanked: 2152, region: 'Global' },
    ],
    accreditations: [
      { id: 'cu-acc-nuc', body: 'National Universities Commission', country: 'Nigeria', status: 'Accredited', awardedYear: 2002, scope: 'Full institutional accreditation', certification: 'NUC-CU-2002' },
      { id: 'cu-acc-coren', body: 'Council for the Regulation of Engineering in Nigeria', country: 'Nigeria', status: 'Accredited', awardedYear: 2006, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'cu-out-1', title: 'Perovskite solar cell efficiency optimisation', type: 'Journal Article', year: 2025, authors: ['A. Nwankwo', 'E. Adebayo'], venue: 'Journal of Photovoltaics', citations: 24, doi: '10.1000/cu.2025.0001' },
      { id: 'cu-out-2', title: 'Entrepreneurial intentions among African undergraduates', type: 'Journal Article', year: 2024, authors: ['K. Ogunyemi', 'O. Bankole'], venue: 'Journal of African Business', citations: 15, doi: '10.1000/cu.2024.0002' },
      { id: 'cu-out-3', title: 'An open corpus of Nigerian Pidgin speech', type: 'Dataset', year: 2024, authors: ['C. Eze', 'L. Yusuf'], venue: 'Scholatia Data Repository', citations: 8, doi: '10.1000/cu.2024.0003' },
      { id: 'cu-out-4', title: 'Blockchain identity for academic credentials', type: 'Conference Paper', year: 2023, authors: ['C. Eze'], venue: 'IEEE Blockchain 2023', citations: 19, doi: '10.1000/cu.2023.0004' },
      { id: 'cu-out-5', title: 'Sustainable campus design in tropical climates', type: 'Report', year: 2023, authors: ['M. Adewale'], venue: 'Building Research Report', citations: 4, doi: '10.1000/cu.2023.0005' },
    ],
    grants: [
      { id: 'cu-grant-1', source: 'African Development Bank', type: 'Grant', amount: 1200000, currency: 'USD', year: 2025, description: 'Solar mini-grid research programme.' },
      { id: 'cu-grant-2', source: 'National Information Technology Development Agency', type: 'Grant', amount: 400000, currency: 'USD', year: 2024, description: 'Cybersecurity capacity building.' },
    ],
    funding: [
      { id: 'cu-fund-1', source: 'Tuition Income', type: 'Tuition', amount: 68000000, currency: 'USD', year: 2025, description: 'Annual tuition and fees.' },
      { id: 'cu-fund-2', source: 'Living Faith Church Endowment', type: 'Endowment', amount: 25000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
    ],
    partnerships: [
      { id: 'cu-partner-1', title: 'MIT', detail: 'Innovation collaboration' },
      { id: 'cu-partner-2', title: 'National University of Singapore', detail: 'Strategic alliance' },
    ],
    memberships: [
      { id: 'cu-mem-1', organisation: 'Association of Private Universities in Nigeria', role: 'Member', sinceYear: 2002, status: 'Active' },
      { id: 'cu-mem-2', organisation: 'International Association of Universities', role: 'Member', sinceYear: 2006, status: 'Active' },
    ],
    timeline: [
      { id: 'cu-time-1', date: '2002', title: 'Founded', detail: 'Established on Canaanland, Ota.', type: 'Founded' },
      { id: 'cu-time-2', date: '2005', title: 'Entrepreneurship centre', detail: 'Centre for Entrepreneurship launched.', type: 'Research' },
      { id: 'cu-time-3', date: '2010', title: 'Renewable energy centre', detail: 'CRESD established.', type: 'Research' },
      { id: 'cu-time-4', date: '2016', title: 'Cybersecurity lab', detail: 'Cybersecurity laboratory opened.', type: 'Research' },
      { id: 'cu-time-5', date: '2025', title: 'NUC re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(6, {
    logo: '🌍',
    country: 'South Africa',
    profile: profileFor({
      institutionId: 'INST-UCT-006',
      institutionName: 'University of Cape Town',
      shortName: 'UCT',
      acronym: 'UCT',
      institutionType: 'University',
      country: 'South Africa',
      stateProvince: 'Western Cape',
      city: 'Cape Town',
      website: 'https://www.uct.ac.za',
      officialEmail: 'info@uct.ac.za',
      officialPhone: '+27 21 650 9111',
      description: 'The oldest university in South Africa and the leading African university on global rankings, renowned for research in health sciences, economics, and the environment.',
      mission: 'To be the premier research-led university in Africa, contributing to social justice and sustainable development.',
      history: 'Founded in 1829 as the South African College; became the University of Cape Town in 1918.',
      accreditation: 'Accredited by the Council on Higher Education of South Africa.',
      ranking: 'Top-ranked university in Africa across major global rankings.',
      researchAreas: ['Global Health', 'Climate Change', 'Economics', 'Astronomy', 'Biostatistics'],
      academicDisciplines: ['Health Sciences', 'Commerce', 'Science', 'Humanities', 'Engineering'],
      campusLocations: ['Upper Campus', 'Middle Campus', 'Hiddingh Campus'],
      verificationStatus: 'Verified',
      trustScore: 92,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-02', details: 'Government recognition confirmed.' },
        { type: 'Accreditation', status: 'Accredited', verifiedAt: '2025-08-15', details: 'Council on Higher Education accreditation active.' },
      ],
      faculties: ['Faculty of Health Sciences', 'Faculty of Commerce', 'Faculty of Science', 'Faculty of Engineering and the Built Environment'],
      schools: ['Graduate School of Business'],
      colleges: [],
      departments: ['Department of Medicine', 'Department of Economics', 'Department of Computer Science', 'Department of Astronomy'],
      researchCentres: ['Centre for Global Health', 'African Centre for Cities'],
      institutes: ['Institute of Infectious Disease and Molecular Medicine'],
      libraries: ['Chancellor Oppenheimer Library'],
      administrativeUnits: ['Registry', 'Office of Research'],
      campuses: ['Upper Campus', 'Middle Campus', 'Hiddingh Campus'],
      affiliations: [],
      studentCount: 29000,
      facultyCount: 3400,
      programCount: 120,
      foundedYear: 1829,
      lastVerifiedAt: '2025-11-02',
    }),
    campuses: [
      { id: 'uct-upper', name: 'Upper Campus', city: 'Cape Town', country: 'South Africa', address: 'Rondebosch, Cape Town', establishedYear: 1829, areaHectares: 60, faculties: ['Faculty of Science', 'Faculty of Commerce', 'Faculty of Engineering and the Built Environment'], facilities: ['Chancellor Oppenheimer Library', 'Sports Centre', 'Ara Gocher Memorial Gallery'], studentCount: 21000, academicStaffCount: 2600, coordinates: { latitude: -33.9578, longitude: 18.4606 } },
      { id: 'uct-middle', name: 'Middle Campus', city: 'Cape Town', country: 'South Africa', address: 'Cape Town', establishedYear: 1928, areaHectares: 30, faculties: [], facilities: ['Graduate School of Business'], studentCount: 3000, academicStaffCount: 400, coordinates: { latitude: -33.95, longitude: 18.46 } },
      { id: 'uct-hiddingh', name: 'Hiddingh Campus', city: 'Cape Town', country: 'South Africa', address: 'Cape Town', establishedYear: 1918, areaHectares: 10, faculties: [], facilities: ['Faculty of Humanities'], studentCount: 5000, academicStaffCount: 600, coordinates: { latitude: -33.9307, longitude: 18.4156 } },
    ],
    faculties: [
      { id: 'uct-fac-health', name: 'Faculty of Health Sciences', shortName: 'HSC', dean: 'Prof. L. Dlamini', establishedYear: 1912, departments: ['Department of Medicine', 'Department of Public Health'], programmes: ['Medicine', 'Physiotherapy', 'Public Health'], studentCount: 6000, academicStaffCount: 800, researchFocus: ['Global Health', 'Infectious Disease'] },
      { id: 'uct-fac-commerce', name: 'Faculty of Commerce', shortName: 'COM', dean: 'Prof. R. Patel', establishedYear: 1922, departments: ['Department of Economics', 'Department of Finance'], programmes: ['Economics', 'Finance', 'Accounting'], studentCount: 6500, academicStaffCount: 450, researchFocus: ['Development Economics', 'Financial Regulation'] },
      { id: 'uct-fac-science', name: 'Faculty of Science', shortName: 'SCI', dean: 'Prof. M. van der Merwe', establishedYear: 1918, departments: ['Department of Computer Science', 'Department of Astronomy', 'Department of Mathematics'], programmes: ['Computer Science', 'Astronomy', 'Mathematics'], studentCount: 5000, academicStaffCount: 550, researchFocus: ['Astrophysics', 'Machine Learning', 'Climate Science'] },
      { id: 'uct-fac-ebe', name: 'Faculty of Engineering and the Built Environment', shortName: 'EBE', dean: 'Prof. S. Naidoo', establishedYear: 1966, departments: ['Department of Civil Engineering', 'Department of Chemical Engineering'], programmes: ['Civil Engineering', 'Chemical Engineering'], studentCount: 4500, academicStaffCount: 420, researchFocus: ['Water Systems', 'Green Building'] },
    ],
    schools: [{ id: 'uct-sch-gsb', name: 'Graduate School of Business', shortName: 'GSB', director: 'Prof. T. Botha', establishedYear: 1968, focusAreas: ['MBA', 'Executive Education'], programmeCount: 12, studentCount: 1800 }],
    departments: [
      { id: 'uct-dept-med', name: 'Department of Medicine', facultyName: 'Faculty of Health Sciences', head: 'Prof. L. Dlamini', establishedYear: 1912, researchAreas: ['HIV Research', 'Cardiology'], programmes: ['MBChB', 'MSc Medicine'], academicStaffCount: 220, studentCount: 1800, laboratories: ['Infectious Disease Laboratory'] },
      { id: 'uct-dept-econ', name: 'Department of Economics', facultyName: 'Faculty of Commerce', head: 'Prof. R. Patel', establishedYear: 1922, researchAreas: ['Labour Economics', 'Econometrics'], programmes: ['BEcon', 'MEcon'], academicStaffCount: 90, studentCount: 2600, laboratories: [] },
      { id: 'uct-dept-cs', name: 'Department of Computer Science', facultyName: 'Faculty of Science', head: 'Dr. N. Abrahams', establishedYear: 1970, researchAreas: ['Machine Learning', 'Scientific Computing'], programmes: ['BSc Computer Science', 'MSc Data Science'], academicStaffCount: 100, studentCount: 2200, laboratories: ['ML Research Laboratory'] },
      { id: 'uct-dept-astro', name: 'Department of Astronomy', facultyName: 'Faculty of Science', head: 'Prof. M. van der Merwe', establishedYear: 1972, researchAreas: ['Galactic Astronomy', 'Cosmology'], programmes: ['BSc Astronomy', 'MSc Astrophysics'], academicStaffCount: 40, studentCount: 400, laboratories: [] },
    ],
    researchCentres: [
      { id: 'uct-centre-gh', name: 'Centre for Global Health', acronym: 'CGH', director: 'Prof. L. Dlamini', establishedYear: 2006, researchThemes: ['HIV/AIDS', 'Tuberculosis', 'Health Systems'], staffCount: 110, activeProjects: 22, publications: 780, fundingAwarded: 8200000, description: 'A world-leading centre for infectious disease research.' },
      { id: 'uct-centre-acc', name: 'African Centre for Cities', acronym: 'ACC', director: 'Prof. S. Naidoo', establishedYear: 2008, researchThemes: ['Urban Resilience', 'Informal Settlements'], staffCount: 45, activeProjects: 10, publications: 260, fundingAwarded: 1600000, description: 'Interdisciplinary urban studies centre.' },
    ],
    laboratories: [
      { id: 'uct-lab-id', name: 'Infectious Disease Laboratory', departmentName: 'Department of Medicine', director: 'Prof. L. Dlamini', establishedYear: 2006, focusAreas: ['HIV Virology', 'TB Diagnostics'], equipment: ['Biosafety Cabinets', 'PCR Platforms'], capacity: 35, accessLevel: 'Controlled' },
      { id: 'uct-lab-ml', name: 'ML Research Laboratory', departmentName: 'Department of Computer Science', director: 'Dr. N. Abrahams', establishedYear: 2018, focusAreas: ['Deep Learning', 'NLP'], equipment: ['GPU Clusters', 'Storage Arrays'], capacity: 45, accessLevel: 'Restricted' },
      { id: 'uct-lab-water', name: 'Water Systems Laboratory', departmentName: 'Department of Civil Engineering', director: 'Dr. P. Molefe', establishedYear: 1985, focusAreas: ['Hydrology', 'Water Quality'], equipment: ['Flume', 'Water Quality Analysers'], capacity: 30, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'uct-admin-reg', name: 'Registry', director: 'Mr. D. Botha', responsibilities: ['Student records', 'Examinations'], staffCount: 130, reportsTo: 'Registrar' },
      { id: 'uct-admin-research', name: 'Office of Research', director: 'Prof. A. Gounder', responsibilities: ['Grant management', 'Research contracts'], staffCount: 60, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 29000, faculty: 3400, staff: 2800, internationalStudents: 5200, alumni: 180000, programmes: 120, faculties: 6, departments: 65, researchCentres: 12, laboratories: 40, campuses: 3, postgraduates: 12000, undergraduates: 17000, acceptanceRate: 24, graduationRate: 80,
    },
    rankings: [
      { id: 'uct-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 173, totalRanked: 1503, percentile: 12, region: 'Africa', note: 'Best-ranked university in Africa.' },
      { id: 'uct-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 167, totalRanked: 1904, percentile: 9, region: 'Africa' },
      { id: 'uct-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 201, totalRanked: 1000, percentile: 20, region: 'Global' },
    ],
    accreditations: [
      { id: 'uct-acc-che', body: 'Council on Higher Education', country: 'South Africa', status: 'Accredited', awardedYear: 2002, scope: 'Full institutional accreditation', certification: 'CHE-UCT-2002' },
      { id: 'uct-acc-hpca', body: 'Health Professions Council of South Africa', country: 'South Africa', status: 'Accredited', awardedYear: 1919, scope: 'Health sciences programmes' },
    ],
    researchOutputs: [
      { id: 'uct-out-1', title: 'Cape Town groundwater recharge under climate change', type: 'Journal Article', year: 2025, authors: ['P. Molefe', 'S. Naidoo'], venue: 'Water Resources Research', citations: 26, doi: '10.1000/uct.2025.0001' },
      { id: 'uct-out-2', title: 'Galactic archaeology with the MeerKAT telescope', type: 'Journal Article', year: 2024, authors: ['M. van der Merwe'], venue: 'Monthly Notices of the RAS', citations: 34, doi: '10.1000/uct.2024.0002' },
      { id: 'uct-out-3', title: 'South African health worker mobility dataset', type: 'Dataset', year: 2024, authors: ['L. Dlamini', 'A. Gounder'], venue: 'Scholatia Data Repository', citations: 9, doi: '10.1000/uct.2024.0003' },
      { id: 'uct-out-4', title: 'Labour market transitions in post-apartheid South Africa', type: 'Journal Article', year: 2023, authors: ['R. Patel'], venue: 'Journal of Development Economics', citations: 41, doi: '10.1000/uct.2023.0004' },
      { id: 'uct-out-5', title: 'Multilingual model evaluation for South African languages', type: 'Conference Paper', year: 2023, authors: ['N. Abrahams'], venue: 'EMNLP 2023', citations: 28, doi: '10.1000/uct.2023.0005' },
    ],
    grants: [
      { id: 'uct-grant-1', source: 'Wellcome Trust', type: 'Grant', amount: 4200000, currency: 'USD', year: 2025, description: 'Infectious disease genomics consortium.' },
      { id: 'uct-grant-2', source: 'National Research Foundation', type: 'Grant', amount: 1100000, currency: 'USD', year: 2024, description: 'Astrophysics infrastructure programme.' },
    ],
    funding: [
      { id: 'uct-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 180000000, currency: 'USD', year: 2025, description: 'National higher education allocation.' },
      { id: 'uct-fund-2', source: 'UCT Endowment', type: 'Endowment', amount: 450000000, currency: 'USD', year: 2025, description: 'Historic institutional endowment.' },
    ],
    partnerships: [
      { id: 'uct-partner-1', title: 'University of Oxford', detail: 'Research partnership' },
      { id: 'uct-partner-2', title: 'University of Ibadan', detail: 'African research network' },
    ],
    memberships: [
      { id: 'uct-mem-1', organisation: 'African Research Universities Alliance', role: 'Founding Member', sinceYear: 2015, status: 'Active' },
      { id: 'uct-mem-2', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
    ],
    timeline: [
      { id: 'uct-time-1', date: '1829', title: 'Founded', detail: 'Established as the South African College.', type: 'Founded' },
      { id: 'uct-time-2', date: '1918', title: 'University status', detail: 'Became the University of Cape Town.', type: 'Leadership' },
      { id: 'uct-time-3', date: '2006', title: 'Global health centre', detail: 'Centre for Global Health launched.', type: 'Research' },
      { id: 'uct-time-4', date: '2015', title: 'ARUA founding', detail: 'Co-founded the African Research Universities Alliance.', type: 'Partnership' },
      { id: 'uct-time-5', date: '2025', title: 'Top-ranked in Africa', detail: 'Ranked first in Africa by QS and THE.', type: 'Ranking' },
    ],
  }),

  makeInstitution(7, {
    logo: '🌿',
    country: 'South Africa',
    profile: profileFor({
      institutionId: 'INST-SU-007',
      institutionName: 'Stellenbosch University',
      shortName: 'SU',
      acronym: 'SU',
      institutionType: 'University',
      country: 'South Africa',
      stateProvince: 'Western Cape',
      city: 'Stellenbosch',
      website: 'https://www.sun.ac.za',
      officialEmail: 'info@sun.ac.za',
      officialPhone: '+27 21 808 9111',
      description: 'A leading research university in South Africa, known for its viticulture, engineering, and health sciences, set in the historic Winelands.',
      mission: 'To contribute to the advancement of knowledge and the quality of life through excellent teaching and research.',
      history: 'Founded in 1866 as the Stellenbosch Gymnasium; became Stellenbosch University in 1918.',
      accreditation: 'Accredited by the Council on Higher Education of South Africa.',
      ranking: 'Ranked among the top universities in Africa.',
      researchAreas: ['Viticulture and Oenology', 'Engineering', 'Health Sciences', 'Finance'],
      academicDisciplines: ['Engineering', 'AgriSciences', 'Health Sciences', 'Economic and Management Sciences'],
      campusLocations: ['Stellenbosch Campus', 'Tygerberg Campus'],
      verificationStatus: 'Verified',
      trustScore: 90,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-10-11', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Engineering', 'Faculty of AgriSciences', 'Faculty of Medicine and Health Sciences', 'Faculty of Economic and Management Sciences'],
      schools: ['Business School'],
      colleges: [],
      departments: ['Department of Mechanical Engineering', 'Department of Viticulture and Oenology', 'Department of Health Sciences', 'Department of Finance'],
      researchCentres: ['Stellenbosch Institute for Advanced Study', 'Institute for Wine Biotechnology'],
      institutes: ['Institute for Futures Research'],
      libraries: ['JS Gericke Library'],
      administrativeUnits: ['Registry', 'Division for Research Development'],
      campuses: ['Stellenbosch Campus', 'Tygerberg Campus'],
      affiliations: [],
      studentCount: 32000,
      facultyCount: 3600,
      programCount: 140,
      foundedYear: 1866,
      lastVerifiedAt: '2025-10-11',
    }),
    campuses: [
      { id: 'su-stellenbosch', name: 'Stellenbosch Campus', city: 'Stellenbosch', country: 'South Africa', address: 'Victoria Street, Stellenbosch', establishedYear: 1866, areaHectares: 320, faculties: ['Faculty of Engineering', 'Faculty of AgriSciences', 'Faculty of Economic and Management Sciences'], facilities: ['JS Gericke Library', 'Sports Complex', 'Botanical Garden'], studentCount: 27000, academicStaffCount: 3100, coordinates: { latitude: -33.9321, longitude: 18.8602 } },
      { id: 'su-tygerberg', name: 'Tygerberg Campus', city: 'Cape Town', country: 'South Africa', address: 'Tygerberg, Cape Town', establishedYear: 1970, areaHectares: 40, faculties: ['Faculty of Medicine and Health Sciences'], facilities: ['Tygerberg Teaching Hospital'], studentCount: 5000, academicStaffCount: 800, coordinates: { latitude: -33.8477, longitude: 18.6294 } },
    ],
    faculties: [
      { id: 'su-fac-eng', name: 'Faculty of Engineering', shortName: 'ENG', dean: 'Prof. K. Dlamini', establishedYear: 1944, departments: ['Department of Mechanical Engineering', 'Department of Electrical Engineering'], programmes: ['Mechanical Engineering', 'Electrical Engineering'], studentCount: 4800, academicStaffCount: 420, researchFocus: ['Renewable Energy', 'Mechatronics'] },
      { id: 'su-fac-agri', name: 'Faculty of AgriSciences', shortName: 'AGR', dean: 'Prof. J. van Wyk', establishedYear: 1918, departments: ['Department of Viticulture and Oenology', 'Department of Conservation Ecology'], programmes: ['Viticulture', 'Conservation Ecology'], studentCount: 3500, academicStaffCount: 380, researchFocus: ['Wine Science', 'Biodiversity'] },
      { id: 'su-fac-med', name: 'Faculty of Medicine and Health Sciences', shortName: 'MED', dean: 'Prof. N. Mokoena', establishedYear: 1956, departments: ['Department of Health Sciences', 'Department of Paediatrics'], programmes: ['MBChB', 'Nursing'], studentCount: 4500, academicStaffCount: 900, researchFocus: ['Tuberculosis', 'Maternal Health'] },
      { id: 'su-fac-ems', name: 'Faculty of Economic and Management Sciences', shortName: 'EMS', dean: 'Prof. H. Boshoff', establishedYear: 1918, departments: ['Department of Finance', 'Department of Economics'], programmes: ['Finance', 'Economics', 'Business Management'], studentCount: 6500, academicStaffCount: 480, researchFocus: ['Risk Management', 'Development Finance'] },
    ],
    schools: [{ id: 'su-sch-bus', name: 'Business School', shortName: 'BUS', director: 'Prof. T. Fourie', establishedYear: 2005, focusAreas: ['MBA', 'Executive Education'], programmeCount: 10, studentCount: 1500 }],
    departments: [
      { id: 'su-dept-mech', name: 'Department of Mechanical Engineering', facultyName: 'Faculty of Engineering', head: 'Prof. K. Dlamini', establishedYear: 1944, researchAreas: ['Thermofluids', 'Mechatronics'], programmes: ['BEng Mechanical', 'MEng Mechanical'], academicStaffCount: 85, studentCount: 1800, laboratories: ['Energy Laboratory'] },
      { id: 'su-dept-vit', name: 'Department of Viticulture and Oenology', facultyName: 'Faculty of AgriSciences', head: 'Prof. J. van Wyk', establishedYear: 1920, researchAreas: ['Wine Chemistry', 'Grapevine Physiology'], programmes: ['BSc Viticulture', 'MSc Oenology'], academicStaffCount: 55, studentCount: 900, laboratories: ['Wine Biotechnology Laboratory'] },
      { id: 'su-dept-health', name: 'Department of Health Sciences', facultyName: 'Faculty of Medicine and Health Sciences', head: 'Prof. N. Mokoena', establishedYear: 1956, researchAreas: ['Tuberculosis', 'Community Health'], programmes: ['MBChB', 'MSc Public Health'], academicStaffCount: 180, studentCount: 1900, laboratories: ['TB Research Laboratory'] },
      { id: 'su-dept-fin', name: 'Department of Finance', facultyName: 'Faculty of Economic and Management Sciences', head: 'Prof. H. Boshoff', establishedYear: 1918, researchAreas: ['Corporate Finance', 'Risk Management'], programmes: ['BCom Finance', 'MCom Finance'], academicStaffCount: 70, studentCount: 2400, laboratories: [] },
    ],
    researchCentres: [
      { id: 'su-centre-stias', name: 'Stellenbosch Institute for Advanced Study', acronym: 'STIAS', director: 'Prof. H. Boshoff', establishedYear: 2008, researchThemes: ['Interdisciplinary Scholarship', 'Africa Futures'], staffCount: 30, activeProjects: 12, publications: 320, fundingAwarded: 1800000, description: 'Wallenberg-supported institute for advanced study.' },
      { id: 'su-centre-wbt', name: 'Institute for Wine Biotechnology', acronym: 'IWB', director: 'Prof. J. van Wyk', establishedYear: 1995, researchThemes: ['Yeast Genomics', 'Wine Microbiology'], staffCount: 60, activeProjects: 14, publications: 410, fundingAwarded: 2400000, description: 'World-leading wine biotechnology institute.' },
    ],
    laboratories: [
      { id: 'su-lab-wine', name: 'Wine Biotechnology Laboratory', departmentName: 'Department of Viticulture and Oenology', director: 'Prof. J. van Wyk', establishedYear: 1995, focusAreas: ['Yeast Engineering', 'Fermentation'], equipment: ['Fermenters', 'Genomic Sequencers'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'su-lab-tb', name: 'TB Research Laboratory', departmentName: 'Department of Health Sciences', director: 'Prof. N. Mokoena', establishedYear: 2008, focusAreas: ['Drug Resistance', 'Biomarkers'], equipment: ['Biosafety Cabinets', 'MGIT Systems'], capacity: 25, accessLevel: 'Controlled' },
      { id: 'su-lab-energy', name: 'Energy Laboratory', departmentName: 'Department of Mechanical Engineering', director: 'Prof. K. Dlamini', establishedYear: 2010, focusAreas: ['Solar Thermal', 'Energy Storage'], equipment: ['Solar Simulators', 'Thermal Test Rigs'], capacity: 40, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'su-admin-reg', name: 'Registry', director: 'Mrs. A. van der Merwe', responsibilities: ['Admissions', 'Records'], staffCount: 140, reportsTo: 'Registrar' },
      { id: 'su-admin-research', name: 'Division for Research Development', director: 'Prof. M. van Heerden', responsibilities: ['Research funding', 'Postgraduate support'], staffCount: 55, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 32000, faculty: 3600, staff: 3000, internationalStudents: 4800, alumni: 160000, programmes: 140, faculties: 10, departments: 70, researchCentres: 11, laboratories: 36, campuses: 2, postgraduates: 13000, undergraduates: 19000, acceptanceRate: 28, graduationRate: 82,
    },
    rankings: [
      { id: 'su-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 302, totalRanked: 1503, percentile: 20, region: 'Africa' },
      { id: 'su-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 301, totalRanked: 1904, percentile: 16, region: 'Africa' },
      { id: 'su-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 401, totalRanked: 1000, region: 'Global' },
    ],
    accreditations: [
      { id: 'su-acc-che', body: 'Council on Higher Education', country: 'South Africa', status: 'Accredited', awardedYear: 2002, scope: 'Full institutional accreditation', certification: 'CHE-SU-2002' },
      { id: 'su-acc-eng', body: 'Engineering Council of South Africa', country: 'South Africa', status: 'Accredited', awardedYear: 1945, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'su-out-1', title: 'Genome-wide analysis of wine yeast diversity', type: 'Journal Article', year: 2025, authors: ['J. van Wyk'], venue: 'Applied and Environmental Microbiology', citations: 22, doi: '10.1000/su.2025.0001' },
      { id: 'su-out-2', title: 'Drug-resistant tuberculosis in the Western Cape', type: 'Journal Article', year: 2024, authors: ['N. Mokoena'], venue: 'Lancet Infectious Diseases', citations: 31, doi: '10.1000/su.2024.0002' },
      { id: 'su-out-3', title: 'Cape winelands terroir mapping dataset', type: 'Dataset', year: 2024, authors: ['J. van Wyk', 'P. Botha'], venue: 'Scholatia Data Repository', citations: 7, doi: '10.1000/su.2024.0003' },
      { id: 'su-out-4', title: 'Concentrating solar power in semi-arid regions', type: 'Conference Paper', year: 2023, authors: ['K. Dlamini'], venue: 'SolarPACES 2023', citations: 9, doi: '10.1000/su.2023.0004' },
      { id: 'su-out-5', title: 'Banking regulation and financial inclusion in Africa', type: 'Journal Article', year: 2023, authors: ['H. Boshoff'], venue: 'Journal of Banking and Finance', citations: 18, doi: '10.1000/su.2023.0005' },
    ],
    grants: [
      { id: 'su-grant-1', source: 'Wellcome Trust', type: 'Grant', amount: 2800000, currency: 'USD', year: 2025, description: 'TB drug resistance programme.' },
      { id: 'su-grant-2', source: 'Wallenberg Foundation', type: 'Philanthropy', amount: 1500000, currency: 'USD', year: 2024, description: 'Advanced study fellowship programme.' },
    ],
    funding: [
      { id: 'su-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 140000000, currency: 'USD', year: 2025, description: 'National higher education allocation.' },
      { id: 'su-fund-2', source: 'Research Contracts', type: 'Research Contract', amount: 48000000, currency: 'USD', year: 2025, description: 'Industry and government research contracts.' },
    ],
    partnerships: [
      { id: 'su-partner-1', title: 'ETH Zurich', detail: 'Joint research centre' },
      { id: 'su-partner-2', title: 'University of Cape Town', detail: 'African research network' },
    ],
    memberships: [
      { id: 'su-mem-1', organisation: 'African Research Universities Alliance', role: 'Founding Member', sinceYear: 2015, status: 'Active' },
      { id: 'su-mem-2', organisation: 'Worldwide Universities Network', role: 'Member', sinceYear: 2010, status: 'Active' },
    ],
    timeline: [
      { id: 'su-time-1', date: '1866', title: 'Founded', detail: 'Established as the Stellenbosch Gymnasium.', type: 'Founded' },
      { id: 'su-time-2', date: '1918', title: 'University status', detail: 'Became Stellenbosch University.', type: 'Leadership' },
      { id: 'su-time-3', date: '1995', title: 'Wine biotechnology', detail: 'Institute for Wine Biotechnology established.', type: 'Research' },
      { id: 'su-time-4', date: '2008', title: 'STIAS launched', detail: 'Stellenbosch Institute for Advanced Study opened.', type: 'Research' },
      { id: 'su-time-5', date: '2025', title: 'Top three in Africa', detail: 'Ranked among the top three universities in Africa.', type: 'Ranking' },
    ],
  }),

  makeInstitution(8, {
    logo: '⛏️',
    country: 'South Africa',
    profile: profileFor({
      institutionId: 'INST-WITS-008',
      institutionName: 'University of the Witwatersrand',
      shortName: 'Wits',
      acronym: 'WITS',
      institutionType: 'University',
      country: 'South Africa',
      stateProvince: 'Gauteng',
      city: 'Johannesburg',
      website: 'https://www.wits.ac.za',
      officialEmail: 'info@wits.ac.za',
      officialPhone: '+27 11 717 1000',
      description: 'A research-intensive university in the heart of Johannesburg, known for its strengths in engineering, science, health sciences, and the humanities.',
      mission: 'To be a globally leading research university rooted in Africa.',
      history: 'Founded in 1896 as the South African School of Mines; became the University of the Witwatersrand in 1922.',
      accreditation: 'Accredited by the Council on Higher Education of South Africa.',
      ranking: 'Ranked among the leading universities in Africa.',
      researchAreas: ['Mining Engineering', 'Paleoscience', 'Public Health', 'Data Science'],
      academicDisciplines: ['Engineering', 'Science', 'Health Sciences', 'Commerce', 'Humanities'],
      campusLocations: ['East Campus', 'West Campus', 'Parktown Campus'],
      verificationStatus: 'Verified',
      trustScore: 88,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-09-05', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Engineering and the Built Environment', 'Faculty of Science', 'Faculty of Health Sciences', 'Faculty of Humanities'],
      schools: ['Wits Business School'],
      colleges: [],
      departments: ['Department of Mining Engineering', 'Department of Earth Sciences', 'Department of Public Health', 'Department of Computer Science'],
      researchCentres: ['Wits Institute for Social and Economic Research', 'DSI-NRF Centre of Excellence in Paleosciences'],
      institutes: ['Evolutionary Studies Institute'],
      libraries: ['William Cullen Library'],
      administrativeUnits: ['Registry', 'Office of Research'],
      campuses: ['East Campus', 'West Campus', 'Parktown Campus'],
      affiliations: [],
      studentCount: 40000,
      facultyCount: 4200,
      programCount: 160,
      foundedYear: 1896,
      lastVerifiedAt: '2025-09-05',
    }),
    campuses: [
      { id: 'wits-east', name: 'East Campus', city: 'Johannesburg', country: 'South Africa', address: 'Braamfontein, Johannesburg', establishedYear: 1922, areaHectares: 40, faculties: ['Faculty of Engineering and the Built Environment', 'Faculty of Science'], facilities: ['William Cullen Library', 'Great Hall'], studentCount: 22000, academicStaffCount: 2400, coordinates: { latitude: -26.1914, longitude: 28.0303 } },
      { id: 'wits-west', name: 'West Campus', city: 'Johannesburg', country: 'South Africa', address: 'Johannesburg', establishedYear: 1950, areaHectares: 30, faculties: ['Faculty of Humanities', 'Faculty of Commerce'], facilities: ['Wits Theatre'], studentCount: 14000, academicStaffCount: 1400, coordinates: { latitude: -26.1908, longitude: 28.0214 } },
      { id: 'wits-parktown', name: 'Parktown Campus', city: 'Johannesburg', country: 'South Africa', address: 'Parktown, Johannesburg', establishedYear: 1970, areaHectares: 20, faculties: ['Faculty of Health Sciences'], facilities: ['Charlotte Maxeke Hospital'], studentCount: 4000, academicStaffCount: 900, coordinates: { latitude: -26.1777, longitude: 28.045 } },
    ],
    faculties: [
      { id: 'wits-fac-ebe', name: 'Faculty of Engineering and the Built Environment', shortName: 'EBE', dean: 'Prof. S. Khumalo', establishedYear: 1922, departments: ['Department of Mining Engineering', 'Department of Civil Engineering'], programmes: ['Mining Engineering', 'Civil Engineering'], studentCount: 5000, academicStaffCount: 420, researchFocus: ['Deep Mining', 'Urban Engineering'] },
      { id: 'wits-fac-sci', name: 'Faculty of Science', shortName: 'SCI', dean: 'Prof. D. Makhubu', establishedYear: 1922, departments: ['Department of Earth Sciences', 'Department of Computer Science'], programmes: ['Geology', 'Computer Science'], studentCount: 5200, academicStaffCount: 480, researchFocus: ['Paleoscience', 'Computational Science'] },
      { id: 'wits-fac-health', name: 'Faculty of Health Sciences', shortName: 'HSC', dean: 'Prof. T. Ndlovu', establishedYear: 1940, departments: ['Department of Public Health', 'Department of Medicine'], programmes: ['MBChB', 'Public Health'], studentCount: 5500, academicStaffCount: 800, researchFocus: ['HIV Research', 'Health Systems'] },
      { id: 'wits-fac-hum', name: 'Faculty of Humanities', shortName: 'HUM', dean: 'Prof. E. Mahlangu', establishedYear: 1922, departments: ['Department of History', 'Department of Sociology'], programmes: ['History', 'Sociology'], studentCount: 6500, academicStaffCount: 520, researchFocus: ['Social Justice', 'Urban Studies'] },
    ],
    schools: [{ id: 'wits-sch-bus', name: 'Wits Business School', shortName: 'WBS', director: 'Prof. L. Mncube', establishedYear: 1968, focusAreas: ['MBA', 'Executive Education'], programmeCount: 12, studentCount: 2200 }],
    departments: [
      { id: 'wits-dept-mining', name: 'Department of Mining Engineering', facultyName: 'Faculty of Engineering and the Built Environment', head: 'Prof. S. Khumalo', establishedYear: 1896, researchAreas: ['Deep-Level Mining', 'Mine Safety'], programmes: ['BSc Mining Engineering', 'MSc Mining'], academicStaffCount: 60, studentCount: 900, laboratories: ['Rock Mechanics Laboratory'] },
      { id: 'wits-dept-earth', name: 'Department of Earth Sciences', facultyName: 'Faculty of Science', head: 'Prof. D. Makhubu', establishedYear: 1922, researchAreas: ['Paleontology', 'Geochemistry'], programmes: ['BSc Geology', 'MSc Paleoscience'], academicStaffCount: 70, studentCount: 1400, laboratories: ['Paleo Laboratory'] },
      { id: 'wits-dept-pubhealth', name: 'Department of Public Health', facultyName: 'Faculty of Health Sciences', head: 'Prof. T. Ndlovu', establishedYear: 1970, researchAreas: ['Epidemiology', 'Health Economics'], programmes: ['MPH', 'PhD Public Health'], academicStaffCount: 90, studentCount: 1200, laboratories: [] },
      { id: 'wits-dept-cs', name: 'Department of Computer Science', facultyName: 'Faculty of Science', head: 'Dr. P. Chauke', establishedYear: 1975, researchAreas: ['Machine Learning', 'Human-Computer Interaction'], programmes: ['BSc Computer Science', 'MSc Data Science'], academicStaffCount: 65, studentCount: 1800, laboratories: ['Data Science Laboratory'] },
    ],
    researchCentres: [
      { id: 'wits-centre-wiser', name: 'Wits Institute for Social and Economic Research', acronym: 'WISER', director: 'Prof. E. Mahlangu', establishedYear: 2001, researchThemes: ['Inequality', 'Democracy', 'Urban Life'], staffCount: 50, activeProjects: 9, publications: 240, fundingAwarded: 1100000, description: 'Flagship social science research institute.' },
      { id: 'wits-centre-paleo', name: 'DSI-NRF Centre of Excellence in Paleosciences', acronym: 'CoE', director: 'Prof. D. Makhubu', establishedYear: 2010, researchThemes: ['Human Evolution', 'Hominin Sites'], staffCount: 80, activeProjects: 16, publications: 520, fundingAwarded: 3000000, description: 'Centre of excellence for hominin and paleoscience research.' },
    ],
    laboratories: [
      { id: 'wits-lab-rock', name: 'Rock Mechanics Laboratory', departmentName: 'Department of Mining Engineering', director: 'Prof. S. Khumalo', establishedYear: 1960, focusAreas: ['Seismic Testing', 'Rock Strength'], equipment: ['Triaxial Testing Frames', 'Seismic Sensors'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'wits-lab-paleo', name: 'Paleo Laboratory', departmentName: 'Department of Earth Sciences', director: 'Prof. D. Makhubu', establishedYear: 2010, focusAreas: ['Fossil Preparation', 'Dating'], equipment: ['CT Scanner', 'Preparation Tools'], capacity: 25, accessLevel: 'Restricted' },
      { id: 'wits-lab-ds', name: 'Data Science Laboratory', departmentName: 'Department of Computer Science', director: 'Dr. P. Chauke', establishedYear: 2017, focusAreas: ['Deep Learning', 'NLP'], equipment: ['GPU Servers'], capacity: 40, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'wits-admin-reg', name: 'Registry', director: 'Mr. J. Nkosi', responsibilities: ['Records', 'Examinations'], staffCount: 120, reportsTo: 'Registrar' },
      { id: 'wits-admin-research', name: 'Office of Research', director: 'Prof. A. Sikhosana', responsibilities: ['Grant administration', 'Ethics'], staffCount: 60, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 40000, faculty: 4200, staff: 3400, internationalStudents: 6000, alumni: 210000, programmes: 160, faculties: 5, departments: 75, researchCentres: 14, laboratories: 42, campuses: 3, postgraduates: 16000, undergraduates: 24000, acceptanceRate: 20, graduationRate: 78,
    },
    rankings: [
      { id: 'wits-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 311, totalRanked: 1503, percentile: 21, region: 'Africa' },
      { id: 'wits-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 351, totalRanked: 1904, percentile: 18, region: 'Africa' },
      { id: 'wits-rank-mines-2025', source: 'QS Subject Rankings', year: 2025, category: 'Mining Engineering', rank: 12, totalRanked: 300, region: 'Global' },
    ],
    accreditations: [
      { id: 'wits-acc-che', body: 'Council on Higher Education', country: 'South Africa', status: 'Accredited', awardedYear: 2002, scope: 'Full institutional accreditation', certification: 'CHE-WITS-2002' },
      { id: 'wits-acc-eng', body: 'Engineering Council of South Africa', country: 'South Africa', status: 'Accredited', awardedYear: 1925, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'wits-out-1', title: 'New hominin fossils from the Cradle of Humankind', type: 'Journal Article', year: 2025, authors: ['D. Makhubu'], venue: 'Nature', citations: 58, doi: '10.1000/wits.2025.0001' },
      { id: 'wits-out-2', title: 'Deep mining safety with seismic monitoring', type: 'Journal Article', year: 2024, authors: ['S. Khumalo'], venue: 'International Journal of Rock Mechanics', citations: 15, doi: '10.1000/wits.2024.0002' },
      { id: 'wits-out-3', title: 'Johannesburg inequality panel dataset', type: 'Dataset', year: 2024, authors: ['E. Mahlangu'], venue: 'Scholatia Data Repository', citations: 12, doi: '10.1000/wits.2024.0003' },
      { id: 'wits-out-4', title: 'Health system resilience during pandemics', type: 'Journal Article', year: 2023, authors: ['T. Ndlovu'], venue: 'BMJ Global Health', citations: 27, doi: '10.1000/wits.2023.0004' },
      { id: 'wits-out-5', title: 'Multilingual speech recognition for South African languages', type: 'Conference Paper', year: 2023, authors: ['P. Chauke'], venue: 'Interspeech 2023', citations: 19, doi: '10.1000/wits.2023.0005' },
    ],
    grants: [
      { id: 'wits-grant-1', source: 'National Research Foundation', type: 'Grant', amount: 3200000, currency: 'USD', year: 2025, description: 'Paleoscience centre of excellence.' },
      { id: 'wits-grant-2', source: 'National Institutes of Health', type: 'Grant', amount: 2400000, currency: 'USD', year: 2024, description: 'HIV prevention research unit.' },
    ],
    funding: [
      { id: 'wits-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 160000000, currency: 'USD', year: 2025, description: 'National higher education allocation.' },
      { id: 'wits-fund-2', source: 'Mining Industry Contracts', type: 'Industry', amount: 30000000, currency: 'USD', year: 2025, description: 'Mining research and consulting.' },
    ],
    partnerships: [
      { id: 'wits-partner-1', title: 'University of Oxford', detail: 'Research partnership' },
      { id: 'wits-partner-2', title: 'Harvard University', detail: 'Faculty exchange' },
    ],
    memberships: [
      { id: 'wits-mem-1', organisation: 'African Research Universities Alliance', role: 'Founding Member', sinceYear: 2015, status: 'Active' },
      { id: 'wits-mem-2', organisation: 'Association of Commonwealth Universities', role: 'Member', sinceYear: 1922, status: 'Active' },
    ],
    timeline: [
      { id: 'wits-time-1', date: '1896', title: 'Founded', detail: 'Established as the South African School of Mines.', type: 'Founded' },
      { id: 'wits-time-2', date: '1922', title: 'University status', detail: 'Became the University of the Witwatersrand.', type: 'Leadership' },
      { id: 'wits-time-3', date: '2001', title: 'WISER launched', detail: 'Wits Institute for Social and Economic Research established.', type: 'Research' },
      { id: 'wits-time-4', date: '2010', title: 'Paleoscience centre', detail: 'DSI-NRF Centre of Excellence in Paleosciences launched.', type: 'Research' },
      { id: 'wits-time-5', date: '2025', title: 'Nature publication', detail: 'Hominin fossil discoveries published in Nature.', type: 'Award' },
    ],
  }),

  makeInstitution(9, {
    logo: '🦜',
    country: 'Uganda',
    profile: profileFor({
      institutionId: 'INST-MAK-009',
      institutionName: 'Makerere University',
      shortName: 'Makerere',
      acronym: 'MAK',
      institutionType: 'University',
      country: 'Uganda',
      stateProvince: 'Central Region',
      city: 'Kampala',
      website: 'https://www.mak.ac.ug',
      officialEmail: 'info@mak.ac.ug',
      officialPhone: '+256 414 532 631',
      description: 'One of the oldest and most prestigious universities in East Africa, with a strong tradition in agriculture, medicine, and the humanities.',
      mission: 'To provide quality education and research that transforms society.',
      history: 'Founded in 1922 as the Makerere Technical School; became Makerere University in 1970.',
      accreditation: 'Accredited by the Uganda National Council for Higher Education.',
      ranking: 'Ranked among the leading universities in East Africa.',
      researchAreas: ['Agriculture', 'Infectious Diseases', 'Education', 'Public Policy'],
      academicDisciplines: ['Agriculture', 'Health Sciences', 'Humanities', 'Science', 'Social Sciences'],
      campusLocations: ['Main Campus'],
      verificationStatus: 'Verified',
      trustScore: 86,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-08-12', details: 'Government recognition confirmed.' },
      ],
      faculties: ['College of Health Sciences', 'College of Agricultural and Environmental Sciences', 'College of Humanities and Social Sciences', 'College of Engineering, Design, Art and Technology'],
      schools: ['School of Medicine', 'School of Public Health'],
      colleges: [],
      departments: ['Department of Medicine', 'Department of Agricultural Production', 'Department of Economics', 'Department of Electrical Engineering'],
      researchCentres: ['Makerere University Lung Institute', 'Centre for Health and Population Research'],
      institutes: ['Institute of Public Health'],
      libraries: ['Makerere University Main Library'],
      administrativeUnits: ['Academic Registrar', 'Research and Innovations Office'],
      campuses: ['Main Campus'],
      affiliations: [],
      studentCount: 40000,
      facultyCount: 3000,
      programCount: 180,
      foundedYear: 1922,
      lastVerifiedAt: '2025-08-12',
    }),
    campuses: [
      { id: 'mak-main', name: 'Main Campus', city: 'Kampala', country: 'Uganda', address: 'Plot 80, University Road, Kampala', establishedYear: 1922, areaHectares: 132, faculties: ['College of Health Sciences', 'College of Agricultural and Environmental Sciences', 'College of Humanities and Social Sciences'], facilities: ['Main Library', 'Freedom Square', 'Makerere University Hall'], studentCount: 40000, academicStaffCount: 3000, coordinates: { latitude: 0.3378, longitude: 32.5685 } },
    ],
    faculties: [
      { id: 'mak-fac-health', name: 'College of Health Sciences', shortName: 'CHS', dean: 'Prof. B. Orem', establishedYear: 1924, departments: ['Department of Medicine', 'Department of Public Health'], programmes: ['MBChB', 'Public Health'], studentCount: 6000, academicStaffCount: 700, researchFocus: ['Infectious Disease', 'Maternal Health'] },
      { id: 'mak-fac-agri', name: 'College of Agricultural and Environmental Sciences', shortName: 'CAES', dean: 'Prof. G. Mugisha', establishedYear: 1922, departments: ['Department of Agricultural Production', 'Department of Environmental Management'], programmes: ['Agriculture', 'Environmental Science'], studentCount: 5500, academicStaffCount: 500, researchFocus: ['Food Security', 'Climate Adaptation'] },
      { id: 'mak-fac-hss', name: 'College of Humanities and Social Sciences', shortName: 'CHUSS', dean: 'Prof. S. Kiwanda', establishedYear: 1922, departments: ['Department of Economics', 'Department of History'], programmes: ['Economics', 'History'], studentCount: 7000, academicStaffCount: 520, researchFocus: ['Development Studies', 'African History'] },
      { id: 'mak-fac-cedat', name: 'College of Engineering, Design, Art and Technology', shortName: 'CEDAT', dean: 'Prof. H. Alinaitwe', establishedYear: 1990, departments: ['Department of Electrical Engineering', 'Department of Civil Engineering'], programmes: ['Electrical Engineering', 'Civil Engineering'], studentCount: 4500, academicStaffCount: 380, researchFocus: ['Renewable Energy', 'Transport'] },
    ],
    schools: [
      { id: 'mak-sch-med', name: 'School of Medicine', shortName: 'SOM', director: 'Prof. B. Orem', establishedYear: 1924, focusAreas: ['Medicine', 'Surgery'], programmeCount: 8, studentCount: 2500 },
      { id: 'mak-sch-ph', name: 'School of Public Health', shortName: 'SPH', director: 'Prof. R. Wanyenze', establishedYear: 1980, focusAreas: ['Epidemiology', 'Health Policy'], programmeCount: 10, studentCount: 1200 },
    ],
    departments: [
      { id: 'mak-dept-med', name: 'Department of Medicine', facultyName: 'College of Health Sciences', head: 'Prof. B. Orem', establishedYear: 1924, researchAreas: ['HIV Research', 'Tropical Medicine'], programmes: ['MBChB', 'MSc Medicine'], academicStaffCount: 180, studentCount: 1800, laboratories: ['Clinical Research Laboratory'] },
      { id: 'mak-dept-agri', name: 'Department of Agricultural Production', facultyName: 'College of Agricultural and Environmental Sciences', head: 'Prof. G. Mugisha', establishedYear: 1922, researchAreas: ['Agronomy', 'Soil Science'], programmes: ['BSc Agriculture', 'MSc Agronomy'], academicStaffCount: 90, studentCount: 2000, laboratories: ['Soil Testing Laboratory'] },
      { id: 'mak-dept-econ', name: 'Department of Economics', facultyName: 'College of Humanities and Social Sciences', head: 'Dr. F. Nakabugo', establishedYear: 1965, researchAreas: ['Development Economics', 'Trade'], programmes: ['BA Economics', 'MA Economics'], academicStaffCount: 65, studentCount: 2200, laboratories: [] },
      { id: 'mak-dept-ee', name: 'Department of Electrical Engineering', facultyName: 'College of Engineering, Design, Art and Technology', head: 'Prof. H. Alinaitwe', establishedYear: 1990, researchAreas: ['Power Systems', 'Renewables'], programmes: ['BSc Electrical Engineering', 'MSc Power Systems'], academicStaffCount: 55, studentCount: 1200, laboratories: ['Power Systems Laboratory'] },
    ],
    researchCentres: [
      { id: 'mak-centre-lung', name: 'Makerere University Lung Institute', acronym: 'LI', director: 'Prof. B. Orem', establishedYear: 2012, researchThemes: ['Asthma', 'TB', 'Air Quality'], staffCount: 60, activeProjects: 12, publications: 380, fundingAwarded: 2200000, description: 'Leading respiratory health research centre in East Africa.' },
      { id: 'mak-centre-hpr', name: 'Centre for Health and Population Research', acronym: 'CHPR', director: 'Prof. R. Wanyenze', establishedYear: 1995, researchThemes: ['Demography', 'Reproductive Health'], staffCount: 50, activeProjects: 10, publications: 290, fundingAwarded: 1500000, description: 'Population and health research centre.' },
    ],
    laboratories: [
      { id: 'mak-lab-clinical', name: 'Clinical Research Laboratory', departmentName: 'Department of Medicine', director: 'Prof. B. Orem', establishedYear: 2005, focusAreas: ['Virology', 'Immunology'], equipment: ['Flow Cytometers', 'PCR Systems'], capacity: 30, accessLevel: 'Controlled' },
      { id: 'mak-lab-soil', name: 'Soil Testing Laboratory', departmentName: 'Department of Agricultural Production', director: 'Prof. G. Mugisha', establishedYear: 1980, focusAreas: ['Fertility Analysis', 'Pest Studies'], equipment: ['Spectrophotometers'], capacity: 35, accessLevel: 'Open' },
      { id: 'mak-lab-power', name: 'Power Systems Laboratory', departmentName: 'Department of Electrical Engineering', director: 'Prof. H. Alinaitwe', establishedYear: 1995, focusAreas: ['Microgrids', 'Load Studies'], equipment: ['Power Analysers', 'Simulators'], capacity: 40, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'mak-admin-reg', name: 'Academic Registrar', director: 'Dr. C. Bukenya', responsibilities: ['Admissions', 'Records', 'Graduation'], staffCount: 160, reportsTo: 'Vice-Chancellor' },
      { id: 'mak-admin-research', name: 'Research and Innovations Office', director: 'Prof. V. Nabirye', responsibilities: ['Grant management', 'Innovation support'], staffCount: 40, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 40000, faculty: 3000, staff: 2500, internationalStudents: 2800, alumni: 200000, programmes: 180, faculties: 9, departments: 85, researchCentres: 10, laboratories: 25, campuses: 1, postgraduates: 12000, undergraduates: 28000, acceptanceRate: 15, graduationRate: 75,
    },
    rankings: [
      { id: 'mak-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1503, region: 'Africa' },
      { id: 'mak-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 801, totalRanked: 1904, region: 'Africa' },
      { id: 'mak-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 1800, totalRanked: 31000, region: 'Global' },
    ],
    accreditations: [
      { id: 'mak-acc-nche', body: 'National Council for Higher Education', country: 'Uganda', status: 'Accredited', awardedYear: 2006, scope: 'Full institutional accreditation', certification: 'NCHE-MAK-2006' },
      { id: 'mak-acc-umdc', body: 'Uganda Medical and Dental Council', country: 'Uganda', status: 'Accredited', awardedYear: 1970, scope: 'Medical education programmes' },
    ],
    researchOutputs: [
      { id: 'mak-out-1', title: 'Asthma burden in Ugandan urban communities', type: 'Journal Article', year: 2025, authors: ['B. Orem', 'R. Wanyenze'], venue: 'Journal of Allergy and Clinical Immunology', citations: 14, doi: '10.1000/mak.2025.0001' },
      { id: 'mak-out-2', title: 'Climate-smart maize production in East Africa', type: 'Journal Article', year: 2024, authors: ['G. Mugisha'], venue: 'Agricultural Systems', citations: 18, doi: '10.1000/mak.2024.0002' },
      { id: 'mak-out-3', title: 'Kampala household energy consumption dataset', type: 'Dataset', year: 2024, authors: ['H. Alinaitwe'], venue: 'Scholatia Data Repository', citations: 6, doi: '10.1000/mak.2024.0003' },
      { id: 'mak-out-4', title: 'East African integration and intra-regional trade', type: 'Journal Article', year: 2023, authors: ['F. Nakabugo'], venue: 'Journal of African Economies', citations: 11, doi: '10.1000/mak.2023.0004' },
      { id: 'mak-out-5', title: 'Decolonising the East African curriculum', type: 'Book', year: 2023, authors: ['S. Kiwanda'], venue: 'Fountain Publishers', citations: 9, doi: '10.1000/mak.2023.0005' },
    ],
    grants: [
      { id: 'mak-grant-1', source: 'Wellcome Trust', type: 'Grant', amount: 2600000, currency: 'USD', year: 2025, description: 'Respiratory health research programme.' },
      { id: 'mak-grant-2', source: 'Bill & Melinda Gates Foundation', type: 'Philanthropy', amount: 1800000, currency: 'USD', year: 2024, description: 'Maternal health in East Africa.' },
    ],
    funding: [
      { id: 'mak-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 90000000, currency: 'USD', year: 2025, description: 'Ugandan government university allocation.' },
      { id: 'mak-fund-2', source: 'Development Partners', type: 'Philanthropy', amount: 20000000, currency: 'USD', year: 2025, description: 'Development partner support.' },
    ],
    partnerships: [
      { id: 'mak-partner-1', title: 'University of Oxford', detail: 'Research partnership' },
      { id: 'mak-partner-2', title: 'University of Copenhagen', detail: 'Academic exchange' },
    ],
    memberships: [
      { id: 'mak-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1962, status: 'Active' },
      { id: 'mak-mem-2', organisation: 'Inter-University Council for East Africa', role: 'Member', sinceYear: 1970, status: 'Active' },
    ],
    timeline: [
      { id: 'mak-time-1', date: '1922', title: 'Founded', detail: 'Established as the Makerere Technical School.', type: 'Founded' },
      { id: 'mak-time-2', date: '1970', title: 'University status', detail: 'Became Makerere University.', type: 'Leadership' },
      { id: 'mak-time-3', date: '1995', title: 'Population research', detail: 'Centre for Health and Population Research launched.', type: 'Research' },
      { id: 'mak-time-4', date: '2012', title: 'Lung institute', detail: 'Makerere University Lung Institute established.', type: 'Research' },
      { id: 'mak-time-5', date: '2025', title: 'NCHE re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(10, {
    logo: '🦁',
    country: 'Ghana',
    profile: profileFor({
      institutionId: 'INST-UG-010',
      institutionName: 'University of Ghana',
      shortName: 'UG',
      acronym: 'UG',
      institutionType: 'University',
      country: 'Ghana',
      stateProvince: 'Greater Accra',
      city: 'Legon',
      website: 'https://www.ug.edu.gh',
      officialEmail: 'info@ug.edu.gh',
      officialPhone: '+233 302 213 820',
      description: 'The oldest and largest public university in Ghana, known for its humanities, sciences, and a growing tradition of research excellence.',
      mission: 'To develop world-class human resources and capabilities to meet national and global development needs.',
      history: 'Founded in 1948 as the University College of the Gold Coast; became the University of Ghana in 1961.',
      accreditation: 'Accredited by the Ghana Tertiary Education Commission.',
      ranking: 'Ranked among the top universities in West Africa.',
      researchAreas: ['Public Health', 'Biotechnology', 'Humanities', 'Environmental Science'],
      academicDisciplines: ['Health Sciences', 'Science', 'Humanities', 'Social Sciences', 'Law'],
      campusLocations: ['Legon Campus', 'Korle Bu Campus'],
      verificationStatus: 'Verified',
      trustScore: 87,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-09-28', details: 'Government recognition confirmed.' },
      ],
      faculties: ['College of Health Sciences', 'College of Basic and Applied Sciences', 'College of Humanities', 'School of Law'],
      schools: ['School of Public Health', 'University of Ghana Business School'],
      colleges: [],
      departments: ['Department of Medicine', 'Department of Biochemistry', 'Department of History', 'Department of Law'],
      researchCentres: ['West African Centre for Cell Biology of Infectious Pathogens', 'Centre for Remote Sensing and Geographic Information Systems'],
      institutes: ['Institute of Statistical, Social and Economic Research'],
      libraries: ['Balme Library'],
      administrativeUnits: ['Academic Affairs', 'Office of Research, Innovation and Development'],
      campuses: ['Legon Campus', 'Korle Bu Campus'],
      affiliations: [],
      studentCount: 60000,
      facultyCount: 4200,
      programCount: 240,
      foundedYear: 1948,
      lastVerifiedAt: '2025-09-28',
    }),
    campuses: [
      { id: 'ug-legon', name: 'Legon Campus', city: 'Legon', country: 'Ghana', address: 'Legon, Accra', establishedYear: 1948, areaHectares: 1005, faculties: ['College of Basic and Applied Sciences', 'College of Humanities'], facilities: ['Balme Library', 'Sports Stadium', 'Great Hall'], studentCount: 54000, academicStaffCount: 3900, coordinates: { latitude: 5.6506, longitude: -0.1877 } },
      { id: 'ug-korle-bu', name: 'Korle Bu Campus', city: 'Accra', country: 'Ghana', address: 'Korle Bu, Accra', establishedYear: 1962, areaHectares: 40, faculties: ['College of Health Sciences'], facilities: ['Korle Bu Teaching Hospital'], studentCount: 6000, academicStaffCount: 800, coordinates: { latitude: 5.5387, longitude: -0.2343 } },
    ],
    faculties: [
      { id: 'ug-fac-health', name: 'College of Health Sciences', shortName: 'CHS', dean: 'Prof. K. Kusi', establishedYear: 1962, departments: ['Department of Medicine', 'Department of Public Health'], programmes: ['Medicine', 'Public Health'], studentCount: 7000, academicStaffCount: 900, researchFocus: ['Infectious Disease', 'Maternal Health'] },
      { id: 'ug-fac-cbas', name: 'College of Basic and Applied Sciences', shortName: 'CBAS', dean: 'Prof. E. Quaye', establishedYear: 1948, departments: ['Department of Biochemistry', 'Department of Computer Science'], programmes: ['Biochemistry', 'Computer Science'], studentCount: 8000, academicStaffCount: 700, researchFocus: ['Biotechnology', 'Remote Sensing'] },
      { id: 'ug-fac-hum', name: 'College of Humanities', shortName: 'CH', dean: 'Prof. D. Osafo', establishedYear: 1948, departments: ['Department of History', 'Department of Economics'], programmes: ['History', 'Economics'], studentCount: 9000, academicStaffCount: 650, researchFocus: ['African Studies', 'Development Economics'] },
      { id: 'ug-sch-law', name: 'School of Law', shortName: 'LAW', dean: 'Prof. R. Agyeman', establishedYear: 1958, departments: ['Department of Law'], programmes: ['LLB', 'LLM'], studentCount: 2500, academicStaffCount: 150, researchFocus: ['Constitutional Law', 'Commercial Law'] },
    ],
    schools: [
      { id: 'ug-sch-sph', name: 'School of Public Health', shortName: 'SPH', director: 'Prof. K. Kusi', establishedYear: 1990, focusAreas: ['Epidemiology', 'Health Promotion'], programmeCount: 12, studentCount: 1500 },
      { id: 'ug-sch-ugbs', name: 'University of Ghana Business School', shortName: 'UGBS', director: 'Prof. D. Osafo', establishedYear: 1984, focusAreas: ['MBA', 'Executive Education'], programmeCount: 14, studentCount: 3500 },
    ],
    departments: [
      { id: 'ug-dept-med', name: 'Department of Medicine', facultyName: 'College of Health Sciences', head: 'Prof. K. Kusi', establishedYear: 1962, researchAreas: ['Infectious Disease', 'Cardiology'], programmes: ['MBChB', 'MSc Medicine'], academicStaffCount: 200, studentCount: 2000, laboratories: ['Infectious Disease Laboratory'] },
      { id: 'ug-dept-biochem', name: 'Department of Biochemistry', facultyName: 'College of Basic and Applied Sciences', head: 'Prof. E. Quaye', establishedYear: 1952, researchAreas: ['Cell Biology', 'Pathogens'], programmes: ['BSc Biochemistry', 'MSc Cell Biology'], academicStaffCount: 85, studentCount: 2200, laboratories: ['Cell Biology Laboratory'] },
      { id: 'ug-dept-hist', name: 'Department of History', facultyName: 'College of Humanities', head: 'Prof. D. Osafo', establishedYear: 1948, researchAreas: ['African History', 'Heritage'], programmes: ['BA History', 'MA History'], academicStaffCount: 60, studentCount: 1500, laboratories: [] },
      { id: 'ug-dept-law', name: 'Department of Law', facultyName: 'School of Law', head: 'Prof. R. Agyeman', establishedYear: 1958, researchAreas: ['Constitutional Law', 'Human Rights'], programmes: ['LLB', 'LLM'], academicStaffCount: 70, studentCount: 1600, laboratories: [] },
    ],
    researchCentres: [
      { id: 'ug-centre-accbip', name: 'West African Centre for Cell Biology of Infectious Pathogens', acronym: 'WACCBIP', director: 'Prof. E. Quaye', establishedYear: 2014, researchThemes: ['Infectious Disease', 'Genomics', 'Drug Discovery'], staffCount: 100, activeProjects: 24, publications: 620, fundingAwarded: 6800000, description: 'World Bank-supported centre of excellence for infectious disease research.' },
      { id: 'ug-centre-rsgis', name: 'Centre for Remote Sensing and Geographic Information Systems', acronym: 'CERSGIS', director: 'Prof. A. Boateng', establishedYear: 1995, researchThemes: ['Earth Observation', 'Land Use'], staffCount: 40, activeProjects: 8, publications: 180, fundingAwarded: 900000, description: 'National geospatial research and services centre.' },
    ],
    laboratories: [
      { id: 'ug-lab-inf', name: 'Infectious Disease Laboratory', departmentName: 'Department of Medicine', director: 'Prof. K. Kusi', establishedYear: 2014, focusAreas: ['Genomics', 'Immunology'], equipment: ['Sequencers', 'Flow Cytometers'], capacity: 35, accessLevel: 'Controlled' },
      { id: 'ug-lab-cell', name: 'Cell Biology Laboratory', departmentName: 'Department of Biochemistry', director: 'Prof. E. Quaye', establishedYear: 2010, focusAreas: ['Pathogen Biology', 'Molecular Biology'], equipment: ['Confocal Microscopes', 'PCR Systems'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'ug-lab-gis', name: 'Geospatial Laboratory', departmentName: 'Centre for Remote Sensing and GIS', director: 'Prof. A. Boateng', establishedYear: 1995, focusAreas: ['Satellite Imagery', 'Land Monitoring'], equipment: ['GIS Workstations', 'Remote Sensing Software'], capacity: 40, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'ug-admin-acad', name: 'Academic Affairs', director: 'Dr. P. Amegatcher', responsibilities: ['Admissions', 'Records'], staffCount: 180, reportsTo: 'Registrar' },
      { id: 'ug-admin-research', name: 'Office of Research, Innovation and Development', director: 'Prof. N. Oduro', responsibilities: ['Grants', 'Innovation'], staffCount: 55, reportsTo: 'Vice-Chancellor' },
    ],
    statistics: {
      students: 60000, faculty: 4200, staff: 3600, internationalStudents: 4500, alumni: 280000, programmes: 240, faculties: 6, departments: 95, researchCentres: 13, laboratories: 38, campuses: 2, postgraduates: 17000, undergraduates: 43000, acceptanceRate: 11, graduationRate: 76,
    },
    rankings: [
      { id: 'ug-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1503, region: 'Africa' },
      { id: 'ug-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 801, totalRanked: 1904, region: 'Africa' },
      { id: 'ug-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 1500, totalRanked: 31000, region: 'Global' },
    ],
    accreditations: [
      { id: 'ug-acc-gtec', body: 'Ghana Tertiary Education Commission', country: 'Ghana', status: 'Accredited', awardedYear: 2004, scope: 'Full institutional accreditation', certification: 'GTEC-UG-2004' },
      { id: 'ug-acc-gmc', body: 'Medical and Dental Council of Ghana', country: 'Ghana', status: 'Accredited', awardedYear: 1962, scope: 'Medical education programmes' },
    ],
    researchOutputs: [
      { id: 'ug-out-1', title: 'Genomic epidemiology of malaria in West Africa', type: 'Journal Article', year: 2025, authors: ['E. Quaye', 'K. Kusi'], venue: 'Nature Communications', citations: 25, doi: '10.1000/ug.2025.0001' },
      { id: 'ug-out-2', title: 'Land cover change in the Greater Accra region', type: 'Journal Article', year: 2024, authors: ['A. Boateng'], venue: 'Remote Sensing of Environment', citations: 17, doi: '10.1000/ug.2024.0002' },
      { id: 'ug-out-3', title: 'Accra urban land use dataset', type: 'Dataset', year: 2024, authors: ['A. Boateng', 'N. Oduro'], venue: 'Scholatia Data Repository', citations: 8, doi: '10.1000/ug.2024.0003' },
      { id: 'ug-out-4', title: 'Ghanaian cocoa value chains and rural livelihoods', type: 'Journal Article', year: 2023, authors: ['D. Osafo'], venue: 'World Development', citations: 21, doi: '10.1000/ug.2023.0004' },
      { id: 'ug-out-5', title: 'Twi language resources for speech technology', type: 'Conference Paper', year: 2023, authors: ['E. Quaye', 'R. Agyeman'], venue: 'AfricaNLP 2023', citations: 12, doi: '10.1000/ug.2023.0005' },
    ],
    grants: [
      { id: 'ug-grant-1', source: 'World Bank Africa Centres of Excellence', type: 'Grant', amount: 6800000, currency: 'USD', year: 2025, description: 'Infectious pathogen cell biology centre.' },
      { id: 'ug-grant-2', source: 'National Institutes of Health', type: 'Grant', amount: 2100000, currency: 'USD', year: 2024, description: 'Malaria vaccine development studies.' },
    ],
    funding: [
      { id: 'ug-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 120000000, currency: 'USD', year: 2025, description: 'Ghanaian government allocation.' },
      { id: 'ug-fund-2', source: 'Book and Research Fund', type: 'Government Allocation', amount: 18000000, currency: 'USD', year: 2025, description: 'Research book and research allowance fund.' },
    ],
    partnerships: [
      { id: 'ug-partner-1', title: 'University of Oxford', detail: 'Research partnership' },
      { id: 'ug-partner-2', title: 'Obafemi Awolowo University', detail: 'West African network' },
    ],
    memberships: [
      { id: 'ug-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1948, status: 'Active' },
      { id: 'ug-mem-2', organisation: 'Association of Commonwealth Universities', role: 'Member', sinceYear: 1948, status: 'Active' },
    ],
    timeline: [
      { id: 'ug-time-1', date: '1948', title: 'Founded', detail: 'Established as the University College of the Gold Coast.', type: 'Founded' },
      { id: 'ug-time-2', date: '1961', title: 'University status', detail: 'Became the University of Ghana.', type: 'Leadership' },
      { id: 'ug-time-3', date: '2014', title: 'WACCBIP launched', detail: 'World Bank centre of excellence for infectious pathogens.', type: 'Research' },
      { id: 'ug-time-4', date: '2018', title: 'Balme Library upgrade', detail: 'Major library modernisation completed.', type: 'Campus' },
      { id: 'ug-time-5', date: '2025', title: 'GTEC re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(11, {
    logo: '🏙️',
    country: 'Kenya',
    profile: profileFor({
      institutionId: 'INST-UON-011',
      institutionName: 'University of Nairobi',
      shortName: 'UoN',
      acronym: 'UON',
      institutionType: 'University',
      country: 'Kenya',
      stateProvince: 'Nairobi',
      city: 'Nairobi',
      website: 'https://www.uonbi.ac.ke',
      officialEmail: 'info@uonbi.ac.ke',
      officialPhone: '+254 20 491 0000',
      description: 'The largest and oldest university in Kenya, with strengths in medicine, engineering, and the sciences, at the heart of East Africa.',
      mission: 'To provide quality education and research for national and regional development.',
      history: 'Founded in 1970 from the Royal Technical College established in 1956.',
      accreditation: 'Accredited by the Commission for University Education of Kenya.',
      ranking: 'Ranked among the leading universities in East Africa.',
      researchAreas: ['Public Health', 'Engineering', 'Environmental Science', 'Veterinary Medicine'],
      academicDisciplines: ['Health Sciences', 'Engineering', 'Science', 'Agriculture', 'Humanities'],
      campusLocations: ['Main Campus', 'Chiromo Campus', 'Kikuyu Campus'],
      verificationStatus: 'Verified',
      trustScore: 85,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-08-03', details: 'Government recognition confirmed.' },
      ],
      faculties: ['Faculty of Health Sciences', 'Faculty of Engineering', 'Faculty of Science and Technology', 'Faculty of Agriculture'],
      schools: ['School of Law', 'School of Business'],
      colleges: [],
      departments: ['Department of Medicine', 'Department of Civil Engineering', 'Department of Mathematics', 'Department of Veterinary Medicine'],
      researchCentres: ['Centre for Biotechnology and Bioinformatics', 'Wangari Maathai Institute for Peace and Environmental Studies'],
      institutes: ['Institute of Tropical and Infectious Diseases'],
      libraries: ['Jomo Kenyatta Memorial Library'],
      administrativeUnits: ['Registry', 'Office of Research and Innovation'],
      campuses: ['Main Campus', 'Chiromo Campus', 'Kikuyu Campus'],
      affiliations: [],
      studentCount: 55000,
      facultyCount: 3800,
      programCount: 200,
      foundedYear: 1970,
      lastVerifiedAt: '2025-08-03',
    }),
    campuses: [
      { id: 'uon-main', name: 'Main Campus', city: 'Nairobi', country: 'Kenya', address: 'University Way, Nairobi', establishedYear: 1970, areaHectares: 25, faculties: ['Faculty of Health Sciences', 'Faculty of Engineering'], facilities: ['Jomo Kenyatta Memorial Library', 'Taifa Hall'], studentCount: 30000, academicStaffCount: 2200, coordinates: { latitude: -1.2811, longitude: 36.8162 } },
      { id: 'uon-chiromo', name: 'Chiromo Campus', city: 'Nairobi', country: 'Kenya', address: 'Riverside Drive, Nairobi', establishedYear: 1972, areaHectares: 40, faculties: ['Faculty of Science and Technology'], facilities: ['Chiromo Laboratories'], studentCount: 15000, academicStaffCount: 1100, coordinates: { latitude: -1.2696, longitude: 36.8109 } },
      { id: 'uon-kikuyu', name: 'Kikuyu Campus', city: 'Kikuyu', country: 'Kenya', address: 'Kikuyu', establishedYear: 1980, areaHectares: 300, faculties: ['Faculty of Agriculture'], facilities: ['Field Station'], studentCount: 10000, academicStaffCount: 700, coordinates: { latitude: -1.25, longitude: 36.6667 } },
    ],
    faculties: [
      { id: 'uon-fac-health', name: 'Faculty of Health Sciences', shortName: 'HS', dean: 'Prof. F. Mwangi', establishedYear: 1967, departments: ['Department of Medicine', 'Department of Public Health'], programmes: ['MBChB', 'Public Health'], studentCount: 6000, academicStaffCount: 700, researchFocus: ['Infectious Disease', 'Maternal Health'] },
      { id: 'uon-fac-eng', name: 'Faculty of Engineering', shortName: 'ENG', dean: 'Prof. J. Wanjiru', establishedYear: 1970, departments: ['Department of Civil Engineering', 'Department of Electrical Engineering'], programmes: ['Civil Engineering', 'Electrical Engineering'], studentCount: 6500, academicStaffCount: 500, researchFocus: ['Transport', 'Energy Systems'] },
      { id: 'uon-fac-st', name: 'Faculty of Science and Technology', shortName: 'SST', dean: 'Prof. A. Kamau', establishedYear: 1970, departments: ['Department of Mathematics', 'Department of Computer Science'], programmes: ['Mathematics', 'Computer Science'], studentCount: 7000, academicStaffCount: 600, researchFocus: ['Applied Mathematics', 'Data Science'] },
      { id: 'uon-fac-agri', name: 'Faculty of Agriculture', shortName: 'AGR', dean: 'Prof. L. Otieno', establishedYear: 1970, departments: ['Department of Veterinary Medicine', 'Department of Crop Science'], programmes: ['Veterinary Medicine', 'Crop Science'], studentCount: 3500, academicStaffCount: 400, researchFocus: ['Livestock Health', 'Food Security'] },
    ],
    schools: [
      { id: 'uon-sch-law', name: 'School of Law', shortName: 'LAW', director: 'Prof. W. Musyoka', establishedYear: 1970, focusAreas: ['Public Law', 'Commercial Law'], programmeCount: 6, studentCount: 1800 },
      { id: 'uon-sch-bus', name: 'School of Business', shortName: 'BUS', director: 'Prof. G. Njoroge', establishedYear: 1984, focusAreas: ['MBA', 'Finance'], programmeCount: 10, studentCount: 4000 },
    ],
    departments: [
      { id: 'uon-dept-med', name: 'Department of Medicine', facultyName: 'Faculty of Health Sciences', head: 'Prof. F. Mwangi', establishedYear: 1967, researchAreas: ['HIV Research', 'Tropical Medicine'], programmes: ['MBChB', 'MSc Medicine'], academicStaffCount: 190, studentCount: 1800, laboratories: ['Tropical Medicine Laboratory'] },
      { id: 'uon-dept-civil', name: 'Department of Civil Engineering', facultyName: 'Faculty of Engineering', head: 'Prof. J. Wanjiru', establishedYear: 1970, researchAreas: ['Transport Systems', 'Water Engineering'], programmes: ['BSc Civil Engineering', 'MSc Civil Engineering'], academicStaffCount: 75, studentCount: 2000, laboratories: ['Materials Testing Laboratory'] },
      { id: 'uon-dept-math', name: 'Department of Mathematics', facultyName: 'Faculty of Science and Technology', head: 'Prof. A. Kamau', establishedYear: 1970, researchAreas: ['Mathematical Modelling', 'Statistics'], programmes: ['BSc Mathematics', 'MSc Statistics'], academicStaffCount: 90, studentCount: 2600, laboratories: ['Computational Mathematics Laboratory'] },
      { id: 'uon-dept-vet', name: 'Department of Veterinary Medicine', facultyName: 'Faculty of Agriculture', head: 'Prof. L. Otieno', establishedYear: 1970, researchAreas: ['Veterinary Epidemiology', 'Zoonoses'], programmes: ['DVM', 'MSc Veterinary'], academicStaffCount: 110, studentCount: 1400, laboratories: ['Veterinary Diagnostics Laboratory'] },
    ],
    researchCentres: [
      { id: 'uon-centre-cbb', name: 'Centre for Biotechnology and Bioinformatics', acronym: 'CEBIB', director: 'Prof. A. Kamau', establishedYear: 2005, researchThemes: ['Genomics', 'Bioinformatics'], staffCount: 55, activeProjects: 14, publications: 340, fundingAwarded: 1800000, description: 'Regional biotechnology and bioinformatics centre.' },
      { id: 'uon-centre-wmi', name: 'Wangari Maathai Institute for Peace and Environmental Studies', acronym: 'WMI', director: 'Prof. L. Otieno', establishedYear: 2009, researchThemes: ['Environmental Governance', 'Peace Studies'], staffCount: 35, activeProjects: 7, publications: 150, fundingAwarded: 700000, description: 'Named in honour of Nobel laureate Wangari Maathai.' },
    ],
    laboratories: [
      { id: 'uon-lab-trop', name: 'Tropical Medicine Laboratory', departmentName: 'Department of Medicine', director: 'Prof. F. Mwangi', establishedYear: 1980, focusAreas: ['Parasitology', 'Virology'], equipment: ['Microscopes', 'PCR Systems'], capacity: 30, accessLevel: 'Controlled' },
      { id: 'uon-lab-materials', name: 'Materials Testing Laboratory', departmentName: 'Department of Civil Engineering', director: 'Prof. J. Wanjiru', establishedYear: 1975, focusAreas: ['Concrete Testing', 'Soil Mechanics'], equipment: ['Compression Machines', 'Sieves'], capacity: 40, accessLevel: 'Open' },
      { id: 'uon-lab-comp', name: 'Computational Mathematics Laboratory', departmentName: 'Department of Mathematics', director: 'Prof. A. Kamau', establishedYear: 2012, focusAreas: ['Modelling', 'High-Performance Computing'], equipment: ['Compute Servers'], capacity: 45, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'uon-admin-reg', name: 'Registry', director: 'Mr. M. Otieno', responsibilities: ['Admissions', 'Records'], staffCount: 150, reportsTo: 'Registrar' },
      { id: 'uon-admin-research', name: 'Office of Research and Innovation', director: 'Prof. S. Muthoni', responsibilities: ['Grants', 'Technology transfer'], staffCount: 45, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 55000, faculty: 3800, staff: 3200, internationalStudents: 3500, alumni: 240000, programmes: 200, faculties: 6, departments: 90, researchCentres: 12, laboratories: 30, campuses: 3, postgraduates: 16000, undergraduates: 39000, acceptanceRate: 13, graduationRate: 74,
    },
    rankings: [
      { id: 'uon-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1201, totalRanked: 1503, region: 'Africa' },
      { id: 'uon-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 1001, totalRanked: 1904, region: 'Africa' },
      { id: 'uon-rank-web-2025', source: 'Webometrics', year: 2025, category: 'Web Presence', rank: 2000, totalRanked: 31000, region: 'Global' },
    ],
    accreditations: [
      { id: 'uon-acc-cue', body: 'Commission for University Education', country: 'Kenya', status: 'Accredited', awardedYear: 1985, scope: 'Full institutional accreditation', certification: 'CUE-UON-1985' },
      { id: 'uon-acc-kmc', body: 'Kenya Medical and Dental Council', country: 'Kenya', status: 'Accredited', awardedYear: 1970, scope: 'Medical education programmes' },
    ],
    researchOutputs: [
      { id: 'uon-out-1', title: 'Tropical infectious disease burden in Nairobi', type: 'Journal Article', year: 2025, authors: ['F. Mwangi'], venue: 'Journal of Infectious Diseases', citations: 16, doi: '10.1000/uon.2025.0001' },
      { id: 'uon-out-2', title: 'Nairobi expressway traffic flow modelling', type: 'Journal Article', year: 2024, authors: ['J. Wanjiru'], venue: 'Transportation Research', citations: 13, doi: '10.1000/uon.2024.0002' },
      { id: 'uon-out-3', title: 'East African livestock health survey dataset', type: 'Dataset', year: 2024, authors: ['L. Otieno'], venue: 'Scholatia Data Repository', citations: 5, doi: '10.1000/uon.2024.0003' },
      { id: 'uon-out-4', title: 'Mathematical models of infectious disease spread', type: 'Journal Article', year: 2023, authors: ['A. Kamau'], venue: 'Journal of Theoretical Biology', citations: 19, doi: '10.1000/uon.2023.0004' },
      { id: 'uon-out-5', title: 'Swahili speech recognition corpora', type: 'Conference Paper', year: 2023, authors: ['A. Kamau', 'G. Njoroge'], venue: 'Interspeech 2023', citations: 14, doi: '10.1000/uon.2023.0005' },
    ],
    grants: [
      { id: 'uon-grant-1', source: 'Wellcome Trust', type: 'Grant', amount: 2400000, currency: 'USD', year: 2025, description: 'Infectious disease research programme.' },
      { id: 'uon-grant-2', source: 'African Development Bank', type: 'Grant', amount: 1500000, currency: 'USD', year: 2024, description: 'Engineering and science capacity building.' },
    ],
    funding: [
      { id: 'uon-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 110000000, currency: 'USD', year: 2025, description: 'Kenyan government university allocation.' },
      { id: 'uon-fund-2', source: 'Tuition Income', type: 'Tuition', amount: 40000000, currency: 'USD', year: 2025, description: 'Tuition and fee income.' },
    ],
    partnerships: [
      { id: 'uon-partner-1', title: 'University of Cambridge', detail: 'Academic exchange' },
      { id: 'uon-partner-2', title: 'Ahmadu Bello University', detail: 'Agricultural research alliance' },
    ],
    memberships: [
      { id: 'uon-mem-1', organisation: 'Association of African Universities', role: 'Member', sinceYear: 1970, status: 'Active' },
      { id: 'uon-mem-2', organisation: 'Inter-University Council for East Africa', role: 'Member', sinceYear: 1970, status: 'Active' },
    ],
    timeline: [
      { id: 'uon-time-1', date: '1956', title: 'Founded', detail: 'Established as the Royal Technical College.', type: 'Founded' },
      { id: 'uon-time-2', date: '1970', title: 'University status', detail: 'Became the University of Nairobi.', type: 'Leadership' },
      { id: 'uon-time-3', date: '2005', title: 'Biotech centre', detail: 'Centre for Biotechnology and Bioinformatics launched.', type: 'Research' },
      { id: 'uon-time-4', date: '2009', title: 'Maathai institute', detail: 'Wangari Maathai Institute established.', type: 'Research' },
      { id: 'uon-time-5', date: '2025', title: 'CUE re-accreditation', detail: 'Full institutional re-accreditation awarded.', type: 'Accreditation' },
    ],
  }),

  makeInstitution(12, {
    logo: '🏛️',
    country: 'United Kingdom',
    profile: profileFor({
      institutionId: 'INST-OX-012',
      institutionName: 'University of Oxford',
      shortName: 'Oxford',
      acronym: 'OX',
      institutionType: 'University',
      country: 'United Kingdom',
      stateProvince: 'England',
      city: 'Oxford',
      website: 'https://www.ox.ac.uk',
      officialEmail: 'enquiries@ox.ac.uk',
      officialPhone: '+44 1865 270000',
      description: 'The oldest university in the English-speaking world, a global leader in research across the humanities, sciences, medicine, and the social sciences.',
      mission: 'To pursue excellence in education and research, contributing to the advancement of knowledge and society.',
      history: 'Teaching existed at Oxford since 1096, making it the oldest university in the English-speaking world.',
      accreditation: 'Recognised by the Quality Assurance Agency and the Office for Students.',
      ranking: 'Consistently ranked among the top universities in the world.',
      researchAreas: ['Medicine', 'Physics', 'Humanities', 'Artificial Intelligence', 'Economics'],
      academicDisciplines: ['Medical Sciences', 'Mathematical, Physical and Life Sciences', 'Humanities', 'Social Sciences'],
      campusLocations: ['Oxford City Centre'],
      verificationStatus: 'Trusted',
      trustScore: 98,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-12-01', details: 'Recognised by the Office for Students.' },
        { type: 'Accreditation', status: 'Accredited', verifiedAt: '2025-06-20', details: 'QAA quality review completed.' },
      ],
      faculties: ['Medical Sciences Division', 'Mathematical, Physical and Life Sciences Division', 'Humanities Division', 'Social Sciences Division'],
      schools: ['Saïd Business School', 'Oxford Martin School'],
      colleges: ['Balliol College', 'Brasenose College', 'Christ Church'],
      departments: ['Department of Physics', 'Department of Computer Science', 'Nuffield Department of Medicine', 'Department of Economics'],
      researchCentres: ['Oxford Martin School', 'Institute for New Economic Thinking'],
      institutes: ['Oxford Internet Institute', 'Department of Engineering Science'],
      libraries: ['Bodleian Libraries'],
      administrativeUnits: ['University Offices', 'Academic Administration'],
      campuses: ['City Centre'],
      affiliations: [],
      studentCount: 26000,
      facultyCount: 7400,
      programCount: 350,
      foundedYear: 1096,
      lastVerifiedAt: '2025-12-01',
    }),
    campuses: [
      { id: 'ox-city', name: 'City Centre Campus', city: 'Oxford', country: 'United Kingdom', address: 'Wellington Square, Oxford', establishedYear: 1096, areaHectares: 200, faculties: ['Medical Sciences Division', 'Mathematical, Physical and Life Sciences Division', 'Humanities Division', 'Social Sciences Division'], facilities: ['Bodleian Libraries', 'Oxford University Museum', 'Sheldonian Theatre'], studentCount: 26000, academicStaffCount: 7400, coordinates: { latitude: 51.7548, longitude: -1.2543 } },
    ],
    faculties: [
      { id: 'ox-fac-med', name: 'Medical Sciences Division', shortName: 'MSD', dean: 'Prof. S. Ray', establishedYear: 1880, departments: ['Nuffield Department of Medicine', 'Department of Oncology'], programmes: ['Medicine', 'Medical Research'], studentCount: 5000, academicStaffCount: 1800, researchFocus: ['Genomics', 'Vaccines'] },
      { id: 'ox-fac-mpls', name: 'Mathematical, Physical and Life Sciences Division', shortName: 'MPLS', dean: 'Prof. D. Clarke', establishedYear: 1900, departments: ['Department of Physics', 'Department of Computer Science'], programmes: ['Physics', 'Computer Science'], studentCount: 6000, academicStaffCount: 1600, researchFocus: ['Quantum Computing', 'Astrophysics'] },
      { id: 'ox-fac-hum', name: 'Humanities Division', shortName: 'HUM', dean: 'Prof. M. Smith', establishedYear: 1900, departments: ['Department of History', 'Department of Classics'], programmes: ['History', 'Classics'], studentCount: 5000, academicStaffCount: 1200, researchFocus: ['Medieval Studies', 'Digital Humanities'] },
      { id: 'ox-fac-soc', name: 'Social Sciences Division', shortName: 'SSD', dean: 'Prof. A. Turner', establishedYear: 1900, departments: ['Department of Economics', 'Department of Politics'], programmes: ['Economics', 'Politics'], studentCount: 5000, academicStaffCount: 1100, researchFocus: ['Development Economics', 'Political Theory'] },
    ],
    schools: [
      { id: 'ox-sch-sbs', name: 'Saïd Business School', shortName: 'SBS', director: 'Prof. P. Tufano', establishedYear: 1996, focusAreas: ['MBA', 'Executive Education'], programmeCount: 14, studentCount: 1500 },
      { id: 'ox-sch-oms', name: 'Oxford Martin School', shortName: 'OMS', director: 'Prof. C. Fisher', establishedYear: 2005, focusAreas: ['Global Challenges', 'Interdisciplinary Research'], programmeCount: 20, studentCount: 200 },
    ],
    departments: [
      { id: 'ox-dept-physics', name: 'Department of Physics', facultyName: 'Mathematical, Physical and Life Sciences Division', head: 'Prof. D. Clarke', establishedYear: 1900, researchAreas: ['Quantum Matter', 'Astrophysics'], programmes: ['MPhys', 'DPhil Physics'], academicStaffCount: 300, studentCount: 1200, laboratories: ['Quantum Computing Laboratory'] },
      { id: 'ox-dept-cs', name: 'Department of Computer Science', facultyName: 'Mathematical, Physical and Life Sciences Division', head: 'Prof. N. Trefethen', establishedYear: 1957, researchAreas: ['AI', 'Systems Security'], programmes: ['MCompSci', 'DPhil Computer Science'], academicStaffCount: 120, studentCount: 900, laboratories: ['Deep Learning Laboratory'] },
      { id: 'ox-dept-ndm', name: 'Nuffield Department of Medicine', facultyName: 'Medical Sciences Division', head: 'Prof. S. Ray', establishedYear: 1964, researchAreas: ['Infectious Disease', 'Genomics'], programmes: ['DPhil Medical Sciences'], academicStaffCount: 400, studentCount: 600, laboratories: ['Vaccine Research Laboratory'] },
      { id: 'ox-dept-econ', name: 'Department of Economics', facultyName: 'Social Sciences Division', head: 'Prof. A. Turner', establishedYear: 1900, researchAreas: ['Econometrics', 'Development'], programmes: ['MPhil Economics', 'DPhil Economics'], academicStaffCount: 90, studentCount: 400, laboratories: [] },
    ],
    researchCentres: [
      { id: 'ox-centre-oms', name: 'Oxford Martin School', acronym: 'OMS', director: 'Prof. C. Fisher', establishedYear: 2005, researchThemes: ['Climate', 'AI Governance', 'Health'], staffCount: 60, activeProjects: 30, publications: 900, fundingAwarded: 12000000, description: 'Interdisciplinary research hub addressing global challenges.' },
      { id: 'ox-centre-inet', name: 'Institute for New Economic Thinking', acronym: 'INET', director: 'Prof. A. Turner', establishedYear: 2012, researchThemes: ['Financial Stability', 'Macroeconomics'], staffCount: 30, activeProjects: 10, publications: 300, fundingAwarded: 5000000, description: 'Rethinking economic theory for the modern world.' },
    ],
    laboratories: [
      { id: 'ox-lab-quantum', name: 'Quantum Computing Laboratory', departmentName: 'Department of Physics', director: 'Prof. D. Clarke', establishedYear: 2015, focusAreas: ['Quantum Processors', 'Error Correction'], equipment: ['Quantum Test Rigs', 'Cryostats'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'ox-lab-dl', name: 'Deep Learning Laboratory', departmentName: 'Department of Computer Science', director: 'Prof. N. Trefethen', establishedYear: 2018, focusAreas: ['Foundation Models', 'Robotics'], equipment: ['GPU Clusters', 'Robotic Platforms'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'ox-lab-vaccine', name: 'Vaccine Research Laboratory', departmentName: 'Nuffield Department of Medicine', director: 'Prof. S. Ray', establishedYear: 2010, focusAreas: ['Vaccine Development', 'Immunology'], equipment: ['Biosafety Cabinets', 'Immunoassays'], capacity: 25, accessLevel: 'Controlled' },
    ],
    administrativeUnits: [
      { id: 'ox-admin-uo', name: 'University Offices', director: 'Mrs. K. Fitzpatrick', responsibilities: ['Governance', 'Finance'], staffCount: 400, reportsTo: 'Vice-Chancellor' },
      { id: 'ox-admin-acad', name: 'Academic Administration', director: 'Dr. L. Chen', responsibilities: ['Admissions', 'Examinations'], staffCount: 250, reportsTo: 'Registrar' },
    ],
    statistics: {
      students: 26000, faculty: 7400, staff: 6800, internationalStudents: 10000, alumni: 350000, programmes: 350, faculties: 4, departments: 70, researchCentres: 60, laboratories: 120, campuses: 1, postgraduates: 12000, undergraduates: 14000, acceptanceRate: 18, graduationRate: 95,
    },
    rankings: [
      { id: 'ox-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 3, totalRanked: 1503, percentile: 1, region: 'Global' },
      { id: 'ox-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 1, totalRanked: 1904, percentile: 1, region: 'Global', note: 'Ranked first in the world by THE.' },
      { id: 'ox-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 7, totalRanked: 1000, percentile: 1, region: 'Global' },
    ],
    accreditations: [
      { id: 'ox-acc-ofs', body: 'Office for Students', country: 'United Kingdom', status: 'Accredited', awardedYear: 2018, scope: 'Registered higher education provider', certification: 'OFS-OX-2018' },
      { id: 'ox-acc-qaa', body: 'Quality Assurance Agency', country: 'United Kingdom', status: 'Accredited', awardedYear: 1997, scope: 'Higher education quality assurance' },
    ],
    researchOutputs: [
      { id: 'ox-out-1', title: 'Fault-tolerant quantum computing roadmaps', type: 'Journal Article', year: 2025, authors: ['D. Clarke'], venue: 'Nature Reviews Physics', citations: 45, doi: '10.1000/ox.2025.0001' },
      { id: 'ox-out-2', title: 'AI governance and frontier model risk', type: 'Journal Article', year: 2024, authors: ['C. Fisher', 'N. Trefethen'], venue: 'Science', citations: 68, doi: '10.1000/ox.2024.0002' },
      { id: 'ox-out-3', title: 'Global disease burden atlas dataset', type: 'Dataset', year: 2024, authors: ['S. Ray'], venue: 'Scholatia Data Repository', citations: 22, doi: '10.1000/ox.2024.0003' },
      { id: 'ox-out-4', title: 'The economics of degrowth', type: 'Book', year: 2023, authors: ['A. Turner'], venue: 'Oxford University Press', citations: 35, doi: '10.1000/ox.2023.0004' },
      { id: 'ox-out-5', title: 'Medieval manuscripts and digital text analysis', type: 'Journal Article', year: 2023, authors: ['M. Smith'], venue: 'Digital Scholarship', citations: 17, doi: '10.1000/ox.2023.0005' },
    ],
    grants: [
      { id: 'ox-grant-1', source: 'UK Research and Innovation', type: 'Grant', amount: 18000000, currency: 'USD', year: 2025, description: 'Quantum technologies national programme.' },
      { id: 'ox-grant-2', source: 'Wellcome Trust', type: 'Grant', amount: 12000000, currency: 'USD', year: 2024, description: 'Infectious disease genomics.' },
    ],
    funding: [
      { id: 'ox-fund-1', source: 'HESA Grant', type: 'Government Allocation', amount: 320000000, currency: 'USD', year: 2025, description: 'Higher education funding council allocation.' },
      { id: 'ox-fund-2', source: 'Oxford Endowment', type: 'Endowment', amount: 7800000000, currency: 'USD', year: 2025, description: 'Historic college and university endowment.' },
    ],
    partnerships: [
      { id: 'ox-partner-1', title: 'University of Cambridge', detail: 'Academic exchange' },
      { id: 'ox-partner-2', title: 'University of Cape Town', detail: 'Research partnership' },
    ],
    memberships: [
      { id: 'ox-mem-1', organisation: 'Russell Group', role: 'Founding Member', sinceYear: 1994, status: 'Active' },
      { id: 'ox-mem-2', organisation: 'League of European Research Universities', role: 'Member', sinceYear: 2002, status: 'Active' },
    ],
    timeline: [
      { id: 'ox-time-1', date: '1096', title: 'Founded', detail: 'Earliest evidence of teaching at Oxford.', type: 'Founded' },
      { id: 'ox-time-2', date: '1602', title: 'Bodleian Library', detail: 'The Bodleian Library opened.', type: 'Campus' },
      { id: 'ox-time-3', date: '2005', title: 'Oxford Martin School', detail: 'Interdisciplinary research school founded.', type: 'Research' },
      { id: 'ox-time-4', date: '2015', title: 'Quantum laboratory', detail: 'Quantum computing research programme launched.', type: 'Research' },
      { id: 'ox-time-5', date: '2025', title: 'World number one', detail: 'Ranked first in the world by THE.', type: 'Ranking' },
    ],
  }),

  makeInstitution(13, {
    logo: '🔷',
    country: 'United Kingdom',
    profile: profileFor({
      institutionId: 'INST-CAM-013',
      institutionName: 'University of Cambridge',
      shortName: 'Cambridge',
      acronym: 'CAM',
      institutionType: 'University',
      country: 'United Kingdom',
      stateProvince: 'England',
      city: 'Cambridge',
      website: 'https://www.cam.ac.uk',
      officialEmail: 'info@cam.ac.uk',
      officialPhone: '+44 1223 337733',
      description: 'One of the worlds leading research universities, celebrated for discoveries across the sciences, engineering, medicine, and the humanities.',
      mission: 'To contribute to society through the pursuit of education, learning, and research at the highest international levels of excellence.',
      history: 'Founded in 1209 by scholars fleeing Oxford, it is the worlds fourth-oldest surviving university.',
      accreditation: 'Recognised by the Quality Assurance Agency and the Office for Students.',
      ranking: 'Consistently ranked among the top five universities in the world.',
      researchAreas: ['Artificial Intelligence', 'Biology', 'Physics', 'Medicine', 'Engineering'],
      academicDisciplines: ['Physical Sciences', 'Biological Sciences', 'Humanities', 'Social Sciences', 'Technology'],
      campusLocations: ['Cambridge City Centre', 'West Cambridge'],
      verificationStatus: 'Trusted',
      trustScore: 98,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-18', details: 'Recognised by the Office for Students.' },
      ],
      faculties: ['School of the Physical Sciences', 'School of the Biological Sciences', 'School of the Humanities', 'School of Technology'],
      schools: ['Cambridge Judge Business School'],
      colleges: ['St Johns College', 'Trinity College', 'King s College'],
      departments: ['Department of Computer Science and Technology', 'Department of Engineering', 'Cavendish Laboratory', 'Department of Zoology'],
      researchCentres: ['Cambridge Centre for AI in Medicine', 'Cambridge Institute for Sustainability Leadership'],
      institutes: ['Alan Turing Institute (partnership)', 'Institute of Astronomy'],
      libraries: ['Cambridge University Library'],
      administrativeUnits: ['Registry', 'Research Operations Office'],
      campuses: ['City Centre', 'West Cambridge'],
      affiliations: [],
      studentCount: 24000,
      facultyCount: 7000,
      programCount: 300,
      foundedYear: 1209,
      lastVerifiedAt: '2025-11-18',
    }),
    campuses: [
      { id: 'cam-city', name: 'City Centre Campus', city: 'Cambridge', country: 'United Kingdom', address: 'The Old Schools, Trinity Lane, Cambridge', establishedYear: 1209, areaHectares: 150, faculties: ['School of the Physical Sciences', 'School of the Biological Sciences', 'School of the Humanities'], facilities: ['Cambridge University Library', 'Fitzwilliam Museum', 'Botanic Garden'], studentCount: 19000, academicStaffCount: 5800, coordinates: { latitude: 52.2053, longitude: 0.1218 } },
      { id: 'cam-west', name: 'West Cambridge Campus', city: 'Cambridge', country: 'United Kingdom', address: 'West Cambridge, Cambridge', establishedYear: 1995, areaHectares: 170, faculties: ['School of Technology'], facilities: ['Department of Engineering', 'Cavendish Laboratory'], studentCount: 5000, academicStaffCount: 2000, coordinates: { latitude: 52.2101, longitude: 0.0857 } },
    ],
    faculties: [
      { id: 'cam-fac-ps', name: 'School of the Physical Sciences', shortName: 'SPS', dean: 'Prof. J. Ellis', establishedYear: 1209, departments: ['Cavendish Laboratory', 'Department of Materials Science'], programmes: ['Physics', 'Materials Science'], studentCount: 3000, academicStaffCount: 1200, researchFocus: ['Quantum Materials', 'Condensed Matter'] },
      { id: 'cam-fac-bs', name: 'School of the Biological Sciences', shortName: 'SBS', dean: 'Prof. H. Rahim', establishedYear: 1209, departments: ['Department of Zoology', 'Department of Plant Sciences'], programmes: ['Biology', 'Genetics'], studentCount: 4000, academicStaffCount: 1400, researchFocus: ['Genomics', 'Ecology'] },
      { id: 'cam-fac-hum', name: 'School of the Humanities', shortName: 'SH', dean: 'Prof. R. Turner', establishedYear: 1209, departments: ['Department of History', 'Department of Classics'], programmes: ['History', 'Classics'], studentCount: 5000, academicStaffCount: 1300, researchFocus: ['Digital Humanities', 'Medieval Studies'] },
      { id: 'cam-fac-tech', name: 'School of Technology', shortName: 'TECH', dean: 'Prof. M. Vaz', establishedYear: 1875, departments: ['Department of Engineering', 'Department of Computer Science and Technology'], programmes: ['Engineering', 'Computer Science'], studentCount: 6000, academicStaffCount: 1600, researchFocus: ['AI', 'Materials Engineering'] },
    ],
    schools: [{ id: 'cam-sch-cjbs', name: 'Cambridge Judge Business School', shortName: 'CJBS', director: 'Prof. G. Clarke', establishedYear: 1990, focusAreas: ['MBA', 'Executive Education'], programmeCount: 15, studentCount: 1600 }],
    departments: [
      { id: 'cam-dept-cst', name: 'Department of Computer Science and Technology', facultyName: 'School of Technology', head: 'Prof. M. Vaz', establishedYear: 1949, researchAreas: ['AI', 'Systems'], programmes: ['BA Computer Science', 'MPhil Computer Science'], academicStaffCount: 180, studentCount: 1500, laboratories: ['Machine Intelligence Laboratory'] },
      { id: 'cam-dept-eng', name: 'Department of Engineering', facultyName: 'School of Technology', head: 'Prof. D. Hewitt', establishedYear: 1875, researchAreas: ['Aerospace', 'Biomedical'], programmes: ['BA Engineering', 'MEng'], academicStaffCount: 350, studentCount: 2500, laboratories: ['Engineering Design Laboratory'] },
      { id: 'cam-dept-cav', name: 'Cavendish Laboratory', facultyName: 'School of the Physical Sciences', head: 'Prof. J. Ellis', establishedYear: 1874, researchAreas: ['Particle Physics', 'Condensed Matter'], programmes: ['BA Physics', 'MPhil Physics'], academicStaffCount: 250, studentCount: 1200, laboratories: ['High Energy Physics Laboratory'] },
      { id: 'cam-dept-zoo', name: 'Department of Zoology', facultyName: 'School of the Biological Sciences', head: 'Prof. H. Rahim', establishedYear: 1900, researchAreas: ['Animal Behaviour', 'Genomics'], programmes: ['BA Zoology', 'MPhil Zoology'], academicStaffCount: 100, studentCount: 800, laboratories: ['Genomics Laboratory'] },
    ],
    researchCentres: [
      { id: 'cam-centre-caim', name: 'Cambridge Centre for AI in Medicine', acronym: 'CC-AIM', director: 'Prof. M. Vaz', establishedYear: 2019, researchThemes: ['Medical AI', 'Drug Discovery'], staffCount: 80, activeProjects: 25, publications: 700, fundingAwarded: 15000000, description: 'AI applied to clinical medicine research.' },
      { id: 'cam-centre-cisl', name: 'Cambridge Institute for Sustainability Leadership', acronym: 'CISL', director: 'Prof. G. Clarke', establishedYear: 1989, researchThemes: ['Net Zero', 'Sustainable Business'], staffCount: 70, activeProjects: 20, publications: 400, fundingAwarded: 6000000, description: 'Business and policy leadership for sustainability.' },
    ],
    laboratories: [
      { id: 'cam-lab-mi', name: 'Machine Intelligence Laboratory', departmentName: 'Department of Computer Science and Technology', director: 'Prof. M. Vaz', establishedYear: 2018, focusAreas: ['Reinforcement Learning', 'Computer Vision'], equipment: ['GPU Clusters'], capacity: 45, accessLevel: 'Restricted' },
      { id: 'cam-lab-hep', name: 'High Energy Physics Laboratory', departmentName: 'Cavendish Laboratory', director: 'Prof. J. Ellis', establishedYear: 1970, focusAreas: ['Detector Development', 'Data Analysis'], equipment: ['Detector Testbeds', 'Compute Farms'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'cam-lab-genomics', name: 'Genomics Laboratory', departmentName: 'Department of Zoology', director: 'Prof. H. Rahim', establishedYear: 2012, focusAreas: ['Sequencing', 'Population Genetics'], equipment: ['Sequencers', 'Bioinformatics Servers'], capacity: 30, accessLevel: 'Restricted' },
    ],
    administrativeUnits: [
      { id: 'cam-admin-reg', name: 'Registry', director: 'Mrs. E. Jackson', responsibilities: ['Admissions', 'Examinations'], staffCount: 300, reportsTo: 'Registrar' },
      { id: 'cam-admin-research', name: 'Research Operations Office', director: 'Dr. P. Mistry', responsibilities: ['Grant management', 'Contracts'], staffCount: 150, reportsTo: 'Deputy Vice-Chancellor (Research)' },
    ],
    statistics: {
      students: 24000, faculty: 7000, staff: 6400, internationalStudents: 9000, alumni: 320000, programmes: 300, faculties: 6, departments: 90, researchCentres: 80, laboratories: 140, campuses: 2, postgraduates: 11000, undergraduates: 13000, acceptanceRate: 17, graduationRate: 96,
    },
    rankings: [
      { id: 'cam-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 5, totalRanked: 1503, percentile: 1, region: 'Global' },
      { id: 'cam-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 5, totalRanked: 1904, percentile: 1, region: 'Global' },
      { id: 'cam-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 4, totalRanked: 1000, percentile: 1, region: 'Global' },
    ],
    accreditations: [
      { id: 'cam-acc-ofs', body: 'Office for Students', country: 'United Kingdom', status: 'Accredited', awardedYear: 2018, scope: 'Registered higher education provider', certification: 'OFS-CAM-2018' },
      { id: 'cam-acc-qaa', body: 'Quality Assurance Agency', country: 'United Kingdom', status: 'Accredited', awardedYear: 1997, scope: 'Higher education quality assurance' },
    ],
    researchOutputs: [
      { id: 'cam-out-1', title: 'Foundation models for medical imaging', type: 'Journal Article', year: 2025, authors: ['M. Vaz'], venue: 'Nature Medicine', citations: 52, doi: '10.1000/cam.2025.0001' },
      { id: 'cam-out-2', title: 'Graphene-based quantum devices', type: 'Journal Article', year: 2024, authors: ['J. Ellis'], venue: 'Science', citations: 48, doi: '10.1000/cam.2024.0002' },
      { id: 'cam-out-3', title: 'Global biodiversity genomics dataset', type: 'Dataset', year: 2024, authors: ['H. Rahim'], venue: 'Scholatia Data Repository', citations: 19, doi: '10.1000/cam.2024.0003' },
      { id: 'cam-out-4', title: 'The grammar of prediction in language models', type: 'Journal Article', year: 2023, authors: ['M. Vaz', 'R. Turner'], venue: 'Computational Linguistics', citations: 33, doi: '10.1000/cam.2023.0004' },
      { id: 'cam-out-5', title: 'Sustainable infrastructure for net-zero cities', type: 'Report', year: 2023, authors: ['G. Clarke'], venue: 'CISL Working Paper', citations: 11, doi: '10.1000/cam.2023.0005' },
    ],
    grants: [
      { id: 'cam-grant-1', source: 'UK Research and Innovation', type: 'Grant', amount: 16000000, currency: 'USD', year: 2025, description: 'AI in medicine programme.' },
      { id: 'cam-grant-2', source: 'Wellcome Trust', type: 'Grant', amount: 9000000, currency: 'USD', year: 2024, description: 'Genomics of human disease.' },
    ],
    funding: [
      { id: 'cam-fund-1', source: 'HESA Grant', type: 'Government Allocation', amount: 280000000, currency: 'USD', year: 2025, description: 'Higher education funding council allocation.' },
      { id: 'cam-fund-2', source: 'Cambridge Endowment', type: 'Endowment', amount: 5900000000, currency: 'USD', year: 2025, description: 'Historic university and college endowment.' },
    ],
    partnerships: [
      { id: 'cam-partner-1', title: 'University of Oxford', detail: 'Academic exchange' },
      { id: 'cam-partner-2', title: 'MIT', detail: 'Innovation collaboration' },
    ],
    memberships: [
      { id: 'cam-mem-1', organisation: 'Russell Group', role: 'Founding Member', sinceYear: 1994, status: 'Active' },
      { id: 'cam-mem-2', organisation: 'Coimbra Group', role: 'Member', sinceYear: 1985, status: 'Active' },
    ],
    timeline: [
      { id: 'cam-time-1', date: '1209', title: 'Founded', detail: 'Scholars fleeing Oxford established Cambridge.', type: 'Founded' },
      { id: 'cam-time-2', date: '1874', title: 'Cavendish Laboratory', detail: 'The Cavendish Laboratory opened.', type: 'Research' },
      { id: 'cam-time-3', date: '1949', title: 'Computer laboratory', detail: 'Department of Computer Science and Technology established.', type: 'Research' },
      { id: 'cam-time-4', date: '2019', title: 'AI in medicine', detail: 'Cambridge Centre for AI in Medicine launched.', type: 'Research' },
      { id: 'cam-time-5', date: '2025', title: 'Top five worldwide', detail: 'Ranked among the top five universities globally.', type: 'Ranking' },
    ],
  }),

  makeInstitution(14, {
    logo: '🛰️',
    country: 'United Kingdom',
    profile: profileFor({
      institutionId: 'INST-ICL-014',
      institutionName: 'Imperial College London',
      shortName: 'Imperial',
      acronym: 'ICL',
      institutionType: 'University',
      country: 'United Kingdom',
      stateProvince: 'England',
      city: 'London',
      website: 'https://www.imperial.ac.uk',
      officialEmail: 'info@imperial.ac.uk',
      officialPhone: '+44 20 7589 5111',
      description: 'A global leader in science, engineering, medicine, and business, ranked among the worlds foremost universities for technology and innovation.',
      mission: 'To achieve enduring excellence in research and education in science, engineering, medicine, and business.',
      history: 'Founded in 1907 from the merger of the Royal College of Science, the Royal School of Mines, and the City and Guilds College.',
      accreditation: 'Recognised by the Quality Assurance Agency and the Office for Students.',
      ranking: 'Ranked among the top ten universities in the world.',
      researchAreas: ['Engineering', 'Medicine', 'Business', 'Data Science', 'Climate'],
      academicDisciplines: ['Engineering', 'Natural Sciences', 'Medicine', 'Business'],
      campusLocations: ['South Kensington Campus', 'White City Campus'],
      verificationStatus: 'Trusted',
      trustScore: 97,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-05', details: 'Recognised by the Office for Students.' },
      ],
      faculties: ['Faculty of Engineering', 'Faculty of Natural Sciences', 'Faculty of Medicine', 'Imperial College Business School'],
      schools: ['Business School'],
      colleges: [],
      departments: ['Department of Computing', 'Department of Bioengineering', 'Department of Physics', 'Department of Civil Engineering'],
      researchCentres: ['Data Science Institute', 'Energy Futures Lab', 'Institute of Global Health Innovation'],
      institutes: ['Institute for Molecular Science and Engineering'],
      libraries: ['Abdus Salam Library'],
      administrativeUnits: ['Registry', 'Research Office'],
      campuses: ['South Kensington', 'White City'],
      affiliations: [],
      studentCount: 22000,
      facultyCount: 5200,
      programCount: 240,
      foundedYear: 1907,
      lastVerifiedAt: '2025-11-05',
    }),
    campuses: [
      { id: 'icl-south-kensington', name: 'South Kensington Campus', city: 'London', country: 'United Kingdom', address: 'Exhibition Road, London', establishedYear: 1907, areaHectares: 15, faculties: ['Faculty of Engineering', 'Faculty of Natural Sciences', 'Faculty of Medicine'], facilities: ['Abdus Salam Library', 'Royal Albert Hall', 'Science Museum'], studentCount: 16000, academicStaffCount: 4000, coordinates: { latitude: 51.4988, longitude: -0.1749 } },
      { id: 'icl-white-city', name: 'White City Campus', city: 'London', country: 'United Kingdom', address: 'White City, London', establishedYear: 2018, areaHectares: 23, faculties: ['Imperial College Business School'], facilities: ['Scale Space', 'Translation and Innovation Hub'], studentCount: 6000, academicStaffCount: 1600, coordinates: { latitude: 51.5139, longitude: -0.227 } },
    ],
    faculties: [
      { id: 'icl-fac-eng', name: 'Faculty of Engineering', shortName: 'ENG', dean: 'Prof. N. Kelly', establishedYear: 1907, departments: ['Department of Computing', 'Department of Civil Engineering'], programmes: ['Computing', 'Civil Engineering'], studentCount: 7000, academicStaffCount: 1400, researchFocus: ['AI', 'Robotics'] },
      { id: 'icl-fac-ns', name: 'Faculty of Natural Sciences', shortName: 'NS', dean: 'Prof. S. Okafor', establishedYear: 1907, departments: ['Department of Physics', 'Department of Chemistry'], programmes: ['Physics', 'Chemistry'], studentCount: 4000, academicStaffCount: 1000, researchFocus: ['Quantum Physics', 'Materials'] },
      { id: 'icl-fac-med', name: 'Faculty of Medicine', shortName: 'MED', dean: 'Prof. A. Singh', establishedYear: 1997, departments: ['Department of Bioengineering', 'Department of Surgery'], programmes: ['Medicine', 'Bioengineering'], studentCount: 4500, academicStaffCount: 1500, researchFocus: ['Biological Engineering', 'Global Health'] },
      { id: 'icl-fac-bus', name: 'Imperial College Business School', shortName: 'BUS', dean: 'Prof. M. Ellis', establishedYear: 2003, departments: [], programmes: ['MBA', 'Finance'], studentCount: 3500, academicStaffCount: 600, researchFocus: ['Fintech', 'Innovation'] },
    ],
    schools: [{ id: 'icl-sch-bus', name: 'Imperial College Business School', shortName: 'ICBS', director: 'Prof. M. Ellis', establishedYear: 2003, focusAreas: ['MBA', 'Executive Education'], programmeCount: 12, studentCount: 3500 }],
    departments: [
      { id: 'icl-dept-comp', name: 'Department of Computing', facultyName: 'Faculty of Engineering', head: 'Prof. N. Kelly', establishedYear: 1964, researchAreas: ['Machine Learning', 'Security'], programmes: ['MEng Computing', 'MSc Computing'], academicStaffCount: 180, studentCount: 2000, laboratories: ['Machine Learning Laboratory'] },
      { id: 'icl-dept-bioeng', name: 'Department of Bioengineering', facultyName: 'Faculty of Medicine', head: 'Prof. A. Singh', establishedYear: 1964, researchAreas: ['Medical Devices', 'Tissue Engineering'], programmes: ['MEng Bioengineering', 'MSc Biomedical Engineering'], academicStaffCount: 130, studentCount: 1200, laboratories: ['Tissue Engineering Laboratory'] },
      { id: 'icl-dept-phys', name: 'Department of Physics', facultyName: 'Faculty of Natural Sciences', head: 'Prof. S. Okafor', establishedYear: 1907, researchAreas: ['Quantum Physics', 'Cosmology'], programmes: ['MPhys', 'MSc Physics'], academicStaffCount: 180, studentCount: 1300, laboratories: ['Quantum Physics Laboratory'] },
      { id: 'icl-dept-civil', name: 'Department of Civil Engineering', facultyName: 'Faculty of Engineering', head: 'Prof. R. Adeyemi', establishedYear: 1907, researchAreas: ['Structural Engineering', 'Environmental'], programmes: ['MEng Civil Engineering', 'MSc Civil Engineering'], academicStaffCount: 100, studentCount: 1400, laboratories: ['Structural Laboratory'] },
    ],
    researchCentres: [
      { id: 'icl-centre-dsi', name: 'Data Science Institute', acronym: 'DSI', director: 'Prof. N. Kelly', establishedYear: 2014, researchThemes: ['Data Science', 'AI'], staffCount: 120, activeProjects: 40, publications: 1100, fundingAwarded: 20000000, description: 'Cross-faculty data science research institute.' },
      { id: 'icl-centre-efl', name: 'Energy Futures Lab', acronym: 'EFL', director: 'Prof. R. Adeyemi', establishedYear: 2008, researchThemes: ['Energy Systems', 'Decarbonisation'], staffCount: 60, activeProjects: 18, publications: 500, fundingAwarded: 9000000, description: 'Energy transition research laboratory.' },
    ],
    laboratories: [
      { id: 'icl-lab-ml', name: 'Machine Learning Laboratory', departmentName: 'Department of Computing', director: 'Prof. N. Kelly', establishedYear: 2016, focusAreas: ['Deep Learning', 'Bayesian Methods'], equipment: ['GPU Clusters'], capacity: 50, accessLevel: 'Restricted' },
      { id: 'icl-lab-tissue', name: 'Tissue Engineering Laboratory', departmentName: 'Department of Bioengineering', director: 'Prof. A. Singh', establishedYear: 2010, focusAreas: ['Scaffolds', 'Cell Culture'], equipment: ['Bioreactors', 'Microscopes'], capacity: 35, accessLevel: 'Restricted' },
      { id: 'icl-lab-struct', name: 'Structural Laboratory', departmentName: 'Department of Civil Engineering', director: 'Prof. R. Adeyemi', establishedYear: 1920, focusAreas: ['Structural Testing', 'Materials'], equipment: ['Load Frames', 'Actuators'], capacity: 45, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'icl-admin-reg', name: 'Registry', director: 'Mr. T. Barton', responsibilities: ['Admissions', 'Records'], staffCount: 250, reportsTo: 'Registrar' },
      { id: 'icl-admin-research', name: 'Research Office', director: 'Dr. L. Kumar', responsibilities: ['Grants', 'Research contracts'], staffCount: 130, reportsTo: 'Deputy Provost (Research)' },
    ],
    statistics: {
      students: 22000, faculty: 5200, staff: 5000, internationalStudents: 13000, alumni: 220000, programmes: 240, faculties: 4, departments: 60, researchCentres: 40, laboratories: 100, campuses: 2, postgraduates: 10000, undergraduates: 12000, acceptanceRate: 16, graduationRate: 94,
    },
    rankings: [
      { id: 'icl-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 2, totalRanked: 1503, percentile: 1, region: 'Global' },
      { id: 'icl-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 6, totalRanked: 1904, percentile: 1, region: 'Global' },
      { id: 'icl-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 23, totalRanked: 1000, percentile: 2, region: 'Global' },
    ],
    accreditations: [
      { id: 'icl-acc-ofs', body: 'Office for Students', country: 'United Kingdom', status: 'Accredited', awardedYear: 2018, scope: 'Registered higher education provider', certification: 'OFS-ICL-2018' },
      { id: 'icl-acc-qaa', body: 'Quality Assurance Agency', country: 'United Kingdom', status: 'Accredited', awardedYear: 1997, scope: 'Higher education quality assurance' },
    ],
    researchOutputs: [
      { id: 'icl-out-1', title: 'Large language models for scientific discovery', type: 'Journal Article', year: 2025, authors: ['N. Kelly'], venue: 'Nature Machine Intelligence', citations: 40, doi: '10.1000/icl.2025.0001' },
      { id: 'icl-out-2', title: 'Quantum advantage in optimisation problems', type: 'Journal Article', year: 2024, authors: ['S. Okafor'], venue: 'Physical Review Letters', citations: 36, doi: '10.1000/icl.2024.0002' },
      { id: 'icl-out-3', title: 'London energy demand forecasting dataset', type: 'Dataset', year: 2024, authors: ['R. Adeyemi'], venue: 'Scholatia Data Repository', citations: 10, doi: '10.1000/icl.2024.0003' },
      { id: 'icl-out-4', title: 'Biofabrication of cardiac tissue patches', type: 'Journal Article', year: 2023, authors: ['A. Singh'], venue: 'Biomaterials', citations: 29, doi: '10.1000/icl.2023.0004' },
      { id: 'icl-out-5', title: 'Fintech regulation in the age of embedded finance', type: 'Report', year: 2023, authors: ['M. Ellis'], venue: 'ICBS Working Paper', citations: 13, doi: '10.1000/icl.2023.0005' },
    ],
    grants: [
      { id: 'icl-grant-1', source: 'UK Research and Innovation', type: 'Grant', amount: 14000000, currency: 'USD', year: 2025, description: 'AI for science institute.' },
      { id: 'icl-grant-2', source: 'European Research Council', type: 'Grant', amount: 8000000, currency: 'USD', year: 2024, description: 'Advanced engineering research grants.' },
    ],
    funding: [
      { id: 'icl-fund-1', source: 'HESA Grant', type: 'Government Allocation', amount: 240000000, currency: 'USD', year: 2025, description: 'Higher education funding council allocation.' },
      { id: 'icl-fund-2', source: 'Imperial Endowment', type: 'Endowment', amount: 1100000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
    ],
    partnerships: [
      { id: 'icl-partner-1', title: 'MIT', detail: 'Innovation collaboration' },
      { id: 'icl-partner-2', title: 'ETH Zurich', detail: 'Joint research centre' },
    ],
    memberships: [
      { id: 'icl-mem-1', organisation: 'Russell Group', role: 'Founding Member', sinceYear: 1994, status: 'Active' },
      { id: 'icl-mem-2', organisation: 'European University Association', role: 'Member', sinceYear: 1990, status: 'Active' },
    ],
    timeline: [
      { id: 'icl-time-1', date: '1907', title: 'Founded', detail: 'Founded by royal charter in London.', type: 'Founded' },
      { id: 'icl-time-2', date: '1964', title: 'Computing department', detail: 'Department of Computing established.', type: 'Research' },
      { id: 'icl-time-3', date: '2014', title: 'Data Science Institute', detail: 'Cross-faculty Data Science Institute launched.', type: 'Research' },
      { id: 'icl-time-4', date: '2018', title: 'White City campus', detail: 'White City innovation campus opened.', type: 'Campus' },
      { id: 'icl-time-5', date: '2025', title: 'World number two', detail: 'Ranked second globally by QS.', type: 'Ranking' },
    ],
  }),

  makeInstitution(15, {
    logo: '🔴',
    country: 'United States',
    profile: profileFor({
      institutionId: 'INST-HU-015',
      institutionName: 'Harvard University',
      shortName: 'Harvard',
      acronym: 'HU',
      institutionType: 'University',
      country: 'United States',
      stateProvince: 'Massachusetts',
      city: 'Cambridge',
      website: 'https://www.harvard.edu',
      officialEmail: 'info@harvard.edu',
      officialPhone: '+1 617 495 1000',
      description: 'The oldest institution of higher learning in the United States, world-renowned across law, business, medicine, and the sciences.',
      mission: 'To educate the citizens and citizen-leaders for our society through the transformative power of liberal arts and sciences education.',
      history: 'Founded in 1636 as Harvard College, named after its first benefactor John Harvard.',
      accreditation: 'Accredited by the New England Commission of Higher Education.',
      ranking: 'Consistently ranked among the top universities in the world.',
      researchAreas: ['Law', 'Medicine', 'Business', 'Economics', 'Public Health'],
      academicDisciplines: ['Arts and Sciences', 'Law', 'Business', 'Medicine', 'Public Health'],
      campusLocations: ['Cambridge Campus', 'Allston Campus', 'Longwood Medical Area'],
      verificationStatus: 'Trusted',
      trustScore: 99,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-12-08', details: 'NECHE accreditation confirmed.' },
      ],
      faculties: ['Faculty of Arts and Sciences', 'Harvard Law School', 'Harvard Medical School', 'Harvard Business School'],
      schools: ['Harvard Kennedy School', 'Harvard Graduate School of Education'],
      colleges: ['Harvard College', 'Radcliffe Institute'],
      departments: ['Department of Economics', 'Department of Computer Science', 'Department of Medicine', 'Department of Law'],
      researchCentres: ['Harvard Data Science Initiative', 'Belfer Center for Science and International Affairs', 'Wyss Institute for Biologically Inspired Engineering'],
      institutes: ['Broad Institute of MIT and Harvard', 'Harvard Stem Cell Institute'],
      libraries: ['Widener Library', 'Harvard Library System'],
      administrativeUnits: ['University Administration', 'Office of Research Administration'],
      campuses: ['Cambridge', 'Allston', 'Longwood'],
      affiliations: [],
      studentCount: 24000,
      facultyCount: 4700,
      programCount: 400,
      foundedYear: 1636,
      lastVerifiedAt: '2025-12-08',
    }),
    campuses: [
      { id: 'hu-cambridge', name: 'Cambridge Campus', city: 'Cambridge', country: 'United States', address: 'Massachusetts Hall, Cambridge, MA', establishedYear: 1636, areaHectares: 85, faculties: ['Faculty of Arts and Sciences', 'Harvard Law School'], facilities: ['Widener Library', 'Harvard Yard', 'Harvard Art Museums'], studentCount: 14000, academicStaffCount: 2900, coordinates: { latitude: 42.3744, longitude: -71.1167 } },
      { id: 'hu-allston', name: 'Allston Campus', city: 'Boston', country: 'United States', address: 'Allston, Boston, MA', establishedYear: 2010, areaHectares: 145, faculties: ['Harvard Business School'], facilities: ['Science and Engineering Complex', 'Enterprise Research Campus'], studentCount: 6000, academicStaffCount: 1200, coordinates: { latitude: 42.367, longitude: -71.13 } },
      { id: 'hu-longwood', name: 'Longwood Medical Area', city: 'Boston', country: 'United States', address: 'Longwood, Boston, MA', establishedYear: 1900, areaHectares: 20, faculties: ['Harvard Medical School', 'Harvard School of Public Health'], facilities: ['Harvard Medical School Quad'], studentCount: 4000, academicStaffCount: 1000, coordinates: { latitude: 42.3365, longitude: -71.1051 } },
    ],
    faculties: [
      { id: 'hu-fac-fas', name: 'Faculty of Arts and Sciences', shortName: 'FAS', dean: 'Prof. E. Wilson', establishedYear: 1636, departments: ['Department of Economics', 'Department of Computer Science'], programmes: ['Economics', 'Computer Science', 'Physics'], studentCount: 10000, academicStaffCount: 1800, researchFocus: ['AI Ethics', 'Political Economy'] },
      { id: 'hu-fac-law', name: 'Harvard Law School', shortName: 'HLS', dean: 'Prof. R. Gupta', establishedYear: 1817, departments: ['Department of Law'], programmes: ['JD', 'LLM'], studentCount: 2000, academicStaffCount: 400, researchFocus: ['Constitutional Law', 'Corporate Law'] },
      { id: 'hu-fac-med', name: 'Harvard Medical School', shortName: 'HMS', dean: 'Prof. D. Anderson', establishedYear: 1782, departments: ['Department of Medicine', 'Department of Genetics'], programmes: ['MD', 'PhD'], studentCount: 3000, academicStaffCount: 1200, researchFocus: ['Genomics', 'Immunology'] },
      { id: 'hu-fac-bus', name: 'Harvard Business School', shortName: 'HBS', dean: 'Prof. S. Johnson', establishedYear: 1908, departments: [], programmes: ['MBA', 'Doctoral'], studentCount: 2500, academicStaffCount: 500, researchFocus: ['Strategy', 'Leadership'] },
    ],
    schools: [
      { id: 'hu-sch-hks', name: 'Harvard Kennedy School', shortName: 'HKS', director: 'Prof. M. Gray', establishedYear: 1936, focusAreas: ['Public Policy', 'International Affairs'], programmeCount: 15, studentCount: 1200 },
      { id: 'hu-sch-gse', name: 'Harvard Graduate School of Education', shortName: 'HGSE', director: 'Prof. L. Carter', establishedYear: 1920, focusAreas: ['Education Policy', 'Learning Sciences'], programmeCount: 10, studentCount: 900 },
    ],
    departments: [
      { id: 'hu-dept-econ', name: 'Department of Economics', facultyName: 'Faculty of Arts and Sciences', head: 'Prof. E. Wilson', establishedYear: 1820, researchAreas: ['Public Economics', 'Macroeconomics'], programmes: ['BA Economics', 'PhD Economics'], academicStaffCount: 90, studentCount: 1800, laboratories: [] },
      { id: 'hu-dept-cs', name: 'Department of Computer Science', facultyName: 'Faculty of Arts and Sciences', head: 'Prof. J. Park', establishedYear: 1984, researchAreas: ['AI', 'Theory'], programmes: ['BA Computer Science', 'PhD CS'], academicStaffCount: 80, studentCount: 1500, laboratories: ['AI Laboratory'] },
      { id: 'hu-dept-med', name: 'Department of Medicine', facultyName: 'Harvard Medical School', head: 'Prof. D. Anderson', establishedYear: 1782, researchAreas: ['Cardiovascular', 'Genomics'], programmes: ['MD', 'PhD Medicine'], academicStaffCount: 400, studentCount: 1200, laboratories: ['Genomics Laboratory'] },
      { id: 'hu-dept-law', name: 'Department of Law', facultyName: 'Harvard Law School', head: 'Prof. R. Gupta', establishedYear: 1817, researchAreas: ['Constitutional Law', 'International Law'], programmes: ['JD', 'LLM'], academicStaffCount: 150, studentCount: 1600, laboratories: [] },
    ],
    researchCentres: [
      { id: 'hu-centre-dsi', name: 'Harvard Data Science Initiative', acronym: 'HDSI', director: 'Prof. J. Park', establishedYear: 2017, researchThemes: ['Data Science', 'AI Ethics'], staffCount: 100, activeProjects: 35, publications: 900, fundingAwarded: 18000000, description: 'University-wide data science initiative.' },
      { id: 'hu-centre-belfer', name: 'Belfer Center for Science and International Affairs', acronym: 'BCSIA', director: 'Prof. M. Gray', establishedYear: 1973, researchThemes: ['Security', 'Technology Policy'], staffCount: 80, activeProjects: 25, publications: 600, fundingAwarded: 12000000, description: 'Flagship international affairs research centre.' },
    ],
    laboratories: [
      { id: 'hu-lab-ai', name: 'AI Laboratory', departmentName: 'Department of Computer Science', director: 'Prof. J. Park', establishedYear: 2019, focusAreas: ['Foundation Models', 'Alignment'], equipment: ['GPU Clusters'], capacity: 50, accessLevel: 'Restricted' },
      { id: 'hu-lab-genomics', name: 'Genomics Laboratory', departmentName: 'Department of Medicine', director: 'Prof. D. Anderson', establishedYear: 2000, focusAreas: ['Sequencing', 'Epigenetics'], equipment: ['Sequencers', 'Bioinformatics'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'hu-lab-wyss', name: 'Wyss Engineering Laboratory', departmentName: 'Wyss Institute', director: 'Prof. S. Johnson', establishedYear: 2009, focusAreas: ['Bioinspired Engineering', 'Prototyping'], equipment: ['3D Bioprinters', 'Microfluidics'], capacity: 45, accessLevel: 'Restricted' },
    ],
    administrativeUnits: [
      { id: 'hu-admin-ua', name: 'University Administration', director: 'Mr. C. Bennett', responsibilities: ['Finance', 'Governance'], staffCount: 500, reportsTo: 'President' },
      { id: 'hu-admin-ora', name: 'Office of Research Administration', director: 'Dr. N. Patel', responsibilities: ['Grants', 'Compliance'], staffCount: 200, reportsTo: 'Provost' },
    ],
    statistics: {
      students: 24000, faculty: 4700, staff: 7900, internationalStudents: 9000, alumni: 400000, programmes: 400, faculties: 11, departments: 110, researchCentres: 100, laboratories: 160, campuses: 3, postgraduates: 14000, undergraduates: 10000, acceptanceRate: 4, graduationRate: 97,
    },
    rankings: [
      { id: 'hu-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 4, totalRanked: 1503, percentile: 1, region: 'Global' },
      { id: 'hu-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 3, totalRanked: 1904, percentile: 1, region: 'Global' },
      { id: 'hu-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 1, totalRanked: 1000, percentile: 1, region: 'Global', note: 'Ranked first globally by ARWU.' },
    ],
    accreditations: [
      { id: 'hu-acc-neche', body: 'New England Commission of Higher Education', country: 'United States', status: 'Accredited', awardedYear: 1929, scope: 'Full institutional accreditation', certification: 'NECHE-HU-1929' },
      { id: 'hu-acc-aba', body: 'American Bar Association', country: 'United States', status: 'Accredited', awardedYear: 1923, scope: 'Law programmes' },
    ],
    researchOutputs: [
      { id: 'hu-out-1', title: 'Frontier AI safety and governance frameworks', type: 'Journal Article', year: 2025, authors: ['J. Park', 'M. Gray'], venue: 'Science', citations: 55, doi: '10.1000/hu.2025.0001' },
      { id: 'hu-out-2', title: 'Human genetics and disease susceptibility', type: 'Journal Article', year: 2024, authors: ['D. Anderson'], venue: 'Nature', citations: 49, doi: '10.1000/hu.2024.0002' },
      { id: 'hu-out-3', title: 'Global public health indicators dataset', type: 'Dataset', year: 2024, authors: ['L. Carter'], venue: 'Scholatia Data Repository', citations: 18, doi: '10.1000/hu.2024.0003' },
      { id: 'hu-out-4', title: 'The economics of platform monopolies', type: 'Book', year: 2023, authors: ['E. Wilson'], venue: 'Harvard University Press', citations: 31, doi: '10.1000/hu.2023.0004' },
      { id: 'hu-out-5', title: 'Corporate purpose and stakeholder governance', type: 'Journal Article', year: 2023, authors: ['S. Johnson'], venue: 'Harvard Business Review', citations: 42, doi: '10.1000/hu.2023.0005' },
    ],
    grants: [
      { id: 'hu-grant-1', source: 'National Institutes of Health', type: 'Grant', amount: 25000000, currency: 'USD', year: 2025, description: 'Biomedical research programme.' },
      { id: 'hu-grant-2', source: 'National Science Foundation', type: 'Grant', amount: 11000000, currency: 'USD', year: 2024, description: 'AI ethics and trust research.' },
    ],
    funding: [
      { id: 'hu-fund-1', source: 'Harvard Endowment', type: 'Endowment', amount: 50000000000, currency: 'USD', year: 2025, description: 'Largest university endowment in the world.' },
      { id: 'hu-fund-2', source: 'Tuition and Fees', type: 'Tuition', amount: 1800000000, currency: 'USD', year: 2025, description: 'Tuition and fee income.' },
    ],
    partnerships: [
      { id: 'hu-partner-1', title: 'MIT', detail: 'Broad Institute collaboration' },
      { id: 'hu-partner-2', title: 'University of Cape Town', detail: 'Research partnership' },
    ],
    memberships: [
      { id: 'hu-mem-1', organisation: 'Association of American Universities', role: 'Founding Member', sinceYear: 1900, status: 'Active' },
      { id: 'hu-mem-2', organisation: 'Ivy League', role: 'Founding Member', sinceYear: 1954, status: 'Active' },
    ],
    timeline: [
      { id: 'hu-time-1', date: '1636', title: 'Founded', detail: 'Founded as Harvard College.', type: 'Founded' },
      { id: 'hu-time-2', date: '1782', title: 'Medical school', detail: 'Harvard Medical School established.', type: 'Leadership' },
      { id: 'hu-time-3', date: '2009', title: 'Wyss Institute', detail: 'Wyss Institute for Bioinspired Engineering launched.', type: 'Research' },
      { id: 'hu-time-4', date: '2017', title: 'Data science initiative', detail: 'Harvard Data Science Initiative founded.', type: 'Research' },
      { id: 'hu-time-5', date: '2025', title: 'World number one ARWU', detail: 'Ranked first globally by ARWU.', type: 'Ranking' },
    ],
  }),

  makeInstitution(16, {
    logo: '⚙️',
    country: 'United States',
    profile: profileFor({
      institutionId: 'INST-MIT-016',
      institutionName: 'Massachusetts Institute of Technology',
      shortName: 'MIT',
      acronym: 'MIT',
      institutionType: 'University',
      country: 'United States',
      stateProvince: 'Massachusetts',
      city: 'Cambridge',
      website: 'https://www.mit.edu',
      officialEmail: 'info@mit.edu',
      officialPhone: '+1 617 253 1000',
      description: 'A world-leading institute for engineering, science, and technology, renowned for innovation, entrepreneurship, and research breakthroughs.',
      mission: 'To advance knowledge and educate students in science, technology, and other areas of scholarship.',
      history: 'Founded in 1861 in response to the growing industrialization of the United States.',
      accreditation: 'Accredited by the New England Commission of Higher Education.',
      ranking: 'Consistently ranked number one in the world.',
      researchAreas: ['Engineering', 'Artificial Intelligence', 'Robotics', 'Economics', 'Physics'],
      academicDisciplines: ['Engineering', 'Science', 'Architecture', 'Management', 'Humanities'],
      campusLocations: ['Cambridge Campus'],
      verificationStatus: 'Trusted',
      trustScore: 99,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-12-05', details: 'NECHE accreditation confirmed.' },
      ],
      faculties: ['School of Engineering', 'School of Science', 'MIT Sloan School of Management', 'School of Architecture and Planning'],
      schools: ['MIT Sloan School of Management', 'MIT Schwarzman College of Computing'],
      colleges: [],
      departments: ['Department of Electrical Engineering and Computer Science', 'Department of Physics', 'Department of Mechanical Engineering', 'Department of Economics'],
      researchCentres: ['MIT Computer Science and AI Laboratory', 'MIT Media Lab', 'Abdul Latif Jameel Clinic for Machine Learning in Health'],
      institutes: ['Broad Institute of MIT and Harvard', 'MIT Energy Initiative'],
      libraries: ['MIT Libraries'],
      administrativeUnits: ['Office of the Registrar', 'Office of Sponsored Programs'],
      campuses: ['Cambridge Campus'],
      affiliations: [],
      studentCount: 12000,
      facultyCount: 2600,
      programCount: 180,
      foundedYear: 1861,
      lastVerifiedAt: '2025-12-05',
    }),
    campuses: [
      { id: 'mit-cambridge', name: 'Cambridge Campus', city: 'Cambridge', country: 'United States', address: '77 Massachusetts Avenue, Cambridge, MA', establishedYear: 1861, areaHectares: 68, faculties: ['School of Engineering', 'School of Science', 'MIT Sloan School of Management'], facilities: ['MIT Libraries', 'Kresge Auditorium', 'Media Lab Complex'], studentCount: 12000, academicStaffCount: 2600, coordinates: { latitude: 42.3601, longitude: -71.0942 } },
    ],
    faculties: [
      { id: 'mit-fac-eng', name: 'School of Engineering', shortName: 'ENG', dean: 'Prof. A. Chen', establishedYear: 1861, departments: ['Department of Electrical Engineering and Computer Science', 'Department of Mechanical Engineering'], programmes: ['Electrical Engineering', 'Computer Science', 'Mechanical Engineering'], studentCount: 5000, academicStaffCount: 1100, researchFocus: ['Robotics', 'Materials'] },
      { id: 'mit-fac-sci', name: 'School of Science', shortName: 'SCI', dean: 'Prof. L. Zhao', establishedYear: 1861, departments: ['Department of Physics', 'Department of Mathematics'], programmes: ['Physics', 'Mathematics'], studentCount: 3000, academicStaffCount: 800, researchFocus: ['Quantum Science', 'Pure Mathematics'] },
      { id: 'mit-fac-sloan', name: 'MIT Sloan School of Management', shortName: 'SLOAN', dean: 'Prof. G. Chen', establishedYear: 1914, departments: [], programmes: ['MBA', 'PhD Management'], studentCount: 2500, academicStaffCount: 400, researchFocus: ['Operations', 'Finance'] },
      { id: 'mit-fac-sap', name: 'School of Architecture and Planning', shortName: 'SAP', dean: 'Prof. R. Lee', establishedYear: 1865, departments: ['Department of Architecture'], programmes: ['Architecture', 'Urban Planning'], studentCount: 1500, academicStaffCount: 300, researchFocus: ['Urban Science', 'Design Computing'] },
    ],
    schools: [
      { id: 'mit-sch-sloan', name: 'MIT Sloan School of Management', shortName: 'SLOAN', director: 'Prof. G. Chen', establishedYear: 1914, focusAreas: ['MBA', 'Executive Education'], programmeCount: 10, studentCount: 2500 },
      { id: 'mit-sch-scc', name: 'MIT Schwarzman College of Computing', shortName: 'SCC', director: 'Prof. A. Chen', establishedYear: 2019, focusAreas: ['AI', 'Computing Education'], programmeCount: 8, studentCount: 1000 },
    ],
    departments: [
      { id: 'mit-dept-eecs', name: 'Department of Electrical Engineering and Computer Science', facultyName: 'School of Engineering', head: 'Prof. A. Chen', establishedYear: 1882, researchAreas: ['AI', 'Systems', 'Hardware'], programmes: ['MEng', 'PhD EECS'], academicStaffCount: 180, studentCount: 2800, laboratories: ['CSAIL Laboratory'] },
      { id: 'mit-dept-phys', name: 'Department of Physics', facultyName: 'School of Science', head: 'Prof. L. Zhao', establishedYear: 1865, researchAreas: ['Particle Physics', 'Quantum'], programmes: ['SB Physics', 'PhD Physics'], academicStaffCount: 120, studentCount: 900, laboratories: ['Quantum Laboratory'] },
      { id: 'mit-dept-mech', name: 'Department of Mechanical Engineering', facultyName: 'School of Engineering', head: 'Prof. D. Walker', establishedYear: 1865, researchAreas: ['Robotics', 'Energy'], programmes: ['SB Mechanical Engineering', 'PhD MechE'], academicStaffCount: 130, studentCount: 1600, laboratories: ['Robotics Laboratory'] },
      { id: 'mit-dept-econ', name: 'Department of Economics', facultyName: 'School of Humanities and Social Sciences', head: 'Prof. H. Varian', establishedYear: 1941, researchAreas: ['Microeconomics', 'Econometrics'], programmes: ['SB Economics', 'PhD Economics'], academicStaffCount: 60, studentCount: 500, laboratories: [] },
    ],
    researchCentres: [
      { id: 'mit-centre-csail', name: 'MIT Computer Science and AI Laboratory', acronym: 'CSAIL', director: 'Prof. A. Chen', establishedYear: 2003, researchThemes: ['AI', 'Systems', 'Robotics'], staffCount: 500, activeProjects: 120, publications: 2500, fundingAwarded: 50000000, description: 'The largest research laboratory at MIT.' },
      { id: 'mit-centre-media', name: 'MIT Media Lab', acronym: 'ML', director: 'Prof. R. Lee', establishedYear: 1985, researchThemes: ['Human-Computer Interaction', 'Design'], staffCount: 200, activeProjects: 60, publications: 800, fundingAwarded: 30000000, description: 'Interdisciplinary design and technology lab.' },
    ],
    laboratories: [
      { id: 'mit-lab-csail', name: 'CSAIL AI Laboratory', departmentName: 'Department of EECS', director: 'Prof. A. Chen', establishedYear: 2003, focusAreas: ['Machine Learning', 'NLP'], equipment: ['GPU Farms'], capacity: 100, accessLevel: 'Restricted' },
      { id: 'mit-lab-quantum', name: 'Quantum Laboratory', departmentName: 'Department of Physics', director: 'Prof. L. Zhao', establishedYear: 2018, focusAreas: ['Superconducting Qubits', 'Photonics'], equipment: ['Cryostats', 'Photonics Benches'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'mit-lab-robotics', name: 'Robotics Laboratory', departmentName: 'Department of Mechanical Engineering', director: 'Prof. D. Walker', establishedYear: 1980, focusAreas: ['Autonomous Systems', 'Soft Robotics'], equipment: ['Robot Platforms', 'Motion Capture'], capacity: 50, accessLevel: 'Restricted' },
    ],
    administrativeUnits: [
      { id: 'mit-admin-reg', name: 'Office of the Registrar', director: 'Ms. M. Jackson', responsibilities: ['Enrollment', 'Records'], staffCount: 100, reportsTo: 'Chancellor' },
      { id: 'mit-admin-osp', name: 'Office of Sponsored Programs', director: 'Dr. K. Kim', responsibilities: ['Grant administration', 'Compliance'], staffCount: 150, reportsTo: 'Vice President for Research' },
    ],
    statistics: {
      students: 12000, faculty: 2600, staff: 5900, internationalStudents: 4500, alumni: 150000, programmes: 180, faculties: 5, departments: 35, researchCentres: 60, laboratories: 120, campuses: 1, postgraduates: 7000, undergraduates: 5000, acceptanceRate: 5, graduationRate: 96,
    },
    rankings: [
      { id: 'mit-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 1, totalRanked: 1503, percentile: 1, region: 'Global', note: 'Ranked first in the world by QS.' },
      { id: 'mit-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 2, totalRanked: 1904, percentile: 1, region: 'Global' },
      { id: 'mit-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 3, totalRanked: 1000, percentile: 1, region: 'Global' },
    ],
    accreditations: [
      { id: 'mit-acc-neche', body: 'New England Commission of Higher Education', country: 'United States', status: 'Accredited', awardedYear: 1929, scope: 'Full institutional accreditation', certification: 'NECHE-MIT-1929' },
      { id: 'mit-acc-abet', body: 'ABET Accreditation', country: 'United States', status: 'Accredited', awardedYear: 1930, scope: 'Engineering and computing programmes' },
    ],
    researchOutputs: [
      { id: 'mit-out-1', title: 'Scaling laws for multimodal foundation models', type: 'Journal Article', year: 2025, authors: ['A. Chen'], venue: 'Nature Machine Intelligence', citations: 62, doi: '10.1000/mit.2025.0001' },
      { id: 'mit-out-2', title: 'Quantum error correction with topological codes', type: 'Journal Article', year: 2024, authors: ['L. Zhao'], venue: 'Nature', citations: 51, doi: '10.1000/mit.2024.0002' },
      { id: 'mit-out-3', title: 'Boston mobility and traffic dataset', type: 'Dataset', year: 2024, authors: ['D. Walker'], venue: 'Scholatia Data Repository', citations: 15, doi: '10.1000/mit.2024.0003' },
      { id: 'mit-out-4', title: 'Soft robotics for healthcare applications', type: 'Journal Article', year: 2023, authors: ['D. Walker'], venue: 'Science Robotics', citations: 38, doi: '10.1000/mit.2023.0004' },
      { id: 'mit-out-5', title: 'Machine learning and market design', type: 'Book', year: 2023, authors: ['H. Varian'], venue: 'MIT Press', citations: 27, doi: '10.1000/mit.2023.0005' },
    ],
    grants: [
      { id: 'mit-grant-1', source: 'Defense Advanced Research Projects Agency', type: 'Grant', amount: 22000000, currency: 'USD', year: 2025, description: 'AI and autonomy research programme.' },
      { id: 'mit-grant-2', source: 'National Science Foundation', type: 'Grant', amount: 15000000, currency: 'USD', year: 2024, description: 'Quantum science centre.' },
    ],
    funding: [
      { id: 'mit-fund-1', source: 'MIT Endowment', type: 'Endowment', amount: 28000000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
      { id: 'mit-fund-2', source: 'Industry Research Contracts', type: 'Industry', amount: 900000000, currency: 'USD', year: 2025, description: 'Corporate sponsored research.' },
    ],
    partnerships: [
      { id: 'mit-partner-1', title: 'Harvard University', detail: 'Broad Institute collaboration' },
      { id: 'mit-partner-2', title: 'National University of Singapore', detail: 'Strategic alliance' },
    ],
    memberships: [
      { id: 'mit-mem-1', organisation: 'Association of American Universities', role: 'Member', sinceYear: 1934, status: 'Active' },
      { id: 'mit-mem-2', organisation: 'CINTRA (with Nanyang Technical University)', role: 'Partner', sinceYear: 2010, status: 'Active' },
    ],
    timeline: [
      { id: 'mit-time-1', date: '1861', title: 'Founded', detail: 'Founded in Cambridge, Massachusetts.', type: 'Founded' },
      { id: 'mit-time-2', date: '1985', title: 'Media Lab', detail: 'MIT Media Lab established.', type: 'Research' },
      { id: 'mit-time-3', date: '2003', title: 'CSAIL formed', detail: 'Computer Science and AI Laboratory created.', type: 'Research' },
      { id: 'mit-time-4', date: '2019', title: 'College of Computing', detail: 'MIT Schwarzman College of Computing founded.', type: 'Leadership' },
      { id: 'mit-time-5', date: '2025', title: 'World number one QS', detail: 'Ranked first globally by QS.', type: 'Ranking' },
    ],
  }),

  makeInstitution(17, {
    logo: '🌲',
    country: 'United States',
    profile: profileFor({
      institutionId: 'INST-SU-017',
      institutionName: 'Stanford University',
      shortName: 'Stanford',
      acronym: 'SU',
      institutionType: 'University',
      country: 'United States',
      stateProvince: 'California',
      city: 'Stanford',
      website: 'https://www.stanford.edu',
      officialEmail: 'info@stanford.edu',
      officialPhone: '+1 650 723 2300',
      description: 'A world-class research university in Silicon Valley, known for its pioneering work in technology, entrepreneurship, medicine, and the sciences.',
      mission: 'To promote the pursuit of knowledge for the welfare of humankind.',
      history: 'Founded in 1885 by Leland and Jane Stanford in memory of their son.',
      accreditation: 'Accredited by the WASC Senior College and University Commission.',
      ranking: 'Consistently ranked among the top five universities in the world.',
      researchAreas: ['Artificial Intelligence', 'Medicine', 'Entrepreneurship', 'Environmental Science', 'Law'],
      academicDisciplines: ['Engineering', 'Humanities and Sciences', 'Medicine', 'Business', 'Law'],
      campusLocations: ['Main Campus'],
      verificationStatus: 'Trusted',
      trustScore: 98,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-30', details: 'WSCUC accreditation confirmed.' },
      ],
      faculties: ['School of Engineering', 'School of Humanities and Sciences', 'Stanford School of Medicine', 'Stanford Graduate School of Business'],
      schools: ['Stanford Graduate School of Education', 'Stanford Law School'],
      colleges: [],
      departments: ['Department of Computer Science', 'Department of Electrical Engineering', 'Department of Medicine', 'Department of Economics'],
      researchCentres: ['Stanford Institute for Human-Centered AI', 'SLAC National Accelerator Laboratory', 'Stanford Woods Institute for the Environment'],
      institutes: ['Stanford Center for Biomedical Informatics Research', 'Freeman Spogli Institute'],
      libraries: ['Stanford Libraries'],
      administrativeUnits: ['Office of the Registrar', 'Office of Research Administration'],
      campuses: ['Main Campus'],
      affiliations: [],
      studentCount: 17000,
      facultyCount: 3300,
      programCount: 260,
      foundedYear: 1885,
      lastVerifiedAt: '2025-11-30',
    }),
    campuses: [
      { id: 'su-main', name: 'Main Campus', city: 'Stanford', country: 'United States', address: '450 Serra Mall, Stanford, CA', establishedYear: 1885, areaHectares: 3310, faculties: ['School of Engineering', 'School of Humanities and Sciences', 'Stanford School of Medicine'], facilities: ['Stanford Libraries', 'Cantor Arts Center', 'SLAC'], studentCount: 17000, academicStaffCount: 3300, coordinates: { latitude: 37.4275, longitude: -122.1697 } },
    ],
    faculties: [
      { id: 'su-fac-eng', name: 'School of Engineering', shortName: 'ENG', dean: 'Prof. P. Murphy', establishedYear: 1925, departments: ['Department of Computer Science', 'Department of Electrical Engineering'], programmes: ['Computer Science', 'Electrical Engineering'], studentCount: 5000, academicStaffCount: 900, researchFocus: ['AI', 'Bioengineering'] },
      { id: 'su-fac-hs', name: 'School of Humanities and Sciences', shortName: 'H&S', dean: 'Prof. R. Sanchez', establishedYear: 1885, departments: ['Department of Economics', 'Department of Physics'], programmes: ['Economics', 'Physics'], studentCount: 6000, academicStaffCount: 1100, researchFocus: ['Behavioral Economics', 'Astrophysics'] },
      { id: 'su-fac-med', name: 'Stanford School of Medicine', shortName: 'SOM', dean: 'Prof. L. Fernandez', establishedYear: 1908, departments: ['Department of Medicine', 'Department of Genetics'], programmes: ['MD', 'PhD Medicine'], studentCount: 2000, academicStaffCount: 800, researchFocus: ['Genomics', 'Precision Health'] },
      { id: 'su-fac-gsb', name: 'Stanford Graduate School of Business', shortName: 'GSB', dean: 'Prof. T. Cohen', establishedYear: 1925, departments: [], programmes: ['MBA', 'PhD Business'], studentCount: 1500, academicStaffCount: 300, researchFocus: ['Entrepreneurship', 'Leadership'] },
    ],
    schools: [
      { id: 'su-sch-gse', name: 'Stanford Graduate School of Education', shortName: 'GSE', director: 'Prof. S. Mitchell', establishedYear: 1891, focusAreas: ['Education Policy', 'Learning Sciences'], programmeCount: 8, studentCount: 800 },
      { id: 'su-sch-law', name: 'Stanford Law School', shortName: 'SLS', director: 'Prof. M. Reyes', establishedYear: 1893, focusAreas: ['Law and Technology', 'Constitutional Law'], programmeCount: 6, studentCount: 600 },
    ],
    departments: [
      { id: 'su-dept-cs', name: 'Department of Computer Science', facultyName: 'School of Engineering', head: 'Prof. P. Murphy', establishedYear: 1965, researchAreas: ['AI', 'Systems'], programmes: ['BS Computer Science', 'PhD CS'], academicStaffCount: 140, studentCount: 2000, laboratories: ['AI Laboratory'] },
      { id: 'su-dept-ee', name: 'Department of Electrical Engineering', facultyName: 'School of Engineering', head: 'Prof. J. Tan', establishedYear: 1893, researchAreas: ['Semiconductors', 'Photonics'], programmes: ['BS EE', 'MS EE'], academicStaffCount: 100, studentCount: 1300, laboratories: ['Photonic Laboratory'] },
      { id: 'su-dept-med', name: 'Department of Medicine', facultyName: 'Stanford School of Medicine', head: 'Prof. L. Fernandez', establishedYear: 1908, researchAreas: ['Cardiovascular', 'Oncology'], programmes: ['MD', 'PhD Medicine'], academicStaffCount: 350, studentCount: 900, laboratories: ['Genomics Laboratory'] },
      { id: 'su-dept-econ', name: 'Department of Economics', facultyName: 'School of Humanities and Sciences', head: 'Prof. R. Sanchez', establishedYear: 1925, researchAreas: ['Behavioral Economics', 'Industrial Organization'], programmes: ['BA Economics', 'PhD Economics'], academicStaffCount: 60, studentCount: 1100, laboratories: [] },
    ],
    researchCentres: [
      { id: 'su-centre-hai', name: 'Stanford Institute for Human-Centered AI', acronym: 'HAI', director: 'Prof. P. Murphy', establishedYear: 2019, researchThemes: ['AI Ethics', 'Human-AI Interaction'], staffCount: 150, activeProjects: 50, publications: 1200, fundingAwarded: 25000000, description: 'Flagship institute for human-centred AI research.' },
      { id: 'su-centre-slac', name: 'SLAC National Accelerator Laboratory', acronym: 'SLAC', director: 'Prof. L. Fernandez', establishedYear: 1962, researchThemes: ['Particle Physics', 'X-ray Science'], staffCount: 1600, activeProjects: 200, publications: 4000, fundingAwarded: 40000000, description: 'National laboratory operated by Stanford for the US Department of Energy.' },
    ],
    laboratories: [
      { id: 'su-lab-ai', name: 'AI Laboratory', departmentName: 'Department of Computer Science', director: 'Prof. P. Murphy', establishedYear: 2019, focusAreas: ['NLP', 'Computer Vision'], equipment: ['GPU Clusters'], capacity: 60, accessLevel: 'Restricted' },
      { id: 'su-lab-photonics', name: 'Photonic Laboratory', departmentName: 'Department of Electrical Engineering', director: 'Prof. J. Tan', establishedYear: 2005, focusAreas: ['Optoelectronics', 'Laser Physics'], equipment: ['Laser Benches', 'Spectrometers'], capacity: 35, accessLevel: 'Restricted' },
      { id: 'su-lab-genomics', name: 'Genomics Laboratory', departmentName: 'Department of Medicine', director: 'Prof. L. Fernandez', establishedYear: 2000, focusAreas: ['Precision Medicine', 'Sequencing'], equipment: ['Sequencers', 'Bioinformatics'], capacity: 40, accessLevel: 'Restricted' },
    ],
    administrativeUnits: [
      { id: 'su-admin-reg', name: 'Office of the Registrar', director: 'Ms. S. Lee', responsibilities: ['Enrollment', 'Records'], staffCount: 90, reportsTo: 'Registrar' },
      { id: 'su-admin-ora', name: 'Office of Research Administration', director: 'Dr. C. Nguyen', responsibilities: ['Grants', 'Compliance'], staffCount: 140, reportsTo: 'Vice Provost for Research' },
    ],
    statistics: {
      students: 17000, faculty: 3300, staff: 5200, internationalStudents: 5500, alumni: 240000, programmes: 260, faculties: 7, departments: 60, researchCentres: 80, laboratories: 130, campuses: 1, postgraduates: 10000, undergraduates: 7000, acceptanceRate: 4, graduationRate: 96,
    },
    rankings: [
      { id: 'su-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 6, totalRanked: 1503, percentile: 1, region: 'Global' },
      { id: 'su-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 4, totalRanked: 1904, percentile: 1, region: 'Global' },
      { id: 'su-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 2, totalRanked: 1000, percentile: 1, region: 'Global' },
    ],
    accreditations: [
      { id: 'su-acc-wscuc', body: 'WASC Senior College and University Commission', country: 'United States', status: 'Accredited', awardedYear: 1949, scope: 'Full institutional accreditation', certification: 'WSCUC-SU-1949' },
      { id: 'su-acc-aba', body: 'American Bar Association', country: 'United States', status: 'Accredited', awardedYear: 1908, scope: 'Law programmes' },
    ],
    researchOutputs: [
      { id: 'su-out-1', title: 'Human-centred AI and responsible deployment', type: 'Journal Article', year: 2025, authors: ['P. Murphy'], venue: 'Science', citations: 47, doi: '10.1000/su.2025.0001' },
      { id: 'su-out-2', title: 'Precision oncology with liquid biopsies', type: 'Journal Article', year: 2024, authors: ['L. Fernandez'], venue: 'New England Journal of Medicine', citations: 44, doi: '10.1000/su.2024.0002' },
      { id: 'su-out-3', title: 'Silicon Valley innovation ecosystem dataset', type: 'Dataset', year: 2024, authors: ['T. Cohen'], venue: 'Scholatia Data Repository', citations: 12, doi: '10.1000/su.2024.0003' },
      { id: 'su-out-4', title: 'Behavioral economics of platform markets', type: 'Book', year: 2023, authors: ['R. Sanchez'], venue: 'Princeton University Press', citations: 29, doi: '10.1000/su.2023.0004' },
      { id: 'su-out-5', title: 'Photonic computing architectures', type: 'Conference Paper', year: 2023, authors: ['J. Tan'], venue: 'Nature Photonics Conference', citations: 21, doi: '10.1000/su.2023.0005' },
    ],
    grants: [
      { id: 'su-grant-1', source: 'National Institutes of Health', type: 'Grant', amount: 21000000, currency: 'USD', year: 2025, description: 'Precision health research programme.' },
      { id: 'su-grant-2', source: 'National Science Foundation', type: 'Grant', amount: 13000000, currency: 'USD', year: 2024, description: 'Human-centred AI research institute.' },
    ],
    funding: [
      { id: 'su-fund-1', source: 'Stanford Endowment', type: 'Endowment', amount: 37000000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
      { id: 'su-fund-2', source: 'Research Contracts', type: 'Industry', amount: 600000000, currency: 'USD', year: 2025, description: 'Corporate sponsored research.' },
    ],
    partnerships: [
      { id: 'su-partner-1', title: 'MIT', detail: 'Innovation collaboration' },
      { id: 'su-partner-2', title: 'ETH Zurich', detail: 'Joint research centre' },
    ],
    memberships: [
      { id: 'su-mem-1', organisation: 'Association of American Universities', role: 'Member', sinceYear: 1900, status: 'Active' },
      { id: 'su-mem-2', organisation: 'Pac-12 Research Universities', role: 'Member', sinceYear: 1915, status: 'Active' },
    ],
    timeline: [
      { id: 'su-time-1', date: '1885', title: 'Founded', detail: 'Founded by Leland and Jane Stanford.', type: 'Founded' },
      { id: 'su-time-2', date: '1908', title: 'Medical school', detail: 'Stanford School of Medicine established.', type: 'Leadership' },
      { id: 'su-time-3', date: '2019', title: 'HAI institute', detail: 'Institute for Human-Centered AI launched.', type: 'Research' },
      { id: 'su-time-4', date: '2021', title: 'SLAC partnership', detail: 'SLAC renamed SLAC National Accelerator Laboratory.', type: 'Research' },
      { id: 'su-time-5', date: '2025', title: 'Top five worldwide', detail: 'Ranked among the top five universities globally.', type: 'Ranking' },
    ],
  }),

  makeInstitution(18, {
    logo: '🏔️',
    country: 'Switzerland',
    profile: profileFor({
      institutionId: 'INST-ETH-018',
      institutionName: 'ETH Zurich',
      shortName: 'ETH',
      acronym: 'ETHZ',
      institutionType: 'University',
      country: 'Switzerland',
      stateProvince: 'Zurich',
      city: 'Zurich',
      website: 'https://ethz.ch',
      officialEmail: 'info@ethz.ch',
      officialPhone: '+41 44 632 11 11',
      description: 'A world-leading science and technology university in Switzerland, renowned for engineering, natural sciences, and innovation.',
      mission: 'To educate engineers and scientists and to generate knowledge for the benefit of society.',
      history: 'Founded in 1855 as the Swiss Federal Institute of Technology.',
      accreditation: 'Accredited by the Swiss Center of Accreditation and Quality Assurance in Higher Education.',
      ranking: 'Consistently ranked among the top ten universities in the world.',
      researchAreas: ['Engineering', 'Natural Sciences', 'Robotics', 'Architecture', 'Data Science'],
      academicDisciplines: ['Engineering', 'Natural Sciences', 'Architecture', 'System Sciences'],
      campusLocations: ['Central Campus', 'Science City Campus'],
      verificationStatus: 'Trusted',
      trustScore: 97,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-12', details: 'AAQ accreditation confirmed.' },
      ],
      faculties: ['Department of Mechanical and Process Engineering', 'Department of Computer Science', 'Department of Physics', 'Department of Architecture'],
      schools: ['Department of Management, Technology and Economics'],
      colleges: [],
      departments: ['Institute for Robotics and Intelligent Systems', 'Institute of Machine Learning', 'Institute for Quantum Electronics', 'Institute of Technology in Architecture'],
      researchCentres: ['ETH AI Center', 'Energy Science Center'],
      institutes: ['Institute for Atmospheric and Climate Science', 'Institute of Data Science'],
      libraries: ['ETH Library'],
      administrativeUnits: ['ETH Zurich Executive Board', 'Research Administration'],
      campuses: ['Central Campus', 'Science City'],
      affiliations: [],
      studentCount: 25000,
      facultyCount: 3600,
      programCount: 180,
      foundedYear: 1855,
      lastVerifiedAt: '2025-11-12',
    }),
    campuses: [
      { id: 'eth-central', name: 'Central Campus', city: 'Zurich', country: 'Switzerland', address: 'Rämistrasse 101, Zurich', establishedYear: 1855, areaHectares: 25, faculties: ['Department of Computer Science', 'Department of Physics'], facilities: ['ETH Library', 'Polyterrasse', 'Main Building'], studentCount: 15000, academicStaffCount: 2200, coordinates: { latitude: 47.3769, longitude: 8.5494 } },
      { id: 'eth-science-city', name: 'Science City Campus', city: 'Zurich', country: 'Switzerland', address: 'Hönggerberg, Zurich', establishedYear: 1960, areaHectares: 120, faculties: ['Department of Mechanical and Process Engineering', 'Department of Architecture'], facilities: ['HIT Building', 'Architecture Pavilion'], studentCount: 10000, academicStaffCount: 1800, coordinates: { latitude: 47.4104, longitude: 8.5064 } },
    ],
    faculties: [
      { id: 'eth-fac-mech', name: 'Department of Mechanical and Process Engineering', shortName: 'D-MAVT', dean: 'Prof. F. Keller', establishedYear: 1855, departments: ['Institute for Robotics and Intelligent Systems'], programmes: ['Mechanical Engineering', 'Process Engineering'], studentCount: 3000, academicStaffCount: 600, researchFocus: ['Robotics', 'Energy Systems'] },
      { id: 'eth-fac-cs', name: 'Department of Computer Science', shortName: 'D-INFK', dean: 'Prof. S. Huber', establishedYear: 1981, departments: ['Institute of Machine Learning'], programmes: ['Computer Science', 'Data Science'], studentCount: 3500, academicStaffCount: 500, researchFocus: ['Machine Learning', 'Cybersecurity'] },
      { id: 'eth-fac-phys', name: 'Department of Physics', shortName: 'D-PHYS', dean: 'Prof. A. Meyer', establishedYear: 1855, departments: ['Institute for Quantum Electronics'], programmes: ['Physics', 'Quantum Engineering'], studentCount: 2000, academicStaffCount: 500, researchFocus: ['Quantum Physics', 'Condensed Matter'] },
      { id: 'eth-fac-arch', name: 'Department of Architecture', shortName: 'D-ARCH', dean: 'Prof. L. Graf', establishedYear: 1855, departments: ['Institute of Technology in Architecture'], programmes: ['Architecture', 'Urban Design'], studentCount: 2500, academicStaffCount: 400, researchFocus: ['Digital Fabrication', 'Sustainable Design'] },
    ],
    schools: [{ id: 'eth-sch-mtec', name: 'Department of Management, Technology and Economics', shortName: 'D-MTEC', director: 'Prof. R. Fischer', establishedYear: 1992, focusAreas: ['Technology Management', 'Entrepreneurship'], programmeCount: 10, studentCount: 1800 }],
    departments: [
      { id: 'eth-dept-iris', name: 'Institute for Robotics and Intelligent Systems', facultyName: 'Department of Mechanical and Process Engineering', head: 'Prof. F. Keller', establishedYear: 2008, researchAreas: ['Autonomous Systems', 'Soft Robotics'], programmes: ['PhD Robotics'], academicStaffCount: 90, studentCount: 300, laboratories: ['Robot Learning Laboratory'] },
      { id: 'eth-dept-ml', name: 'Institute of Machine Learning', facultyName: 'Department of Computer Science', head: 'Prof. S. Huber', establishedYear: 2015, researchAreas: ['Deep Learning', 'Optimization'], programmes: ['MSc Data Science', 'PhD ML'], academicStaffCount: 80, studentCount: 500, laboratories: ['ML Research Laboratory'] },
      { id: 'eth-dept-quantum', name: 'Institute for Quantum Electronics', facultyName: 'Department of Physics', head: 'Prof. A. Meyer', establishedYear: 2000, researchAreas: ['Quantum Optics', 'Superconducting Devices'], programmes: ['MSc Quantum Engineering', 'PhD Physics'], academicStaffCount: 60, studentCount: 250, laboratories: ['Quantum Optics Laboratory'] },
      { id: 'eth-dept-ita', name: 'Institute of Technology in Architecture', facultyName: 'Department of Architecture', head: 'Prof. L. Graf', establishedYear: 2000, researchAreas: ['Digital Fabrication', 'Robotic Construction'], programmes: ['MSc Architecture', 'PhD Architecture'], academicStaffCount: 50, studentCount: 200, laboratories: ['Digital Fabrication Laboratory'] },
    ],
    researchCentres: [
      { id: 'eth-centre-ai', name: 'ETH AI Center', acronym: 'AI CENTER', director: 'Prof. S. Huber', establishedYear: 2020, researchThemes: ['AI Foundations', 'AI for Science'], staffCount: 200, activeProjects: 80, publications: 1800, fundingAwarded: 35000000, description: 'University-wide centre for artificial intelligence research.' },
      { id: 'eth-centre-esc', name: 'Energy Science Center', acronym: 'ESC', director: 'Prof. F. Keller', establishedYear: 2010, researchThemes: ['Energy Systems', 'Storage'], staffCount: 80, activeProjects: 25, publications: 700, fundingAwarded: 12000000, description: 'Interdisciplinary energy research centre.' },
    ],
    laboratories: [
      { id: 'eth-lab-robot', name: 'Robot Learning Laboratory', departmentName: 'Institute for Robotics and Intelligent Systems', director: 'Prof. F. Keller', establishedYear: 2012, focusAreas: ['Reinforcement Learning', 'Manipulation'], equipment: ['Robot Arms', 'Simulation Clusters'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'eth-lab-quantum', name: 'Quantum Optics Laboratory', departmentName: 'Institute for Quantum Electronics', director: 'Prof. A. Meyer', establishedYear: 2005, focusAreas: ['Laser Physics', 'Quantum Sensors'], equipment: ['Laser Systems', 'Cryostats'], capacity: 25, accessLevel: 'Restricted' },
      { id: 'eth-lab-fab', name: 'Digital Fabrication Laboratory', departmentName: 'Institute of Technology in Architecture', director: 'Prof. L. Graf', establishedYear: 2008, focusAreas: ['Robotic Construction', 'Additive Manufacturing'], equipment: ['Robotic Arms', '3D Printers'], capacity: 50, accessLevel: 'Open' },
    ],
    administrativeUnits: [
      { id: 'eth-admin-eb', name: 'ETH Zurich Executive Board', director: 'Dr. V. Keller', responsibilities: ['Institutional strategy', 'Finance'], staffCount: 200, reportsTo: 'President' },
      { id: 'eth-admin-research', name: 'Research Administration', director: 'Dr. A. Brunner', responsibilities: ['Grants', 'ETH Zurich Research Commission'], staffCount: 80, reportsTo: 'Vice President for Research' },
    ],
    statistics: {
      students: 25000, faculty: 3600, staff: 4000, internationalStudents: 12000, alumni: 120000, programmes: 180, faculties: 16, departments: 40, researchCentres: 30, laboratories: 90, campuses: 2, postgraduates: 13000, undergraduates: 12000, acceptanceRate: 25, graduationRate: 85,
    },
    rankings: [
      { id: 'eth-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 7, totalRanked: 1503, percentile: 1, region: 'Europe' },
      { id: 'eth-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 8, totalRanked: 1904, percentile: 1, region: 'Europe' },
      { id: 'eth-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 20, totalRanked: 1000, percentile: 2, region: 'Europe' },
    ],
    accreditations: [
      { id: 'eth-acc-aaq', body: 'Swiss Agency of Accreditation and Quality Assurance', country: 'Switzerland', status: 'Accredited', awardedYear: 2004, scope: 'Full institutional accreditation', certification: 'AAQ-ETH-2004' },
      { id: 'eth-acc-enqa', body: 'European Network for Quality Assurance', country: 'Switzerland', status: 'Accredited', awardedYear: 2010, scope: 'European quality assurance registration' },
    ],
    researchOutputs: [
      { id: 'eth-out-1', title: 'Robotic manipulation with reinforcement learning', type: 'Journal Article', year: 2025, authors: ['F. Keller'], venue: 'Science Robotics', citations: 39, doi: '10.1000/eth.2025.0001' },
      { id: 'eth-out-2', title: 'Quantum sensors for precision measurement', type: 'Journal Article', year: 2024, authors: ['A. Meyer'], venue: 'Physical Review Letters', citations: 32, doi: '10.1000/eth.2024.0002' },
      { id: 'eth-out-3', title: 'Swiss energy demand forecasting dataset', type: 'Dataset', year: 2024, authors: ['F. Keller', 'R. Fischer'], venue: 'Scholatia Data Repository', citations: 8, doi: '10.1000/eth.2024.0003' },
      { id: 'eth-out-4', title: 'Digital fabrication for sustainable construction', type: 'Journal Article', year: 2023, authors: ['L. Graf'], venue: 'Architectural Design', citations: 16, doi: '10.1000/eth.2023.0004' },
      { id: 'eth-out-5', title: 'Foundations of trustworthy machine learning', type: 'Book', year: 2023, authors: ['S. Huber'], venue: 'MIT Press', citations: 24, doi: '10.1000/eth.2023.0005' },
    ],
    grants: [
      { id: 'eth-grant-1', source: 'Swiss National Science Foundation', type: 'Grant', amount: 16000000, currency: 'USD', year: 2025, description: 'National centre of competence in robotics.' },
      { id: 'eth-grant-2', source: 'European Research Council', type: 'Grant', amount: 9000000, currency: 'USD', year: 2024, description: 'Quantum engineering advanced grants.' },
    ],
    funding: [
      { id: 'eth-fund-1', source: 'ETH Confederation Funding', type: 'Government Allocation', amount: 220000000, currency: 'USD', year: 2025, description: 'Swiss federal funding allocation.' },
      { id: 'eth-fund-2', source: 'Research Contracts', type: 'Industry', amount: 150000000, currency: 'USD', year: 2025, description: 'Industry research collaboration income.' },
    ],
    partnerships: [
      { id: 'eth-partner-1', title: 'National University of Singapore', detail: 'Strategic alliance' },
      { id: 'eth-partner-2', title: 'Stellenbosch University', detail: 'Joint research centre' },
    ],
    memberships: [
      { id: 'eth-mem-1', organisation: 'ETH Domain (Swiss Federal Institutes)', role: 'Member', sinceYear: 1855, status: 'Active' },
      { id: 'eth-mem-2', organisation: 'League of European Research Universities', role: 'Member', sinceYear: 2002, status: 'Active' },
    ],
    timeline: [
      { id: 'eth-time-1', date: '1855', title: 'Founded', detail: 'Founded as the Swiss Federal Institute of Technology.', type: 'Founded' },
      { id: 'eth-time-2', date: '1960', title: 'Science City', detail: 'Hönggerberg campus development began.', type: 'Campus' },
      { id: 'eth-time-3', date: '2020', title: 'AI centre', detail: 'ETH AI Center launched.', type: 'Research' },
      { id: 'eth-time-4', date: '2021', title: 'Robot learning lab', detail: 'Advanced robot learning laboratory opened.', type: 'Research' },
      { id: 'eth-time-5', date: '2025', title: 'Top ten Europe', detail: 'Ranked among the top ten universities in Europe.', type: 'Ranking' },
    ],
  }),

  makeInstitution(19, {
    logo: '🌟',
    country: 'Singapore',
    profile: profileFor({
      institutionId: 'INST-NUS-019',
      institutionName: 'National University of Singapore',
      shortName: 'NUS',
      acronym: 'NUS',
      institutionType: 'University',
      country: 'Singapore',
      stateProvince: 'Singapore',
      city: 'Singapore',
      website: 'https://www.nus.edu.sg',
      officialEmail: 'enquiry@nus.edu.sg',
      officialPhone: '+65 6516 6666',
      description: 'Asias leading research university, with world-class programmes in engineering, computing, medicine, law, and business.',
      mission: 'To advance knowledge and nurture talent in service of Singapore and the world.',
      history: 'Founded in 1905 as the Straits Settlements and Federated Malay States Government Medical School.',
      accreditation: 'Accredited by the Singapore Ministry of Education and various professional bodies.',
      ranking: 'Ranked among the top ten universities in the world.',
      researchAreas: ['Engineering', 'Computing', 'Medicine', 'Law', 'Data Science'],
      academicDisciplines: ['Engineering', 'Computing', 'Science', 'Medicine', 'Law', 'Business'],
      campusLocations: ['Kent Ridge Campus', 'Bukit Timah Campus'],
      verificationStatus: 'Trusted',
      trustScore: 96,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-25', details: 'Ministry of Education recognition confirmed.' },
      ],
      faculties: ['College of Design and Engineering', 'School of Computing', 'Yong Loo Lin School of Medicine', 'NUS Business School'],
      schools: ['NUS Business School', 'Faculty of Law'],
      colleges: ['NUS College', 'Ridge View Residential College'],
      departments: ['Department of Computer Science', 'Department of Electrical and Computer Engineering', 'Department of Medicine', 'Department of Law'],
      researchCentres: ['NUS Centre for AI Technology', 'NUS Environmental Research Institute', 'Smart Nation Research Centre'],
      institutes: ['Institute of Systems Science', 'Cancer Science Institute of Singapore'],
      libraries: ['NUS Libraries'],
      administrativeUnits: ['Office of the Registrar', 'Office of Research'],
      campuses: ['Kent Ridge', 'Bukit Timah'],
      affiliations: [],
      studentCount: 37000,
      facultyCount: 3900,
      programCount: 300,
      foundedYear: 1905,
      lastVerifiedAt: '2025-11-25',
    }),
    campuses: [
      { id: 'nus-kent-ridge', name: 'Kent Ridge Campus', city: 'Singapore', country: 'Singapore', address: '21 Lower Kent Ridge Road, Singapore', establishedYear: 1905, areaHectares: 150, faculties: ['College of Design and Engineering', 'School of Computing', 'Yong Loo Lin School of Medicine'], facilities: ['NUS Libraries', 'University Cultural Centre', 'NUS Museum'], studentCount: 32000, academicStaffCount: 3500, coordinates: { latitude: 1.2966, longitude: 103.7764 } },
      { id: 'nus-bukit-timah', name: 'Bukit Timah Campus', city: 'Singapore', country: 'Singapore', address: '469 Bukit Timah Road, Singapore', establishedYear: 1980, areaHectares: 10, faculties: ['NUS Business School', 'Faculty of Law'], facilities: ['Shaw Foundation Building'], studentCount: 5000, academicStaffCount: 800, coordinates: { latitude: 1.3216, longitude: 103.8201 } },
    ],
    faculties: [
      { id: 'nus-fac-cde', name: 'College of Design and Engineering', shortName: 'CDE', dean: 'Prof. H. Lim', establishedYear: 1905, departments: ['Department of Electrical and Computer Engineering', 'Department of Civil Engineering'], programmes: ['Engineering', 'Design'], studentCount: 8000, academicStaffCount: 800, researchFocus: ['Smart Systems', 'Urban Engineering'] },
      { id: 'nus-fac-computing', name: 'School of Computing', shortName: 'SOC', dean: 'Prof. W. Tan', establishedYear: 1998, departments: ['Department of Computer Science', 'Department of Information Systems'], programmes: ['Computer Science', 'Information Security'], studentCount: 5000, academicStaffCount: 450, researchFocus: ['AI', 'Cybersecurity'] },
      { id: 'nus-fac-med', name: 'Yong Loo Lin School of Medicine', shortName: 'YLLSOM', dean: 'Prof. K. Chua', establishedYear: 1905, departments: ['Department of Medicine', 'Department of Surgery'], programmes: ['MBBS', 'MD'], studentCount: 4000, academicStaffCount: 900, researchFocus: ['Translational Medicine', 'Cancer Biology'] },
      { id: 'nus-fac-business', name: 'NUS Business School', shortName: 'BIZ', dean: 'Prof. D. Ng', establishedYear: 1965, departments: [], programmes: ['BBA', 'MBA'], studentCount: 3500, academicStaffCount: 400, researchFocus: ['Finance', 'Asia Business'] },
    ],
    schools: [
      { id: 'nus-sch-law', name: 'Faculty of Law', shortName: 'LAW', director: 'Prof. R. Kumar', establishedYear: 1956, focusAreas: ['Asian Legal Studies', 'Corporate Law'], programmeCount: 8, studentCount: 1200 },
      { id: 'nus-sch-iss', name: 'Institute of Systems Science', shortName: 'ISS', director: 'Prof. M. Goh', establishedYear: 1981, focusAreas: ['Digital Leadership', 'AI Graduate Programmes'], programmeCount: 20, studentCount: 2000 },
    ],
    departments: [
      { id: 'nus-dept-cs', name: 'Department of Computer Science', facultyName: 'School of Computing', head: 'Prof. W. Tan', establishedYear: 1998, researchAreas: ['Machine Learning', 'Computer Vision'], programmes: ['BComp', 'PhD CS'], academicStaffCount: 130, studentCount: 1800, laboratories: ['AI Laboratory'] },
      { id: 'nus-dept-ece', name: 'Department of Electrical and Computer Engineering', facultyName: 'College of Design and Engineering', head: 'Prof. H. Lim', establishedYear: 1905, researchAreas: ['VLSI', 'Power Systems'], programmes: ['BEng ECE', 'MEng ECE'], academicStaffCount: 140, studentCount: 2200, laboratories: ['Microelectronics Laboratory'] },
      { id: 'nus-dept-med', name: 'Department of Medicine', facultyName: 'Yong Loo Lin School of Medicine', head: 'Prof. K. Chua', establishedYear: 1905, researchAreas: ['Cancer Biology', 'Cardiology'], programmes: ['MBBS', 'PhD Medicine'], academicStaffCount: 250, studentCount: 1200, laboratories: ['Cancer Biology Laboratory'] },
      { id: 'nus-dept-law', name: 'Department of Law', facultyName: 'Faculty of Law', head: 'Prof. R. Kumar', establishedYear: 1956, researchAreas: ['Asian Law', 'Commercial Law'], programmes: ['LLB', 'LLM'], academicStaffCount: 80, studentCount: 1000, laboratories: [] },
    ],
    researchCentres: [
      { id: 'nus-centre-cait', name: 'NUS Centre for AI Technology', acronym: 'CAIT', director: 'Prof. W. Tan', establishedYear: 2019, researchThemes: ['AI Systems', 'AI for Science'], staffCount: 150, activeProjects: 50, publications: 1500, fundingAwarded: 30000000, description: 'University-wide AI technology research centre.' },
      { id: 'nus-centre-neri', name: 'NUS Environmental Research Institute', acronym: 'NERI', director: 'Prof. H. Lim', establishedYear: 2010, researchThemes: ['Climate Science', 'Urban Sustainability'], staffCount: 80, activeProjects: 20, publications: 600, fundingAwarded: 15000000, description: 'Environmental sustainability research institute.' },
    ],
    laboratories: [
      { id: 'nus-lab-ai', name: 'AI Laboratory', departmentName: 'Department of Computer Science', director: 'Prof. W. Tan', establishedYear: 2019, focusAreas: ['Deep Learning', 'NLP'], equipment: ['GPU Clusters'], capacity: 60, accessLevel: 'Restricted' },
      { id: 'nus-lab-micro', name: 'Microelectronics Laboratory', departmentName: 'Department of Electrical and Computer Engineering', director: 'Prof. H. Lim', establishedYear: 1985, focusAreas: ['Semiconductor Fabrication', 'Sensors'], equipment: ['Cleanroom', 'Lithography Tools'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'nus-lab-cancer', name: 'Cancer Biology Laboratory', departmentName: 'Department of Medicine', director: 'Prof. K. Chua', establishedYear: 2010, focusAreas: ['Drug Discovery', 'Genomics'], equipment: ['Sequencers', 'Cell Culture Facilities'], capacity: 35, accessLevel: 'Controlled' },
    ],
    administrativeUnits: [
      { id: 'nus-admin-reg', name: 'Office of the Registrar', director: 'Ms. S. Tan', responsibilities: ['Admissions', 'Records'], staffCount: 130, reportsTo: 'Registrar' },
      { id: 'nus-admin-research', name: 'Office of Research', director: 'Prof. C. Yeo', responsibilities: ['Grant management', 'Research integrity'], staffCount: 100, reportsTo: 'Deputy President (Research)' },
    ],
    statistics: {
      students: 37000, faculty: 3900, staff: 4500, internationalStudents: 9000, alumni: 300000, programmes: 300, faculties: 17, departments: 80, researchCentres: 50, laboratories: 120, campuses: 2, postgraduates: 14000, undergraduates: 23000, acceptanceRate: 9, graduationRate: 93,
    },
    rankings: [
      { id: 'nus-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 8, totalRanked: 1503, percentile: 1, region: 'Asia', note: 'Top-ranked university in Asia by QS.' },
      { id: 'nus-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 17, totalRanked: 1904, percentile: 1, region: 'Asia' },
      { id: 'nus-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 61, totalRanked: 1000, percentile: 6, region: 'Asia' },
    ],
    accreditations: [
      { id: 'nus-acc-moe', body: 'Singapore Ministry of Education', country: 'Singapore', status: 'Accredited', awardedYear: 1905, scope: 'Full institutional accreditation', certification: 'MOE-NUS-1905' },
      { id: 'nus-acc-eng', body: 'Professional Engineers Board Singapore', country: 'Singapore', status: 'Accredited', awardedYear: 1965, scope: 'Engineering programmes' },
    ],
    researchOutputs: [
      { id: 'nus-out-1', title: 'Tropical urban climate resilience modelling', type: 'Journal Article', year: 2025, authors: ['H. Lim'], venue: 'Nature Climate Change', citations: 35, doi: '10.1000/nus.2025.0001' },
      { id: 'nus-out-2', title: 'Edge computing for autonomous urban systems', type: 'Journal Article', year: 2024, authors: ['W. Tan'], venue: 'IEEE Transactions on Computers', citations: 28, doi: '10.1000/nus.2024.0002' },
      { id: 'nus-out-3', title: 'Singapore urban heat island dataset', type: 'Dataset', year: 2024, authors: ['H. Lim', 'C. Yeo'], venue: 'Scholatia Data Repository', citations: 11, doi: '10.1000/nus.2024.0003' },
      { id: 'nus-out-4', title: 'Cancer stem cell signalling pathways', type: 'Journal Article', year: 2023, authors: ['K. Chua'], venue: 'Nature Reviews Cancer', citations: 45, doi: '10.1000/nus.2023.0004' },
      { id: 'nus-out-5', title: 'Asian legal harmonisation in digital trade', type: 'Book', year: 2023, authors: ['R. Kumar'], venue: 'Cambridge University Press', citations: 14, doi: '10.1000/nus.2023.0005' },
    ],
    grants: [
      { id: 'nus-grant-1', source: 'National Research Foundation Singapore', type: 'Grant', amount: 20000000, currency: 'USD', year: 2025, description: 'Smart nation research programme.' },
      { id: 'nus-grant-2', source: 'Agency for Science, Technology and Research', type: 'Grant', amount: 8000000, currency: 'USD', year: 2024, description: 'Biomedical research partnership.' },
    ],
    funding: [
      { id: 'nus-fund-1', source: 'Government Grant', type: 'Government Allocation', amount: 480000000, currency: 'USD', year: 2025, description: 'Singapore Ministry of Education allocation.' },
      { id: 'nus-fund-2', source: 'NUS Endowment', type: 'Endowment', amount: 2200000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
    ],
    partnerships: [
      { id: 'nus-partner-1', title: 'ETH Zurich', detail: 'Strategic alliance' },
      { id: 'nus-partner-2', title: 'MIT', detail: 'Innovation collaboration' },
    ],
    memberships: [
      { id: 'nus-mem-1', organisation: 'Association of Southeast Asian Institutions of Higher Learning', role: 'Member', sinceYear: 1956, status: 'Active' },
      { id: 'nus-mem-2', organisation: 'Global Alliance of Technological Universities', role: 'Founding Member', sinceYear: 2009, status: 'Active' },
    ],
    timeline: [
      { id: 'nus-time-1', date: '1905', title: 'Founded', detail: 'Founded as the Straits Settlements Medical School.', type: 'Founded' },
      { id: 'nus-time-2', date: '1980', title: 'NUS formed', detail: 'University of Singapore merged with Nanyang University.', type: 'Leadership' },
      { id: 'nus-time-3', date: '2019', title: 'AI centre', detail: 'Centre for AI Technology launched.', type: 'Research' },
      { id: 'nus-time-4', date: '2021', title: 'Smart Nation research', detail: 'Smart Nation Research Centre established.', type: 'Research' },
      { id: 'nus-time-5', date: '2025', title: 'Top in Asia', detail: 'Ranked first in Asia by QS.', type: 'Ranking' },
    ],
  }),

  makeInstitution(20, {
    logo: '🌸',
    country: 'Japan',
    profile: profileFor({
      institutionId: 'INST-UTOKYO-020',
      institutionName: 'University of Tokyo',
      shortName: 'UTokyo',
      acronym: 'UTOKYO',
      institutionType: 'University',
      country: 'Japan',
      stateProvince: 'Tokyo',
      city: 'Bunkyo',
      website: 'https://www.u-tokyo.ac.jp',
      officialEmail: 'info@u-tokyo.ac.jp',
      officialPhone: '+81 3 3812 2111',
      description: 'Japans most prestigious research university, a global leader in the natural sciences, engineering, medicine, and the humanities.',
      mission: 'To advance knowledge and contribute to society through world-class research and education.',
      history: 'Founded in 1877 as the first imperial university in Japan.',
      accreditation: 'Accredited by the Japan University Accreditation Association.',
      ranking: 'Ranked among the top 30 universities in the world.',
      researchAreas: ['Physics', 'Engineering', 'Medicine', 'Materials Science', 'Artificial Intelligence'],
      academicDisciplines: ['Science', 'Engineering', 'Medicine', 'Law', 'Economics', 'Humanities'],
      campusLocations: ['Hongo Campus', 'Komaba Campus', 'Kashiwa Campus'],
      verificationStatus: 'Trusted',
      trustScore: 96,
      verificationHistory: [
        { type: 'Government', status: 'Verified', verifiedAt: '2025-11-20', details: 'JUAA accreditation confirmed.' },
      ],
      faculties: ['Graduate School of Engineering', 'Graduate School of Science', 'Graduate School of Medicine', 'Graduate School of Law and Politics'],
      schools: ['Graduate School of Economics', 'Graduate School of Information Science and Technology'],
      colleges: ['College of Arts and Sciences', 'Faculty of Medicine'],
      departments: ['Department of Mechanical Engineering', 'Department of Physics', 'Department of Medicine', 'Department of Law'],
      researchCentres: ['Kavli Institute for the Physics and Mathematics of the Universe', 'UTokyo Center for Integrative AI', 'Earthquake Research Institute'],
      institutes: ['Institute of Industrial Science', 'Institute of Medical Science'],
      libraries: ['University of Tokyo Library System'],
      administrativeUnits: ['Executive Office', 'Office of Research and Innovation'],
      campuses: ['Hongo', 'Komaba', 'Kashiwa'],
      affiliations: [],
      studentCount: 28000,
      facultyCount: 3800,
      programCount: 250,
      foundedYear: 1877,
      lastVerifiedAt: '2025-11-20',
    }),
    campuses: [
      { id: 'utokyo-hongo', name: 'Hongo Campus', city: 'Bunkyo', country: 'Japan', address: '7-3-1 Hongo, Bunkyo-ku, Tokyo', establishedYear: 1877, areaHectares: 54, faculties: ['Graduate School of Engineering', 'Graduate School of Science', 'Graduate School of Medicine'], facilities: ['Yasuda Auditorium', 'Sanshiro Pond', 'General Library'], studentCount: 15000, academicStaffCount: 2100, coordinates: { latitude: 35.7138, longitude: 139.762 } },
      { id: 'utokyo-komaba', name: 'Komaba Campus', city: 'Meguro', country: 'Japan', address: '3-8-1 Komaba, Meguro-ku, Tokyo', establishedYear: 1949, areaHectares: 30, faculties: ['College of Arts and Sciences'], facilities: ['Komaba Campus Library'], studentCount: 8000, academicStaffCount: 1000, coordinates: { latitude: 35.6581, longitude: 139.6863 } },
      { id: 'utokyo-kashiwa', name: 'Kashiwa Campus', city: 'Kashiwa', country: 'Japan', address: '5-1-5 Kashiwanoha, Kashiwa, Chiba', establishedYear: 2000, areaHectares: 80, faculties: ['Graduate School of Frontier Sciences'], facilities: ['Kavli IPMU', 'Transdisciplinary Research Area'], studentCount: 5000, academicStaffCount: 800, coordinates: { latitude: 35.9094, longitude: 139.941 } },
    ],
    faculties: [
      { id: 'utokyo-fac-eng', name: 'Graduate School of Engineering', shortName: 'ENG', dean: 'Prof. K. Sato', establishedYear: 1886, departments: ['Department of Mechanical Engineering', 'Department of Electrical Engineering'], programmes: ['Mechanical Engineering', 'Electrical Engineering'], studentCount: 5000, academicStaffCount: 900, researchFocus: ['Robotics', 'Energy'] },
      { id: 'utokyo-fac-sci', name: 'Graduate School of Science', shortName: 'SCI', dean: 'Prof. T. Nakamura', establishedYear: 1886, departments: ['Department of Physics', 'Department of Chemistry'], programmes: ['Physics', 'Chemistry'], studentCount: 4000, academicStaffCount: 800, researchFocus: ['High Energy Physics', 'Materials'] },
      { id: 'utokyo-fac-med', name: 'Graduate School of Medicine', shortName: 'MED', dean: 'Prof. H. Yoshida', establishedYear: 1880, departments: ['Department of Medicine', 'Department of Neurology'], programmes: ['Medicine', 'Medical Science'], studentCount: 3000, academicStaffCount: 900, researchFocus: ['Neuroscience', 'Regenerative Medicine'] },
      { id: 'utokyo-fac-law', name: 'Graduate School of Law and Politics', shortName: 'LAW', dean: 'Prof. M. Tanaka', establishedYear: 1877, departments: ['Department of Law'], programmes: ['Law', 'Political Science'], studentCount: 2000, academicStaffCount: 300, researchFocus: ['Constitutional Law', 'Comparative Law'] },
    ],
    schools: [
      { id: 'utokyo-sch-econ', name: 'Graduate School of Economics', shortName: 'ECON', director: 'Prof. Y. Fujii', establishedYear: 1919, focusAreas: ['Economics', 'Management'], programmeCount: 8, studentCount: 1500 },
      { id: 'utokyo-sch-ist', name: 'Graduate School of Information Science and Technology', shortName: 'IST', director: 'Prof. A. Kobayashi', establishedYear: 1999, focusAreas: ['Computer Science', 'AI'], programmeCount: 10, studentCount: 1800 },
    ],
    departments: [
      { id: 'utokyo-dept-mech', name: 'Department of Mechanical Engineering', facultyName: 'Graduate School of Engineering', head: 'Prof. K. Sato', establishedYear: 1886, researchAreas: ['Robotics', 'Thermal Engineering'], programmes: ['BEng Mechanical', 'PhD Mechanical'], academicStaffCount: 80, studentCount: 1200, laboratories: ['Robotics Laboratory'] },
      { id: 'utokyo-dept-phys', name: 'Department of Physics', facultyName: 'Graduate School of Science', head: 'Prof. T. Nakamura', establishedYear: 1886, researchAreas: ['High Energy Physics', 'Cosmology'], programmes: ['BSc Physics', 'PhD Physics'], academicStaffCount: 110, studentCount: 800, laboratories: ['High Energy Physics Laboratory'] },
      { id: 'utokyo-dept-med', name: 'Department of Medicine', facultyName: 'Graduate School of Medicine', head: 'Prof. H. Yoshida', establishedYear: 1880, researchAreas: ['Neuroscience', 'Gerontology'], programmes: ['Medicine', 'PhD Medicine'], academicStaffCount: 220, studentCount: 900, laboratories: ['Neuroscience Laboratory'] },
      { id: 'utokyo-dept-law', name: 'Department of Law', facultyName: 'Graduate School of Law and Politics', head: 'Prof. M. Tanaka', establishedYear: 1877, researchAreas: ['Constitutional Law', 'International Law'], programmes: ['Law', 'Political Science'], academicStaffCount: 90, studentCount: 700, laboratories: [] },
    ],
    researchCentres: [
      { id: 'utokyo-centre-kavli', name: 'Kavli Institute for the Physics and Mathematics of the Universe', acronym: 'Kavli IPMU', director: 'Prof. T. Nakamura', establishedYear: 2007, researchThemes: ['Cosmology', 'Particle Physics'], staffCount: 120, activeProjects: 30, publications: 1200, fundingAwarded: 20000000, description: 'World-leading institute for the physics and mathematics of the universe.' },
      { id: 'utokyo-centre-ai', name: 'UTokyo Center for Integrative AI', acronym: 'UTIA', director: 'Prof. A. Kobayashi', establishedYear: 2021, researchThemes: ['AI', 'Robotics'], staffCount: 90, activeProjects: 25, publications: 700, fundingAwarded: 12000000, description: 'University-wide integrative AI research centre.' },
    ],
    laboratories: [
      { id: 'utokyo-lab-robot', name: 'Robotics Laboratory', departmentName: 'Department of Mechanical Engineering', director: 'Prof. K. Sato', establishedYear: 1990, focusAreas: ['Humanoid Robots', 'Manipulation'], equipment: ['Robot Platforms', 'Motion Capture'], capacity: 40, accessLevel: 'Restricted' },
      { id: 'utokyo-lab-hep', name: 'High Energy Physics Laboratory', departmentName: 'Department of Physics', director: 'Prof. T. Nakamura', establishedYear: 1970, focusAreas: ['Detectors', 'Data Analysis'], equipment: ['Test Stands', 'Compute Farms'], capacity: 30, accessLevel: 'Restricted' },
      { id: 'utokyo-lab-neuro', name: 'Neuroscience Laboratory', departmentName: 'Department of Medicine', director: 'Prof. H. Yoshida', establishedYear: 2005, focusAreas: ['Brain Imaging', 'Neurodegeneration'], equipment: ['fMRI', 'Microscopes'], capacity: 35, accessLevel: 'Controlled' },
    ],
    administrativeUnits: [
      { id: 'utokyo-admin-exec', name: 'Executive Office', director: 'Mr. T. Suzuki', responsibilities: ['Governance', 'Finance'], staffCount: 300, reportsTo: 'President' },
      { id: 'utokyo-admin-research', name: 'Office of Research and Innovation', director: 'Prof. S. Yamada', responsibilities: ['Grants', 'Technology transfer'], staffCount: 100, reportsTo: 'Executive Vice President (Research)' },
    ],
    statistics: {
      students: 28000, faculty: 3800, staff: 4200, internationalStudents: 4000, alumni: 380000, programmes: 250, faculties: 10, departments: 120, researchCentres: 60, laboratories: 140, campuses: 3, postgraduates: 14000, undergraduates: 14000, acceptanceRate: 13, graduationRate: 95,
    },
    rankings: [
      { id: 'utokyo-rank-qs-2025', source: 'QS World University Rankings', year: 2025, category: 'Overall', rank: 28, totalRanked: 1503, percentile: 2, region: 'Asia' },
      { id: 'utokyo-rank-times-2025', source: 'THE World University Rankings', year: 2025, category: 'Overall', rank: 39, totalRanked: 1904, percentile: 2, region: 'Asia' },
      { id: 'utokyo-rank-arwu-2025', source: 'ARWU Shanghai Ranking', year: 2025, category: 'Overall', rank: 28, totalRanked: 1000, percentile: 3, region: 'Asia' },
    ],
    accreditations: [
      { id: 'utokyo-acc-juaa', body: 'Japan University Accreditation Association', country: 'Japan', status: 'Accredited', awardedYear: 1951, scope: 'Full institutional accreditation', certification: 'JUAA-UTOKYO-1951' },
      { id: 'utokyo-acc-ncee', body: 'National Institution for Academic Degrees and Quality Enhancement', country: 'Japan', status: 'Accredited', awardedYear: 2004, scope: 'National university certification' },
    ],
    researchOutputs: [
      { id: 'utokyo-out-1', title: 'Cosmological constraints from the Kavli IPMU survey', type: 'Journal Article', year: 2025, authors: ['T. Nakamura'], venue: 'Physical Review D', citations: 33, doi: '10.1000/utokyo.2025.0001' },
      { id: 'utokyo-out-2', title: 'Humanoid robotics for disaster response', type: 'Journal Article', year: 2024, authors: ['K. Sato'], venue: 'IEEE Transactions on Robotics', citations: 27, doi: '10.1000/utokyo.2024.0002' },
      { id: 'utokyo-out-3', title: 'Tokyo metropolitan sensing dataset', type: 'Dataset', year: 2024, authors: ['A. Kobayashi'], venue: 'Scholatia Data Repository', citations: 9, doi: '10.1000/utokyo.2024.0003' },
      { id: 'utokyo-out-4', title: 'Neurodegeneration and aging biomarkers', type: 'Journal Article', year: 2023, authors: ['H. Yoshida'], venue: 'Nature Medicine', citations: 41, doi: '10.1000/utokyo.2023.0004' },
      { id: 'utokyo-out-5', title: 'Comparative constitutionalism in Asia', type: 'Book', year: 2023, authors: ['M. Tanaka'], venue: 'University of Tokyo Press', citations: 10, doi: '10.1000/utokyo.2023.0005' },
    ],
    grants: [
      { id: 'utokyo-grant-1', source: 'Japan Science and Technology Agency', type: 'Grant', amount: 12000000, currency: 'USD', year: 2025, description: 'AI and robotics national programme.' },
      { id: 'utokyo-grant-2', source: 'Japan Society for the Promotion of Science', type: 'Grant', amount: 9000000, currency: 'USD', year: 2024, description: 'Basic science research grants.' },
    ],
    funding: [
      { id: 'utokyo-fund-1', source: 'National University Corporation Budget', type: 'Government Allocation', amount: 520000000, currency: 'USD', year: 2025, description: 'Japanese national university operating grant.' },
      { id: 'utokyo-fund-2', source: 'UTokyo Endowment', type: 'Endowment', amount: 1800000000, currency: 'USD', year: 2025, description: 'Institutional endowment.' },
    ],
    partnerships: [
      { id: 'utokyo-partner-1', title: 'University of Oxford', detail: 'Academic exchange' },
      { id: 'utokyo-partner-2', title: 'National University of Singapore', detail: 'Asia-Pacific alliance' },
    ],
    memberships: [
      { id: 'utokyo-mem-1', organisation: 'Association of Pacific Rim Universities', role: 'Founding Member', sinceYear: 1997, status: 'Active' },
      { id: 'utokyo-mem-2', organisation: 'Japan Association of National Universities', role: 'Member', sinceYear: 1950, status: 'Active' },
    ],
    timeline: [
      { id: 'utokyo-time-1', date: '1877', title: 'Founded', detail: 'Founded as the University of Tokyo, the first imperial university.', type: 'Founded' },
      { id: 'utokyo-time-2', date: '1886', title: 'Imperial university', detail: 'Renamed the Imperial University of Japan.', type: 'Leadership' },
      { id: 'utokyo-time-3', date: '2007', title: 'Kavli IPMU', detail: 'Kavli Institute for the Physics and Mathematics of the Universe established.', type: 'Research' },
      { id: 'utokyo-time-4', date: '2021', title: 'AI centre', detail: 'Center for Integrative AI launched.', type: 'Research' },
      { id: 'utokyo-time-5', date: '2025', title: 'Top 30 worldwide', detail: 'Ranked among the top 30 universities globally.', type: 'Ranking' },
    ],
  }),
];

export const FEATURED_INSTITUTION: Institution = INSTITUTIONS[0];

export const ALL_INSTITUTION_RANKINGS: InstitutionRanking[] = INSTITUTIONS.flatMap(
  (institution) => institution.rankings
);

export const ALL_INSTITUTION_ACCREDITATIONS: InstitutionAccreditation[] = INSTITUTIONS.flatMap(
  (institution) => institution.accreditations
);

export const ALL_INSTITUTION_FUNDING: InstitutionFunding[] = [
  ...INSTITUTIONS.flatMap((institution) => institution.funding),
  ...INSTITUTIONS.flatMap((institution) => institution.grants),
];

export const ALL_INSTITUTION_TIMELINE_ENTRIES: InstitutionTimelineEntry[] = INSTITUTIONS.flatMap(
  (institution) => institution.timeline
);

export const ALL_INSTITUTION_MEMBERSHIPS: InstitutionMembership[] = INSTITUTIONS.flatMap(
  (institution) => institution.memberships
);

function buildPortfolioStatistics(institutions: Institution[]): InstitutionPortfolioStatistics {
  const countries = new Set(institutions.map((institution) => institution.country));
  const universities = institutions.filter(
    (institution) => institution.profile.institutionType === 'University'
  ).length;
  const researchInstitutes = institutions.filter(
    (institution) => institution.profile.institutionType === 'Research Institute'
  ).length;
  const verified = institutions.filter((institution) =>
    ['Verified', 'Trusted'].includes(institution.profile.verificationStatus)
  ).length;
  const accredited = institutions.filter(
    (institution) => institution.accreditations.length > 0
  ).length;
  const avgTrustScore = Math.round(
    institutions.reduce((sum, institution) => sum + institution.profile.trustScore, 0) /
      institutions.length
  );

  return {
    totalInstitutions: institutions.length,
    totalCountries: countries.size,
    totalUniversities: universities,
    totalResearchInstitutes: researchInstitutes,
    totalStudents: institutions.reduce((sum, institution) => sum + institution.statistics.students, 0),
    totalFaculty: institutions.reduce((sum, institution) => sum + institution.statistics.faculty, 0),
    totalCampuses: institutions.reduce((sum, institution) => sum + institution.campuses.length, 0),
    totalFaculties: institutions.reduce((sum, institution) => sum + institution.faculties.length, 0),
    totalDepartments: institutions.reduce((sum, institution) => sum + institution.departments.length, 0),
    totalResearchCentres: institutions.reduce(
      (sum, institution) => sum + institution.researchCentres.length,
      0
    ),
    totalLaboratories: institutions.reduce(
      (sum, institution) => sum + institution.laboratories.length,
      0
    ),
    totalPublications: institutions.reduce(
      (sum, institution) => sum + institution.analytics.publications,
      0
    ),
    totalResearchers: institutions.reduce(
      (sum, institution) => sum + institution.researchers.length,
      0
    ),
    totalGrants: institutions.reduce((sum, institution) => sum + institution.grants.length, 0),
    totalPartnerships: institutions.reduce(
      (sum, institution) => sum + institution.partnerships.length,
      0
    ),
    verifiedInstitutions: verified,
    accreditedInstitutions: accredited,
    avgTrustScore,
  };
}

export const INSTITUTION_PORTFOLIO_STATISTICS: InstitutionPortfolioStatistics =
  buildPortfolioStatistics(INSTITUTIONS);

/**
 * Lifecycle integration: institutions support every stage of the canonical
 * Scholatia research lifecycle. This array is derived entirely from the
 * `ResearchLifecycleEngine` so no lifecycle logic is duplicated by this module.
 */
export const INSTITUTION_LIFECYCLE_COVERAGE: InstitutionLifecycleCoverage[] =
  ResearchLifecycleEngine.getAllStages().map((stage) => ({
    stageId: stage.id,
    name: stage.name,
    description: stage.description,
    icon: stage.icon,
    order: stage.order,
    completionPercentage: ResearchLifecycleEngine.getCompletionPercentage(stage.id),
    previousStage: ResearchLifecycleEngine.getPreviousStage(stage.id)?.name ?? null,
    nextStage: ResearchLifecycleEngine.getNextStage(stage.id)?.name ?? null,
  }));
