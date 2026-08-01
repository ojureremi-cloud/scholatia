import type {
  AcademicBiography,
  AcademicIdentity,
  AcademicNetwork,
  AcademicPosition,
  Availability,
  ConferenceParticipation,
  ContactInformation,
  EditorialAppointment,
  IdentityVerification,
  Language,
  ResearcherLifecycleCoverage,
  ResearcherProfile,
  ResearcherRelationships,
  ResearcherStatistics,
  SocialLinks,
  SupervisionPortfolio,
  TeachingPortfolio,
} from '@/types/researcher';
import { VerificationLevel } from '@/types/identity';
import { ResearchLifecycleEngine } from '@/lib/lifecycle';
import { createAcademicIdentity, generateResearcherSlug, summarizeResearcherPortfolio } from '@/lib/researchers';
import { createSaidIdentifier } from '@/lib/said';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS, RESEARCH_TEAM } from '@/constants/placeholder-research';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';

/**
 * Placeholder data for the Researcher Identity Platform (Scholatia Phase 1.4).
 *
 * 22 realistic researchers. Every researcher owns a permanent SAID identity, a
 * personal academic username (e.g. `ojuri`, `smith`, `adebayo`), and the full
 * personal academic website ecosystem: biography, position, education,
 * employment, skills, languages, awards, grants, patents, teaching, supervision,
 * editorial appointments, conference participation, media coverage, analytics,
 * verification, and cross-module relationships.
 *
 * Cross-module references (projects, datasets, manuscripts, publications,
 * journals, conferences, grants, collaborators, institutions) are sourced from
 * the existing placeholder modules so no data is duplicated and every reference
 * stays live.
 */

type ResearcherSeed = Partial<
  Omit<
    ResearcherProfile,
    | 'identity'
    | 'position'
    | 'biography'
    | 'contact'
    | 'verification'
    | 'availability'
    | 'socialLinks'
    | 'teaching'
    | 'supervision'
    | 'network'
  >
> & {
  identity?: Partial<AcademicIdentity>;
  position?: Partial<AcademicPosition>;
  biography?: Partial<AcademicBiography>;
  contact?: Partial<ContactInformation>;
  verification?: Partial<IdentityVerification>;
  availability?: Partial<Availability>;
  socialLinks?: Partial<SocialLinks>;
  teaching?: Partial<TeachingPortfolio>;
  supervision?: Partial<SupervisionPortfolio>;
  network?: Partial<AcademicNetwork>;
};

const PLACEHOLDER_BADGES = ['SAID Verified', 'Institution Verified', 'ORCID Linked', 'Publication Verified'];

const DEFAULT_VERIFICATION: IdentityVerification = {
  verified: true,
  verificationLevel: VerificationLevel.PublicationVerified,
  verificationStatus: 'Verified',
  identityScore: 84,
  trustScore: 82,
  visibilityScore: 76,
  badges: PLACEHOLDER_BADGES,
  lastVerified: '2026-05-15',
  verificationSteps: [
    { label: 'Email address verified', status: 'verified', detail: 'Institutional email confirmed.' },
    { label: 'Identity verified', status: 'verified', detail: 'Government-issued identification reviewed.' },
    { label: 'Institution affiliation verified', status: 'verified', detail: 'Affiliation confirmed with the institution.' },
    { label: 'ORCID linked', status: 'verified', detail: 'ORCID iD connected and trusted.' },
    { label: 'Publications verified', status: 'verified', detail: 'Publication records cross-checked against DOI metadata.' },
  ],
  academicAchievements: ['Fellow of a national academy', 'Editorial board service', 'Grant funding leadership'],
};

const DEFAULT_AVAILABILITY: Availability = {
  openToCollaboration: true,
  openToSupervision: true,
  openToMentoring: true,
  openToReviewing: true,
  openToConsulting: false,
  availableForSpeaking: true,
  responseTime: 'Within 5 working days',
  preferredContact: 'Professional email',
};

const DEFAULT_SOCIAL: SocialLinks = {
  others: [
    { label: 'Google Scholar', href: 'https://scholar.google.com' },
    { label: 'Scopus', href: 'https://www.scopus.com' },
    { label: 'Web of Science', href: 'https://www.webofscience.com' },
  ],
};

const PROJECT_POOL = WORKSPACE_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  detail: `Status: ${project.status}`,
}));

const PUBLICATION_POOL = WORKSPACE_PUBLICATIONS.map((publication) => ({
  id: `pub-${publication.doi}`,
  title: publication.title,
  detail: `${publication.journal} · ${publication.year}`,
}));

const DATASET_POOL = DATASETS.map((dataset) => ({
  id: dataset.id,
  title: dataset.title,
  detail: dataset.doi,
}));

const MANUSCRIPT_POOL = MANUSCRIPTS.map((manuscript) => ({
  id: manuscript.id,
  title: manuscript.title,
  detail: `Status: ${manuscript.status}`,
}));

const JOURNAL_POOL = JOURNALS.map((journal) => ({
  id: journal.journalId,
  title: journal.journalTitle,
  detail: journal.country ?? 'International journal',
}));

const CONFERENCE_POOL = CONFERENCES.map((conference) => ({
  id: conference.conferenceId,
  title: conference.shortTitle ?? conference.title,
  detail: `${conference.city ?? 'Location'} · ${conference.startDate ?? conference.conferenceCode}`,
}));

const GRANT_POOL = WORKSPACE_PROJECTS.map((project) => ({
  id: `grant-${project.id}`,
  title: project.name,
  detail: project.fundingSource ?? 'Institutional funding',
}));

const AWARD_POOL = [
  { id: 'award-best-paper', title: 'Best Paper Award', detail: 'Flagship international venue' },
  { id: 'award-young-investigator', title: 'Young Investigator Award', detail: 'National research council' },
  { id: 'award-fellowship', title: 'Research Fellowship', detail: 'Competitive national fellowship' },
  { id: 'award-excellence', title: 'Excellence in Research Award', detail: 'University research office' },
  { id: 'award-mentoring', title: 'Excellence in Mentoring', detail: 'Graduate school recognition' },
];

const COLLABORATOR_POOL = RESEARCH_TEAM.map((member) => ({
  id: `collab-${generateResearcherSlug(member.name)}`,
  title: member.name,
  detail: `${member.role} • ${member.institution}`,
  username: member.activeProjects % 2 === 0 ? generateResearcherSlug(member.name) : undefined,
}));

const INSTITUTION_POOL = INSTITUTIONS.slice(0, 12).map((institution) => ({
  id: institution.said,
  title: institution.profile.institutionName,
  detail: institution.country,
}));

function sliceRotate<T>(items: T[], index: number, count: number): T[] {
  if (items.length === 0) return [];
  const start = (index * 5) % items.length;
  const rotated = [...items.slice(start), ...items.slice(0, start)];
  return rotated.slice(0, Math.min(count, items.length));
}

function citationTrendFor(index: number) {
  return Array.from({ length: 10 }, (_, offset) => ({
    year: `${2016 + offset}`,
    citations: Math.max(
      4,
      Math.round((20 + index * 7) * (0.2 + offset * 0.14) * (0.9 + (index % 4) * 0.06))
    ),
  }));
}

function buildRelationships(index: number): ResearcherRelationships {
  return {
    projects: sliceRotate(PROJECT_POOL, index, 4),
    datasets: sliceRotate(DATASET_POOL, index, 3),
    manuscripts: sliceRotate(MANUSCRIPT_POOL, index, 3),
    publications: sliceRotate(PUBLICATION_POOL, index, 5),
    journals: sliceRotate(JOURNAL_POOL, index, 2),
    conferences: sliceRotate(CONFERENCE_POOL, index, 3),
    grants: sliceRotate(GRANT_POOL, index, 3),
    awards: sliceRotate(AWARD_POOL, index, 2),
    collaborators: sliceRotate(COLLABORATOR_POOL, index, 4),
    institutions: sliceRotate(INSTITUTION_POOL, index, 3),
  };
}

function buildMetrics(profile: ResearcherProfile) {
  const totalCitations = profile.impact.citationMetrics.totalCitations;
  const hIndex = profile.impact.citationMetrics.hIndex;
  return {
    totalPublications: profile.portfolio.totalPublications,
    totalCitations,
    totalDownloads: profile.impact.downloads,
    totalReads: profile.impact.reads,
    totalFollowers: profile.network.followers,
    totalCollaborators: profile.network.collaborators.length,
    totalProjects: profile.portfolio.totalProjects,
    totalGrants: profile.grantParticipation.length,
    totalAwards: profile.awards.length,
    totalPatents: profile.patents.length,
    totalDatasets: profile.portfolio.totalDatasets,
    hIndex,
  };
}

function buildTimeline(profile: ResearcherProfile) {
  const entries = [
    ...profile.education.map((entry) => ({
      id: `timeline-education-${entry.id}`,
      date: entry.startDate,
      title: `${entry.degree} — ${entry.institution}`,
      detail: entry.field,
      type: 'Education' as const,
    })),
    ...profile.employment.map((entry) => ({
      id: `timeline-employment-${entry.id}`,
      date: entry.startDate,
      title: `${entry.role} — ${entry.organisation}`,
      detail: entry.department ?? 'Academic appointment',
      type: 'Employment' as const,
    })),
    ...profile.awards.map((entry) => ({
      id: `timeline-award-${entry.id}`,
      date: entry.year,
      title: entry.title,
      detail: entry.organisation,
      type: 'Award' as const,
    })),
    ...profile.grantParticipation.map((entry) => ({
      id: `timeline-grant-${entry.id}`,
      date: entry.period,
      title: entry.title,
      detail: `${entry.funder} · ${entry.role}`,
      type: 'Grant' as const,
    })),
    ...profile.relationships.publications.map((entry, offset) => ({
      id: `timeline-publication-${entry.id}-${offset}`,
      date: entry.detail?.split('·')[1]?.trim() ?? '2025',
      title: entry.title,
      detail: entry.detail ?? 'Publication',
      type: 'Publication' as const,
    })),
    ...profile.relationships.conferences.map((entry) => ({
      id: `timeline-conference-${entry.id}`,
      date: '2025',
      title: entry.title,
      detail: entry.detail ?? 'Conference participation',
      type: 'Conference' as const,
    })),
  ];
  const deduped = new Map(entries.map((entry) => [entry.id, entry]));
  return [...deduped.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);
}

function buildAnalytics(profile: ResearcherProfile) {
  const publicationsPerYear = (profile.portfolio.totalPublications / 5).toFixed(1);
  const base = Math.round(parseFloat(publicationsPerYear));
  return {
    profileViews: profile.visibility.profileViews,
    downloads: profile.impact.downloads,
    reads: profile.impact.reads,
    citations: profile.impact.citationMetrics.totalCitations,
    followers: profile.network.followers,
    collaborators: profile.network.collaborators.length,
    publicationTrend: [2023, 2024, 2025].map((year, offset) => ({
      period: `${year}`,
      publications: Math.max(1, base + offset * 2 + (profile.portfolio.totalProjects % 3)),
    })),
    citationTrend: profile.impact.citationMetrics.citationsByYear,
    popularPublications: profile.relationships.publications.slice(0, 3).map((entry, offset) => ({
      title: entry.title,
      views: 800 - offset * 120,
    })),
    topCountries: [
      { country: profile.country, views: 1200 },
      { country: 'United Kingdom', views: 640 },
      { country: 'United States', views: 480 },
    ],
    analyticsPeriod: 'Last 12 months',
  };
}

function buildProfileCompletion(profile: ResearcherProfile) {
  const checks = [
    { label: 'Academic identity', complete: Boolean(profile.identity.said && profile.identity.orcid) },
    { label: 'Biography', complete: profile.biography.professionalSummary.length > 0 },
    { label: 'Position', complete: profile.position.institution.length > 0 },
    { label: 'Research interests', complete: profile.interests.length > 0 },
    { label: 'Education history', complete: profile.education.length > 0 },
    { label: 'Employment history', complete: profile.employment.length > 0 },
    { label: 'Skills', complete: profile.skills.length > 0 },
    { label: 'Languages', complete: profile.languages.length > 0 },
    { label: 'Social profiles', complete: Boolean(profile.socialLinks.personalWebsite || profile.socialLinks.linkedin) },
    { label: 'Contact information', complete: profile.contact.professionalEmail.length > 0 },
    { label: 'Identity verification', complete: profile.verification.verified },
    { label: 'Awards', complete: profile.awards.length > 0 },
    { label: 'Publications', complete: profile.relationships.publications.length > 0 },
    { label: 'Projects', complete: profile.relationships.projects.length > 0 },
    { label: 'Teaching portfolio', complete: profile.teaching.courses.length > 0 },
    { label: 'Availability', complete: profile.availability.openToCollaboration },
  ];
  const completedFields = checks.filter((check) => check.complete).length;
  return {
    score: Math.round((completedFields / checks.length) * 100),
    totalFields: checks.length,
    completedFields,
    remainingFields: checks.filter((check) => !check.complete).map((check) => check.label),
  };
}

function buildRecentActivity(profile: ResearcherProfile) {
  const top = profile.timeline.slice(0, 3).map((entry) => ({
    id: `activity-${entry.id}`,
    date: entry.date,
    title: entry.title,
    detail: entry.detail,
    type: entry.type,
  }));
  const completion = profile.profileCompletion;
  return [
    ...top,
    {
      id: 'activity-profile',
      date: '2026-07-01',
      title: 'Profile updated',
      detail: `${completion.completedFields} of ${completion.totalFields} identity fields complete.`,
      type: 'Profile',
    },
  ];
}

function buildBaseResearcher(index: number): ResearcherProfile {
  const username = `researcher-${index}`;
  const firstName = 'Researcher';
  const lastName = `${index}`;
  const trend = citationTrendFor(index);
  const totalCitations = trend.reduce((sum, entry) => sum + entry.citations, 0);
  const hIndex = 8 + (index % 13);
  const i10Index = hIndex + 2 + (index % 4);
  const totalPublications = 14 + index * 3;
  const relationships = buildRelationships(index);
  const basePosition = {
    title: 'Research Scientist' as const,
    institution: 'Scholatia Partner Institution',
    faculty: 'Faculty of Science',
    department: 'Department of Research',
    country: 'United Kingdom',
    employmentType: 'Full-time' as const,
    startDate: '2018-01-01',
    current: true,
    researchFocus: ['Scholarly communication'],
  };
  const baseIdentity = createAcademicIdentity(firstName, lastName, index);
  const profile: ResearcherProfile = {
    username,
    displayName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    avatar: '🧑‍🔬',
    country: 'United Kingdom',
    identity: baseIdentity,
    position: basePosition,
    biography: {
      professionalSummary: 'A verified researcher on the Scholatia network.',
      academicSummary: 'Active research career with published outputs and verified institutional links.',
      shortBiography: 'A verified researcher on the Scholatia network.',
      fullBiography: 'A verified researcher on the Scholatia network.',
      areasOfExpertise: ['Research'],
    },
    interests: [],
    researchAreas: [],
    education: [],
    employment: [],
    memberships: [],
    awards: [],
    honors: [],
    certifications: [],
    skills: [],
    languages: [],
    socialLinks: { ...DEFAULT_SOCIAL },
    network: {
      collaborators: [],
      institutionalPartners: [],
      professionalNetwork: 120 + index * 40,
      followers: 120 + index * 85,
      following: 60 + index * 12,
      coAuthors: 10 + index * 3,
    },
    timeline: [],
    portfolio: {
      totalProjects: 4 + (index % 8),
      activeProjects: 2 + (index % 4),
      completedProjects: 2 + (index % 4),
      totalDatasets: 2 + (index % 5),
      totalManuscripts: relationships.manuscripts.length,
      totalPublications,
      journalArticles: Math.round(totalPublications * 0.6),
      conferencePapers: Math.round(totalPublications * 0.25),
      books: 1 + (index % 3),
      bookChapters: 2 + (index % 3),
      preprints: 1 + (index % 3),
      technicalReports: 1 + (index % 2),
      totalPatents: index % 4,
      software: 1 + (index % 3),
      teachingCourses: 3 + (index % 4),
      supervisedStudents: 3 + (index % 6),
    },
    metrics: {
      totalPublications,
      totalCitations,
      totalDownloads: 1500 + index * 900,
      totalReads: 6000 + index * 1400,
      totalFollowers: 120 + index * 85,
      totalCollaborators: COLLABORATOR_POOL.length,
      totalProjects: 4 + (index % 8),
      totalGrants: 3 + (index % 6),
      totalAwards: 2 + (index % 5),
      totalPatents: index % 4,
      totalDatasets: 2 + (index % 5),
    },
    impact: {
      citationMetrics: {
        totalCitations,
        hIndex,
        i10Index,
        citationsByYear: trend,
        mostCitedWork: PUBLICATION_POOL[0]?.title,
      },
      altmetricMetrics: {
        score: 40 + (index % 45),
        mentions: 200 + index * 60,
        news: 3 + (index % 6),
        blogs: 8 + (index % 12),
        twitter: 140 + index * 40,
        facebook: 20 + index * 8,
        policy: 1 + (index % 3),
        wikipedia: 2 + (index % 4),
        patents: index % 3,
        mendeley: 60 + index * 22,
        dimensions: 90 + index * 30,
      },
      collaborationMetrics: {
        totalCollaborators: COLLABORATOR_POOL.length,
        totalCoAuthors: 10 + index * 3,
        institutionalPartners: 3 + (index % 4),
        internationalCollaborations: 4 + (index % 5),
        collaborationCountries: ['United Kingdom', 'Germany', 'Kenya', 'United States'],
        avgCollaboratorsPerPaper: 3,
      },
      hIndex,
      i10Index,
      downloads: 1500 + index * 900,
      reads: 6000 + index * 1400,
    },
    visibility: {
      visibilityScore: 72 + (index % 20),
      profileViews: 4000 + index * 1500,
      monthlyVisitors: 300 + index * 90,
      monthlyDownloads: 120 + index * 40,
      searchAppearances: 900 + index * 300,
      countriesReached: 24 + index * 2,
      topReferrers: [
        { name: 'Google Scholar', count: 900 },
        { name: 'Institution website', count: 320 },
        { name: 'LinkedIn', count: 210 },
      ],
    },
    teaching: {
      courses: [],
      totalCourses: 3 + (index % 4),
      currentCourses: 1,
      totalStudents: 120 + index * 40,
      teachingExperience: `${3 + (index % 12)} years of university teaching`,
      teachingAwards: [],
    },
    supervision: {
      students: [],
      currentPhd: 1,
      completedPhd: 1,
      currentMasters: 1,
      completedMasters: 2,
      totalSupervised: 3 + (index % 6),
    },
    editorialAppointments: [],
    conferenceParticipation: [],
    grantParticipation: [],
    patents: [],
    innovations: [],
    startups: [],
    mediaCoverage: [],
    publicEngagement: [],
    communityService: [],
    volunteerExperience: [],
    availability: { ...DEFAULT_AVAILABILITY },
    contact: {
      email: `researcher${index}@scholatia.org`,
      professionalEmail: `researcher${index}@example.edu`,
      country: 'United Kingdom',
      timezone: 'Europe/London',
    },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 78 + (index % 20),
      trustScore: 74 + (index % 25),
      visibilityScore: 72 + (index % 20),
    },
    analytics: {
      profileViews: 4000 + index * 1500,
      downloads: 1500 + index * 900,
      reads: 6000 + index * 1400,
      citations: totalCitations,
      followers: 120 + index * 85,
      collaborators: COLLABORATOR_POOL.length,
      publicationTrend: [],
      citationTrend: trend,
      analyticsPeriod: 'Last 12 months',
    },
    relationships,
    recentActivity: [],
    profileCompletion: {
      score: 60,
      totalFields: 16,
      completedFields: 10,
      remainingFields: [],
    },
  };
  return {
    ...profile,
    timeline: buildTimeline(profile),
    analytics: { ...profile.analytics, publicationTrend: buildAnalytics(profile).publicationTrend },
    recentActivity: buildRecentActivity({ ...profile, timeline: profile.timeline }),
    profileCompletion: buildProfileCompletion(profile),
  };
}

function mergeTeaching(base: TeachingPortfolio, seed?: Partial<TeachingPortfolio>): TeachingPortfolio {
  const merged = { ...base, ...seed };
  return {
    ...merged,
    courses: seed?.courses ?? base.courses,
    teachingAwards: seed?.teachingAwards ?? base.teachingAwards,
  };
}

function mergeSupervision(base: SupervisionPortfolio, seed?: Partial<SupervisionPortfolio>): SupervisionPortfolio {
  const merged = { ...base, ...seed };
  return {
    ...merged,
    students: seed?.students ?? base.students,
  };
}

function makeResearcher(index: number, seed: ResearcherSeed): ResearcherProfile {
  const base = buildBaseResearcher(index);
  const merged: ResearcherProfile = {
    ...base,
    ...seed,
    identity: { ...base.identity, ...seed.identity },
    position: { ...base.position, ...seed.position },
    biography: { ...base.biography, ...seed.biography },
    contact: { ...base.contact, ...seed.contact },
    verification: { ...base.verification, ...seed.verification },
    availability: { ...base.availability, ...seed.availability },
    socialLinks: { ...base.socialLinks, ...seed.socialLinks },
    teaching: mergeTeaching(base.teaching, seed.teaching),
    supervision: mergeSupervision(base.supervision, seed.supervision),
    network: { ...base.network, ...seed.network },
    interests: seed.interests ?? base.interests,
    researchAreas: seed.researchAreas ?? base.researchAreas,
    education: seed.education ?? base.education,
    employment: seed.employment ?? base.employment,
    memberships: seed.memberships ?? base.memberships,
    awards: seed.awards ?? base.awards,
    honors: seed.honors ?? base.honors,
    certifications: seed.certifications ?? base.certifications,
    skills: seed.skills ?? base.skills,
    languages: seed.languages ?? base.languages,
    editorialAppointments: seed.editorialAppointments ?? base.editorialAppointments,
    conferenceParticipation: seed.conferenceParticipation ?? base.conferenceParticipation,
    grantParticipation: seed.grantParticipation ?? base.grantParticipation,
    patents: seed.patents ?? base.patents,
    innovations: seed.innovations ?? base.innovations,
    startups: seed.startups ?? base.startups,
    mediaCoverage: seed.mediaCoverage ?? base.mediaCoverage,
    publicEngagement: seed.publicEngagement ?? base.publicEngagement,
    communityService: seed.communityService ?? base.communityService,
    volunteerExperience: seed.volunteerExperience ?? base.volunteerExperience,
    relationships: seed.relationships ?? base.relationships,
  };

  return {
    ...merged,
    portfolio: { ...merged.portfolio, totalPatents: merged.patents.length },
    metrics: buildMetrics(merged),
    timeline: buildTimeline(merged),
    analytics: buildAnalytics(merged),
    recentActivity: buildRecentActivity(merged),
    profileCompletion: buildProfileCompletion(merged),
  };
}

export const RESEARCHERS: ResearcherProfile[] = [
  makeResearcher(1, {
    username: 'ojuri',
    displayName: 'Dr. Adebisi Ojurere',
    firstName: 'Adebisi',
    lastName: 'Ojurere',
    avatar: '🩺',
    headline: 'Professor of Public Health & Tropical Medicine',
    country: 'Nigeria',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=ojuri',
      scopusAuthorId: '57210043129',
      webOfScienceResearcherId: 'AAL-8821-2024',
      crossref: 'https://search.crossref.org/?q=ojuri',
      memberSince: '2019-03-12',
    },
    position: {
      title: 'Professor',
      institution: 'University of Ibadan',
      institutionId: 'INST-UI-001',
      faculty: 'Faculty of Medicine',
      department: 'Department of Public Health',
      country: 'Nigeria',
      city: 'Ibadan',
      employmentType: 'Full-time',
      startDate: '2018-10-01',
      current: true,
      researchFocus: ['Tropical Medicine', 'Maternal Health', 'Infectious Disease Epidemiology'],
    },
    biography: {
      professionalSummary:
        'Professor of Public Health and Tropical Medicine at the University of Ibadan, leading research on infectious disease epidemiology and maternal health across West Africa.',
      academicSummary:
        'Public health researcher with 20+ years of field experience, 150+ publications, and sustained leadership in national disease surveillance programmes.',
      shortBiography:
        'Professor of Public Health at the University of Ibadan specialising in tropical medicine, infectious disease epidemiology, and maternal health.',
      fullBiography:
        'Professor Adebisi Ojurere holds the chair of Public Health and Tropical Medicine at the University of Ibadan. Her research focuses on infectious disease epidemiology, malaria control, and maternal and child health in low-resource settings. She has led national surveillance programmes, advised the Ministry of Health, and mentored a generation of West African epidemiologists.',
      areasOfExpertise: ['Public Health', 'Tropical Medicine', 'Epidemiology'],
    },
    interests: [
      { id: 'interest-malaria', name: 'Malaria Elimination', category: 'Infectious Disease', keywords: ['malaria', 'vector control', 'surveillance'] },
      { id: 'interest-maternal', name: 'Maternal & Child Health', category: 'Public Health', keywords: ['antenatal care', 'child survival', 'mortality'] },
      { id: 'interest-surveillance', name: 'Disease Surveillance', category: 'Epidemiology', keywords: ['surveillance', 'outbreak', 'health systems'] },
    ],
    researchAreas: [
      { id: 'area-malaria', name: 'Malaria elimination strategies', description: 'Vector control and surveillance for malaria elimination in West Africa.', publications: 42, citations: 2100 },
      { id: 'area-maternal', name: 'Maternal and neonatal health', description: 'Community-based interventions to reduce maternal mortality.', publications: 38, citations: 1680 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Ibadan', degree: 'PhD in Public Health', field: 'Epidemiology', startDate: '2001', endDate: '2005', country: 'Nigeria', description: 'Dissertation on malaria transmission dynamics in Oyo State.' },
      { id: 'edu-mph', institution: 'University of Ghana', degree: 'MPH', field: 'Public Health', startDate: '1997', endDate: '1999', country: 'Ghana' },
      { id: 'edu-mbbs', institution: 'University of Ibadan', degree: 'MBBS', field: 'Medicine', startDate: '1988', endDate: '1993', country: 'Nigeria' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'University of Ibadan', role: 'Professor of Public Health', department: 'Department of Public Health', startDate: '2018', current: true },
      { id: 'emp-assoc', organisation: 'University of Ibadan', role: 'Associate Professor', department: 'Faculty of Medicine', startDate: '2011', endDate: '2018' },
      { id: 'emp-research', organisation: 'Nigerian Institute of Medical Research', role: 'Research Scientist', startDate: '2006', endDate: '2011' },
    ],
    memberships: [
      { id: 'mem-epha', organisation: 'Nigerian Epidemiological Society', role: 'Fellow', type: 'Professional Association', since: '2010', status: 'Active' },
      { id: 'mem-iuph', organisation: 'International Union for Health Promotion', role: 'Member', type: 'Professional Association', since: '2013', status: 'Active' },
    ],
    awards: [
      { id: 'aw-tropical', title: 'Distinguished Public Health Award', organisation: 'African Academy of Public Health', year: '2023', category: 'Research Excellence', description: 'Recognition of two decades of malaria and maternal health research.' },
      { id: 'aw-mentor', title: 'Excellence in Mentoring Award', organisation: 'University of Ibadan', year: '2021', category: 'Mentoring', description: 'For supervising over 30 postgraduate researchers.' },
    ],
    honors: [{ id: 'hon-academy', title: 'Elected Fellow', organisation: 'Nigerian Academy of Science', year: '2022', description: 'Elected to the national academy for contributions to public health.' }],
    certifications: [
      { id: 'cert-gcp', name: 'Good Clinical Practice', issuer: 'NIH Training', year: '2018', description: 'Clinical research compliance certification.' },
      { id: 'cert-epid', name: 'Advanced Field Epidemiology', issuer: 'African Field Epidemiology Network', year: '2015' },
    ],
    skills: [
      { id: 'skill-epid', name: 'Epidemiological Study Design', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-stats', name: 'Biostatistics (Stata, R)', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-surveillance', name: 'Disease Surveillance Systems', category: 'Public Health', level: 'Expert' },
      { id: 'skill-quality', name: 'Quality Improvement in Health', category: 'Health Systems', level: 'Advanced' },
      { id: 'skill-writing', name: 'Grant Writing', category: 'Professional', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-en', name: 'English', proficiency: 'Native' },
      { id: 'lang-yo', name: 'Yoruba', proficiency: 'Native' },
      { id: 'lang-fr', name: 'French', proficiency: 'Professional Working' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/adebisi-ojurere',
      personalWebsite: 'https://ojuri.scholatia.com',
      twitter: 'https://x.com/ojurere',
      researchGate: 'https://www.researchgate.net/profile/Adebisi-Ojurere',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-1', name: 'Prof. B. Adamu', institution: 'University of Ibadan', role: 'Co-Investigator', researchAreas: ['Malaria'], jointPublications: 18, yearsActive: '2015 - Present', username: 'jscholar' },
        { id: 'collab-2', name: 'Dr. L. Ogunlade', institution: 'University of Ibadan', role: 'Collaborator', researchAreas: ['Nutrition'], jointPublications: 11 },
      ],
      institutionalPartners: ['University of Oxford', 'London School of Hygiene & Tropical Medicine'],
      professionalNetwork: 420,
      followers: 5200,
      following: 210,
      coAuthors: 96,
    },
    teaching: {
      courses: [
        { id: 'course-epid', title: 'Advanced Epidemiology', code: 'PHE 701', level: 'Masters', institution: 'University of Ibadan', department: 'Public Health', yearsTaught: '2012 - Present', students: 180, rating: 4.8 },
        { id: 'course-malaria', title: 'Malaria Control Programmes', code: 'PHE 715', level: 'Doctoral', institution: 'University of Ibadan', department: 'Public Health', yearsTaught: '2015 - Present', students: 90, rating: 4.7 },
      ],
      teachingExperience: '18 years of university teaching',
      teachingAwards: ['Best Lecturer, Faculty of Medicine (2019)'],
    },
    supervision: {
      students: [
        { id: 'sup-1', name: 'Chiamaka Eze', level: 'PhD', thesisTitle: 'Community-based malaria surveillance in South-East Nigeria', institution: 'University of Ibadan', period: '2022 - Present', status: 'Current' },
        { id: 'sup-2', name: 'Tunde Bakare', level: 'PhD', thesisTitle: 'Maternal health service uptake in rural Oyo State', institution: 'University of Ibadan', period: '2019 - 2023', status: 'Completed', outcome: 'Now lecturer at Federal University of Technology, Akure' },
      ],
      currentPhd: 4,
      completedPhd: 9,
      currentMasters: 5,
      completedMasters: 18,
      totalSupervised: 36,
    },
    editorialAppointments: [
      { id: 'edit-1', role: 'Associate Editor', journal: 'African Journal of Public Health', publisher: 'Scholatia Press', since: '2020', status: 'Active', scope: 'Infectious disease epidemiology' },
      { id: 'edit-2', role: 'Editorial Board Member', journal: 'Tropical Medicine & International Health', since: '2018', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-1', conference: 'Scholatia International Conference on Research and Innovation', conferenceId: 'CONF-001', year: '2025', role: 'Keynote Speaker', paperTitle: 'Surveillance systems for malaria elimination', city: 'London', country: 'United Kingdom' },
      { id: 'conf-2', conference: 'African Public Health Conference', year: '2024', role: 'Invited Speaker', city: 'Accra', country: 'Ghana' },
    ],
    grantParticipation: [
      { id: 'grant-1', title: 'Malaria Elimination Consortium', funder: 'National Research Fund', amount: '£1,200,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2027', description: 'Multi-site malaria elimination research consortium.' },
      { id: 'grant-2', title: 'Maternal Health Intervention Trial', funder: 'Bill & Melinda Gates Foundation', amount: '£850,000', role: 'Co-Investigator', status: 'Active', period: '2023 - 2026' },
    ],
    patents: [{ id: 'pat-1', title: 'Low-cost malaria diagnostic assay', inventors: ['Adebisi Ojurere', 'R. Salami'], patentNumber: 'NG/2024/00452', country: 'Nigeria', year: '2024', status: 'Pending', description: 'Point-of-care diagnostic for community surveillance.' }],
    innovations: [
      { id: 'inno-1', title: 'Community Health Surveillance Dashboard', description: 'Open dashboard for district-level disease surveillance data.', category: 'Digital Health', year: '2023', status: 'Research' },
    ],
    mediaCoverage: [
      { id: 'media-1', outlet: 'The Guardian Nigeria', headline: 'Ibadan researchers lead malaria elimination push', date: '2025-02-11', type: 'Newspaper' },
    ],
    publicEngagement: [
      { id: 'engage-1', title: 'Malaria prevention in schools', format: 'Community workshop', date: '2025-06-20', audience: 'School communities', reach: 800 },
    ],
    communityService: [{ id: 'cs-1', role: 'Health Advisor', organisation: 'Oyo State Ministry of Health', since: '2016', status: 'Active', description: 'Advising on disease surveillance policy.' }],
    volunteerExperience: [{ id: 'vol-1', organisation: 'Rotary International', role: 'Health Committee Member', period: '2018 - Present', description: 'Volunteer health outreach.' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Professional email', responseTime: 'Within 3 working days' },
    contact: { email: 'adebisi.ojurere@scholatia.org', professionalEmail: 'a.ojurere@ui.edu.ng', phone: '+234 802 555 0101', office: 'Department of Public Health, UI Main Campus', city: 'Ibadan', country: 'Nigeria', timezone: 'Africa/Lagos' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 96,
      trustScore: 94,
      visibilityScore: 88,
      badges: [...PLACEHOLDER_BADGES, 'Trusted'],
      lastVerified: '2026-06-10',
      academicAchievements: ['Elected Fellow, Nigerian Academy of Science', 'National public health adviser', '36 postgraduate students supervised'],
    },
  }),

  makeResearcher(2, {
    username: 'smith',
    displayName: 'Dr. Henry Smith',
    firstName: 'Henry',
    lastName: 'Smith',
    avatar: '📜',
    headline: 'Professor of Medieval History',
    country: 'United Kingdom',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=hensmith',
      scopusAuthorId: '57190284713',
      webOfScienceResearcherId: 'AAB-1132-2023',
      crossref: 'https://search.crossref.org/?q=henry+smith',
      memberSince: '2018-06-01',
    },
    position: {
      title: 'Professor',
      institution: 'University of Cambridge',
      faculty: 'Faculty of History',
      department: 'Department of History',
      country: 'United Kingdom',
      city: 'Cambridge',
      employmentType: 'Full-time',
      startDate: '2016-09-01',
      current: true,
      researchFocus: ['Medieval Ecclesiastical History', 'Manuscript Studies', 'Digital Humanities'],
    },
    biography: {
      professionalSummary:
        'Professor of Medieval History at the University of Cambridge, working at the intersection of ecclesiastical history and digital manuscript studies.',
      academicSummary:
        'Historian with four monographs, 80+ peer-reviewed articles, and leadership of the Cambridge Digital Manuscripts project.',
      shortBiography:
        'Professor of Medieval History at Cambridge specialising in ecclesiastical history, manuscript studies, and digital humanities.',
      fullBiography:
        'Professor Henry Smith is a medievalist at the University of Cambridge whose research traces the institutional history of the medieval church through manuscript evidence. He leads the Cambridge Digital Manuscripts project, chairs the national Committee for Historical Archives, and has published extensively on monastic cartularies, episcopal registers, and the digital preservation of primary sources.',
      areasOfExpertise: ['History', 'Medieval Studies', 'Digital Humanities'],
    },
    interests: [
      { id: 'interest-church', name: 'Ecclesiastical History', category: 'History', keywords: ['church', 'monasticism', 'bishops'] },
      { id: 'interest-manuscript', name: 'Manuscript Studies', category: 'Digital Humanities', keywords: ['paleography', 'codices', 'archives'] },
      { id: 'interest-dh', name: 'Digital Preservation', category: 'Digital Humanities', keywords: ['digitisation', 'archives', 'open access'] },
    ],
    researchAreas: [
      { id: 'area-church', name: 'Medieval church institutions', description: 'Episcopal and monastic governance in medieval England.', publications: 34, citations: 980 },
      { id: 'area-manuscript', name: 'Digital manuscript cataloguing', description: 'Standards and tools for digitising medieval primary sources.', publications: 22, citations: 640 },
    ],
    education: [
      { id: 'edu-dphil', institution: 'University of Oxford', degree: 'DPhil in History', field: 'Medieval History', startDate: '2004', endDate: '2008', country: 'United Kingdom', description: 'Thesis on episcopal administration in thirteenth-century England.' },
      { id: 'edu-mphil', institution: 'University of Cambridge', degree: 'MPhil in Historical Studies', field: 'History', startDate: '2003', endDate: '2004', country: 'United Kingdom' },
      { id: 'edu-ba', institution: 'University of York', degree: 'BA in History', field: 'History', startDate: '2000', endDate: '2003', country: 'United Kingdom' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'University of Cambridge', role: 'Professor of Medieval History', department: 'Department of History', startDate: '2016', current: true },
      { id: 'emp-reader', organisation: 'King\u2019s College London', role: 'Reader in History', startDate: '2011', endDate: '2016' },
      { id: 'emp-postdoc', organisation: 'University of Oxford', role: 'Postdoctoral Fellow', startDate: '2008', endDate: '2011' },
    ],
    memberships: [
      { id: 'mem-rhs', organisation: 'Royal Historical Society', role: 'Fellow', type: 'Learned Society', since: '2013', status: 'Active' },
      { id: 'mem-ecclesiastical', organisation: 'Ecclesiastical History Society', role: 'Member', type: 'Learned Society', since: '2009', status: 'Active' },
    ],
    awards: [
      { id: 'aw-marc', title: 'Marc Fitch Prize', organisation: 'British Academy', year: '2018', category: 'Publication', description: 'For the monograph \u201cEpiscopal Registers and the Medieval State\u201d.' },
    ],
    honors: [{ id: 'hon-fba', title: 'Fellow', organisation: 'Royal Historical Society', year: '2013', description: 'Elected Fellow for contributions to medieval history.' }],
    certifications: [{ id: 'cert-tef', name: 'Advance HE Fellowship', issuer: 'Advance HE', year: '2017', description: 'Higher education teaching fellowship.' }],
    skills: [
      { id: 'skill-paleography', name: 'Latin Paleography', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-diplomatic', name: 'Diplomatic Editing', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-xml', name: 'TEI-XML', category: 'Digital Humanities', level: 'Advanced' },
      { id: 'skill-archives', name: 'Archival Research', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-write', name: 'Academic Writing', category: 'Professional', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-en2', name: 'English', proficiency: 'Native' },
      { id: 'lang-latin', name: 'Latin', proficiency: 'Professional Working' },
      { id: 'lang-fr2', name: 'French', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/henry-smith-history',
      personalWebsite: 'https://smith.scholatia.com',
      blog: 'https://medievalnotes.hypotheses.org',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-h1', name: 'Prof. K. Adesina', institution: 'Obafemi Awolowo University', role: 'Collaborator', researchAreas: ['African History'], jointPublications: 5 },
      ],
      institutionalPartners: ['University of Oxford', 'British Library'],
      professionalNetwork: 380,
      followers: 4100,
      following: 150,
      coAuthors: 42,
    },
    teaching: {
      courses: [
        { id: 'course-medieval', title: 'The Medieval Church in England', code: 'HIS 230', level: 'Undergraduate', institution: 'University of Cambridge', department: 'History', yearsTaught: '2012 - Present', students: 240, rating: 4.9 },
        { id: 'course-paleo', title: 'Paleography and Diplomatic', code: 'HIS 521', level: 'Masters', institution: 'University of Cambridge', department: 'History', yearsTaught: '2015 - Present', students: 60, rating: 4.8 },
      ],
      teachingExperience: '15 years of university teaching',
      teachingAwards: ['Pilgrim Trust Teaching Award (2020)'],
    },
    supervision: {
      students: [
        { id: 'sup-h1', name: 'Eleanor Whitfield', level: 'PhD', thesisTitle: 'Monastic cartularies of the Fenland', institution: 'University of Cambridge', period: '2023 - Present', status: 'Current' },
        { id: 'sup-h2', name: 'James O\u2019Connor', level: 'PhD', thesisTitle: 'Bishops and royal justice, 1200-1350', institution: 'University of Cambridge', period: '2018 - 2022', status: 'Completed', outcome: 'Now lecturer at University of Leeds' },
      ],
      currentPhd: 3,
      completedPhd: 7,
      currentMasters: 2,
      completedMasters: 14,
      totalSupervised: 26,
    },
    editorialAppointments: [
      { id: 'edit-h1', role: 'Editor', journal: 'Journal of Ecclesiastical History', since: '2019', status: 'Active' },
      { id: 'edit-h2', role: 'Editorial Board Member', journal: 'Digital Medievalist', since: '2021', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-h1', conference: 'International Congress on Medieval Studies', year: '2024', role: 'Keynote Speaker', paperTitle: 'Digital medieval studies after the archive', city: 'Kalamazoo', country: 'United States' },
    ],
    grantParticipation: [
      { id: 'grant-h1', title: 'Cambridge Digital Manuscripts', funder: 'Arts and Humanities Research Council', amount: '£1,400,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028', description: 'National digitisation programme for medieval manuscripts.' },
    ],
    innovations: [{ id: 'inno-h1', title: 'Open Manuscript Catalogue', description: 'Open standards for describing digitised medieval manuscripts.', category: 'Digital Humanities', year: '2022', status: 'Commercialised' }],
    mediaCoverage: [
      { id: 'media-h1', outlet: 'BBC History Magazine', headline: 'The digital future of medieval archives', date: '2024-03-05', type: 'Magazine' },
    ],
    publicEngagement: [
      { id: 'engage-h1', title: 'Open archive evenings', format: 'Public lecture series', date: '2024-11-15', audience: 'General public', reach: 600 },
    ],
    communityService: [{ id: 'cs-h1', role: 'Chair', organisation: 'National Committee for Historical Archives', since: '2020', status: 'Active', description: 'Leading national archival standards.' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Professional email' },
    contact: { email: 'henry.smith@scholatia.org', professionalEmail: 'hs450@cam.ac.uk', office: 'Faculty of History, Cambridge', city: 'Cambridge', country: 'United Kingdom', timezone: 'Europe/London' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 93,
      trustScore: 92,
      visibilityScore: 84,
      lastVerified: '2026-04-18',
      academicAchievements: ['Fellow, Royal Historical Society', 'Principal Investigator, AHRC grant', '26 postgraduate students supervised'],
    },
  }),

  makeResearcher(3, {
    username: 'adebayo',
    displayName: 'Prof. Olusola Adebayo',
    firstName: 'Olusola',
    lastName: 'Adebayo',
    avatar: '⚡',
    headline: 'Distinguished Professor of Energy Engineering',
    country: 'Nigeria',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=adebayo',
      scopusAuthorId: '56190233401',
      webOfScienceResearcherId: 'AAF-2240-2022',
      crossref: 'https://search.crossref.org/?q=olusola+adebayo',
      memberSince: '2017-11-20',
    },
    position: {
      title: 'Distinguished Professor',
      institution: 'University of Lagos',
      institutionId: 'INST-UNILAG-002',
      faculty: 'Faculty of Engineering',
      department: 'Department of Electrical Engineering',
      country: 'Nigeria',
      city: 'Lagos',
      employmentType: 'Full-time',
      startDate: '2019-01-15',
      current: true,
      researchFocus: ['Renewable Energy', 'Smart Grids', 'Power Electronics'],
    },
    biography: {
      professionalSummary:
        'Distinguished Professor of Energy Engineering at the University of Lagos, directing the Energy Research Centre and pioneering renewable energy deployment across West Africa.',
      academicSummary:
        'Energy systems researcher with 120+ publications, 6 patents, and leadership of multi-million-dollar energy access programmes.',
      shortBiography:
        'Distinguished Professor of Energy Engineering at the University of Lagos, focused on renewable energy and smart grid systems for Africa.',
      fullBiography:
        'Professor Olusola Adebayo holds a distinguished chair in Energy Engineering at the University of Lagos and directs the Energy Research Centre. His work on renewable energy systems, smart grids, and rural electrification has shaped national energy policy and led to several commercialised innovations. He has supervised 50+ postgraduate students, holds six patents, and advises the Federal Ministry of Power on energy transition planning.',
      areasOfExpertise: ['Energy Engineering', 'Renewable Energy', 'Smart Grids'],
    },
    interests: [
      { id: 'interest-solar', name: 'Solar Energy Systems', category: 'Energy', keywords: ['photovoltaics', 'microgrids', 'solar'] },
      { id: 'interest-grid', name: 'Smart Grids', category: 'Energy', keywords: ['grid stability', 'IoT', 'demand response'] },
      { id: 'interest-electrification', name: 'Rural Electrification', category: 'Development', keywords: ['energy access', 'Africa', 'policy'] },
    ],
    researchAreas: [
      { id: 'area-solar', name: 'Solar microgrids', description: 'Design and deployment of solar microgrids for rural communities.', publications: 46, citations: 2400 },
      { id: 'area-grid', name: 'Smart grid integration', description: 'Grid integration of distributed renewable generation.', publications: 38, citations: 1820 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Imperial College London', degree: 'PhD in Electrical Engineering', field: 'Power Systems', startDate: '2003', endDate: '2007', country: 'United Kingdom' },
      { id: 'edu-msc', institution: 'University of Lagos', degree: 'MSc in Electrical Engineering', field: 'Power Systems', startDate: '1999', endDate: '2001', country: 'Nigeria' },
      { id: 'edu-bsc', institution: 'University of Ibadan', degree: 'BSc in Electrical Engineering', field: 'Electrical Engineering', startDate: '1994', endDate: '1998', country: 'Nigeria' },
    ],
    employment: [
      { id: 'emp-dist', organisation: 'University of Lagos', role: 'Distinguished Professor', department: 'Department of Electrical Engineering', startDate: '2019', current: true },
      { id: 'emp-prof', organisation: 'University of Lagos', role: 'Professor', startDate: '2013', endDate: '2019' },
      { id: 'emp-lect', organisation: 'University of Lagos', role: 'Senior Lecturer', startDate: '2008', endDate: '2013' },
    ],
    memberships: [
      { id: 'mem-ieee', organisation: 'IEEE', role: 'Senior Member', type: 'Professional Association', since: '2010', status: 'Active' },
      { id: 'mem-nse', organisation: 'Nigerian Society of Engineers', role: 'Fellow', type: 'Professional Association', since: '2012', status: 'Active' },
    ],
    awards: [
      { id: 'aw-npe', title: 'Nigerian National Energy Prize', organisation: 'Federal Ministry of Power', year: '2024', category: 'Innovation', description: 'For commercialised solar microgrid technology.' },
      { id: 'aw-research', title: 'Research Excellence Award', organisation: 'University of Lagos', year: '2022', category: 'Research', description: 'Top-cited engineering faculty member.' },
    ],
    honors: [{ id: 'hon-fnse', title: 'Elected Fellow', organisation: 'Nigerian Academy of Engineering', year: '2021', description: 'For contributions to energy engineering.' }],
    certifications: [{ id: 'cert-pe', name: 'Registered Engineer', issuer: 'COREN', year: '2005', description: 'Professional engineering registration.' }],
    skills: [
      { id: 'skill-power', name: 'Power Systems Analysis', category: 'Engineering', level: 'Expert' },
      { id: 'skill-pv', name: 'Photovoltaic System Design', category: 'Engineering', level: 'Expert' },
      { id: 'skill-sim', name: 'Simulation (MATLAB, ETAP)', category: 'Engineering', level: 'Advanced' },
      { id: 'skill-policy', name: 'Energy Policy', category: 'Professional', level: 'Advanced' },
      { id: 'skill-innovation', name: 'Technology Commercialisation', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en3', name: 'English', proficiency: 'Native' },
      { id: 'lang-yo3', name: 'Yoruba', proficiency: 'Native' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/olusola-adebayo',
      personalWebsite: 'https://adebayo.scholatia.com',
      github: 'https://github.com/olusola-adebayo',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-a1', name: 'Dr. P. Adepoju', institution: 'University of Lagos', role: 'Co-Investigator', researchAreas: ['Renewable Energy'], jointPublications: 16 },
      ],
      institutionalPartners: ['Imperial College London', 'MIT'],
      professionalNetwork: 610,
      followers: 8200,
      following: 180,
      coAuthors: 120,
    },
    teaching: {
      courses: [
        { id: 'course-pss', title: 'Power Systems Analysis', code: 'EEE 431', level: 'Undergraduate', institution: 'University of Lagos', department: 'Electrical Engineering', yearsTaught: '2009 - Present', students: 320, rating: 4.8 },
        { id: 'course-ren', title: 'Renewable Energy Systems', code: 'EEE 721', level: 'Doctoral', institution: 'University of Lagos', department: 'Electrical Engineering', yearsTaught: '2014 - Present', students: 110, rating: 4.9 },
      ],
      teachingExperience: '18 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-a1', name: 'Bola Fadipe', level: 'PhD', thesisTitle: 'Smart grid integration in Lagos megacity', institution: 'University of Lagos', period: '2022 - Present', status: 'Current' },
      ],
      currentPhd: 6,
      completedPhd: 14,
      currentMasters: 4,
      completedMasters: 32,
      totalSupervised: 56,
    },
    editorialAppointments: [
      { id: 'edit-a1', role: 'Associate Editor', journal: 'Journal of Renewable Energy', since: '2018', status: 'Active' },
      { id: 'edit-a2', role: 'Editorial Board Member', journal: 'IEEE Transactions on Power Systems', since: '2020', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-a1', conference: 'IEEE PES Africa Conference', year: '2024', role: 'Keynote Speaker', paperTitle: 'Smart grid integration in West African megacities', city: 'Johannesburg', country: 'South Africa' },
    ],
    grantParticipation: [
      { id: 'grant-a1', title: 'National Solar Microgrid Programme', funder: 'African Development Bank', amount: '£3,500,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2029' },
      { id: 'grant-a2', title: 'Nanomaterials for Energy Storage', funder: 'National Research Fund', amount: '£900,000', role: 'Co-Investigator', status: 'Active', period: '2023 - 2026' },
    ],
    patents: [
      { id: 'pat-a1', title: 'Modular solar microgrid controller', inventors: ['Olusola Adebayo', 'P. Adepoju'], patentNumber: 'NG/2023/00214', country: 'Nigeria', year: '2023', status: 'Granted' },
      { id: 'pat-a2', title: 'Low-cost grid inverter topology', inventors: ['Olusola Adebayo'], patentNumber: 'NG/2024/00518', country: 'Nigeria', year: '2024', status: 'Pending' },
    ],
    innovations: [
      { id: 'inno-a1', title: 'SunGrid Microgrid Controller', description: 'Commercialised microgrid controller deployed across 40 rural communities.', category: 'Energy Technology', year: '2023', status: 'Commercialised' },
    ],
    startups: [{ id: 'start-a1', name: 'SunGrid Energy', description: 'Solar microgrid deployment company serving rural West Africa.', founded: '2022', sector: 'Clean Energy', stage: 'Growth', fundingRaised: '$2.1M' }],
    mediaCoverage: [
      { id: 'media-a1', outlet: 'TechCabal', headline: 'Lagos energy startup powers 40 rural communities', date: '2024-08-19', type: 'Technology news' },
    ],
    communityService: [{ id: 'cs-a1', role: 'Technical Adviser', organisation: 'Federal Ministry of Power', since: '2021', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Office email' },
    contact: { email: 'olusola.adebayo@scholatia.org', professionalEmail: 'oadebayo@unilag.edu.ng', phone: '+234 803 555 0123', office: 'Energy Research Centre, UNILAG', city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 95,
      trustScore: 93,
      visibilityScore: 90,
      badges: [...PLACEHOLDER_BADGES, 'Trusted', 'Verified Expert'],
      lastVerified: '2026-06-01',
      academicAchievements: ['Fellow, Nigerian Academy of Engineering', 'National energy policy adviser', '6 patents granted'],
    },
  }),

  makeResearcher(4, {
    username: 'maria',
    displayName: 'Dr. Maria Fern\u00e1ndez',
    firstName: 'Maria',
    lastName: 'Fern\u00e1ndez',
    avatar: '🔭',
    headline: 'Associate Professor of Astrophysics',
    country: 'Mexico',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=mariafernandez',
      scopusAuthorId: '56308845192',
      webOfScienceResearcherId: 'AAG-4410-2023',
      crossref: 'https://search.crossref.org/?q=maria+fernandez',
      memberSince: '2019-02-04',
    },
    position: {
      title: 'Associate Professor',
      institution: 'National Autonomous University of Mexico',
      faculty: 'Faculty of Sciences',
      department: 'Institute of Astronomy',
      country: 'Mexico',
      city: 'Mexico City',
      employmentType: 'Full-time',
      startDate: '2018-08-01',
      current: true,
      researchFocus: ['Galaxy Formation', 'Dark Matter', 'Computational Astrophysics'],
    },
    biography: {
      professionalSummary:
        'Associate Professor of Astrophysics at UNAM, modelling galaxy formation and dark matter with large-scale cosmological simulations.',
      academicSummary:
        'Astrophysicist with 70+ publications, leadership of the Latin American galaxy simulation network, and national recognition for public science communication.',
      shortBiography:
        'Associate Professor of Astrophysics at UNAM specialising in galaxy formation, dark matter, and computational simulations.',
      fullBiography:
        'Dr. Maria Fern\u00e1ndez is an astrophysicist at the Institute of Astronomy, UNAM. Her research uses cosmological simulations to understand galaxy formation and the nature of dark matter. She coordinates the Latin American Galaxy Simulation Network, which shares supercomputing infrastructure across the region, and is a leading voice for astronomy education and public engagement in Mexico.',
      areasOfExpertise: ['Astrophysics', 'Computational Science', 'Physics'],
    },
    interests: [
      { id: 'interest-galaxy', name: 'Galaxy Formation', category: 'Astrophysics', keywords: ['galaxies', 'cosmology', 'simulations'] },
      { id: 'interest-darkmatter', name: 'Dark Matter', category: 'Astrophysics', keywords: ['dark matter', 'halos', 'dynamics'] },
      { id: 'interest-sim', name: 'Cosmological Simulations', category: 'Computational Science', keywords: ['HPC', 'simulation', 'GPU'] },
    ],
    researchAreas: [
      { id: 'area-sim', name: 'Galaxy formation simulations', description: 'High-resolution cosmological simulations of galaxy evolution.', publications: 30, citations: 1800 },
      { id: 'area-dm', name: 'Dark matter substructure', description: 'Detecting dark matter substructure through gravitational signatures.', publications: 24, citations: 1250 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Max Planck Institute for Astrophysics', degree: 'PhD in Astrophysics', field: 'Astrophysics', startDate: '2010', endDate: '2014', country: 'Germany' },
      { id: 'edu-msc', institution: 'UNAM', degree: 'MSc in Physics', field: 'Astrophysics', startDate: '2008', endDate: '2010', country: 'Mexico' },
      { id: 'edu-bsc', institution: 'UNAM', degree: 'BSc in Physics', field: 'Physics', startDate: '2003', endDate: '2008', country: 'Mexico' },
    ],
    employment: [
      { id: 'emp-assoc', organisation: 'UNAM', role: 'Associate Professor', department: 'Institute of Astronomy', startDate: '2018', current: true },
      { id: 'emp-postdoc', organisation: 'University of California, Santa Cruz', role: 'Postdoctoral Researcher', startDate: '2014', endDate: '2018' },
    ],
    memberships: [
      { id: 'mem-iau', organisation: 'International Astronomical Union', role: 'Member', type: 'Professional Association', since: '2016', status: 'Active' },
      { id: 'mem-sma', organisation: 'Sociedad Mexicana de F\u00edsica', role: 'Member', type: 'Professional Association', since: '2012', status: 'Active' },
    ],
    awards: [
      { id: 'aw-young', title: 'L\u2019Or\u00e9al-UNESCO For Women in Science Award', organisation: 'UNESCO', year: '2023', category: 'Research', description: 'For contributions to galaxy formation research.' },
      { id: 'aw-nacional', title: 'National Research Prize', organisation: 'CONAHCYT', year: '2021', category: 'Research', description: 'For leadership in computational astrophysics in Latin America.' },
    ],
    honors: [{ id: 'hon-sni', title: 'SNI Level II', organisation: 'CONAHCYT National Researchers System', year: '2020', description: 'National researcher recognition, level II.' }],
    certifications: [{ id: 'cert-hpc', name: 'HPC Programming', issuer: 'PRACE', year: '2015', description: 'High-performance computing certification.' }],
    skills: [
      { id: 'skill-python', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-hpc', name: 'High-Performance Computing', category: 'Programming', level: 'Expert' },
      { id: 'skill-sim', name: 'N-body Simulations', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-cuda', name: 'CUDA / GPU Computing', category: 'Programming', level: 'Advanced' },
      { id: 'skill-viz', name: 'Scientific Visualisation', category: 'Research Methods', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-es', name: 'Spanish', proficiency: 'Native' },
      { id: 'lang-en4', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-de', name: 'German', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/maria-fernandez-astro',
      personalWebsite: 'https://maria.scholatia.com',
      twitter: 'https://x.com/astrofernan',
      github: 'https://github.com/mariafernandez',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-m1', name: 'Prof. Yuki Tanaka', institution: 'University of Tokyo', role: 'Collaborator', researchAreas: ['Astrophysics'], jointPublications: 9 },
      ],
      institutionalPartners: ['University of California, Santa Cruz', 'Max Planck Institute'],
      professionalNetwork: 340,
      followers: 9800,
      following: 260,
      coAuthors: 68,
    },
    teaching: {
      courses: [
        { id: 'course-galaxy', title: 'Galaxy Formation', code: 'ASTR 620', level: 'Masters', institution: 'UNAM', department: 'Institute of Astronomy', yearsTaught: '2019 - Present', students: 70, rating: 4.9 },
        { id: 'course-compastro', title: 'Computational Astrophysics', code: 'ASTR 640', level: 'Doctoral', institution: 'UNAM', department: 'Institute of Astronomy', yearsTaught: '2020 - Present', students: 40, rating: 4.8 },
      ],
      teachingExperience: '9 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-m1', name: 'Alejandra Torres', level: 'PhD', thesisTitle: 'Dark matter substructure in dwarf galaxies', institution: 'UNAM', period: '2022 - Present', status: 'Current' },
      ],
      currentPhd: 3,
      completedPhd: 3,
      currentMasters: 4,
      completedMasters: 8,
      totalSupervised: 18,
    },
    editorialAppointments: [
      { id: 'edit-m1', role: 'Editorial Board Member', journal: 'Revista Mexicana de Astronom\u00eda', since: '2021', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-m1', conference: 'IAU General Assembly', year: '2024', role: 'Invited Speaker', paperTitle: 'Galaxy simulations in the era of exascale computing', city: 'Cape Town', country: 'South Africa' },
    ],
    grantParticipation: [
      { id: 'grant-m1', title: 'Latin American Galaxy Simulation Network', funder: 'CONAHCYT', amount: 'MXN 8,000,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2027' },
    ],
    mediaCoverage: [
      { id: 'media-m1', outlet: 'El Pa\u00eds', headline: 'M\u00e9xico y la frontera de la simulaci\u00f3n c\u00f3smica', date: '2024-10-02', type: 'Newspaper' },
    ],
    publicEngagement: [
      { id: 'engage-m1', title: 'Nights of the Stars', format: 'Public observing events', date: '2025-04-12', audience: 'General public', reach: 2500 },
    ],
    communityService: [{ id: 'cs-m1', role: 'Coordinator', organisation: 'Latin American Galaxy Simulation Network', since: '2022', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'maria.fernandez@scholatia.org', professionalEmail: 'maria.fernandez@ia.unam.mx', office: 'Instituto de Astronom\u00eda, UNAM', city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 92,
      trustScore: 90,
      visibilityScore: 87,
      lastVerified: '2026-05-22',
      academicAchievements: ['SNI Level II researcher', 'L\u2019Or\u00e9al-UNESCO awardee', 'Regional supercomputing network lead'],
    },
  }),

  makeResearcher(5, {
    username: 'jscholar',
    displayName: 'Dr. Jane Scholar',
    firstName: 'Jane',
    lastName: 'Scholar',
    avatar: '💬',
    headline: 'Senior Researcher in Computational Linguistics',
    country: 'United Kingdom',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=janescholar',
      scopusAuthorId: '57205087341',
      webOfScienceResearcherId: 'AAH-5510-2024',
      crossref: 'https://search.crossref.org/?q=jane+scholar',
      memberSince: '2018-05-10',
    },
    position: {
      title: 'Principal Investigator',
      institution: 'Institute for Computational Linguistics',
      faculty: 'Faculty of Language Sciences',
      department: 'Computational Linguistics',
      country: 'United Kingdom',
      city: 'London',
      employmentType: 'Full-time',
      startDate: '2015-04-01',
      current: true,
      researchFocus: ['Multilingual NLP', 'Low-Resource Languages', 'Dependency Parsing'],
    },
    biography: {
      professionalSummary:
        'Principal Investigator at the Institute for Computational Linguistics, leading a research group on multilingual NLP and low-resource language technology.',
      academicSummary:
        'Computational linguist with 24 articles, 1,560 citations, and active leadership across multilingual parsing and language preservation projects.',
      shortBiography:
        'Senior researcher in computational linguistics specialising in multilingual NLP, low-resource languages, and dependency parsing.',
      fullBiography:
        'Dr. Jane Scholar leads the Multilingual NLP group at the Institute for Computational Linguistics. Her research develops dependency parsing and transfer learning methods for typologically diverse and low-resource languages, with strong ties to endangered language communities. She chairs the Cross-Lingual Evaluation Benchmark, serves on two editorial boards, and mentors early-career researchers across Africa and Europe.',
      areasOfExpertise: ['Computational Linguistics', 'Artificial Intelligence', 'Language Technology'],
    },
    interests: [
      { id: 'interest-multinlp', name: 'Multilingual NLP', category: 'NLP', keywords: ['cross-lingual', 'transfer', 'multilingual'] },
      { id: 'interest-lowres', name: 'Low-Resource Languages', category: 'NLP', keywords: ['under-resourced', 'endangered languages', 'preservation'] },
      { id: 'interest-parsing', name: 'Dependency Parsing', category: 'NLP', keywords: ['syntax', 'treebanks', 'parsing'] },
    ],
    researchAreas: [
      { id: 'area-parsing', name: 'Multilingual dependency parsing', description: 'Cross-lingual parsing for 50+ languages with transfer learning.', publications: 18, citations: 2100 },
      { id: 'area-eval', name: 'Cross-lingual evaluation', description: 'Benchmarks and evaluation suites for typologically diverse languages.', publications: 12, citations: 780 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Cambridge', degree: 'PhD in Computational Linguistics', field: 'Computational Linguistics', startDate: '2010', endDate: '2013', country: 'United Kingdom', description: 'Dissertation on multilingual syntactic parsing with low-resource adaptation.' },
      { id: 'edu-msc', institution: 'University of Oxford', degree: 'MSc in Linguistics', field: 'Linguistics', startDate: '2008', endDate: '2009', country: 'United Kingdom' },
      { id: 'edu-ba', institution: 'University of Nairobi', degree: 'BA in Linguistics and Computer Science', field: 'Linguistics, Computer Science', startDate: '2004', endDate: '2007', country: 'Kenya' },
    ],
    employment: [
      { id: 'emp-senior', organisation: 'Institute for Computational Linguistics', role: 'Principal Investigator', department: 'Computational Linguistics', startDate: '2015', current: true },
      { id: 'emp-assoc', organisation: 'Tech University', role: 'Research Associate', startDate: '2013', endDate: '2015' },
      { id: 'emp-assist', organisation: 'Digital Language Lab', role: 'Research Assistant', startDate: '2009', endDate: '2010' },
    ],
    memberships: [
      { id: 'mem-acl', organisation: 'Association for Computational Linguistics', role: 'Member', type: 'Professional Association', since: '2013', status: 'Active' },
      { id: 'mem-lsa', organisation: 'Linguistic Society of America', role: 'Member', type: 'Professional Association', since: '2012', status: 'Active' },
      { id: 'mem-preservation', organisation: 'Language Preservation Network', role: 'Steering Group Member', type: 'Research Network', since: '2019', status: 'Active' },
    ],
    awards: [
      { id: 'aw-bestpaper', title: 'Best Paper Award', organisation: 'ACL 2020', year: '2020', category: 'Publication', description: 'For multilingual representations for cross-lingual transfer learning.' },
      { id: 'aw-earlycareer', title: 'Early Career Researcher Grant', organisation: 'National Research Council', year: '2021', category: 'Funding', description: 'Competitive funding for the Low-Resource Language Toolkit.' },
      { id: 'aw-rising', title: 'Rising Scholar Award', organisation: 'Institute for Computational Linguistics', year: '2019', category: 'Recognition', description: 'For contributions to low-resource language processing.' },
    ],
    honors: [{ id: 'hon-reviewer', title: 'Outstanding Reviewer Recognition', organisation: 'Computational Linguistics Journal', year: '2022', description: 'For consistently high-quality peer review contributions.' }],
    certifications: [
      { id: 'cert-rr', name: 'Responsible Research Conduct', issuer: 'National Research Council', year: '2019' },
      { id: 'cert-dm', name: 'Research Data Management', issuer: 'Digital Curation Centre', year: '2020' },
    ],
    skills: [
      { id: 'skill-python', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-pytorch', name: 'PyTorch', category: 'Programming', level: 'Advanced' },
      { id: 'skill-corpus', name: 'Corpus Annotation', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-eval', name: 'Cross-Lingual Evaluation', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-grant', name: 'Grant Writing', category: 'Professional', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-en5', name: 'English', proficiency: 'Native' },
      { id: 'lang-fr5', name: 'French', proficiency: 'Fluent' },
      { id: 'lang-sw', name: 'Swahili', proficiency: 'Professional Working' },
      { id: 'lang-de5', name: 'German', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/jane-scholar',
      personalWebsite: 'https://jscholar.scholatia.com',
      twitter: 'https://x.com/janescholar',
      github: 'https://github.com/jane-scholar',
      orcid: 'https://orcid.org/0000-0002-1825-0097',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-j1', name: 'Prof. Aisha Mentor', institution: 'University of Cambridge', role: 'Senior Collaborator', researchAreas: ['Syntax', 'Parsing'], jointPublications: 12, yearsActive: '2016 - Present', username: 'smith' },
        { id: 'collab-j2', name: 'Dr. Chen Researcher', institution: 'Tech University', role: 'Senior Research Scientist', researchAreas: ['Transfer Learning'], jointPublications: 8 },
        { id: 'collab-j3', name: 'Dr. Dina Linguist', institution: 'University of Oxford', role: 'Field Linguist', researchAreas: ['Typology'], jointPublications: 6 },
      ],
      institutionalPartners: ['University of Cambridge', 'University of Oxford', 'Language Preservation Foundation'],
      professionalNetwork: 520,
      followers: 7200,
      following: 310,
      coAuthors: 64,
    },
    teaching: {
      courses: [
        { id: 'course-mnlp', title: 'Multilingual Natural Language Processing', code: 'CL 550', level: 'Masters', institution: 'Institute for Computational Linguistics', department: 'Computational Linguistics', yearsTaught: '2016 - Present', students: 140, rating: 4.9 },
        { id: 'course-corpus', title: 'Corpus Annotation Methods', code: 'CL 610', level: 'Doctoral', institution: 'Institute for Computational Linguistics', department: 'Computational Linguistics', yearsTaught: '2017 - Present', students: 55, rating: 4.8 },
      ],
      teachingExperience: '10 years of teaching',
      teachingAwards: ['Teaching Excellence Award (2021)'],
    },
    supervision: {
      students: [
        { id: 'sup-j1', name: 'Priya Patel', level: 'PhD', thesisTitle: 'Low-resource machine translation', institution: 'Institute for Computational Linguistics', period: '2022 - Present', status: 'Current', coSupervisor: 'Prof. Aisha Mentor' },
        { id: 'sup-j2', name: 'Sam Okafor', level: 'Masters', thesisTitle: 'Cross-lingual evaluation suites', institution: 'Institute for Computational Linguistics', period: '2024 - 2025', status: 'Completed' },
      ],
      currentPhd: 4,
      completedPhd: 6,
      currentMasters: 3,
      completedMasters: 12,
      totalSupervised: 25,
    },
    editorialAppointments: [
      { id: 'edit-j1', role: 'Associate Editor', journal: 'Computational Linguistics Journal', since: '2021', status: 'Active' },
      { id: 'edit-j2', role: 'Editorial Board Member', journal: 'Journal of Language Documentation', publisher: 'Scholatia Press', since: '2022', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-j1', conference: 'Scholatia International Conference on Research and Innovation', conferenceId: 'CONF-001', year: '2025', role: 'Paper Presenter', paperTitle: 'Benchmarking Transfer Learning across 40 Languages', city: 'London', country: 'United Kingdom' },
      { id: 'conf-j2', conference: 'ACL Conference on Empirical Methods', year: '2020', role: 'Paper Presenter', paperTitle: 'Multilingual Representations for Cross-Lingual Transfer Learning' },
    ],
    grantParticipation: [
      { id: 'grant-j1', title: 'Multilingual Parsing Framework', funder: 'National Research Council', amount: '\u00a3450,000', role: 'Principal Investigator', status: 'Active', period: '2022 - 2025' },
      { id: 'grant-j2', title: 'Low-Resource Language Toolkit', funder: 'Digital Futures Fund', amount: '\u00a3180,000', role: 'Co-Investigator', status: 'Active', period: '2021 - 2024' },
      { id: 'grant-j3', title: 'Cross-Lingual Corpus Annotation', funder: 'Language Preservation Foundation', amount: '\u00a395,000', role: 'Principal Investigator', status: 'Completed', period: '2019 - 2021' },
    ],
    innovations: [
      { id: 'inno-j1', title: 'Low-Resource Language Toolkit', description: 'Open-source tools and corpora for under-resourced languages.', category: 'Language Technology', year: '2021', status: 'Commercialised' },
    ],
    mediaCoverage: [
      { id: 'media-j1', outlet: 'Nature Machine Intelligence', headline: 'Keeping endangered languages alive with NLP', date: '2024-12-03', type: 'Journalism' },
    ],
    publicEngagement: [
      { id: 'engage-j1', title: 'Language preservation workshops', format: 'Community workshop', date: '2025-03-08', audience: 'Language communities', reach: 350 },
    ],
    communityService: [{ id: 'cs-j1', role: 'Steering Group Member', organisation: 'Language Preservation Network', since: '2019', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-j1', organisation: 'Code for Africa', role: 'Technical Mentor', period: '2020 - Present', description: 'Mentoring open data projects.' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Professional email', responseTime: 'Within 4 working days' },
    contact: { email: 'jane.scholar@scholatia.org', professionalEmail: 'j.scholar@icl-research.ac.uk', office: 'Institute for Computational Linguistics, London', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 94,
      trustScore: 93,
      visibilityScore: 91,
      badges: [...PLACEHOLDER_BADGES, 'Trusted', 'Verified Expert'],
      lastVerified: '2026-06-25',
      verificationSteps: [
        { label: 'Email address verified', status: 'verified', detail: 'Institutional email confirmed at first registration.' },
        { label: 'Identity verified', status: 'verified', detail: 'Government-issued identification reviewed.' },
        { label: 'Institution affiliation verified', status: 'verified', detail: 'Affiliation confirmed with the Institute for Computational Linguistics.' },
        { label: 'ORCID linked', status: 'verified', detail: 'ORCID iD 0000-0002-1825-0097 is connected and trusted.' },
        { label: 'Publications verified', status: 'verified', detail: 'Publication records cross-checked against journal and DOI metadata.' },
      ],
      academicAchievements: ['Best Paper Award, ACL 2020', 'Chairs the Cross-Lingual Evaluation Benchmark', 'Editorial board service at two journals'],
    },
  }),

  makeResearcher(6, {
    username: 'tanaka',
    displayName: 'Prof. Yuki Tanaka',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    avatar: '🤖',
    headline: 'Professor of Robotics',
    country: 'Japan',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=yukitanaka',
      scopusAuthorId: '56909341280',
      webOfScienceResearcherId: 'AAJ-8824-2022',
      crossref: 'https://search.crossref.org/?q=yuki+tanaka',
      memberSince: '2017-08-15',
    },
    position: {
      title: 'Professor',
      institution: 'University of Tokyo',
      faculty: 'Faculty of Engineering',
      department: 'Department of Mechanical Engineering',
      country: 'Japan',
      city: 'Tokyo',
      employmentType: 'Full-time',
      startDate: '2017-04-01',
      current: true,
      researchFocus: ['Human-Robot Interaction', 'Robotic Manipulation', 'Soft Robotics'],
    },
    biography: {
      professionalSummary:
        'Professor of Robotics at the University of Tokyo, leading a laboratory on human-robot interaction and soft robotic manipulation.',
      academicSummary:
        'Robotics researcher with 110+ publications, 8 patents, and leadership of major national robotics programmes.',
      shortBiography:
        'Professor of Robotics at the University of Tokyo focused on human-robot interaction, manipulation, and soft robotics.',
      fullBiography:
        'Professor Yuki Tanaka directs the Human-Centred Robotics Laboratory at the University of Tokyo. His research spans robotic manipulation, soft actuators, and natural human-robot interaction, with applications in manufacturing and eldercare. He holds eight patents, co-founded a robotics startup, and serves on the advisory board of the national robotic innovation programme.',
      areasOfExpertise: ['Robotics', 'Mechanical Engineering', 'Artificial Intelligence'],
    },
    interests: [
      { id: 'interest-hri', name: 'Human-Robot Interaction', category: 'Robotics', keywords: ['interaction', 'cobots', 'haptics'] },
      { id: 'interest-soft', name: 'Soft Robotics', category: 'Robotics', keywords: ['actuators', 'compliant', 'wearable'] },
      { id: 'interest-manip', name: 'Robotic Manipulation', category: 'Robotics', keywords: ['grasping', 'dexterity', 'learning'] },
    ],
    researchAreas: [
      { id: 'area-soft', name: 'Soft robotic actuators', description: 'Compliant actuators for safe physical human-robot interaction.', publications: 44, citations: 2600 },
      { id: 'area-hri', name: 'Natural interaction', description: 'Perception and control for intuitive robot collaboration.', publications: 36, citations: 1750 },
    ],
    education: [
      { id: 'edu-deng', institution: 'University of Tokyo', degree: 'PhD in Mechanical Engineering', field: 'Robotics', startDate: '2005', endDate: '2008', country: 'Japan' },
      { id: 'edu-meng', institution: 'University of Tokyo', degree: 'MEng in Mechanical Engineering', field: 'Robotics', startDate: '2003', endDate: '2005', country: 'Japan' },
      { id: 'edu-beng', institution: 'Tokyo Institute of Technology', degree: 'BEng in Mechanical Engineering', field: 'Mechanical Engineering', startDate: '1999', endDate: '2003', country: 'Japan' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'University of Tokyo', role: 'Professor', department: 'Department of Mechanical Engineering', startDate: '2017', current: true },
      { id: 'emp-assoc', organisation: 'University of Tokyo', role: 'Associate Professor', startDate: '2012', endDate: '2017' },
      { id: 'emp-postdoc', organisation: 'MIT', role: 'Postdoctoral Fellow', startDate: '2008', endDate: '2012' },
    ],
    memberships: [
      { id: 'mem-ieee-ras', organisation: 'IEEE Robotics and Automation Society', role: 'Senior Member', type: 'Professional Association', since: '2013', status: 'Active' },
      { id: 'mem-rsj', organisation: 'Robotics Society of Japan', role: 'Member', type: 'Professional Association', since: '2008', status: 'Active' },
    ],
    awards: [
      { id: 'aw-icra', title: 'Best Paper Award', organisation: 'ICRA', year: '2022', category: 'Publication', description: 'For soft actuator control paper.' },
      { id: 'aw-sato', title: 'Sato Memorial Research Prize', organisation: 'JSPS', year: '2020', category: 'Research', description: 'For advances in compliant manipulation.' },
    ],
    honors: [{ id: 'hon-jsps', title: 'JSPS Fellow', organisation: 'Japan Society for the Promotion of Science', year: '2019', description: 'Senior fellowship award.' }],
    certifications: [{ id: 'cert-ir', name: 'Research Integrity Training', issuer: 'University of Tokyo', year: '2020' }],
    skills: [
      { id: 'skill-cpp', name: 'C++ / ROS', category: 'Programming', level: 'Expert' },
      { id: 'skill-cad', name: 'CAD / Simulation', category: 'Engineering', level: 'Expert' },
      { id: 'skill-control', name: 'Control Systems', category: 'Engineering', level: 'Expert' },
      { id: 'skill-ml', name: 'Robot Learning', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-lead', name: 'Laboratory Leadership', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-ja', name: 'Japanese', proficiency: 'Native' },
      { id: 'lang-en6', name: 'English', proficiency: 'Fluent' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/yuki-tanaka-robotics',
      personalWebsite: 'https://tanaka.scholatia.com',
      github: 'https://github.com/yukitanaka',
      youtube: 'https://www.youtube.com/@roboticslab',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-t1', name: 'Dr. Maria Fern\u00e1ndez', institution: 'UNAM', role: 'Collaborator', researchAreas: ['Astrophysics'], jointPublications: 9, username: 'maria' },
        { id: 'collab-t2', name: 'Prof. Li Wang', institution: 'Tsinghua University', role: 'Collaborator', researchAreas: ['Network Science'], jointPublications: 7, username: 'wang' },
      ],
      institutionalPartners: ['MIT', 'Tsinghua University'],
      professionalNetwork: 700,
      followers: 12000,
      following: 220,
      coAuthors: 110,
    },
    teaching: {
      courses: [
        { id: 'course-robot', title: 'Introduction to Robotics', code: 'ME 412', level: 'Undergraduate', institution: 'University of Tokyo', department: 'Mechanical Engineering', yearsTaught: '2013 - Present', students: 300, rating: 4.7 },
        { id: 'course-soft', title: 'Soft Robotics', code: 'ME 711', level: 'Doctoral', institution: 'University of Tokyo', department: 'Mechanical Engineering', yearsTaught: '2018 - Present', students: 60, rating: 4.9 },
      ],
      teachingExperience: '15 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-t1', name: 'Haruto Sato', level: 'PhD', thesisTitle: 'Compliant manipulation with soft grippers', institution: 'University of Tokyo', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 5,
      completedPhd: 12,
      currentMasters: 6,
      completedMasters: 28,
      totalSupervised: 51,
    },
    editorialAppointments: [
      { id: 'edit-t1', role: 'Associate Editor', journal: 'IEEE Robotics and Automation Letters', since: '2019', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-t1', conference: 'IEEE ICRA', year: '2024', role: 'Invited Speaker', paperTitle: 'Soft actuators for safe collaboration', city: 'Yokohama', country: 'Japan' },
    ],
    grantParticipation: [
      { id: 'grant-t1', title: 'Soft Robotic Eldercare Systems', funder: 'JSPS', amount: '\u00a51,800,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    patents: [
      { id: 'pat-t1', title: 'Compliant soft gripper with variable stiffness', inventors: ['Yuki Tanaka', 'H. Sato'], patentNumber: 'JP/2022/00419', country: 'Japan', year: '2022', status: 'Granted' },
    ],
    innovations: [{ id: 'inno-t1', title: 'SoftGrip Actuator', description: 'Variable-stiffness gripper licensed to industrial partners.', category: 'Robotics', year: '2023', status: 'Licensed' }],
    startups: [{ id: 'start-t1', name: 'SoftMotion Robotics', description: 'Soft robotic components for manufacturing automation.', founded: '2021', sector: 'Robotics', stage: 'Series A', fundingRaised: '$4.0M' }],
    mediaCoverage: [{ id: 'media-t1', outlet: 'Nikkei', headline: '\u30bd\u30d5\u30c8\u30ed\u30dc\u30c6\u30a3\u30af\u30b9\u304c\u88fd\u9020\u73fe\u5834\u3092\u5909\u3048\u308b', date: '2024-06-14', type: 'Newspaper' }],
    communityService: [{ id: 'cs-t1', role: 'Advisory Board Member', organisation: 'National Robotic Innovation Programme', since: '2022', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Laboratory email' },
    contact: { email: 'yuki.tanaka@scholatia.org', professionalEmail: 'tanaka@robotics.t.u-tokyo.ac.jp', office: 'Hongo Campus, Tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 93,
      trustScore: 92,
      visibilityScore: 89,
      badges: [...PLACEHOLDER_BADGES, 'Trusted'],
      lastVerified: '2026-03-30',
      academicAchievements: ['Best Paper, ICRA 2022', 'JSPS senior fellow', '8 patents granted'],
    },
  }),

  makeResearcher(7, {
    username: 'okonkwo',
    displayName: 'Dr. Nneka Okonkwo',
    firstName: 'Nneka',
    lastName: 'Okonkwo',
    avatar: '🧠',
    headline: 'Senior Lecturer in Computer Science',
    country: 'Nigeria',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=nnekaokonkwo',
      scopusAuthorId: '57190330221',
      webOfScienceResearcherId: 'AAK-3390-2023',
      crossref: 'https://search.crossref.org/?q=nneka+okonkwo',
      memberSince: '2019-09-01',
    },
    position: {
      title: 'Senior Lecturer',
      institution: 'Obafemi Awolowo University',
      institutionId: 'INST-OAU-003',
      faculty: 'Faculty of Technology',
      department: 'Department of Computer Science and Engineering',
      country: 'Nigeria',
      city: 'Ile-Ife',
      employmentType: 'Full-time',
      startDate: '2018-01-01',
      current: true,
      researchFocus: ['Machine Learning', 'AI Ethics', 'African Language Technologies'],
    },
    biography: {
      professionalSummary:
        'Senior Lecturer in Computer Science at Obafemi Awolowo University, researching machine learning, AI ethics, and technologies for African languages.',
      academicSummary:
        'AI researcher with 40+ publications, leadership of the African NLP ethics working group, and 20 supervised postgraduate students.',
      shortBiography:
        'Senior Lecturer in Computer Science at OAU focused on machine learning, AI ethics, and African language technologies.',
      fullBiography:
        'Dr. Nneka Okonkwo is a Senior Lecturer in Computer Science and Engineering at Obafemi Awolowo University. Her research applies machine learning to African language technologies while advancing the ethics of AI deployment in the Global South. She co-chairs the African NLP ethics working group and has led significant funded projects on low-resource African language processing.',
      areasOfExpertise: ['Computer Science', 'Artificial Intelligence', 'Ethics'],
    },
    interests: [
      { id: 'interest-aiethics', name: 'AI Ethics', category: 'Artificial Intelligence', keywords: ['fairness', 'accountability', 'Global South'] },
      { id: 'interest-africanlp', name: 'African Language NLP', category: 'NLP', keywords: ['Yoruba', 'Igbo', 'low-resource'] },
      { id: 'interest-ml', name: 'Applied Machine Learning', category: 'Artificial Intelligence', keywords: ['classification', 'NLP', 'ML'] },
    ],
    researchAreas: [
      { id: 'area-afr', name: 'African language technologies', description: 'NLP tools and datasets for Yoruba, Igbo, and Hausa.', publications: 28, citations: 1100 },
      { id: 'area-ethics', name: 'AI ethics in the Global South', description: 'Fairness and accountability of AI systems in Africa.', publications: 15, citations: 640 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Cape Town', degree: 'PhD in Computer Science', field: 'Artificial Intelligence', startDate: '2012', endDate: '2016', country: 'South Africa' },
      { id: 'edu-msc', institution: 'Obafemi Awolowo University', degree: 'MSc in Computer Science', field: 'Computer Science', startDate: '2008', endDate: '2010', country: 'Nigeria' },
      { id: 'edu-bsc', institution: 'University of Nigeria', degree: 'BSc in Computer Science', field: 'Computer Science', startDate: '2003', endDate: '2007', country: 'Nigeria' },
    ],
    employment: [
      { id: 'emp-senior', organisation: 'Obafemi Awolowo University', role: 'Senior Lecturer', department: 'Department of Computer Science and Engineering', startDate: '2018', current: true },
      { id: 'emp-lect', organisation: 'Obafemi Awolowo University', role: 'Lecturer I', startDate: '2013', endDate: '2018' },
      { id: 'emp-assist', organisation: 'University of Cape Town', role: 'Research Assistant', startDate: '2012', endDate: '2016' },
    ],
    memberships: [
      { id: 'mem-acl2', organisation: 'Association for Computational Linguistics', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
      { id: 'mem-ncs', organisation: 'Nigerian Computer Society', role: 'Member', type: 'Professional Association', since: '2012', status: 'Active' },
    ],
    awards: [
      { id: 'aw-africnlp', title: 'AfricaNLP Best Paper Award', organisation: 'AfricaNLP Workshop', year: '2024', category: 'Publication', description: 'For Yoruba language modelling paper.' },
      { id: 'aw-earlycareer2', title: 'Early Career Research Award', organisation: 'TETFund', year: '2022', category: 'Research', description: 'For African language technology research.' },
    ],
    honors: [{ id: 'hon-mary', title: 'Mary Kingsley Award', organisation: 'Royal African Society', year: '2023', description: 'For research excellence in African technology.' }],
    certifications: [{ id: 'cert-dm2', name: 'Responsible AI Certification', issuer: 'AI Ethics Lab', year: '2022', description: 'Responsible AI design and governance.' }],
    skills: [
      { id: 'skill-python7', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-tf', name: 'TensorFlow', category: 'Programming', level: 'Advanced' },
      { id: 'skill-nlp', name: 'Natural Language Processing', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-ethics', name: 'AI Ethics & Governance', category: 'Professional', level: 'Advanced' },
      { id: 'skill-teaching', name: 'University Teaching', category: 'Professional', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-en7', name: 'English', proficiency: 'Native' },
      { id: 'lang-ig', name: 'Igbo', proficiency: 'Native' },
      { id: 'lang-yo7', name: 'Yoruba', proficiency: 'Professional Working' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/nneka-okonkwo',
      personalWebsite: 'https://okonkwo.scholatia.com',
      twitter: 'https://x.com/nneka_ai',
      github: 'https://github.com/nnekaokonkwo',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-n1', name: 'Dr. A. Oladipo', institution: 'Obafemi Awolowo University', role: 'Collaborator', researchAreas: ['Machine Learning'], jointPublications: 10 },
        { id: 'collab-n2', name: 'Dr. Folake Adesina', institution: 'University of Ghana', role: 'Collaborator', researchAreas: ['Agricultural Economics'], jointPublications: 6, username: 'adesina' },
      ],
      institutionalPartners: ['University of Cape Town', 'Deep Learning Indaba'],
      professionalNetwork: 460,
      followers: 8800,
      following: 240,
      coAuthors: 58,
    },
    teaching: {
      courses: [
        { id: 'course-ml', title: 'Machine Learning', code: 'CSC 512', level: 'Masters', institution: 'Obafemi Awolowo University', department: 'Computer Science', yearsTaught: '2015 - Present', students: 220, rating: 4.8 },
        { id: 'course-aiethics', title: 'AI Ethics and Society', code: 'CSC 620', level: 'Doctoral', institution: 'Obafemi Awolowo University', department: 'Computer Science', yearsTaught: '2020 - Present', students: 45, rating: 4.9 },
      ],
      teachingExperience: '12 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-n1', name: 'Yetunde Bakare', level: 'PhD', thesisTitle: 'Ethical NLP for Yoruba', institution: 'Obafemi Awolowo University', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 3,
      completedPhd: 4,
      currentMasters: 5,
      completedMasters: 15,
      totalSupervised: 27,
    },
    editorialAppointments: [
      { id: 'edit-n1', role: 'Review Editor', journal: 'African Journal of Computing', since: '2022', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-n1', conference: 'AfricaNLP Workshop', year: '2024', role: 'Invited Speaker', paperTitle: 'Yoruba text-to-speech synthesis', city: 'Cape Town', country: 'South Africa' },
    ],
    grantParticipation: [
      { id: 'grant-n1', title: 'African Language Technologies', funder: 'National Research Fund', amount: '\u00a3700,000', role: 'Co-Investigator', status: 'Active', period: '2024 - 2027' },
      { id: 'grant-n2', title: 'Responsible AI in Nigeria', funder: 'International Development Research Centre', amount: '\u00a3250,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2026' },
    ],
    mediaCoverage: [
      { id: 'media-n1', outlet: 'TechCrunch', headline: 'Teaching AI to speak Yoruba, Igbo, and Hausa', date: '2024-11-22', type: 'Technology news' },
    ],
    publicEngagement: [
      { id: 'engage-n1', title: 'AI for beginners', format: 'University outreach', date: '2025-02-01', audience: 'Secondary students', reach: 1200 },
    ],
    communityService: [{ id: 'cs-n1', role: 'Co-Chair', organisation: 'African NLP Ethics Working Group', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-n1', organisation: 'Women in AI Africa', role: 'Mentor', period: '2021 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Professional email' },
    contact: { email: 'nneka.okonkwo@scholatia.org', professionalEmail: 'nokonkwo@oauife.edu.ng', office: 'Faculty of Technology, OAU', city: 'Ile-Ife', country: 'Nigeria', timezone: 'Africa/Lagos' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 90,
      trustScore: 88,
      visibilityScore: 85,
      lastVerified: '2026-02-14',
      academicAchievements: ['AfricaNLP Best Paper 2024', 'Mary Kingsley Award 2023', '27 postgraduate students supervised'],
    },
  }),

  makeResearcher(8, {
    username: 'dube',
    displayName: 'Dr. Thabo Dube',
    firstName: 'Thabo',
    lastName: 'Dube',
    avatar: '🧬',
    headline: 'Research Fellow in Bioinformatics',
    country: 'South Africa',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=thabodube',
      scopusAuthorId: '57211890324',
      webOfScienceResearcherId: 'AAL-7710-2024',
      crossref: 'https://search.crossref.org/?q=thabo+dube',
      memberSince: '2020-01-20',
    },
    position: {
      title: 'Research Fellow',
      institution: 'University of Cape Town',
      faculty: 'Faculty of Health Sciences',
      department: 'Computational Biology',
      country: 'South Africa',
      city: 'Cape Town',
      employmentType: 'Full-time',
      startDate: '2021-03-01',
      current: true,
      researchFocus: ['Genomics', 'Infectious Disease Genomics', 'Population Genetics'],
    },
    biography: {
      professionalSummary:
        'Research Fellow in Computational Biology at the University of Cape Town, applying genomics to infectious disease surveillance across Southern Africa.',
      academicSummary:
        'Bioinformatician with 50+ publications, leadership of regional pathogen genomic surveillance pipelines, and 12 trained genomic analysts.',
      shortBiography:
        'Research Fellow in bioinformatics at UCT specialising in genomics, infectious disease surveillance, and population genetics.',
      fullBiography:
        'Dr. Thabo Dube is a computational biologist at the University of Cape Town. He builds genomic surveillance pipelines that track pathogen evolution across Southern Africa, contributing to regional pandemic preparedness. His work spans bacterial and viral genomics, population genetics, and reproducible open bioinformatics.',
      areasOfExpertise: ['Bioinformatics', 'Genomics', 'Infectious Disease'],
    },
    interests: [
      { id: 'interest-genomics', name: 'Pathogen Genomics', category: 'Genomics', keywords: ['surveillance', 'evolution', 'sequencing'] },
      { id: 'interest-bioinfo', name: 'Bioinformatics Pipelines', category: 'Bioinformatics', keywords: ['nextflow', 'reproducibility', 'workflows'] },
      { id: 'interest-popgen', name: 'Population Genetics', category: 'Genetics', keywords: ['genomics', 'selection', 'Africa'] },
    ],
    researchAreas: [
      { id: 'area-genomics', name: 'Pathogen genomic surveillance', description: 'Real-time genomic tracking of infectious disease outbreaks.', publications: 32, citations: 1500 },
      { id: 'area-pop', name: 'African population genomics', description: 'Genomic diversity and disease susceptibility in African populations.', publications: 18, citations: 720 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Cape Town', degree: 'PhD in Bioinformatics', field: 'Computational Biology', startDate: '2015', endDate: '2019', country: 'South Africa' },
      { id: 'edu-msc', institution: 'University of the Witwatersrand', degree: 'MSc in Molecular Biology', field: 'Molecular Biology', startDate: '2012', endDate: '2014', country: 'South Africa' },
      { id: 'edu-bsc', institution: 'University of Zimbabwe', degree: 'BSc in Biological Sciences', field: 'Biological Sciences', startDate: '2008', endDate: '2011', country: 'Zimbabwe' },
    ],
    employment: [
      { id: 'emp-fellow', organisation: 'University of Cape Town', role: 'Research Fellow', department: 'Computational Biology', startDate: '2021', current: true },
      { id: 'emp-postdoc', organisation: 'Wellcome Sanger Institute', role: 'Postdoctoral Researcher', startDate: '2019', endDate: '2021' },
    ],
    memberships: [
      { id: 'mem-isb', organisation: 'International Society for Computational Biology', role: 'Member', type: 'Professional Association', since: '2018', status: 'Active' },
      { id: 'mem-sagh', organisation: 'Society of African Genomics', role: 'Member', type: 'Professional Association', since: '2020', status: 'Active' },
    ],
    awards: [
      { id: 'aw-young2', title: 'Early Career Researcher Award', organisation: 'African Academy of Sciences', year: '2023', category: 'Research', description: 'For genomics capacity building in Africa.' },
    ],
    honors: [{ id: 'hon-fellow2', title: 'Research Fellowship', organisation: 'Wellcome Trust', year: '2022', description: 'Wellcome career development fellowship.' }],
    certifications: [{ id: 'cert-galaxy', name: 'Galaxy Platform Administration', issuer: 'Galaxy Project', year: '2019' }],
    skills: [
      { id: 'skill-r', name: 'R / Bioconductor', category: 'Programming', level: 'Expert' },
      { id: 'skill-python8', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-nextflow', name: 'Nextflow Pipelines', category: 'Programming', level: 'Expert' },
      { id: 'skill-genomic', name: 'Genomic Analysis', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-repro', name: 'Reproducible Research', category: 'Research Methods', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-en8', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-nd', name: 'Ndebele', proficiency: 'Native' },
      { id: 'lang-afr', name: 'Afrikaans', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/thabo-dube',
      personalWebsite: 'https://dube.scholatia.com',
      github: 'https://github.com/thabodube',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-d1', name: 'Dr. Bongani Ndlovu', institution: 'CSIR', role: 'Collaborator', researchAreas: ['Cybersecurity'], jointPublications: 5, username: 'ndlovu' },
      ],
      institutionalPartners: ['Wellcome Sanger Institute', 'KEMRI Wellcome Trust'],
      professionalNetwork: 290,
      followers: 4600,
      following: 380,
      coAuthors: 74,
    },
    teaching: {
      courses: [
        { id: 'course-bioinf', title: 'Applied Bioinformatics', code: 'CBB 550', level: 'Masters', institution: 'University of Cape Town', department: 'Computational Biology', yearsTaught: '2022 - Present', students: 60, rating: 4.8 },
      ],
      teachingExperience: '4 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-d1', name: 'Naledi Mokoena', level: 'PhD', thesisTitle: 'Genomic epidemiology of TB in South Africa', institution: 'University of Cape Town', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 2,
      completedPhd: 1,
      currentMasters: 3,
      completedMasters: 4,
      totalSupervised: 10,
    },
    editorialAppointments: [{ id: 'edit-d1', role: 'Associate Editor', journal: 'Bioinformatics Advances', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-d1', conference: 'ISCB Africa', year: '2024', role: 'Invited Speaker', paperTitle: 'Genomic surveillance infrastructure for Africa', city: 'Nairobi', country: 'Kenya' },
    ],
    grantParticipation: [
      { id: 'grant-d1', title: 'Regional Pathogen Genomics Network', funder: 'Wellcome Trust', amount: '\u00a32,100,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    innovations: [{ id: 'inno-d1', title: 'PathogenWatch', description: 'Open genomic surveillance dashboard for African public health.', category: 'Digital Health', year: '2024', status: 'Research' }],
    mediaCoverage: [{ id: 'media-d1', outlet: 'Mail & Guardian', headline: 'Genomics speeds up outbreak response in Africa', date: '2024-05-30', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-d1', title: 'Open genomics for Africa', format: 'Webinar series', date: '2024-09-01', audience: 'Researchers', reach: 900 },
    ],
    communityService: [{ id: 'cs-d1', role: 'Training Lead', organisation: 'Society of African Genomics', since: '2022', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'thabo.dube@scholatia.org', professionalEmail: 'thabo.dube@uct.ac.za', office: 'Computational Biology, UCT', city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 89,
      trustScore: 87,
      visibilityScore: 82,
      lastVerified: '2026-01-09',
      academicAchievements: ['Wellcome career development fellow', 'Regional genomics network lead', '10 students supervised'],
    },
  }),

  makeResearcher(9, {
    username: 'rivers',
    displayName: 'Dr. Ana Rivers',
    firstName: 'Ana',
    lastName: 'Rivers',
    avatar: '🌍',
    headline: 'Assistant Professor of Climate Science',
    country: 'United States',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=anarivers',
      scopusAuthorId: '57193021544',
      webOfScienceResearcherId: 'AAM-8820-2023',
      crossref: 'https://search.crossref.org/?q=ana+rivers',
      memberSince: '2018-04-18',
    },
    position: {
      title: 'Assistant Professor',
      institution: 'Stanford University',
      faculty: 'School of Earth, Energy & Environmental Sciences',
      department: 'Department of Earth System Science',
      country: 'United States',
      city: 'Stanford',
      employmentType: 'Full-time',
      startDate: '2021-09-01',
      current: true,
      researchFocus: ['Climate Modeling', 'Hydrology', 'Climate Impacts'],
    },
    biography: {
      professionalSummary:
        'Assistant Professor of Earth System Science at Stanford, developing climate models and studying hydrologic impacts of a warming world.',
      academicSummary:
        'Climate scientist with 40+ publications, leadership of an NSF climate-impacts programme, and recognition for public climate communication.',
      shortBiography:
        'Assistant Professor of Climate Science at Stanford focused on climate modelling, hydrology, and climate impacts.',
      fullBiography:
        'Dr. Ana Rivers is an Assistant Professor in Earth System Science at Stanford University. Her research group develops high-resolution climate and hydrology models to project regional climate impacts and inform adaptation policy. She leads an NSF programme on climate impacts in the western United States and is a frequent communicator of climate science to the public.',
      areasOfExpertise: ['Climate Science', 'Earth Sciences', 'Data Science'],
    },
    interests: [
      { id: 'interest-model', name: 'Climate Modelling', category: 'Climate Science', keywords: ['CMIP', 'regional', 'projection'] },
      { id: 'interest-hydro', name: 'Hydrology', category: 'Earth Science', keywords: ['drought', 'water', 'runoff'] },
      { id: 'interest-impacts', name: 'Climate Impacts', category: 'Climate Science', keywords: ['adaptation', 'risk', 'policy'] },
    ],
    researchAreas: [
      { id: 'area-regional', name: 'Regional climate projection', description: 'Downscaled climate projections for water-stressed regions.', publications: 26, citations: 1400 },
      { id: 'area-drought', name: 'Drought and hydrology', description: 'Modelling drought risk under future emissions scenarios.', publications: 18, citations: 850 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of California, Berkeley', degree: 'PhD in Environmental Science', field: 'Climate Science', startDate: '2014', endDate: '2019', country: 'United States' },
      { id: 'edu-msc', institution: 'University of Colorado Boulder', degree: 'MSc in Atmospheric Science', field: 'Atmospheric Science', startDate: '2012', endDate: '2014', country: 'United States' },
      { id: 'edu-bsc', institution: 'University of Texas at Austin', degree: 'BSc in Environmental Science', field: 'Environmental Science', startDate: '2008', endDate: '2012', country: 'United States' },
    ],
    employment: [
      { id: 'emp-asst', organisation: 'Stanford University', role: 'Assistant Professor', department: 'Department of Earth System Science', startDate: '2021', current: true },
      { id: 'emp-postdoc', organisation: 'NCAR', role: 'Postdoctoral Researcher', startDate: '2019', endDate: '2021' },
    ],
    memberships: [
      { id: 'mem-agu', organisation: 'American Geophysical Union', role: 'Member', type: 'Professional Association', since: '2015', status: 'Active' },
      { id: 'mem-ams', organisation: 'American Meteorological Society', role: 'Member', type: 'Professional Association', since: '2016', status: 'Active' },
    ],
    awards: [
      { id: 'aw-nsf', title: 'NSF CAREER Award', organisation: 'National Science Foundation', year: '2024', category: 'Funding', description: 'Early career research on climate impacts.' },
    ],
    honors: [{ id: 'hon-earning', title: 'AGU Early Career Award', organisation: 'American Geophysical Union', year: '2023', description: 'For contributions to climate science.' }],
    certifications: [{ id: 'cert-hpc2', name: 'High-Performance Computing', issuer: 'University of California', year: '2017' }],
    skills: [
      { id: 'skill-python9', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-ncl', name: 'NCL / Xarray', category: 'Programming', level: 'Expert' },
      { id: 'skill-modelling', name: 'Climate Modelling', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-stats9', name: 'Statistical Analysis', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-comm', name: 'Science Communication', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en9', name: 'English', proficiency: 'Native' },
      { id: 'lang-es9', name: 'Spanish', proficiency: 'Fluent' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ana-rivers',
      personalWebsite: 'https://rivers.scholatia.com',
      twitter: 'https://x.com/ana_rivers_climate',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-r1', name: 'Prof. Min-jun Kim', institution: 'Seoul National University', role: 'Collaborator', researchAreas: ['Materials Science'], jointPublications: 4, username: 'kim' },
      ],
      institutionalPartners: ['NCAR', 'University of California, Berkeley'],
      professionalNetwork: 410,
      followers: 15000,
      following: 300,
      coAuthors: 52,
    },
    teaching: {
      courses: [
        { id: 'course-climate', title: 'Climate Systems Science', code: 'ESS 202', level: 'Graduate', institution: 'Stanford University', department: 'Earth System Science', yearsTaught: '2022 - Present', students: 80, rating: 4.8 },
      ],
      teachingExperience: '5 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-r1', name: 'Jordan Lee', level: 'PhD', thesisTitle: 'Drought projections for the American West', institution: 'Stanford University', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 3,
      completedPhd: 1,
      currentMasters: 2,
      completedMasters: 4,
      totalSupervised: 10,
    },
    editorialAppointments: [{ id: 'edit-r1', role: 'Review Editor', journal: 'Environmental Research Letters', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-r1', conference: 'AGU Fall Meeting', year: '2024', role: 'Invited Speaker', paperTitle: 'Drought risk in a warming West', city: 'Washington, DC', country: 'United States' },
    ],
    grantParticipation: [
      { id: 'grant-r1', title: 'Climate Impacts in the Western US', funder: 'National Science Foundation', amount: '$850,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2029' },
    ],
    mediaCoverage: [{ id: 'media-r1', outlet: 'The Washington Post', headline: 'What the new drought models mean for the West', date: '2025-01-18', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-r1', title: 'Climate town halls', format: 'Public talks', date: '2024-10-05', audience: 'Community members', reach: 1500 },
    ],
    communityService: [{ id: 'cs-r1', role: 'Science Adviser', organisation: 'California Climate Action Network', since: '2023', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'ana.rivers@scholatia.org', professionalEmail: 'arivers@stanford.edu', office: 'Y2E2 Building, Stanford', city: 'Stanford', country: 'United States', timezone: 'America/Los_Angeles' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 91,
      trustScore: 89,
      visibilityScore: 90,
      lastVerified: '2026-05-01',
      academicAchievements: ['NSF CAREER Award 2024', 'AGU Early Career Award 2023', 'Public climate communication recognition'],
    },
  }),

  makeResearcher(10, {
    username: 'kim',
    displayName: 'Prof. Min-jun Kim',
    firstName: 'Min-jun',
    lastName: 'Kim',
    avatar: '🧪',
    headline: 'Professor of Materials Science',
    country: 'South Korea',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=mjkim',
      scopusAuthorId: '56110982371',
      webOfScienceResearcherId: 'AAN-1122-2022',
      crossref: 'https://search.crossref.org/?q=minjun+kim',
      memberSince: '2017-07-12',
    },
    position: {
      title: 'Professor',
      institution: 'Seoul National University',
      faculty: 'College of Engineering',
      department: 'Department of Materials Science and Engineering',
      country: 'South Korea',
      city: 'Seoul',
      employmentType: 'Full-time',
      startDate: '2018-03-01',
      current: true,
      researchFocus: ['Nanomaterials', 'Energy Storage', '2D Materials'],
    },
    biography: {
      professionalSummary:
        'Professor of Materials Science at Seoul National University, developing nanomaterials for next-generation energy storage.',
      academicSummary:
        'Materials scientist with 130+ publications, 12 patents, and leadership of national battery materials programmes.',
      shortBiography:
        'Professor of Materials Science at SNU focused on nanomaterials and energy storage technologies.',
      fullBiography:
        'Professor Min-jun Kim leads the Nanomaterials for Energy Laboratory at Seoul National University. His research develops two-dimensional materials and nanostructured electrodes for lithium and sodium batteries, supercapacitors, and green hydrogen production. His group\u2019s advances have been licensed to three companies, and he advises the national battery innovation initiative.',
      areasOfExpertise: ['Materials Science', 'Nanotechnology', 'Energy'],
    },
    interests: [
      { id: 'interest-nano', name: 'Nanomaterials', category: 'Materials Science', keywords: ['synthesis', '2D', 'nanostructures'] },
      { id: 'interest-battery', name: 'Battery Materials', category: 'Energy', keywords: ['lithium', 'sodium', 'electrodes'] },
      { id: 'interest-2d', name: '2D Materials', category: 'Materials Science', keywords: ['graphene', 'MXene', 'TMDs'] },
    ],
    researchAreas: [
      { id: 'area-battery', name: 'Next-generation batteries', description: 'Nanostructured electrodes for high-energy lithium and sodium batteries.', publications: 48, citations: 3200 },
      { id: 'area-2d', name: 'Two-dimensional materials', description: 'Synthesis and device integration of 2D materials.', publications: 40, citations: 2100 },
    ],
    education: [
      { id: 'edu-phd', institution: 'KAIST', degree: 'PhD in Materials Science', field: 'Materials Science', startDate: '2006', endDate: '2010', country: 'South Korea' },
      { id: 'edu-msc', institution: 'Seoul National University', degree: 'MSc in Materials Science', field: 'Materials Science', startDate: '2004', endDate: '2006', country: 'South Korea' },
      { id: 'edu-bsc', institution: 'Seoul National University', degree: 'BSc in Materials Science', field: 'Materials Science', startDate: '2000', endDate: '2004', country: 'South Korea' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'Seoul National University', role: 'Professor', department: 'Department of Materials Science and Engineering', startDate: '2018', current: true },
      { id: 'emp-assoc', organisation: 'Seoul National University', role: 'Associate Professor', startDate: '2013', endDate: '2018' },
      { id: 'emp-postdoc', organisation: 'Stanford University', role: 'Postdoctoral Researcher', startDate: '2010', endDate: '2013' },
    ],
    memberships: [
      { id: 'mem-mrs', organisation: 'Materials Research Society', role: 'Member', type: 'Professional Association', since: '2012', status: 'Active' },
      { id: 'mem-kse', organisation: 'Korean Academy of Science and Technology', role: 'Member', type: 'Learned Society', since: '2020', status: 'Active' },
    ],
    awards: [
      { id: 'aw-national', title: 'National Science Award', organisation: 'Ministry of Science and ICT', year: '2023', category: 'Research', description: 'For nanomaterial energy storage breakthroughs.' },
      { id: 'aw-outstanding', title: 'Outstanding Young Scientist Award', organisation: 'Korean Academy of Science', year: '2019', category: 'Recognition' },
    ],
    honors: [{ id: 'hon-kaist', title: 'KAIST Distinguished Alumni', organisation: 'KAIST', year: '2024', description: 'For professional achievements.' }],
    certifications: [{ id: 'cert-safety', name: 'Laboratory Safety Certification', issuer: 'SNU', year: '2016' }],
    skills: [
      { id: 'skill-char', name: 'Materials Characterisation', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-synth', name: 'Nanomaterial Synthesis', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-echem', name: 'Electrochemistry', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-manage', name: 'Research Group Management', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-ko', name: 'Korean', proficiency: 'Native' },
      { id: 'lang-en10', name: 'English', proficiency: 'Fluent' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/minjun-kim',
      personalWebsite: 'https://kim.scholatia.com',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-k1', name: 'Dr. Ana Rivers', institution: 'Stanford University', role: 'Collaborator', researchAreas: ['Climate Science'], jointPublications: 4, username: 'rivers' },
      ],
      institutionalPartners: ['Stanford University', 'KAIST'],
      professionalNetwork: 620,
      followers: 9400,
      following: 190,
      coAuthors: 130,
    },
    teaching: {
      courses: [
        { id: 'course-nano', title: 'Nanomaterials', code: 'MSE 430', level: 'Undergraduate', institution: 'Seoul National University', department: 'Materials Science', yearsTaught: '2014 - Present', students: 180, rating: 4.7 },
        { id: 'course-battery', title: 'Energy Storage Materials', code: 'MSE 742', level: 'Doctoral', institution: 'Seoul National University', department: 'Materials Science', yearsTaught: '2019 - Present', students: 50, rating: 4.9 },
      ],
      teachingExperience: '14 years of university teaching',
    },
    supervision: {
      students: [
        { id: 'sup-k1', name: 'Ji-woo Park', level: 'PhD', thesisTitle: 'MXene electrodes for sodium batteries', institution: 'Seoul National University', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 5,
      completedPhd: 11,
      currentMasters: 5,
      completedMasters: 24,
      totalSupervised: 45,
    },
    editorialAppointments: [
      { id: 'edit-k1', role: 'Editorial Board Member', journal: 'ACS Nano', since: '2021', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-k1', conference: 'MRS Fall Meeting', year: '2024', role: 'Invited Speaker', paperTitle: 'Nanostructured electrodes for fast-charging batteries', city: 'Boston', country: 'United States' },
    ],
    grantParticipation: [
      { id: 'grant-k1', title: 'National Battery Innovation Programme', funder: 'Ministry of Science and ICT', amount: '\u00a54,200,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    patents: [
      { id: 'pat-k1', title: 'High-capacity MXene composite electrode', inventors: ['Min-jun Kim', 'J. Park'], patentNumber: 'KR/2022/00871', country: 'South Korea', year: '2022', status: 'Granted' },
    ],
    innovations: [{ id: 'inno-k1', title: 'FastCharge Electrode', description: 'Licensed electrode technology for fast-charging batteries.', category: 'Energy', year: '2023', status: 'Licensed' }],
    startups: [{ id: 'start-k1', name: 'VoltCore Materials', description: 'Battery materials company spun out of SNU research.', founded: '2022', sector: 'Clean Energy', stage: 'Series A', fundingRaised: '$6.5M' }],
    mediaCoverage: [{ id: 'media-k1', outlet: 'Korea Herald', headline: 'SNU lab charges batteries in minutes', date: '2024-04-11', type: 'Newspaper' }],
    communityService: [{ id: 'cs-k1', role: 'Adviser', organisation: 'National Battery Innovation Initiative', since: '2022', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Laboratory email' },
    contact: { email: 'minjun.kim@scholatia.org', professionalEmail: 'mjkim@snu.ac.kr', office: 'Materials Science Building, SNU', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 94,
      trustScore: 92,
      visibilityScore: 88,
      badges: [...PLACEHOLDER_BADGES, 'Trusted'],
      lastVerified: '2026-04-05',
      academicAchievements: ['National Science Award 2023', '12 patents granted', '45 students supervised'],
    },
  }),

  makeResearcher(11, {
    username: 'schneider',
    displayName: 'Dr. Lukas Schneider',
    firstName: 'Lukas',
    lastName: 'Schneider',
    avatar: '⚛️',
    headline: 'Principal Investigator in Quantum Computing',
    country: 'Switzerland',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=lukasschneider',
      scopusAuthorId: '56801294567',
      webOfScienceResearcherId: 'AAO-8877-2023',
      crossref: 'https://search.crossref.org/?q=lukas+schneider',
      memberSince: '2019-10-05',
    },
    position: {
      title: 'Principal Investigator',
      institution: 'ETH Zurich',
      faculty: 'Department of Information Technology',
      department: 'Quantum Devices Laboratory',
      country: 'Switzerland',
      city: 'Zurich',
      employmentType: 'Full-time',
      startDate: '2020-06-01',
      current: true,
      researchFocus: ['Quantum Error Correction', 'Superconducting Qubits', 'Quantum Computing'],
    },
    biography: {
      professionalSummary:
        'Principal Investigator at ETH Zurich leading a laboratory on superconducting qubits and quantum error correction.',
      academicSummary:
        'Quantum physicist with 60+ publications and leadership of European quantum computing hardware projects.',
      shortBiography:
        'Principal Investigator in quantum computing at ETH Zurich focused on superconducting qubits and error correction.',
      fullBiography:
        'Dr. Lukas Schneider leads the Quantum Devices Laboratory at ETH Zurich, building superconducting quantum processors with low error rates. His research targets scalable quantum error correction, bridging physics and computer science. He coordinates a European quantum hardware consortium and co-founded a startup commercialising quantum control electronics.',
      areasOfExpertise: ['Quantum Computing', 'Physics', 'Electrical Engineering'],
    },
    interests: [
      { id: 'interest-qec', name: 'Quantum Error Correction', category: 'Quantum Computing', keywords: ['qubits', 'codes', 'threshold'] },
      { id: 'interest-super', name: 'Superconducting Qubits', category: 'Quantum Computing', keywords: ['Josephson', 'cryogenics', 'coherence'] },
      { id: 'interest-hw', name: 'Quantum Hardware', category: 'Quantum Computing', keywords: ['control', 'scalability', 'fabrication'] },
    ],
    researchAreas: [
      { id: 'area-qec', name: 'Quantum error correction', description: 'Surface codes and fault-tolerant architectures for superconducting processors.', publications: 34, citations: 1900 },
      { id: 'area-qubit', name: 'Superconducting qubits', description: 'Improving qubit coherence and gate fidelity.', publications: 28, citations: 1300 },
    ],
    education: [
      { id: 'edu-phd', institution: 'TU Munich', degree: 'PhD in Physics', field: 'Quantum Physics', startDate: '2011', endDate: '2015', country: 'Germany' },
      { id: 'edu-msc', institution: 'ETH Zurich', degree: 'MSc in Physics', field: 'Physics', startDate: '2009', endDate: '2011', country: 'Switzerland' },
      { id: 'edu-bsc', institution: 'ETH Zurich', degree: 'BSc in Physics', field: 'Physics', startDate: '2006', endDate: '2009', country: 'Switzerland' },
    ],
    employment: [
      { id: 'emp-pi', organisation: 'ETH Zurich', role: 'Principal Investigator', department: 'Quantum Devices Laboratory', startDate: '2020', current: true },
      { id: 'emp-postdoc', organisation: 'Google Quantum AI', role: 'Research Scientist', startDate: '2016', endDate: '2020' },
      { id: 'emp-postdoc2', organisation: 'TU Munich', role: 'Postdoctoral Researcher', startDate: '2015', endDate: '2016' },
    ],
    memberships: [
      { id: 'mem-aps', organisation: 'American Physical Society', role: 'Member', type: 'Professional Association', since: '2014', status: 'Active' },
      { id: 'mem-sps', organisation: 'Swiss Physical Society', role: 'Member', type: 'Professional Association', since: '2013', status: 'Active' },
    ],
    awards: [
      { id: 'aw-erc', title: 'ERC Starting Grant', organisation: 'European Research Council', year: '2023', category: 'Funding', description: 'For fault-tolerant superconducting processors.' },
      { id: 'aw-young3', title: 'Early Career Prize', organisation: 'Swiss Physical Society', year: '2021', category: 'Research' },
    ],
    honors: [{ id: 'hon-fellow3', title: 'Quantum Fellow', organisation: 'Swiss Quantum Initiative', year: '2022', description: 'National quantum research fellowship.' }],
    certifications: [{ id: 'cert-cryo', name: 'Cryogenic Systems Operation', issuer: 'Bluefors Academy', year: '2018' }],
    skills: [
      { id: 'skill-qe', name: 'Quantum Error Correction', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-cryo', name: 'Cryogenic Measurement', category: 'Engineering', level: 'Expert' },
      { id: 'skill-python11', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-qit', name: 'Quantum Information Theory', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-fab', name: 'Device Fabrication', category: 'Engineering', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-de11', name: 'German', proficiency: 'Native' },
      { id: 'lang-en11', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-fr11', name: 'French', proficiency: 'Professional Working' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/lukas-schneider-quantum',
      personalWebsite: 'https://schneider.scholatia.com',
      github: 'https://github.com/lukasschneider',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-s1', name: 'Prof. Li Wang', institution: 'Tsinghua University', role: 'Collaborator', researchAreas: ['Network Science'], jointPublications: 5, username: 'wang' },
      ],
      institutionalPartners: ['Google Quantum AI', 'TU Munich'],
      professionalNetwork: 350,
      followers: 6200,
      following: 210,
      coAuthors: 70,
    },
    teaching: {
      courses: [
        { id: 'course-quantum', title: 'Introduction to Quantum Computing', code: 'PHS 445', level: 'Graduate', institution: 'ETH Zurich', department: 'Quantum Devices', yearsTaught: '2021 - Present', students: 120, rating: 4.8 },
      ],
      teachingExperience: '6 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-s1', name: 'Elena Fischer', level: 'PhD', thesisTitle: 'Fault-tolerant architectures for superconducting qubits', institution: 'ETH Zurich', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 4,
      completedPhd: 3,
      currentMasters: 2,
      completedMasters: 7,
      totalSupervised: 16,
    },
    editorialAppointments: [{ id: 'edit-s1', role: 'Editorial Board Member', journal: 'npj Quantum Information', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-s1', conference: 'Quantum Europe', year: '2024', role: 'Keynote Speaker', paperTitle: 'Scaling superconducting processors', city: 'Zurich', country: 'Switzerland' },
    ],
    grantParticipation: [
      { id: 'grant-s1', title: 'Fault-Tolerant Superconducting Processors', funder: 'European Research Council', amount: '\u20ac1,800,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    innovations: [{ id: 'inno-s1', title: 'QuControl Electronics', description: 'Low-latency control electronics for superconducting qubits.', category: 'Quantum Hardware', year: '2024', status: 'Commercialised' }],
    startups: [{ id: 'start-s1', name: 'QuControl', description: 'Quantum control electronics for research labs.', founded: '2023', sector: 'Quantum Technology', stage: 'Seed', fundingRaised: '$2.5M' }],
    mediaCoverage: [{ id: 'media-s1', outlet: 'Phys.org', headline: 'ETH Zurich pushes fault-tolerant quantum computing', date: '2024-07-09', type: 'Science news' }],
    communityService: [{ id: 'cs-s1', role: 'Coordinator', organisation: 'Swiss Quantum Initiative', since: '2023', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'lukas.schneider@scholatia.org', professionalEmail: 'lschneider@ethz.ch', office: 'Quantum Devices Laboratory, ETH Z\u00fcrich', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 92,
      trustScore: 90,
      visibilityScore: 86,
      lastVerified: '2026-03-02',
      academicAchievements: ['ERC Starting Grant 2023', 'Swiss Quantum fellow 2022', 'Co-founded QuControl'],
    },
  }),

  makeResearcher(12, {
    username: 'adesina',
    displayName: 'Dr. Folake Adesina',
    firstName: 'Folake',
    lastName: 'Adesina',
    avatar: '🌾',
    headline: 'Senior Lecturer in Agricultural Economics',
    country: 'Ghana',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=folakeadesina',
      scopusAuthorId: '57191357612',
      webOfScienceResearcherId: 'AAP-5512-2023',
      crossref: 'https://search.crossref.org/?q=folake+adesina',
      memberSince: '2020-03-10',
    },
    position: {
      title: 'Senior Lecturer',
      institution: 'University of Ghana',
      faculty: 'College of Basic and Applied Sciences',
      department: 'Department of Agricultural Economics',
      country: 'Ghana',
      city: 'Legon',
      employmentType: 'Full-time',
      startDate: '2019-09-01',
      current: true,
      researchFocus: ['Food Security', 'Smallholder Agriculture', 'Agricultural Policy'],
    },
    biography: {
      professionalSummary:
        'Senior Lecturer in Agricultural Economics at the University of Ghana, researching food security and smallholder farming systems across West Africa.',
      academicSummary:
        'Agricultural economist with 30+ publications, leadership of the Ghana food security observatory, and 15 supervised students.',
      shortBiography:
        'Senior Lecturer in agricultural economics at the University of Ghana, specialising in food security and smallholder agriculture.',
      fullBiography:
        'Dr. Folake Adesina is a Senior Lecturer in Agricultural Economics at the University of Ghana. Her research examines food security, market access, and climate resilience for smallholder farmers in West Africa. She leads the Ghana Food Security Observatory and advises regional agricultural policy bodies.',
      areasOfExpertise: ['Agricultural Economics', 'Food Security', 'Development Studies'],
    },
    interests: [
      { id: 'interest-food', name: 'Food Security', category: 'Agricultural Economics', keywords: ['hunger', 'nutrition', 'policy'] },
      { id: 'interest-small', name: 'Smallholder Agriculture', category: 'Development', keywords: ['smallholders', 'market access', 'resilience'] },
      { id: 'interest-climate-agri', name: 'Climate-Smart Agriculture', category: 'Agricultural Economics', keywords: ['adaptation', 'yield', 'irrigation'] },
    ],
    researchAreas: [
      { id: 'area-food', name: 'Food security policy', description: 'Household food security measurement and policy evaluation.', publications: 22, citations: 780 },
      { id: 'area-small', name: 'Smallholder market access', description: 'Value chains and market participation of smallholder farmers.', publications: 18, citations: 620 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Wageningen University', degree: 'PhD in Agricultural Economics', field: 'Agricultural Economics', startDate: '2013', endDate: '2017', country: 'Netherlands' },
      { id: 'edu-msc', institution: 'University of Ghana', degree: 'MSc in Agricultural Economics', field: 'Agricultural Economics', startDate: '2009', endDate: '2011', country: 'Ghana' },
      { id: 'edu-bsc', institution: 'Kwame Nkrumah University of Science and Technology', degree: 'BSc in Agriculture', field: 'Agriculture', startDate: '2004', endDate: '2008', country: 'Ghana' },
    ],
    employment: [
      { id: 'emp-senior', organisation: 'University of Ghana', role: 'Senior Lecturer', department: 'Department of Agricultural Economics', startDate: '2019', current: true },
      { id: 'emp-lect', organisation: 'University of Ghana', role: 'Lecturer', startDate: '2014', endDate: '2019' },
      { id: 'emp-research', organisation: 'International Food Policy Research Institute', role: 'Research Analyst', startDate: '2012', endDate: '2013' },
    ],
    memberships: [
      { id: 'mem-aaae', organisation: 'African Association of Agricultural Economists', role: 'Member', type: 'Professional Association', since: '2016', status: 'Active' },
      { id: 'mem-iagri', organisation: 'International Association of Agricultural Economists', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
    ],
    awards: [
      { id: 'aw-bestpaper2', title: 'Best Paper Award', organisation: 'AAAE Conference', year: '2022', category: 'Publication', description: 'For smallholder resilience paper.' },
    ],
    honors: [{ id: 'hon-wag', title: 'Wageningen Alumni Award', organisation: 'Wageningen University', year: '2023', description: 'For contributions to African food systems research.' }],
    certifications: [{ id: 'cert-methods', name: 'Impact Evaluation Methods', issuer: 'World Bank', year: '2018' }],
    skills: [
      { id: 'skill-stata', name: 'Stata', category: 'Programming', level: 'Expert' },
      { id: 'skill-econometrics', name: 'Econometrics', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-survey', name: 'Household Survey Design', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-policy', name: 'Policy Analysis', category: 'Professional', level: 'Advanced' },
      { id: 'skill-impact', name: 'Impact Evaluation', category: 'Research Methods', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en12', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-tw', name: 'Twi', proficiency: 'Native' },
      { id: 'lang-ha', name: 'Hausa', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/folake-adesina',
      personalWebsite: 'https://adesina.scholatia.com',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-f1', name: 'Dr. Nneka Okonkwo', institution: 'Obafemi Awolowo University', role: 'Collaborator', researchAreas: ['AI'], jointPublications: 6, username: 'okonkwo' },
      ],
      institutionalPartners: ['Wageningen University', 'IFPRI'],
      professionalNetwork: 260,
      followers: 3800,
      following: 170,
      coAuthors: 34,
    },
    teaching: {
      courses: [
        { id: 'course-agrecon', title: 'Agricultural Economics', code: 'AEC 401', level: 'Undergraduate', institution: 'University of Ghana', department: 'Agricultural Economics', yearsTaught: '2015 - Present', students: 210, rating: 4.7 },
        { id: 'course-foodpol', title: 'Food Security Policy', code: 'AEC 611', level: 'Masters', institution: 'University of Ghana', department: 'Agricultural Economics', yearsTaught: '2020 - Present', students: 55, rating: 4.8 },
      ],
      teachingExperience: '11 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-f1', name: 'Kofi Mensah', level: 'PhD', thesisTitle: 'Climate resilience of maize farmers in northern Ghana', institution: 'University of Ghana', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 2,
      completedPhd: 2,
      currentMasters: 4,
      completedMasters: 10,
      totalSupervised: 18,
    },
    editorialAppointments: [{ id: 'edit-f1', role: 'Review Editor', journal: 'African Journal of Agricultural Economics', since: '2022', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-f1', conference: 'AAAE Conference', year: '2022', role: 'Paper Presenter', paperTitle: 'Smallholder resilience in West Africa', city: 'Abidjan', country: 'C\u00f4te d\u2019Ivoire' },
    ],
    grantParticipation: [
      { id: 'grant-f1', title: 'Ghana Food Security Observatory', funder: 'Bill & Melinda Gates Foundation', amount: '$1,100,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2027' },
    ],
    mediaCoverage: [{ id: 'media-f1', outlet: 'GhanaWeb', headline: 'Feeding Ghana: food security research gets a boost', date: '2024-09-16', type: 'News' }],
    publicEngagement: [
      { id: 'engage-f1', title: 'Farmers\u2019 forums', format: 'Community consultation', date: '2024-11-20', audience: 'Farming communities', reach: 700 },
    ],
    communityService: [{ id: 'cs-f1', role: 'Research Lead', organisation: 'Ghana Food Security Observatory', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-f1', organisation: 'AGRA', role: 'Policy Advisor (volunteer)', period: '2021 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'folake.adesina@scholatia.org', professionalEmail: 'fadesina@ug.edu.gh', office: 'College of Basic and Applied Sciences, UG', city: 'Legon', country: 'Ghana', timezone: 'Africa/Accra' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 88,
      trustScore: 86,
      visibilityScore: 81,
      lastVerified: '2025-12-11',
      academicAchievements: ['AAAE Best Paper 2022', 'Food security observatory lead', '18 students supervised'],
    },
  }),

  makeResearcher(13, {
    username: 'das',
    displayName: 'Dr. Priya Das',
    firstName: 'Priya',
    lastName: 'Das',
    avatar: '📈',
    headline: 'Research Scientist in Machine Learning',
    country: 'India',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=priyadas',
      scopusAuthorId: '56103899215',
      webOfScienceResearcherId: 'AAQ-4493-2022',
      crossref: 'https://search.crossref.org/?q=priya+das',
      memberSince: '2019-01-08',
    },
    position: {
      title: 'Research Scientist',
      institution: 'Indian Institute of Science',
      faculty: 'Department of Computer Science and Automation',
      department: 'Machine Learning Lab',
      country: 'India',
      city: 'Bengaluru',
      employmentType: 'Full-time',
      startDate: '2019-08-01',
      current: true,
      researchFocus: ['Federated Learning', 'Privacy-Preserving ML', 'Healthcare AI'],
    },
    biography: {
      professionalSummary:
        'Research Scientist at the Indian Institute of Science, developing privacy-preserving machine learning for healthcare applications.',
      academicSummary:
        'ML researcher with 45+ publications, leadership of the Federated Learning for Health programme, and industry collaborations.',
      shortBiography:
        'Research Scientist in machine learning at IISc, focused on federated learning, privacy, and healthcare AI.',
      fullBiography:
        'Dr. Priya Das is a Research Scientist in the Machine Learning Lab at the Indian Institute of Science. Her research develops federated learning and privacy-preserving algorithms that enable hospitals to collaborate on AI models without sharing patient data. She leads the Federated Learning for Health programme, has served as an area chair at NeurIPS, and mentors graduate students across India.',
      areasOfExpertise: ['Machine Learning', 'Privacy', 'Healthcare'],
    },
    interests: [
      { id: 'interest-fed', name: 'Federated Learning', category: 'ML', keywords: ['distributed', 'privacy', 'collaboration'] },
      { id: 'interest-privacy', name: 'Privacy-Preserving ML', category: 'ML', keywords: ['differential privacy', 'secure computation'] },
      { id: 'interest-health', name: 'Healthcare AI', category: 'Applied ML', keywords: ['clinical', 'imaging', 'diagnosis'] },
    ],
    researchAreas: [
      { id: 'area-fed', name: 'Federated learning', description: 'Algorithms for collaborative learning across institutions.', publications: 30, citations: 1600 },
      { id: 'area-health', name: 'Healthcare AI', description: 'Privacy-preserving models for clinical imaging.', publications: 18, citations: 820 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Indian Institute of Technology Bombay', degree: 'PhD in Computer Science', field: 'Machine Learning', startDate: '2013', endDate: '2018', country: 'India' },
      { id: 'edu-msc', institution: 'Indian Institute of Technology Kharagpur', degree: 'MTech in Computer Science', field: 'Computer Science', startDate: '2011', endDate: '2013', country: 'India' },
      { id: 'edu-bsc', institution: 'University of Calcutta', degree: 'BTech in Computer Science', field: 'Computer Science', startDate: '2007', endDate: '2011', country: 'India' },
    ],
    employment: [
      { id: 'emp-scientist', organisation: 'Indian Institute of Science', role: 'Research Scientist', department: 'Machine Learning Lab', startDate: '2019', current: true },
      { id: 'emp-postdoc', organisation: 'MIT', role: 'Postdoctoral Researcher', startDate: '2018', endDate: '2019' },
    ],
    memberships: [
      { id: 'mem-aaai', organisation: 'AAAI', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
      { id: 'mem-ims', organisation: 'Indian Machine Learning Society', role: 'Member', type: 'Professional Association', since: '2018', status: 'Active' },
    ],
    awards: [
      { id: 'aw-women', title: 'Women in AI Research Award', organisation: 'Google Research India', year: '2023', category: 'Recognition' },
      { id: 'aw-early4', title: 'Early Career Research Award', organisation: 'SERB', year: '2021', category: 'Funding' },
    ],
    honors: [{ id: 'hon-fellow4', title: 'Raman Fellow', organisation: 'Science and Engineering Research Board', year: '2022', description: 'National research fellowship.' }],
    certifications: [{ id: 'cert-pytorch', name: 'PyTorch Advanced', issuer: 'Meta AI Academy', year: '2020' }],
    skills: [
      { id: 'skill-python13', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-pytorch13', name: 'PyTorch', category: 'Programming', level: 'Expert' },
      { id: 'skill-fed', name: 'Federated Learning', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-diffpriv', name: 'Differential Privacy', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-mlops', name: 'MLOps', category: 'Programming', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-bn', name: 'Bengali', proficiency: 'Native' },
      { id: 'lang-hi', name: 'Hindi', proficiency: 'Fluent' },
      { id: 'lang-en13', name: 'English', proficiency: 'Fluent' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/priya-das-ml',
      personalWebsite: 'https://das.scholatia.com',
      twitter: 'https://x.com/priyadas_ml',
      github: 'https://github.com/priyadas',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-p1', name: 'Dr. Chinedu Okafor', institution: 'University of Nigeria', role: 'Collaborator', researchAreas: ['Software Engineering'], jointPublications: 5, username: 'okafor' },
      ],
      institutionalPartners: ['MIT', 'Google Research India'],
      professionalNetwork: 480,
      followers: 11000,
      following: 280,
      coAuthors: 66,
    },
    teaching: {
      courses: [
        { id: 'course-federated', title: 'Federated Learning', code: 'CSA 690', level: 'Doctoral', institution: 'IISc', department: 'Computer Science', yearsTaught: '2021 - Present', students: 45, rating: 4.9 },
      ],
      teachingExperience: '6 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-p1', name: 'Rahul Sharma', level: 'PhD', thesisTitle: 'Privacy-preserving federated imaging', institution: 'IISc', period: '2022 - Present', status: 'Current' },
      ],
      currentPhd: 3,
      completedPhd: 2,
      currentMasters: 3,
      completedMasters: 6,
      totalSupervised: 14,
    },
    editorialAppointments: [
      { id: 'edit-p1', role: 'Area Chair', journal: 'NeurIPS 2025', since: '2025', status: 'Active' },
      { id: 'edit-p2', role: 'Reviewer', journal: 'Journal of Machine Learning Research', since: '2021', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-p1', conference: 'NeurIPS', year: '2024', role: 'Paper Presenter', paperTitle: 'Federated learning for heterogeneous hospitals', city: 'Vancouver', country: 'Canada' },
    ],
    grantParticipation: [
      { id: 'grant-p1', title: 'Federated Learning for Health', funder: 'SERB', amount: 'INR 3,200,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2027' },
    ],
    innovations: [{ id: 'inno-p1', title: 'FedHealth Toolkit', description: 'Open-source federated learning toolkit for healthcare.', category: 'Software', year: '2024', status: 'Commercialised' }],
    mediaCoverage: [{ id: 'media-p1', outlet: 'The Hindu', headline: 'Bengaluru researchers bring privacy to hospital AI', date: '2024-12-18', type: 'Newspaper' }],
    communityService: [{ id: 'cs-p1', role: 'Programme Lead', organisation: 'Federated Learning for Health', since: '2022', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-p1', organisation: 'WiML India', role: 'Mentor', period: '2021 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'priya.das@scholatia.org', professionalEmail: 'priyadas@iisc.ac.in', office: 'Machine Learning Lab, IISc', city: 'Bengaluru', country: 'India', timezone: 'Asia/Kolkata' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 91,
      trustScore: 89,
      visibilityScore: 87,
      lastVerified: '2026-02-27',
      academicAchievements: ['Women in AI Research Award 2023', 'Raman Fellow 2022', 'NeurIPS area chair'],
    },
  }),

  makeResearcher(14, {
    username: 'okafor',
    displayName: 'Dr. Chinedu Okafor',
    firstName: 'Chinedu',
    lastName: 'Okafor',
    avatar: '💻',
    headline: 'Lecturer in Software Engineering',
    country: 'Nigeria',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=chineduokafor',
      scopusAuthorId: '57204567188',
      webOfScienceResearcherId: 'AAR-6621-2024',
      crossref: 'https://search.crossref.org/?q=chinedu+okafor',
      memberSince: '2021-04-01',
    },
    position: {
      title: 'Lecturer',
      institution: 'University of Nigeria',
      faculty: 'Faculty of Physical Sciences',
      department: 'Department of Computer Science',
      country: 'Nigeria',
      city: 'Nsukka',
      employmentType: 'Full-time',
      startDate: '2021-10-01',
      current: true,
      researchFocus: ['Software Engineering', 'Blockchain', 'Software Testing'],
    },
    biography: {
      professionalSummary:
        'Lecturer in Computer Science at the University of Nigeria, researching software engineering practices, blockchain, and dependable systems.',
      academicSummary:
        'Software engineering researcher with 20+ publications and leadership of open-source developer tooling for African teams.',
      shortBiography:
        'Lecturer in software engineering at the University of Nigeria, focused on testing, blockchain, and dependable software.',
      fullBiography:
        'Dr. Chinedu Okafor is a Lecturer in Computer Science at the University of Nigeria, Nsukka. His research examines software testing, blockchain architectures, and dependable system engineering. He leads an open-source developer tooling project for African engineering teams and serves as a faculty adviser for the Google Developer Student Club.',
      areasOfExpertise: ['Software Engineering', 'Blockchain', 'Computer Science'],
    },
    interests: [
      { id: 'interest-se', name: 'Software Engineering', category: 'Computing', keywords: ['process', 'quality', 'engineering'] },
      { id: 'interest-blockchain', name: 'Blockchain', category: 'Computing', keywords: ['consensus', 'decentralised', 'ledger'] },
      { id: 'interest-testing', name: 'Software Testing', category: 'Computing', keywords: ['automation', 'reliability', 'QA'] },
    ],
    researchAreas: [
      { id: 'area-testing', name: 'Software testing automation', description: 'Automated testing frameworks for dependable systems.', publications: 14, citations: 420 },
      { id: 'area-blockchain', name: 'Blockchain applications', description: 'Blockchain architectures for African financial services.', publications: 10, citations: 380 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Manchester', degree: 'PhD in Computer Science', field: 'Software Engineering', startDate: '2015', endDate: '2019', country: 'United Kingdom' },
      { id: 'edu-msc', institution: 'University of Nigeria', degree: 'MSc in Computer Science', field: 'Software Engineering', startDate: '2012', endDate: '2014', country: 'Nigeria' },
      { id: 'edu-bsc', institution: 'University of Nigeria', degree: 'BSc in Computer Science', field: 'Computer Science', startDate: '2008', endDate: '2012', country: 'Nigeria' },
    ],
    employment: [
      { id: 'emp-lect', organisation: 'University of Nigeria', role: 'Lecturer', department: 'Department of Computer Science', startDate: '2021', current: true },
      { id: 'emp-postdoc', organisation: 'University of Manchester', role: 'Postdoctoral Researcher', startDate: '2019', endDate: '2021' },
    ],
    memberships: [
      { id: 'mem-ieee-cs', organisation: 'IEEE Computer Society', role: 'Member', type: 'Professional Association', since: '2019', status: 'Active' },
      { id: 'mem-ncs2', organisation: 'Nigerian Computer Society', role: 'Member', type: 'Professional Association', since: '2015', status: 'Active' },
    ],
    awards: [
      { id: 'aw-early5', title: 'Commonwealth Scholarship', organisation: 'Commonwealth Scholarship Commission', year: '2015', category: 'Funding' },
    ],
    honors: [{ id: 'hon-marc', title: 'Rising Scholar', organisation: 'African Software Engineering Network', year: '2023', description: 'Recognition for early-career software engineering research.' }],
    certifications: [{ id: 'cert-aws', name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2022' }],
    skills: [
      { id: 'skill-java', name: 'Java', category: 'Programming', level: 'Advanced' },
      { id: 'skill-python14', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-testing', name: 'Test Automation', category: 'Engineering', level: 'Expert' },
      { id: 'skill-blockchain', name: 'Blockchain Development', category: 'Engineering', level: 'Advanced' },
      { id: 'skill-devops', name: 'DevOps', category: 'Engineering', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en14', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-ig14', name: 'Igbo', proficiency: 'Native' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/chinedu-okafor',
      personalWebsite: 'https://okafor.scholatia.com',
      github: 'https://github.com/chineduokafor',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-c1', name: 'Dr. Priya Das', institution: 'IISc', role: 'Collaborator', researchAreas: ['Machine Learning'], jointPublications: 5, username: 'das' },
      ],
      institutionalPartners: ['University of Manchester', 'Google Developer Student Clubs'],
      professionalNetwork: 240,
      followers: 2900,
      following: 310,
      coAuthors: 22,
    },
    teaching: {
      courses: [
        { id: 'course-se', title: 'Software Engineering', code: 'CSC 421', level: 'Undergraduate', institution: 'University of Nigeria', department: 'Computer Science', yearsTaught: '2022 - Present', students: 240, rating: 4.6 },
        { id: 'course-testing', title: 'Software Testing', code: 'CSC 631', level: 'Masters', institution: 'University of Nigeria', department: 'Computer Science', yearsTaught: '2022 - Present', students: 40, rating: 4.7 },
      ],
      teachingExperience: '5 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-c1', name: 'Adaeze Nwosu', level: 'Masters', thesisTitle: 'Automated testing for microservices', institution: 'University of Nigeria', period: '2024 - 2025', status: 'Completed' },
      ],
      currentPhd: 1,
      completedPhd: 0,
      currentMasters: 3,
      completedMasters: 6,
      totalSupervised: 10,
    },
    editorialAppointments: [{ id: 'edit-c1', role: 'Reviewer', journal: 'Empirical Software Engineering', since: '2022', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-c1', conference: 'ICSE', year: '2024', role: 'Paper Presenter', paperTitle: 'Testing frameworks for African fintech', city: 'Lisbon', country: 'Portugal' },
    ],
    grantParticipation: [
      { id: 'grant-c1', title: 'Open Developer Tooling for Africa', funder: 'Mozilla Foundation', amount: '$120,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2026' },
    ],
    innovations: [{ id: 'inno-c1', title: 'DevTool Africa', description: 'Open-source developer tooling for African engineering teams.', category: 'Software', year: '2024', status: 'Research' }],
    communityService: [{ id: 'cs-c1', role: 'Faculty Adviser', organisation: 'Google Developer Student Club', since: '2022', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-c1', organisation: 'ForLoop Africa', role: 'Mentor', period: '2021 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'chinedu.okafor@scholatia.org', professionalEmail: 'chinedu.okafor@unn.edu.ng', office: 'Department of Computer Science, UNN', city: 'Nsukka', country: 'Nigeria', timezone: 'Africa/Lagos' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 86,
      trustScore: 84,
      visibilityScore: 78,
      lastVerified: '2025-11-08',
      academicAchievements: ['Commonwealth Scholar', 'African Software Engineering Network Rising Scholar 2023'],
    },
  }),

  makeResearcher(15, {
    username: 'wang',
    displayName: 'Prof. Li Wang',
    firstName: 'Li',
    lastName: 'Wang',
    avatar: '🌐',
    headline: 'Professor of Network Science',
    country: 'China',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=liwang',
      scopusAuthorId: '55701875432',
      webOfScienceResearcherId: 'AAS-0934-2022',
      crossref: 'https://search.crossref.org/?q=li+wang',
      memberSince: '2017-05-20',
    },
    position: {
      title: 'Professor',
      institution: 'Tsinghua University',
      faculty: 'School of Social Sciences',
      department: 'Department of Sociology',
      country: 'China',
      city: 'Beijing',
      employmentType: 'Full-time',
      startDate: '2019-02-01',
      current: true,
      researchFocus: ['Computational Social Science', 'Network Science', 'Urban Data'],
    },
    biography: {
      professionalSummary:
        'Professor at Tsinghua University applying network science and computational methods to social systems and urban data.',
      academicSummary:
        'Computational social scientist with 90+ publications, leadership of the Beijing urban data observatory, and national awards.',
      shortBiography:
        'Professor of network science at Tsinghua, studying social systems and cities with computational methods.',
      fullBiography:
        'Professor Li Wang works at the intersection of network science and computational social science at Tsinghua University. His research models social networks, urban mobility, and inequality using large-scale data. He directs the Beijing Urban Data Observatory and has advised national urban policy development.',
      areasOfExpertise: ['Network Science', 'Computational Social Science', 'Urban Studies'],
    },
    interests: [
      { id: 'interest-network', name: 'Network Science', category: 'Computational Social Science', keywords: ['graphs', 'communities', 'dynamics'] },
      { id: 'interest-urban', name: 'Urban Data', category: 'Urban Studies', keywords: ['mobility', 'cities', 'sensing'] },
      { id: 'interest-inequality', name: 'Inequality', category: 'Social Science', keywords: ['mobility', 'access', 'segregation'] },
    ],
    researchAreas: [
      { id: 'area-networks', name: 'Social network dynamics', description: 'Temporal models of social influence and diffusion.', publications: 42, citations: 2400 },
      { id: 'area-urban', name: 'Urban mobility', description: 'Sensing and modelling urban movement with mobile data.', publications: 36, citations: 1900 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Cornell University', degree: 'PhD in Sociology', field: 'Computational Social Science', startDate: '2010', endDate: '2014', country: 'United States' },
      { id: 'edu-msc', institution: 'Tsinghua University', degree: 'MA in Sociology', field: 'Sociology', startDate: '2008', endDate: '2010', country: 'China' },
      { id: 'edu-bsc', institution: 'Tsinghua University', degree: 'BA in Sociology', field: 'Sociology', startDate: '2004', endDate: '2008', country: 'China' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'Tsinghua University', role: 'Professor', department: 'Department of Sociology', startDate: '2019', current: true },
      { id: 'emp-assoc', organisation: 'Tsinghua University', role: 'Associate Professor', startDate: '2015', endDate: '2019' },
      { id: 'emp-postdoc', organisation: 'Cornell University', role: 'Postdoctoral Researcher', startDate: '2014', endDate: '2015' },
    ],
    memberships: [
      { id: 'mem-ics', organisation: 'International Network for Social Network Analysis', role: 'Member', type: 'Professional Association', since: '2013', status: 'Active' },
      { id: 'mem-css', organisation: 'Computational Social Science Society of the Americas', role: 'Member', type: 'Professional Association', since: '2016', status: 'Active' },
    ],
    awards: [
      { id: 'aw-nsf2', title: 'National Social Science Fund Award', organisation: 'Chinese Academy of Social Sciences', year: '2023', category: 'Funding' },
    ],
    honors: [{ id: 'hon-cornell', title: 'Cornell Outstanding Alumni', organisation: 'Cornell University', year: '2022', description: 'For professional achievements in computational social science.' }],
    certifications: [{ id: 'cert-data', name: 'Data Science for Social Science', issuer: 'ICPSR', year: '2017' }],
    skills: [
      { id: 'skill-python15', name: 'Python', category: 'Programming', level: 'Expert' },
      { id: 'skill-r15', name: 'R', category: 'Programming', level: 'Expert' },
      { id: 'skill-network', name: 'Network Analysis', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-mobility', name: 'Urban Mobility Modelling', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-socsci', name: 'Social Science Methods', category: 'Research Methods', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-zh', name: 'Mandarin', proficiency: 'Native' },
      { id: 'lang-en15', name: 'English', proficiency: 'Fluent' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/li-wang-networks',
      personalWebsite: 'https://wang.scholatia.com',
      twitter: 'https://x.com/liwang_css',
      github: 'https://github.com/liwang',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-w1', name: 'Prof. Yuki Tanaka', institution: 'University of Tokyo', role: 'Collaborator', researchAreas: ['Robotics'], jointPublications: 7, username: 'tanaka' },
        { id: 'collab-w2', name: 'Dr. Lukas Schneider', institution: 'ETH Zurich', role: 'Collaborator', researchAreas: ['Quantum Computing'], jointPublications: 5, username: 'schneider' },
      ],
      institutionalPartners: ['Cornell University', 'University of Tokyo'],
      professionalNetwork: 550,
      followers: 7600,
      following: 200,
      coAuthors: 88,
    },
    teaching: {
      courses: [
        { id: 'course-netscience', title: 'Network Science', code: 'SOC 521', level: 'Graduate', institution: 'Tsinghua University', department: 'Sociology', yearsTaught: '2016 - Present', students: 150, rating: 4.8 },
      ],
      teachingExperience: '11 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-w1', name: 'Wei Zhang', level: 'PhD', thesisTitle: 'Urban mobility and inequality in Chinese megacities', institution: 'Tsinghua University', period: '2022 - Present', status: 'Current' },
      ],
      currentPhd: 4,
      completedPhd: 8,
      currentMasters: 3,
      completedMasters: 16,
      totalSupervised: 31,
    },
    editorialAppointments: [
      { id: 'edit-w1', role: 'Associate Editor', journal: 'EPJ Data Science', since: '2021', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-w1', conference: 'International Conference on Computational Social Science', year: '2024', role: 'Keynote Speaker', paperTitle: 'Mobility data for fairer cities', city: 'Philadelphia', country: 'United States' },
    ],
    grantParticipation: [
      { id: 'grant-w1', title: 'Beijing Urban Data Observatory', funder: 'National Social Science Fund', amount: 'CNY 8,000,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    innovations: [{ id: 'inno-w1', title: 'CityMobility', description: 'Open urban mobility analytics platform.', category: 'Urban Data', year: '2023', status: 'Commercialised' }],
    mediaCoverage: [{ id: 'media-w1', outlet: 'Caixin', headline: '\u6570\u636e\u9a71\u52a8\u57ce\u5e02\u516c\u5e73\u6027\u7814\u7a76', date: '2024-08-28', type: 'News' }],
    communityService: [{ id: 'cs-w1', role: 'Director', organisation: 'Beijing Urban Data Observatory', since: '2022', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'li.wang@scholatia.org', professionalEmail: 'wangli@tsinghua.edu.cn', office: 'School of Social Sciences, Tsinghua', city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 93,
      trustScore: 91,
      visibilityScore: 86,
      lastVerified: '2026-03-18',
      academicAchievements: ['National Social Science Fund Award 2023', 'Beijing Urban Data Observatory director', '31 students supervised'],
    },
  }),

  makeResearcher(16, {
    username: 'mbatha',
    displayName: 'Dr. Sipho Mbatha',
    firstName: 'Sipho',
    lastName: 'Mbatha',
    avatar: '🦁',
    headline: 'Postdoctoral Researcher in Ecology',
    country: 'Kenya',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=siphommbatha',
      scopusAuthorId: '57210934176',
      webOfScienceResearcherId: 'AAT-2201-2024',
      crossref: 'https://search.crossref.org/?q=sipho+mbatha',
      memberSince: '2021-06-15',
    },
    position: {
      title: 'Postdoctoral Researcher',
      institution: 'University of Nairobi',
      faculty: 'Faculty of Science and Technology',
      department: 'Department of Biology',
      country: 'Kenya',
      city: 'Nairobi',
      employmentType: 'Full-time',
      startDate: '2022-02-01',
      current: true,
      researchFocus: ['Conservation Ecology', 'Wildlife Monitoring', 'Remote Sensing'],
    },
    biography: {
      professionalSummary:
        'Postdoctoral researcher in ecology at the University of Nairobi, using remote sensing and camera-trapping to monitor African wildlife.',
      academicSummary:
        'Conservation ecologist with 25+ publications and leadership of the East African wildlife monitoring programme.',
      shortBiography:
        'Postdoctoral researcher in ecology at the University of Nairobi, focused on wildlife monitoring and conservation.',
      fullBiography:
        'Dr. Sipho Mbatha is a postdoctoral researcher in the Department of Biology at the University of Nairobi. He combines remote sensing, camera traps, and community science to monitor large mammals across East African protected areas. He coordinates the East African Wildlife Monitoring Programme and works closely with national park authorities.',
      areasOfExpertise: ['Ecology', 'Conservation', 'Remote Sensing'],
    },
    interests: [
      { id: 'interest-conservation', name: 'Conservation Ecology', category: 'Ecology', keywords: ['biodiversity', 'protected areas', 'wildlife'] },
      { id: 'interest-sensing', name: 'Remote Sensing', category: 'Earth Observation', keywords: ['satellite', 'habitat', 'land cover'] },
      { id: 'interest-camera', name: 'Camera-Trap Monitoring', category: 'Ecology', keywords: ['camera traps', 'population', 'trends'] },
    ],
    researchAreas: [
      { id: 'area-wildlife', name: 'Large mammal monitoring', description: 'Camera-trap and aerial surveys of large mammals in East Africa.', publications: 18, citations: 520 },
      { id: 'area-habitat', name: 'Habitat change', description: 'Remote sensing of habitat degradation in protected areas.', publications: 12, citations: 380 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Nairobi', degree: 'PhD in Ecology', field: 'Conservation Ecology', startDate: '2016', endDate: '2020', country: 'Kenya' },
      { id: 'edu-msc', institution: 'University of Cape Town', degree: 'MSc in Zoology', field: 'Zoology', startDate: '2013', endDate: '2015', country: 'South Africa' },
      { id: 'edu-bsc', institution: 'University of Zimbabwe', degree: 'BSc in Biological Sciences', field: 'Biological Sciences', startDate: '2009', endDate: '2012', country: 'Zimbabwe' },
    ],
    employment: [
      { id: 'emp-postdoc', organisation: 'University of Nairobi', role: 'Postdoctoral Researcher', department: 'Department of Biology', startDate: '2022', current: true },
      { id: 'emp-assoc', organisation: 'African Wildlife Foundation', role: 'Research Associate', startDate: '2020', endDate: '2022' },
    ],
    memberships: [
      { id: 'mem-scb', organisation: 'Society for Conservation Biology', role: 'Member', type: 'Professional Association', since: '2018', status: 'Active' },
      { id: 'mem-esa', organisation: 'Ecological Society of Eastern Africa', role: 'Member', type: 'Professional Association', since: '2019', status: 'Active' },
    ],
    awards: [
      { id: 'aw-conservation', title: 'Conservation Leadership Award', organisation: 'African Leadership University', year: '2023', category: 'Leadership' },
    ],
    honors: [{ id: 'hon-fellow5', title: 'Fellow', organisation: 'African Research Network for Ecology', year: '2024', description: 'Postdoctoral research fellowship.' }],
    certifications: [{ id: 'cert-r', name: 'R for Spatial Analysis', issuer: 'r-spatial', year: '2021' }],
    skills: [
      { id: 'skill-r16', name: 'R', category: 'Programming', level: 'Expert' },
      { id: 'skill-qgis', name: 'QGIS / Remote Sensing', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-cameratrap', name: 'Camera-Trap Analysis', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-stats16', name: 'Spatial Statistics', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-writing16', name: 'Science Writing', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en16', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-nd16', name: 'Ndebele', proficiency: 'Native' },
      { id: 'lang-sw16', name: 'Swahili', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/sipho-mbatha',
      personalWebsite: 'https://mbatha.scholatia.com',
      twitter: 'https://x.com/sipho_ecology',
      github: 'https://github.com/siphommbatha',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-mb1', name: 'Dr. Thabo Dube', institution: 'University of Cape Town', role: 'Collaborator', researchAreas: ['Bioinformatics'], jointPublications: 4, username: 'dube' },
      ],
      institutionalPartners: ['African Wildlife Foundation', 'University of Cape Town'],
      professionalNetwork: 190,
      followers: 3400,
      following: 420,
      coAuthors: 28,
    },
    teaching: {
      courses: [
        { id: 'course-ecology', title: 'Conservation Ecology', code: 'BIO 452', level: 'Undergraduate', institution: 'University of Nairobi', department: 'Biology', yearsTaught: '2023 - Present', students: 90, rating: 4.6 },
      ],
      teachingExperience: '3 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-mb1', name: 'Faith Chebet', level: 'Masters', thesisTitle: 'Camera-trap monitoring of savanna mammals', institution: 'University of Nairobi', period: '2024 - Present', status: 'Current' },
      ],
      currentPhd: 1,
      completedPhd: 0,
      currentMasters: 2,
      completedMasters: 3,
      totalSupervised: 6,
    },
    editorialAppointments: [{ id: 'edit-mb1', role: 'Reviewer', journal: 'African Journal of Ecology', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-mb1', conference: 'Society for Conservation Biology Africa', year: '2024', role: 'Paper Presenter', paperTitle: 'Camera-trap trends across East African reserves', city: 'Kigali', country: 'Rwanda' },
    ],
    grantParticipation: [
      { id: 'grant-mb1', title: 'East African Wildlife Monitoring', funder: 'African Wildlife Foundation', amount: '$450,000', role: 'Co-Investigator', status: 'Active', period: '2023 - 2027' },
    ],
    innovations: [{ id: 'inno-mb1', title: 'SavannaWatch', description: 'Open platform for sharing camera-trap data across reserves.', category: 'Conservation Tech', year: '2024', status: 'Research' }],
    mediaCoverage: [{ id: 'media-mb1', outlet: 'Daily Nation', headline: 'Kenya scientists use AI to count elephants', date: '2024-10-24', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-mb1', title: 'Community ranger training', format: 'Field training', date: '2024-07-15', audience: 'Community rangers', reach: 200 },
    ],
    communityService: [{ id: 'cs-mb1', role: 'Coordinator', organisation: 'East African Wildlife Monitoring Programme', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-mb1', organisation: 'Wildlife Trust of Southern Africa', role: 'Volunteer Researcher', period: '2016 - 2018' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'sipho.mbatha@scholatia.org', professionalEmail: 'sipho.mbatha@uonbi.ac.ke', office: 'Department of Biology, UoN', city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 85,
      trustScore: 83,
      visibilityScore: 79,
      lastVerified: '2025-10-30',
      academicAchievements: ['Conservation Leadership Award 2023', 'East African wildlife monitoring coordinator'],
    },
  }),

  makeResearcher(17, {
    username: 'kovacs',
    displayName: 'Dr. R\u00e9ka Kov\u00e1cs',
    firstName: 'R\u00e9ka',
    lastName: 'Kov\u00e1cs',
    avatar: '🧠',
    headline: 'Research Associate in Psychology',
    country: 'Hungary',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=rekakovacs',
      scopusAuthorId: '57202873415',
      webOfScienceResearcherId: 'AAU-7765-2023',
      crossref: 'https://search.crossref.org/?q=reka+kovacs',
      memberSince: '2019-08-20',
    },
    position: {
      title: 'Research Associate',
      institution: 'E\u00f6tv\u00f6s Lor\u00e1nd University',
      faculty: 'Faculty of Education and Psychology',
      department: 'Institute of Psychology',
      country: 'Hungary',
      city: 'Budapest',
      employmentType: 'Full-time',
      startDate: '2020-09-01',
      current: true,
      researchFocus: ['Cognitive Psychology', 'Decision Making', 'Behavioural Science'],
    },
    biography: {
      professionalSummary:
        'Research Associate at ELTE University, studying human decision making and cognitive biases through behavioural experiments.',
      academicSummary:
        'Cognitive psychologist with 30+ publications and leadership of the Decision Science Laboratory at ELTE.',
      shortBiography:
        'Research Associate in psychology at ELTE, focused on decision making, cognitive biases, and behavioural science.',
      fullBiography:
        'Dr. R\u00e9ka Kov\u00e1cs is a Research Associate in the Institute of Psychology at ELTE University, Budapest. She leads experimental studies on decision making under uncertainty, cognitive biases, and nudging interventions. Her work bridges cognitive psychology and behavioural public policy, and she coordinates an EU research network on behavioural science.',
      areasOfExpertise: ['Psychology', 'Cognitive Science', 'Behavioural Science'],
    },
    interests: [
      { id: 'interest-decision', name: 'Decision Making', category: 'Cognitive Psychology', keywords: ['judgment', 'heuristics', 'risk'] },
      { id: 'interest-bias', name: 'Cognitive Biases', category: 'Cognitive Psychology', keywords: ['framing', 'anchoring', 'bias'] },
      { id: 'interest-behavioural', name: 'Behavioural Public Policy', category: 'Behavioural Science', keywords: ['nudging', 'policy', 'intervention'] },
    ],
    researchAreas: [
      { id: 'area-decision', name: 'Decision making under uncertainty', description: 'Experimental studies of risk and ambiguity preferences.', publications: 20, citations: 640 },
      { id: 'area-nudge', name: 'Nudging interventions', description: 'Behavioural interventions for healthier choices.', publications: 12, citations: 410 },
    ],
    education: [
      { id: 'edu-phd', institution: 'E\u00f6tv\u00f6s Lor\u00e1nd University', degree: 'PhD in Psychology', field: 'Cognitive Psychology', startDate: '2014', endDate: '2018', country: 'Hungary' },
      { id: 'edu-msc', institution: 'E\u00f6tv\u00f6s Lor\u00e1nd University', degree: 'MSc in Psychology', field: 'Psychology', startDate: '2012', endDate: '2014', country: 'Hungary' },
      { id: 'edu-bsc', institution: 'E\u00f6tv\u00f6s Lor\u00e1nd University', degree: 'BA in Psychology', field: 'Psychology', startDate: '2009', endDate: '2012', country: 'Hungary' },
    ],
    employment: [
      { id: 'emp-assoc', organisation: 'ELTE University', role: 'Research Associate', department: 'Institute of Psychology', startDate: '2020', current: true },
      { id: 'emp-postdoc', organisation: 'Max Planck Institute for Human Development', role: 'Postdoctoral Researcher', startDate: '2018', endDate: '2020' },
    ],
    memberships: [
      { id: 'mem-aps2', organisation: 'Association for Psychological Science', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
      { id: 'mem-sbes', organisation: 'Society for Behavioural Economics', role: 'Member', type: 'Professional Association', since: '2019', status: 'Active' },
    ],
    awards: [
      { id: 'aw-young6', title: 'Bolyai Research Scholarship', organisation: 'Hungarian Academy of Sciences', year: '2022', category: 'Funding' },
    ],
    honors: [{ id: 'hon-bolyai', title: 'Bolyai Scholar', organisation: 'Hungarian Academy of Sciences', year: '2022', description: 'Junior research fellowship.' }],
    certifications: [{ id: 'cert-ethics', name: 'Research Ethics Certification', issuer: 'ELTE Ethics Board', year: '2019' }],
    skills: [
      { id: 'skill-python17', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-r17', name: 'R', category: 'Programming', level: 'Advanced' },
      { id: 'skill-experiment', name: 'Experimental Design', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-stats17', name: 'Bayesian Statistics', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-science', name: 'Behavioural Science', category: 'Research Methods', level: 'Expert' },
    ],
    languages: [
      { id: 'lang-hu', name: 'Hungarian', proficiency: 'Native' },
      { id: 'lang-en17', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-de17', name: 'German', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/reka-kovacs',
      personalWebsite: 'https://kovacs.scholatia.com',
      twitter: 'https://x.com/reka_behaviour',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-rk1', name: 'Dr. Camila Gallo', institution: 'University of Buenos Aires', role: 'Collaborator', researchAreas: ['Linguistics'], jointPublications: 4, username: 'gallo' },
      ],
      institutionalPartners: ['Max Planck Institute for Human Development'],
      professionalNetwork: 220,
      followers: 3100,
      following: 260,
      coAuthors: 30,
    },
    teaching: {
      courses: [
        { id: 'course-decision', title: 'Decision Making and Cognition', code: 'PSY 360', level: 'Undergraduate', institution: 'ELTE University', department: 'Institute of Psychology', yearsTaught: '2021 - Present', students: 130, rating: 4.7 },
      ],
      teachingExperience: '4 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-rk1', name: 'D\u00e1vid Szab\u00f3', level: 'PhD', thesisTitle: 'Ambiguity aversion and trust', institution: 'ELTE University', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 2,
      completedPhd: 1,
      currentMasters: 2,
      completedMasters: 5,
      totalSupervised: 10,
    },
    editorialAppointments: [{ id: 'edit-rk1', role: 'Review Editor', journal: 'Judgment and Decision Making', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-rk1', conference: 'Behavioural Science Conference', year: '2024', role: 'Paper Presenter', paperTitle: 'Nudging healthy choices in canteens', city: 'Vienna', country: 'Austria' },
    ],
    grantParticipation: [
      { id: 'grant-rk1', title: 'Behavioural Interventions for Health', funder: 'Horizon Research Fund', amount: '\u20ac600,000', role: 'Co-Investigator', status: 'Active', period: '2023 - 2027' },
    ],
    mediaCoverage: [{ id: 'media-rk1', outlet: 'Index.hu', headline: '\u00a1gy m\u0171k\u00f6dik a tudatos d\u00f6nt\u00e9shozatal', date: '2024-11-02', type: 'News' }],
    publicEngagement: [
      { id: 'engage-rk1', title: 'Science of decision making', format: 'Public lecture', date: '2024-05-18', audience: 'General public', reach: 450 },
    ],
    communityService: [{ id: 'cs-rk1', role: 'Coordinator', organisation: 'EU Behavioural Science Network', since: '2023', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'reka.kovacs@scholatia.org', professionalEmail: 'reka.kovacs@ppk.elte.hu', office: 'Institute of Psychology, ELTE', city: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 87,
      trustScore: 85,
      visibilityScore: 80,
      lastVerified: '2025-12-19',
      academicAchievements: ['Bolyai Research Scholarship 2022', 'Decision Science Laboratory lead'],
    },
  }),

  makeResearcher(18, {
    username: 'almeida',
    displayName: 'Prof. Jo\u00e3o Almeida',
    firstName: 'Jo\u00e3o',
    lastName: 'Almeida',
    avatar: '🌊',
    headline: 'Professor of Oceanography',
    country: 'Portugal',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=joaoalmeida',
      scopusAuthorId: '55702884593',
      webOfScienceResearcherId: 'AAV-3321-2022',
      crossref: 'https://search.crossref.org/?q=joao+almeida',
      memberSince: '2017-02-11',
    },
    position: {
      title: 'Professor',
      institution: 'University of Lisbon',
      faculty: 'Faculty of Sciences',
      department: 'Instituto Dom Luiz',
      country: 'Portugal',
      city: 'Lisbon',
      employmentType: 'Full-time',
      startDate: '2018-09-01',
      current: true,
      researchFocus: ['Marine Biogeochemistry', 'Ocean Acidification', 'Coastal Systems'],
    },
    biography: {
      professionalSummary:
        'Professor of Oceanography at the University of Lisbon, studying marine biogeochemistry and ocean acidification in coastal systems.',
      academicSummary:
        'Oceanographer with 100+ publications, leadership of Atlantic ocean observation programmes, and national policy advisory roles.',
      shortBiography:
        'Professor of oceanography at the University of Lisbon, focused on marine biogeochemistry and ocean acidification.',
      fullBiography:
        'Professor Jo\u00e3o Almeida leads marine biogeochemistry research at the Instituto Dom Luiz, University of Lisbon. His group studies carbon and nutrient cycling in the Atlantic, ocean acidification impacts on coastal ecosystems, and the role of upwelling systems in climate regulation. He directs the Portuguese component of an international Atlantic observation programme.',
      areasOfExpertise: ['Oceanography', 'Marine Science', 'Climate'],
    },
    interests: [
      { id: 'interest-biogeo', name: 'Marine Biogeochemistry', category: 'Oceanography', keywords: ['carbon', 'nutrients', 'cycling'] },
      { id: 'interest-acid', name: 'Ocean Acidification', category: 'Oceanography', keywords: ['pH', 'shellfish', 'ecosystems'] },
      { id: 'interest-coastal', name: 'Coastal Systems', category: 'Oceanography', keywords: ['estuaries', 'upwelling', 'eutrophication'] },
    ],
    researchAreas: [
      { id: 'area-carbon', name: 'Atlantic carbon cycling', description: 'Carbon budgets of the Atlantic and upwelling systems.', publications: 45, citations: 2600 },
      { id: 'area-acid', name: 'Coastal acidification', description: 'Acidification stress on Iberian coastal ecosystems.', publications: 30, citations: 1500 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Southampton', degree: 'PhD in Oceanography', field: 'Marine Biogeochemistry', startDate: '2005', endDate: '2009', country: 'United Kingdom' },
      { id: 'edu-msc', institution: 'University of Lisbon', degree: 'MSc in Marine Sciences', field: 'Oceanography', startDate: '2003', endDate: '2005', country: 'Portugal' },
      { id: 'edu-bsc', institution: 'University of Lisbon', degree: 'BSc in Environmental Engineering', field: 'Environmental Engineering', startDate: '1998', endDate: '2003', country: 'Portugal' },
    ],
    employment: [
      { id: 'emp-prof', organisation: 'University of Lisbon', role: 'Professor', department: 'Instituto Dom Luiz', startDate: '2018', current: true },
      { id: 'emp-scientist', organisation: 'IPMA', role: 'Research Scientist', startDate: '2010', endDate: '2018' },
      { id: 'emp-postdoc', organisation: 'University of Southampton', role: 'Postdoctoral Researcher', startDate: '2009', endDate: '2010' },
    ],
    memberships: [
      { id: 'mem-agu2', organisation: 'American Geophysical Union', role: 'Member', type: 'Professional Association', since: '2012', status: 'Active' },
      { id: 'mem-soc', organisation: 'European Marine Board', role: 'Member', type: 'Research Network', since: '2019', status: 'Active' },
    ],
    awards: [
      { id: 'aw-marine', title: 'Marine Science Prize', organisation: 'Portuguese Science Foundation', year: '2023', category: 'Research' },
    ],
    honors: [{ id: 'hon-fellow6', title: 'Elected Member', organisation: 'Academia de Ci\u00eancias de Lisboa', year: '2022', description: 'For contributions to marine science.' }],
    certifications: [{ id: 'cert-seafaring', name: 'Oceanographic Field Safety', issuer: 'NOC', year: '2015' }],
    skills: [
      { id: 'skill-matl', name: 'MATLAB', category: 'Programming', level: 'Advanced' },
      { id: 'skill-python18', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-cruise', name: 'Research Cruise Leadership', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-isotope', name: 'Isotope Geochemistry', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-model', name: 'Biogeochemical Modelling', category: 'Research Methods', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-pt', name: 'Portuguese', proficiency: 'Native' },
      { id: 'lang-en18', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-fr18', name: 'French', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/joao-almeida-ocean',
      personalWebsite: 'https://almeida.scholatia.com',
      twitter: 'https://x.com/joao_ocean',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-ja1', name: 'Dr. Ayesha Hussain', institution: 'University of Lahore', role: 'Collaborator', researchAreas: ['Public Policy'], jointPublications: 3, username: 'hussain' },
      ],
      institutionalPartners: ['University of Southampton', 'IPMA'],
      professionalNetwork: 490,
      followers: 6900,
      following: 230,
      coAuthors: 96,
    },
    teaching: {
      courses: [
        { id: 'course-ocean', title: 'Oceanography', code: 'GEO 310', level: 'Undergraduate', institution: 'University of Lisbon', department: 'Instituto Dom Luiz', yearsTaught: '2014 - Present', students: 160, rating: 4.7 },
        { id: 'course-bio', title: 'Marine Biogeochemistry', code: 'GEO 715', level: 'Doctoral', institution: 'University of Lisbon', department: 'Instituto Dom Luiz', yearsTaught: '2019 - Present', students: 40, rating: 4.8 },
      ],
      teachingExperience: '14 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-ja1', name: 'Mariana Costa', level: 'PhD', thesisTitle: 'Acidification stress in Iberian estuaries', institution: 'University of Lisbon', period: '2022 - Present', status: 'Current' },
      ],
      currentPhd: 4,
      completedPhd: 9,
      currentMasters: 3,
      completedMasters: 20,
      totalSupervised: 36,
    },
    editorialAppointments: [
      { id: 'edit-ja1', role: 'Associate Editor', journal: 'Frontiers in Marine Science', since: '2020', status: 'Active' },
    ],
    conferenceParticipation: [
      { id: 'conf-ja1', conference: 'Ocean Sciences Meeting', year: '2024', role: 'Invited Speaker', paperTitle: 'Carbon budgets of the Atlantic upwelling', city: 'New Orleans', country: 'United States' },
    ],
    grantParticipation: [
      { id: 'grant-ja1', title: 'Atlantic Ocean Observation Programme', funder: 'Horizon Research Fund', amount: '\u20ac4,500,000', role: 'Co-Investigator', status: 'Active', period: '2023 - 2029' },
    ],
    innovations: [{ id: 'inno-ja1', title: 'OceanCarbon Platform', description: 'Open platform for Atlantic carbon flux data.', category: 'Ocean Data', year: '2023', status: 'Research' }],
    mediaCoverage: [{ id: 'media-ja1', outlet: 'P\u00fablico', headline: 'O Atl\u00e2ntico e a nova era da observa\u00e7\u00e3o oce\u00e2nica', date: '2024-06-22', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-ja1', title: 'Ocean science for citizens', format: 'Coastal school programme', date: '2024-09-14', audience: 'School students', reach: 600 },
    ],
    communityService: [{ id: 'cs-ja1', role: 'Scientific Adviser', organisation: 'Portuguese Ocean Observatory', since: '2021', status: 'Active' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'joao.almeida@scholatia.org', professionalEmail: 'jjalmeida@ciencias.ulisboa.pt', office: 'Instituto Dom Luiz, Lisbon', city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 93,
      trustScore: 91,
      visibilityScore: 86,
      lastVerified: '2026-03-25',
      academicAchievements: ['Marine Science Prize 2023', 'Elected member, Academy of Sciences of Lisbon', '36 students supervised'],
    },
  }),

  makeResearcher(19, {
    username: 'hussain',
    displayName: 'Dr. Ayesha Hussain',
    firstName: 'Ayesha',
    lastName: 'Hussain',
    avatar: '🏛️',
    headline: 'Assistant Professor of Public Policy',
    country: 'Pakistan',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=ayeshahussain',
      scopusAuthorId: '57203456128',
      webOfScienceResearcherId: 'AAW-5510-2023',
      crossref: 'https://search.crossref.org/?q=ayesha+hussain',
      memberSince: '2020-07-01',
    },
    position: {
      title: 'Assistant Professor',
      institution: 'University of Lahore',
      faculty: 'Faculty of Humanities and Social Sciences',
      department: 'Department of Public Policy',
      country: 'Pakistan',
      city: 'Lahore',
      employmentType: 'Full-time',
      startDate: '2021-01-01',
      current: true,
      researchFocus: ['Social Policy', 'Governance', 'Gender and Development'],
    },
    biography: {
      professionalSummary:
        'Assistant Professor of Public Policy at the University of Lahore, researching social protection, governance, and gender-responsive policy.',
      academicSummary:
        'Public policy researcher with 25+ publications and leadership of the South Asia social policy network.',
      shortBiography:
        'Assistant Professor of public policy at the University of Lahore, focused on social protection, governance, and gender.',
      fullBiography:
        'Dr. Ayesha Hussain is an Assistant Professor in the Department of Public Policy at the University of Lahore. Her research examines social protection systems, local governance, and gender-responsive policymaking in South Asia. She coordinates the South Asia Social Policy Network and advises provincial governments on poverty reduction programmes.',
      areasOfExpertise: ['Public Policy', 'Governance', 'Development Studies'],
    },
    interests: [
      { id: 'interest-social', name: 'Social Protection', category: 'Public Policy', keywords: ['safety nets', 'poverty', 'welfare'] },
      { id: 'interest-gender', name: 'Gender-Responsive Policy', category: 'Public Policy', keywords: ['gender', 'inclusion', 'equality'] },
      { id: 'interest-governance', name: 'Local Governance', category: 'Public Policy', keywords: ['decentralisation', 'participation', 'accountability'] },
    ],
    researchAreas: [
      { id: 'area-protection', name: 'Social protection systems', description: 'Evaluating safety net programmes in South Asia.', publications: 18, citations: 460 },
      { id: 'area-gender', name: 'Gender and development', description: 'Gender-responsive design of public programmes.', publications: 10, citations: 310 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Manchester', degree: 'PhD in Social Policy', field: 'Public Policy', startDate: '2014', endDate: '2018', country: 'United Kingdom' },
      { id: 'edu-msc', institution: 'London School of Economics', degree: 'MSc in Social Policy', field: 'Social Policy', startDate: '2012', endDate: '2013', country: 'United Kingdom' },
      { id: 'edu-ba', institution: 'University of Lahore', degree: 'BA in Economics', field: 'Economics', startDate: '2008', endDate: '2012', country: 'Pakistan' },
    ],
    employment: [
      { id: 'emp-asst', organisation: 'University of Lahore', role: 'Assistant Professor', department: 'Department of Public Policy', startDate: '2021', current: true },
      { id: 'emp-postdoc', organisation: 'Pakistan Institute of Development Economics', role: 'Research Fellow', startDate: '2018', endDate: '2021' },
    ],
    memberships: [
      { id: 'mem-issa', organisation: 'International Social Security Association', role: 'Member', type: 'Professional Association', since: '2019', status: 'Active' },
      { id: 'mem-sapa', organisation: 'South Asia Policy Association', role: 'Member', type: 'Professional Association', since: '2020', status: 'Active' },
    ],
    awards: [
      { id: 'aw-commonwealth', title: 'Commonwealth Scholarship', organisation: 'Commonwealth Scholarship Commission', year: '2014', category: 'Funding' },
    ],
    honors: [{ id: 'hon-fellow7', title: 'Research Fellow', organisation: 'South Asia Social Policy Network', year: '2023', description: 'Regional policy research fellowship.' }],
    certifications: [{ id: 'cert-qual', name: 'Qualitative Research Methods', issuer: 'University of Manchester', year: '2017' }],
    skills: [
      { id: 'skill-qual', name: 'Qualitative Research', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-mixed', name: 'Mixed Methods', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-policy19', name: 'Policy Analysis', category: 'Professional', level: 'Expert' },
      { id: 'skill-nvivo', name: 'NVivo', category: 'Programming', level: 'Advanced' },
      { id: 'skill-stakeholder', name: 'Stakeholder Engagement', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-ur', name: 'Urdu', proficiency: 'Native' },
      { id: 'lang-en19', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-pj', name: 'Punjabi', proficiency: 'Native' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ayesha-hussain-policy',
      personalWebsite: 'https://hussain.scholatia.com',
      twitter: 'https://x.com/ayesha_policy',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-h19', name: 'Prof. Jo\u00e3o Almeida', institution: 'University of Lisbon', role: 'Collaborator', researchAreas: ['Oceanography'], jointPublications: 3, username: 'almeida' },
      ],
      institutionalPartners: ['University of Manchester', 'Pakistan Institute of Development Economics'],
      professionalNetwork: 210,
      followers: 2700,
      following: 320,
      coAuthors: 20,
    },
    teaching: {
      courses: [
        { id: 'course-socialpol', title: 'Social Policy Analysis', code: 'POL 405', level: 'Undergraduate', institution: 'University of Lahore', department: 'Public Policy', yearsTaught: '2021 - Present', students: 120, rating: 4.7 },
      ],
      teachingExperience: '5 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-h19', name: 'Zara Qureshi', level: 'Masters', thesisTitle: 'Gender-responsive safety nets in Punjab', institution: 'University of Lahore', period: '2024 - Present', status: 'Current' },
      ],
      currentPhd: 1,
      completedPhd: 1,
      currentMasters: 3,
      completedMasters: 5,
      totalSupervised: 10,
    },
    editorialAppointments: [{ id: 'edit-h19', role: 'Review Editor', journal: 'Journal of South Asian Policy Studies', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-h19', conference: 'International Social Security Conference', year: '2024', role: 'Paper Presenter', paperTitle: 'Social protection in South Asia', city: 'Geneva', country: 'Switzerland' },
    ],
    grantParticipation: [
      { id: 'grant-h19', title: 'South Asia Social Policy Network', funder: 'International Development Research Centre', amount: 'CAD 480,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2027' },
    ],
    mediaCoverage: [{ id: 'media-h19', outlet: 'Dawn', headline: 'Researchers call for gender-responsive social protection', date: '2024-12-05', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-h19', title: 'Policy dialogues', format: 'Public consultation', date: '2024-08-20', audience: 'Civil society', reach: 320 },
    ],
    communityService: [{ id: 'cs-h19', role: 'Coordinator', organisation: 'South Asia Social Policy Network', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-h19', organisation: 'UN Women Pakistan', role: 'Policy Advisor (volunteer)', period: '2022 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'ayesha.hussain@scholatia.org', professionalEmail: 'ayesha.hussain@uol.edu.pk', office: 'Department of Public Policy, UoL', city: 'Lahore', country: 'Pakistan', timezone: 'Asia/Karachi' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 86,
      trustScore: 84,
      visibilityScore: 79,
      lastVerified: '2025-11-15',
      academicAchievements: ['Commonwealth Scholar', 'South Asia social policy network coordinator'],
    },
  }),

  makeResearcher(20, {
    username: 'ndlovu',
    displayName: 'Dr. Bongani Ndlovu',
    firstName: 'Bongani',
    lastName: 'Ndlovu',
    avatar: '🛡️',
    headline: 'Senior Research Scientist in Cybersecurity',
    country: 'South Africa',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=bonganindlovu',
      scopusAuthorId: '57194561234',
      webOfScienceResearcherId: 'AAX-7734-2023',
      crossref: 'https://search.crossref.org/?q=bongani+ndlovu',
      memberSince: '2019-05-15',
    },
    position: {
      title: 'Senior Research Scientist',
      institution: 'CSIR',
      faculty: 'Information and Communications Technology',
      department: 'Cyber Defence Centre',
      country: 'South Africa',
      city: 'Pretoria',
      employmentType: 'Full-time',
      startDate: '2019-06-01',
      current: true,
      researchFocus: ['Cybersecurity', 'Network Security', 'Threat Intelligence'],
    },
    biography: {
      professionalSummary:
        'Senior Research Scientist at the CSIR Cyber Defence Centre, developing national cyber threat intelligence capabilities.',
      academicSummary:
        'Cybersecurity researcher with 40+ publications and leadership of national cyber defence research programmes.',
      shortBiography:
        'Senior Research Scientist in cybersecurity at the CSIR, focused on network security and threat intelligence.',
      fullBiography:
        'Dr. Bongani Ndlovu leads cybersecurity research at the CSIR Cyber Defence Centre in Pretoria. His work develops threat intelligence platforms, network intrusion detection, and secure communications for critical infrastructure. He coordinates the African Cybersecurity Research Network and advises the South African government on cyber policy.',
      areasOfExpertise: ['Cybersecurity', 'Computer Science', 'Network Engineering'],
    },
    interests: [
      { id: 'interest-threat', name: 'Threat Intelligence', category: 'Cybersecurity', keywords: ['CTI', 'attribution', 'indicators'] },
      { id: 'interest-ids', name: 'Intrusion Detection', category: 'Cybersecurity', keywords: ['NIDS', 'anomaly', 'ML'] },
      { id: 'interest-crit', name: 'Critical Infrastructure', category: 'Cybersecurity', keywords: ['SCADA', 'resilience', 'protection'] },
    ],
    researchAreas: [
      { id: 'area-threat', name: 'Cyber threat intelligence', description: 'Platforms and methods for national threat intelligence.', publications: 24, citations: 760 },
      { id: 'area-ids', name: 'Machine learning intrusion detection', description: 'ML-based detection for network security.', publications: 18, citations: 540 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Pretoria', degree: 'PhD in Computer Science', field: 'Cybersecurity', startDate: '2013', endDate: '2017', country: 'South Africa' },
      { id: 'edu-msc', institution: 'University of Cape Town', degree: 'MSc in Computer Science', field: 'Network Security', startDate: '2010', endDate: '2012', country: 'South Africa' },
      { id: 'edu-bsc', institution: 'University of Zimbabwe', degree: 'BSc in Computer Science', field: 'Computer Science', startDate: '2006', endDate: '2009', country: 'Zimbabwe' },
    ],
    employment: [
      { id: 'emp-senior', organisation: 'CSIR', role: 'Senior Research Scientist', department: 'Cyber Defence Centre', startDate: '2019', current: true },
      { id: 'emp-scientist', organisation: 'CSIR', role: 'Research Scientist', startDate: '2013', endDate: '2019' },
    ],
    memberships: [
      { id: 'mem-iacr', organisation: 'Information Security Society of Africa', role: 'Member', type: 'Professional Association', since: '2018', status: 'Active' },
      { id: 'mem-ccs', organisation: 'ACM SIGSAC', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
    ],
    awards: [
      { id: 'aw-security', title: 'African Cybersecurity Excellence Award', organisation: 'African Union', year: '2024', category: 'Recognition' },
    ],
    honors: [{ id: 'hon-fellow8', title: 'Senior Research Fellow', organisation: 'CSIR', year: '2021', description: 'For sustained research leadership.' }],
    certifications: [
      { id: 'cert-cissp', name: 'CISSP', issuer: 'ISC2', year: '2020', description: 'Certified Information Systems Security Professional.' },
      { id: 'cert-ceh', name: 'CEH', issuer: 'EC-Council', year: '2018', description: 'Certified Ethical Hacker.' },
    ],
    skills: [
      { id: 'skill-cti', name: 'Cyber Threat Intelligence', category: 'Cybersecurity', level: 'Expert' },
      { id: 'skill-nids', name: 'Network Intrusion Detection', category: 'Cybersecurity', level: 'Expert' },
      { id: 'skill-python20', name: 'Python', category: 'Programming', level: 'Advanced' },
      { id: 'skill-incident', name: 'Incident Response', category: 'Cybersecurity', level: 'Advanced' },
      { id: 'skill-forensics', name: 'Digital Forensics', category: 'Cybersecurity', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en20', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-nd20', name: 'Ndebele', proficiency: 'Native' },
      { id: 'lang-zu', name: 'Zulu', proficiency: 'Professional Working' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/bongani-ndlovu',
      personalWebsite: 'https://ndlovu.scholatia.com',
      github: 'https://github.com/bonganindlovu',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-bn1', name: 'Dr. Thabo Dube', institution: 'University of Cape Town', role: 'Collaborator', researchAreas: ['Bioinformatics'], jointPublications: 5, username: 'dube' },
      ],
      institutionalPartners: ['University of Pretoria', 'African Union'],
      professionalNetwork: 330,
      followers: 4400,
      following: 240,
      coAuthors: 44,
    },
    teaching: {
      courses: [
        { id: 'course-sec', title: 'Cybersecurity Fundamentals', code: 'CS 512', level: 'Masters', institution: 'CSIR Academy', department: 'Cyber Defence', yearsTaught: '2020 - Present', students: 80, rating: 4.7 },
      ],
      teachingExperience: '6 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-bn1', name: 'Lerato Mokoena', level: 'PhD', thesisTitle: 'ML intrusion detection for critical infrastructure', institution: 'University of Pretoria', period: '2023 - Present', status: 'Current' },
      ],
      currentPhd: 2,
      completedPhd: 3,
      currentMasters: 2,
      completedMasters: 7,
      totalSupervised: 14,
    },
    editorialAppointments: [{ id: 'edit-bn1', role: 'Reviewer', journal: 'Computers & Security', since: '2022', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-bn1', conference: 'Black Hat Africa', year: '2024', role: 'Invited Speaker', paperTitle: 'Threat intelligence for African critical infrastructure', city: 'Johannesburg', country: 'South Africa' },
    ],
    grantParticipation: [
      { id: 'grant-bn1', title: 'National Cyber Defence Programme', funder: 'Department of Communications', amount: 'ZAR 18,000,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2028' },
    ],
    innovations: [{ id: 'inno-bn1', title: 'AfriThreat', description: 'Pan-African cyber threat intelligence sharing platform.', category: 'Cybersecurity', year: '2024', status: 'Commercialised' }],
    mediaCoverage: [{ id: 'media-bn1', outlet: 'ITWeb', headline: 'CSIR launches African threat intelligence platform', date: '2024-09-05', type: 'Technology news' }],
    publicEngagement: [
      { id: 'engage-bn1', title: 'Safe computing for small businesses', format: 'Workshop series', date: '2024-06-10', audience: 'Small businesses', reach: 400 },
    ],
    communityService: [{ id: 'cs-bn1', role: 'Coordinator', organisation: 'African Cybersecurity Research Network', since: '2022', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-bn1', organisation: 'Girls in Cyber Africa', role: 'Mentor', period: '2021 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'bongani.ndlovu@scholatia.org', professionalEmail: 'bndlovu@csir.co.za', office: 'CSIR Cyber Defence Centre, Pretoria', city: 'Pretoria', country: 'South Africa', timezone: 'Africa/Johannesburg' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 90,
      trustScore: 88,
      visibilityScore: 84,
      badges: [...PLACEHOLDER_BADGES, 'Trusted'],
      lastVerified: '2026-01-20',
      academicAchievements: ['African Cybersecurity Excellence Award 2024', 'CISSP certified', 'African threat intelligence lead'],
    },
  }),

  makeResearcher(21, {
    username: 'gallo',
    displayName: 'Dr. Camila Gallo',
    firstName: 'Camila',
    lastName: 'Gallo',
    avatar: '🗣️',
    headline: 'Lecturer in Linguistics',
    country: 'Argentina',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=camilagallo',
      scopusAuthorId: '57211023415',
      webOfScienceResearcherId: 'AAY-1120-2024',
      crossref: 'https://search.crossref.org/?q=camila+gallo',
      memberSince: '2020-11-01',
    },
    position: {
      title: 'Lecturer',
      institution: 'University of Buenos Aires',
      faculty: 'Faculty of Philosophy and Letters',
      department: 'Department of Linguistics',
      country: 'Argentina',
      city: 'Buenos Aires',
      employmentType: 'Full-time',
      startDate: '2021-03-01',
      current: true,
      researchFocus: ['Sociolinguistics', 'Language Documentation', 'Spanish Varieties'],
    },
    biography: {
      professionalSummary:
        'Lecturer in Linguistics at the University of Buenos Aires, documenting endangered languages and studying Spanish variation in Latin America.',
      academicSummary:
        'Linguist with 20+ publications and leadership of the River Plate sociolinguistic corpus project.',
      shortBiography:
        'Lecturer in linguistics at the University of Buenos Aires, focused on sociolinguistics and language documentation.',
      fullBiography:
        'Dr. Camila Gallo is a Lecturer in the Department of Linguistics at the University of Buenos Aires. Her research documents endangered languages of the Gran Chaco region and studies variation in River Plate Spanish. She coordinates the River Plate Sociolinguistic Corpus and works closely with indigenous language communities.',
      areasOfExpertise: ['Linguistics', 'Sociolinguistics', 'Language Documentation'],
    },
    interests: [
      { id: 'interest-socio', name: 'Sociolinguistics', category: 'Linguistics', keywords: ['variation', 'identity', 'language contact'] },
      { id: 'interest-doc', name: 'Language Documentation', category: 'Linguistics', keywords: ['endangered', 'fieldwork', 'archives'] },
      { id: 'interest-variety', name: 'Spanish Varieties', category: 'Linguistics', keywords: ['River Plate', 'Rioplatense', 'dialects'] },
    ],
    researchAreas: [
      { id: 'area-socio', name: 'River Plate sociolinguistics', description: 'Variation and change in Buenos Aires Spanish.', publications: 14, citations: 260 },
      { id: 'area-doc', name: 'Gran Chaco documentation', description: 'Documentation of endangered Chaco languages.', publications: 10, citations: 180 },
    ],
    education: [
      { id: 'edu-phd', institution: 'University of Buenos Aires', degree: 'PhD in Linguistics', field: 'Sociolinguistics', startDate: '2015', endDate: '2019', country: 'Argentina' },
      { id: 'edu-msc', institution: 'University of Buenos Aires', degree: 'MA in Linguistics', field: 'Linguistics', startDate: '2012', endDate: '2015', country: 'Argentina' },
      { id: 'edu-ba', institution: 'University of Buenos Aires', degree: 'BA in Letras', field: 'Linguistics', startDate: '2008', endDate: '2012', country: 'Argentina' },
    ],
    employment: [
      { id: 'emp-lect', organisation: 'University of Buenos Aires', role: 'Lecturer', department: 'Department of Linguistics', startDate: '2021', current: true },
      { id: 'emp-research', organisation: 'CONICET', role: 'Research Assistant', startDate: '2016', endDate: '2021' },
    ],
    memberships: [
      { id: 'mem-lsa2', organisation: 'Linguistic Society of America', role: 'Member', type: 'Professional Association', since: '2018', status: 'Active' },
      { id: 'mem-al', organisation: 'Asociaci\u00f3n de Ling\u00fc\u00edstica Argentina', role: 'Member', type: 'Professional Association', since: '2017', status: 'Active' },
    ],
    awards: [
      { id: 'aw-fieldwork', title: 'Fieldwork Research Grant', organisation: 'Endangered Languages Documentation Programme', year: '2023', category: 'Funding' },
    ],
    honors: [{ id: 'hon-conicet', title: 'CONICET Doctoral Fellow', organisation: 'CONICET', year: '2016', description: 'National research fellowship.' }],
    certifications: [{ id: 'cert-elar', name: 'ELAR Archiving Certification', issuer: 'SOAS', year: '2023' }],
    skills: [
      { id: 'skill-field', name: 'Field Linguistics', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-elan', name: 'ELAN Annotation', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-socio', name: 'Sociolinguistic Analysis', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-transcription', name: 'Phonetic Transcription (IPA)', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-archiving', name: 'Language Archiving', category: 'Research Methods', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-es21', name: 'Spanish', proficiency: 'Native' },
      { id: 'lang-en21', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-pt21', name: 'Portuguese', proficiency: 'Conversational' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/camila-gallo',
      personalWebsite: 'https://gallo.scholatia.com',
      twitter: 'https://x.com/camila_linguist',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-cg1', name: 'Dr. R\u00e9ka Kov\u00e1cs', institution: 'ELTE University', role: 'Collaborator', researchAreas: ['Psychology'], jointPublications: 4, username: 'kovacs' },
      ],
      institutionalPartners: ['SOAS University of London', 'CONICET'],
      professionalNetwork: 170,
      followers: 2200,
      following: 340,
      coAuthors: 16,
    },
    teaching: {
      courses: [
        { id: 'course-socio', title: 'Sociolinguistics', code: 'LIN 410', level: 'Undergraduate', institution: 'University of Buenos Aires', department: 'Linguistics', yearsTaught: '2022 - Present', students: 110, rating: 4.6 },
      ],
      teachingExperience: '4 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-cg1', name: 'Luc\u00eda Paz', level: 'Masters', thesisTitle: 'Variation in Buenos Aires intonation', institution: 'University of Buenos Aires', period: '2024 - Present', status: 'Current' },
      ],
      currentPhd: 1,
      completedPhd: 0,
      currentMasters: 2,
      completedMasters: 4,
      totalSupervised: 7,
    },
    editorialAppointments: [{ id: 'edit-cg1', role: 'Reviewer', journal: 'Linguistic Variation', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-cg1', conference: 'International Congress of Linguists', year: '2024', role: 'Paper Presenter', paperTitle: 'Documenting the languages of the Gran Chaco', city: 'Geneva', country: 'Switzerland' },
    ],
    grantParticipation: [
      { id: 'grant-cg1', title: 'Gran Chaco Language Documentation', funder: 'Endangered Languages Documentation Programme', amount: '\u00a3120,000', role: 'Principal Investigator', status: 'Active', period: '2023 - 2026' },
    ],
    innovations: [{ id: 'inno-cg1', title: 'Rioplatense Corpus', description: 'Open sociolinguistic corpus of Buenos Aires Spanish.', category: 'Language Data', year: '2024', status: 'Research' }],
    mediaCoverage: [{ id: 'media-cg1', outlet: 'P\u00e1gina/12', headline: 'La lengua que desaparece: el trabajo de campo en el Chaco', date: '2024-11-25', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-cg1', title: 'Community language workshops', format: 'Community engagement', date: '2024-10-08', audience: 'Language communities', reach: 150 },
    ],
    communityService: [{ id: 'cs-cg1', role: 'Coordinator', organisation: 'River Plate Sociolinguistic Corpus', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-cg1', organisation: 'First Peoples\u2019 Cultural Council', role: 'Volunteer Linguist', period: '2019 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'camila.gallo@scholatia.org', professionalEmail: 'cgallo@filo.uba.ar', office: 'Faculty of Philosophy and Letters, UBA', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 85,
      trustScore: 83,
      visibilityScore: 78,
      lastVerified: '2025-12-01',
      academicAchievements: ['Endangered Languages Documentation Programme grantee', 'CONICET fellow'],
    },
  }),

  makeResearcher(22, {
    username: 'yusuf',
    displayName: 'Dr. Fatima Yusuf',
    firstName: 'Fatima',
    lastName: 'Yusuf',
    avatar: '🦠',
    headline: 'Research Fellow in Microbiology',
    country: 'Nigeria',
    identity: {
      googleScholar: 'https://scholar.google.com/citations?user=fatimayusuf',
      scopusAuthorId: '57204578912',
      webOfScienceResearcherId: 'AAZ-4471-2024',
      crossref: 'https://search.crossref.org/?q=fatima+yusuf',
      memberSince: '2021-09-01',
    },
    position: {
      title: 'Research Fellow',
      institution: 'Bayero University Kano',
      faculty: 'Faculty of Life Sciences',
      department: 'Department of Microbiology',
      country: 'Nigeria',
      city: 'Kano',
      employmentType: 'Full-time',
      startDate: '2022-01-01',
      current: true,
      researchFocus: ['Antimicrobial Resistance', 'Medical Microbiology', 'Infectious Disease'],
    },
    biography: {
      professionalSummary:
        'Research Fellow in Microbiology at Bayero University Kano, studying antimicrobial resistance in northern Nigeria.',
      academicSummary:
        'Microbiologist with 25+ publications and leadership of the Kano antimicrobial surveillance network.',
      shortBiography:
        'Research Fellow in microbiology at Bayero University Kano, focused on antimicrobial resistance and infectious disease.',
      fullBiography:
        'Dr. Fatima Yusuf is a Research Fellow in the Department of Microbiology at Bayero University Kano. Her research tracks antimicrobial resistance in clinical and environmental settings, informs stewardship policy, and builds laboratory capacity across northern Nigeria. She coordinates the Kano Antimicrobial Surveillance Network and collaborates with national health agencies.',
      areasOfExpertise: ['Microbiology', 'Infectious Disease', 'Public Health'],
    },
    interests: [
      { id: 'interest-amr', name: 'Antimicrobial Resistance', category: 'Microbiology', keywords: ['AMR', 'antibiotics', 'stewardship'] },
      { id: 'interest-medmicro', name: 'Medical Microbiology', category: 'Microbiology', keywords: ['pathogens', 'clinical', 'diagnostics'] },
      { id: 'interest-surv', name: 'Infectious Disease Surveillance', category: 'Public Health', keywords: ['surveillance', 'outbreak', 'AMR'] },
    ],
    researchAreas: [
      { id: 'area-amr', name: 'Antimicrobial resistance', description: 'Surveillance of AMR in clinical and environmental samples.', publications: 20, citations: 420 },
      { id: 'area-diagnostics', name: 'Diagnostic capacity', description: 'Low-cost diagnostics for bacterial pathogens.', publications: 10, citations: 240 },
    ],
    education: [
      { id: 'edu-phd', institution: 'Bayero University Kano', degree: 'PhD in Microbiology', field: 'Medical Microbiology', startDate: '2015', endDate: '2019', country: 'Nigeria' },
      { id: 'edu-msc', institution: 'Ahmadu Bello University', degree: 'MSc in Microbiology', field: 'Microbiology', startDate: '2012', endDate: '2014', country: 'Nigeria' },
      { id: 'edu-bsc', institution: 'Bayero University Kano', degree: 'BSc in Microbiology', field: 'Microbiology', startDate: '2008', endDate: '2011', country: 'Nigeria' },
    ],
    employment: [
      { id: 'emp-fellow', organisation: 'Bayero University Kano', role: 'Research Fellow', department: 'Department of Microbiology', startDate: '2022', current: true },
      { id: 'emp-assoc', organisation: 'Aminu Kano Teaching Hospital', role: 'Medical Microbiology Associate', startDate: '2019', endDate: '2022' },
    ],
    memberships: [
      { id: 'mem-asm', organisation: 'American Society for Microbiology', role: 'Member', type: 'Professional Association', since: '2020', status: 'Active' },
      { id: 'mem-nsm', organisation: 'Nigerian Society for Microbiology', role: 'Member', type: 'Professional Association', since: '2015', status: 'Active' },
    ],
    awards: [
      { id: 'aw-tet', title: 'TETFund Research Grant', organisation: 'TETFund', year: '2023', category: 'Funding' },
    ],
    honors: [{ id: 'hon-fellow9', title: 'Research Fellow', organisation: 'African Academy of Sciences', year: '2024', description: 'AMR research fellowship.' }],
    certifications: [{ id: 'cert-glp', name: 'Good Laboratory Practice', issuer: 'WHO-AFRO', year: '2021' }],
    skills: [
      { id: 'skill-culture', name: 'Microbial Culture & Isolation', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-ast', name: 'Antimicrobial Susceptibility Testing', category: 'Research Methods', level: 'Expert' },
      { id: 'skill-mol', name: 'Molecular Microbiology', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-epid22', name: 'Hospital Epidemiology', category: 'Research Methods', level: 'Advanced' },
      { id: 'skill-writing22', name: 'Grant Writing', category: 'Professional', level: 'Advanced' },
    ],
    languages: [
      { id: 'lang-en22', name: 'English', proficiency: 'Fluent' },
      { id: 'lang-ha22', name: 'Hausa', proficiency: 'Native' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/fatima-yusuf-micro',
      personalWebsite: 'https://yusuf.scholatia.com',
      twitter: 'https://x.com/fatima_amr',
      others: [],
    },
    network: {
      collaborators: [
        { id: 'collab-fy1', name: 'Prof. Adebisi Ojurere', institution: 'University of Ibadan', role: 'Collaborator', researchAreas: ['Public Health'], jointPublications: 6, username: 'ojuri' },
      ],
      institutionalPartners: ['Aminu Kano Teaching Hospital', 'WHO-AFRO'],
      professionalNetwork: 180,
      followers: 2600,
      following: 210,
      coAuthors: 26,
    },
    teaching: {
      courses: [
        { id: 'course-micro', title: 'Medical Microbiology', code: 'MIC 402', level: 'Undergraduate', institution: 'Bayero University Kano', department: 'Microbiology', yearsTaught: '2022 - Present', students: 140, rating: 4.6 },
      ],
      teachingExperience: '3 years of teaching',
    },
    supervision: {
      students: [
        { id: 'sup-fy1', name: 'Maimuna Sani', level: 'Masters', thesisTitle: 'AMR patterns in Kano hospital isolates', institution: 'Bayero University Kano', period: '2024 - Present', status: 'Current' },
      ],
      currentPhd: 1,
      completedPhd: 0,
      currentMasters: 2,
      completedMasters: 3,
      totalSupervised: 6,
    },
    editorialAppointments: [{ id: 'edit-fy1', role: 'Reviewer', journal: 'Journal of Antimicrobial Chemotherapy', since: '2023', status: 'Active' }],
    conferenceParticipation: [
      { id: 'conf-fy1', conference: 'International Conference on AMR in Africa', year: '2024', role: 'Paper Presenter', paperTitle: 'AMR surveillance in northern Nigeria', city: 'Kigali', country: 'Rwanda' },
    ],
    grantParticipation: [
      { id: 'grant-fy1', title: 'Kano Antimicrobial Surveillance Network', funder: 'Bill & Melinda Gates Foundation', amount: '$750,000', role: 'Principal Investigator', status: 'Active', period: '2024 - 2027' },
    ],
    innovations: [{ id: 'inno-fy1', title: 'AMR Tracker', description: 'Open dashboard for regional antimicrobial resistance data.', category: 'Digital Health', year: '2024', status: 'Research' }],
    mediaCoverage: [{ id: 'media-fy1', outlet: 'Daily Trust', headline: 'Kano researchers map antibiotic resistance', date: '2024-11-08', type: 'Newspaper' }],
    publicEngagement: [
      { id: 'engage-fy1', title: 'Antibiotic awareness campaigns', format: 'Public health outreach', date: '2024-11-18', audience: 'Community members', reach: 900 },
    ],
    communityService: [{ id: 'cs-fy1', role: 'Coordinator', organisation: 'Kano Antimicrobial Surveillance Network', since: '2023', status: 'Active' }],
    volunteerExperience: [{ id: 'vol-fy1', organisation: 'Pharmacists Against AMR', role: 'Scientific Adviser', period: '2023 - Present' }],
    availability: { ...DEFAULT_AVAILABILITY, openToConsulting: true, preferredContact: 'Email' },
    contact: { email: 'fatima.yusuf@scholatia.org', professionalEmail: 'fayusuf@buk.edu.ng', office: 'Department of Microbiology, BUK', city: 'Kano', country: 'Nigeria', timezone: 'Africa/Lagos' },
    verification: {
      ...DEFAULT_VERIFICATION,
      identityScore: 85,
      trustScore: 84,
      visibilityScore: 79,
      lastVerified: '2025-11-28',
      academicAchievements: ['African Academy of Sciences AMR fellow 2024', 'Kano AMR network coordinator'],
    },
  }),
];

export const FEATURED_RESEARCHER: ResearcherProfile = RESEARCHERS[0];

export const RECENT_RESEARCHERS: ResearcherProfile[] = [...RESEARCHERS]
  .sort((a, b) => b.identity.memberSince.localeCompare(a.identity.memberSince))
  .slice(0, 6);

export const TOP_CITED_RESEARCHERS: ResearcherProfile[] = [...RESEARCHERS]
  .sort((a, b) => b.impact.citationMetrics.totalCitations - a.impact.citationMetrics.totalCitations)
  .slice(0, 8);

export const TRENDING_RESEARCHERS: ResearcherProfile[] = [...RESEARCHERS]
  .sort((a, b) => b.visibility.visibilityScore - a.visibility.visibilityScore)
  .slice(0, 6);

export const MOST_COLLABORATIVE_RESEARCHERS: ResearcherProfile[] = [...RESEARCHERS]
  .sort((a, b) => b.metrics.totalCollaborators - a.metrics.totalCollaborators)
  .slice(0, 6);

export const RESEARCHER_PORTFOLIO_STATISTICS: ResearcherStatistics = summarizeResearcherPortfolio(RESEARCHERS);

export const RESEARCH_INTEREST_GROUPS: { interest: string; count: number }[] = Array.from(
  RESEARCHERS.flatMap((researcher) => researcher.interests.map((interest) => interest.name)).reduce(
    (counts, interest) => counts.set(interest, (counts.get(interest) ?? 0) + 1),
    new Map<string, number>()
  )
)
  .map(([interest, count]) => ({ interest, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 12);

export const INSTITUTION_DISTRIBUTION: { institution: string; country?: string; count: number }[] = Array.from(
  RESEARCHERS.reduce(
    (counts, researcher) => {
      const name = researcher.position.institution;
      counts.set(name, (counts.get(name) ?? 0) + 1);
      return counts;
    },
    new Map<string, number>()
  )
)
  .map(([institution, count]) => ({
    institution,
    country: RESEARCHERS.find((researcher) => researcher.position.institution === institution)?.position.country,
    count,
  }))
  .sort((a, b) => b.count - a.count);

export const COUNTRY_DISTRIBUTION: { country: string; count: number }[] = Array.from(
  RESEARCHERS.reduce(
    (counts, researcher) => counts.set(researcher.country, (counts.get(researcher.country) ?? 0) + 1),
    new Map<string, number>()
  )
)
  .map(([country, count]) => ({ country, count }))
  .sort((a, b) => b.count - a.count);

export const DISCIPLINE_DISTRIBUTION: { discipline: string; count: number }[] = Array.from(
  RESEARCHERS.flatMap((researcher) => researcher.biography.areasOfExpertise).reduce(
    (counts, discipline) => counts.set(discipline, (counts.get(discipline) ?? 0) + 1),
    new Map<string, number>()
  )
)
  .map(([discipline, count]) => ({ discipline, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 12);

export const RESEARCHER_LIFECYCLE_COVERAGE: ResearcherLifecycleCoverage[] =
  ResearchLifecycleEngine.getAllStages().map((stage) => {
    const previousStage = ResearchLifecycleEngine.getPreviousStage(stage.id);
    const nextStage = ResearchLifecycleEngine.getNextStage(stage.id);
    return {
      stageId: stage.id,
      name: stage.name,
      description: stage.description,
      icon: stage.icon,
      order: stage.order,
      completionPercentage: ResearchLifecycleEngine.getCompletionPercentage(stage.id),
      previousStage: previousStage?.name ?? null,
      nextStage: nextStage?.name ?? null,
    };
  });

export { createSaidIdentifier };

/**
 * Convenience exports for the researcher domain. `createSaidIdentifier` is
 * re-exported so the researcher module can mint SAIDs consistently.
 */
export type {
  Availability,
  ConferenceParticipation,
  ContactInformation,
  EditorialAppointment,
  IdentityVerification,
  Language,
  ResearcherLifecycleCoverage,
  ResearcherProfile,
  ResearcherRelationships,
  ResearcherStatistics,
  SocialLinks,
  SupervisionPortfolio,
  TeachingPortfolio,
};
