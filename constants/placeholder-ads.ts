import type {
  AdAudience,
  AdCampaign,
  AdCampaignAnalytics,
  AdCreative,
  AdForecast,
  AdFraudSignal,
  AdPlacement,
  AdReviewRecord,
  AdSet,
  AdTargetProfile,
  AdvertisingAnalytics,
  AdvertisingPortfolio,
  AdvertisingStatistics,
  AdvertiserAccount,
  CustomAudience,
  LookalikeAudience,
  PromotableObject,
  RetargetingAudience,
  SponsoredLabel,
  SponsoredPlacement,
} from '@/types/ads';
import type { JournalProfile } from '@/types/identity';
import type { Institution } from '@/types/institution';
import type { Publisher } from '@/types/publisher';
import type { Dataset } from '@/types/dataset';
import type { Manuscript } from '@/types/manuscript';
import type { FundingOpportunity } from '@/types/funding';
import type { ConferenceRecord } from '@/types/conference';
import type { ResearcherProfile } from '@/types/researcher';
import type { PublicationEntry } from '@/constants/placeholder-profile';
import type { WorkspaceProject } from '@/constants/placeholder-research';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { PUBLISHERS } from '@/constants/placeholder-publishers';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS } from '@/constants/placeholder-research';

import {
  aggregateMetrics,
  buildFunnel,
  computeAdvertisingAnalytics,
  computeAdvertisingStatistics,
  createPromotableObject,
  detectFraudSignals,
  forecastCampaign,
  registerPromotableObjects,
} from '@/lib/ads';

/**
 * The Academic Advertising & Sponsored Content Platform of the Scholatia
 * ecosystem.
 *
 * The Advertising module is the platform-wide monetization layer. It does NOT
 * own records and does NOT duplicate any module data — every promotable object
 * here is derived from the existing placeholder modules (researchers, journals,
 * conferences, institutions, publishers, datasets, manuscripts, funding,
 * projects, publications) and references the original source identity (a SAID,
 * a journal id, a conference id, a DOI, a grant id, a project id).
 *
 * The platform ships two advertiser surfaces — Scholatia Promote (internal,
 * verified users promoting their own content) and Scholatia Ads (external
 * advertisers without academic profiles) — plus the full Ads Manager structure:
 * campaigns → ad sets → creatives, the audience engine, placements, AI
 * forecasts, fraud prevention, the review queue, and campaign analytics.
 */

const CURRENT_DATE = '2026-07-31';

// ---------------------------------------------------------------------------
// Promotable object derivation
// ---------------------------------------------------------------------------

function researcherKeywords(researcher: ResearcherProfile): string[] {
  return Array.from(
    new Set([
      ...researcher.interests.flatMap((interest) => [interest.name, ...interest.keywords]),
      ...researcher.researchAreas.map((area) => area.name),
      ...researcher.skills.map((skill) => skill.name),
      ...(researcher.position.researchFocus ?? []),
    ])
  );
}

function researcherObject(researcher: ResearcherProfile): PromotableObject {
  return createPromotableObject({
    id: `promo-researcher-${researcher.username}`,
    entityType: 'researcher-profile',
    sourceId: researcher.identity.said,
    title: researcher.displayName,
    summary: `${researcher.position.institution} · ${researcher.position.faculty}${researcher.impact.hIndex ? ` · h-index ${researcher.impact.hIndex}` : ''}`,
    url: `/researchers/${researcher.username}`,
    keywords: researcherKeywords(researcher),
    discipline: researcher.position.faculty,
    researchAreas: researcher.researchAreas.map((area) => area.name),
    organizations: [researcher.position.institution],
    country: researcher.country,
    tags: ['researcher-profile', 'academic-identity'],
    dateAdded: CURRENT_DATE,
  });
}

function journalObject(journal: JournalProfile): PromotableObject {
  return createPromotableObject({
    id: `promo-journal-${journal.journalId}`,
    entityType: 'journal',
    sourceId: journal.journalId,
    title: journal.journalTitle,
    summary: journal.aimsAndScope ?? journal.researchAreas.slice(0, 3).join(', '),
    url: '/journals',
    keywords: journal.researchAreas,
    discipline: journal.discipline,
    researchAreas: journal.researchAreas,
    authors: journal.editors,
    organizations: journal.publisher ? [journal.publisher] : [],
    country: journal.country,
    stageId: 'publication',
    tags: [journal.openAccessStatus, journal.reviewModel],
    dateAdded: CURRENT_DATE,
  });
}

function conferenceObject(conference: ConferenceRecord): PromotableObject {
  return createPromotableObject({
    id: `promo-conference-${conference.conferenceId}`,
    entityType: 'conference',
    sourceId: conference.conferenceId,
    title: conference.title,
    summary: conference.theme ?? conference.researchAreas.slice(0, 3).join(', '),
    url: '/conferences',
    keywords: conference.keywords,
    discipline: conference.researchAreas[0],
    researchAreas: conference.researchAreas,
    organizations: conference.organisers,
    country: conference.country,
    stageId: 'conference',
    tags: [conference.eventType, conference.registrationStatus],
    dateAdded: CURRENT_DATE,
  });
}

function institutionObject(institution: Institution): PromotableObject {
  return createPromotableObject({
    id: `promo-institution-${institution.said}`,
    entityType: 'institution',
    sourceId: institution.said,
    title: institution.profile.institutionName,
    summary: institution.profile.mission ?? institution.profile.description ?? institution.profile.academicDisciplines.slice(0, 3).join(', '),
    url: '/institutions',
    keywords: institution.profile.academicDisciplines,
    discipline: institution.profile.academicDisciplines[0],
    researchAreas: institution.profile.researchAreas,
    organizations: [institution.profile.institutionName],
    country: institution.country,
    tags: [institution.profile.institutionType, institution.verificationStatus],
    dateAdded: CURRENT_DATE,
  });
}

function publisherObject(publisher: Publisher): PromotableObject {
  return createPromotableObject({
    id: `promo-publisher-${publisher.id}`,
    entityType: 'publisher',
    sourceId: publisher.id,
    title: publisher.name,
    summary: publisher.description,
    url: '/publishers',
    keywords: publisher.imprints.flatMap((imprint) => imprint.focusAreas),
    researchAreas: publisher.bookSeries.map((series) => series.discipline),
    organizations: [publisher.name],
    country: publisher.country,
    tags: [publisher.type, publisher.verificationStatus],
    dateAdded: CURRENT_DATE,
  });
}

function datasetObject(dataset: Dataset): PromotableObject {
  return createPromotableObject({
    id: `promo-dataset-${dataset.id}`,
    entityType: 'dataset',
    sourceId: dataset.doi,
    title: dataset.title,
    summary: dataset.description,
    url: '/datasets',
    keywords: dataset.tags,
    researchAreas: dataset.metadata.subjects,
    organizations: [dataset.institution],
    country: dataset.institution,
    stageId: 'dataset',
    tags: [dataset.access, dataset.verification],
    dateAdded: CURRENT_DATE,
  });
}

function manuscriptObject(manuscript: Manuscript): PromotableObject {
  const entityType = manuscript.doi ? 'research-paper' : 'preprint';
  return createPromotableObject({
    id: `promo-manuscript-${manuscript.id}`,
    entityType,
    sourceId: manuscript.doi ?? manuscript.id,
    title: manuscript.title,
    summary: manuscript.description,
    url: '/manuscripts',
    keywords: manuscript.metadata.keywords,
    researchAreas: manuscript.metadata.subjects,
    authors: manuscript.authors.map((author) => author.name),
    organizations: [manuscript.institution],
    stageId: manuscript.stageId,
    tags: [manuscript.status, manuscript.metadata.language],
    dateAdded: CURRENT_DATE,
  });
}

function fundingObject(opportunity: FundingOpportunity): PromotableObject {
  const entityType =
    opportunity.grantType === 'scholarship'
      ? 'scholarship'
      : opportunity.grantType === 'fellowship'
        ? 'fellowship'
        : opportunity.grantType === 'research-grant' || opportunity.grantType === 'collaborative'
          ? 'grant'
          : 'funding-opportunity';
  return createPromotableObject({
    id: `promo-funding-${opportunity.id}`,
    entityType,
    sourceId: opportunity.id,
    title: opportunity.title,
    summary: opportunity.summary,
    url: '/funding',
    keywords: opportunity.researchAreas,
    researchAreas: opportunity.researchAreas,
    organizations: [opportunity.agencyName],
    country: opportunity.countries[0],
    stageId: 'funding',
    tags: [opportunity.category, opportunity.status, opportunity.careerStage],
    dateAdded: CURRENT_DATE,
  });
}

function projectObject(project: WorkspaceProject): PromotableObject {
  return createPromotableObject({
    id: `promo-project-${project.id}`,
    entityType: 'research-project',
    sourceId: project.id,
    title: project.name,
    summary: project.description,
    url: '/research',
    keywords: project.category ? [project.category] : [],
    researchAreas: project.category ? [project.category] : [],
    authors: project.collaborators,
    stageId: 'project',
    tags: [project.status, project.role],
    dateAdded: CURRENT_DATE,
  });
}

function publicationObject(publication: PublicationEntry, index: number): PromotableObject {
  return createPromotableObject({
    id: `promo-publication-${index}`,
    entityType: 'research-paper',
    sourceId: publication.doi,
    title: publication.title,
    summary: `${publication.journal} · ${publication.year}${publication.citations ? ` · ${publication.citations} citations` : ''}`,
    url: '/research',
    keywords: [publication.journal],
    researchAreas: publication.type ? [publication.type] : [],
    authors: publication.authors,
    organizations: [publication.journal],
    stageId: 'publication',
    tags: [publication.year],
    dateAdded: CURRENT_DATE,
  });
}

const PROMOTABLE_SEEDS: PromotableObject[] = [
  ...RESEARCHERS.map(researcherObject),
  ...JOURNALS.map(journalObject),
  ...CONFERENCES.map(conferenceObject),
  ...INSTITUTIONS.map(institutionObject),
  ...PUBLISHERS.map(publisherObject),
  ...DATASETS.map(datasetObject),
  ...MANUSCRIPTS.map(manuscriptObject),
  ...FUNDING_OPPORTUNITIES.map(fundingObject),
  ...WORKSPACE_PROJECTS.map(projectObject),
  ...WORKSPACE_PUBLICATIONS.map(publicationObject),
];

/** The platform-wide promotable catalog. */
export const PROMOTABLE_OBJECTS: PromotableObject[] = registerPromotableObjects(PROMOTABLE_SEEDS);

export const FEATURED_PROMOTABLE = PROMOTABLE_OBJECTS[0];

// ---------------------------------------------------------------------------
// Audiences
// ---------------------------------------------------------------------------

export const AD_AUDIENCES: AdAudience[] = [
  {
    id: 'aud-nlp-researchers',
    name: 'Computational Linguistics & NLP Researchers',
    description: 'Researchers and PhD candidates working on multilingual NLP, parsing, and language technologies.',
    countries: ['United Kingdom', 'Netherlands', 'Germany', 'United States', 'Nigeria', 'Kenya', 'South Africa'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: ['Computer Science', 'Computational Linguistics', 'Linguistics'],
    disciplines: ['Computational Linguistics', 'Natural Language Processing', 'Computer Science', 'Machine Learning'],
    researchInterests: ['multilingual NLP', 'dependency parsing', 'language technologies', 'transfer learning'],
    orcidDisciplines: ['Computer Science', 'Linguistics'],
    researchKeywords: ['parsing', 'NLP', 'language modeling', 'low-resource', 'computational linguistics'],
    academicRanks: ['Postgraduate', 'Postdoctoral Researcher', 'Research Scientist', 'Lecturer', 'Assistant Professor'],
    studentLevels: ['Postgraduate', 'Doctoral'],
    careerStages: ['doctoral', 'postdoctoral', 'early-career', 'mid-career'],
    languages: ['English', 'French', 'German', 'Dutch'],
    sectors: ['education', 'industry', 'all-sectors'],
    researchLifecycleStages: ['manuscript', 'submission', 'peer-review', 'publication', 'conference', 'citation'],
    publicationHistory: true,
    hIndexRange: { min: 3, max: 60 },
    journalReadership: [],
    customAudienceIds: ['custom-african-nlp'],
    lookalikeAudienceIds: ['lookalike-nlp-researchers'],
    retargetingAudienceIds: ['retargeting-submission-visitors'],
    estimatedReach: 128_000,
  },
  {
    id: 'aud-african-early-career',
    name: 'African Early-Career Researchers',
    description: 'Early-career researchers across Africa seeking funding, mentoring, and publishing opportunities.',
    countries: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Uganda', 'Tanzania', 'Rwanda', 'Senegal', 'Zimbabwe'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: [],
    disciplines: [],
    researchInterests: ['research funding', 'mentorship', 'open access', 'career development'],
    orcidDisciplines: [],
    researchKeywords: ['grant', 'fellowship', 'scholarship', 'mentorship', 'capacity building'],
    academicRanks: ['Student', 'Postgraduate', 'Postdoctoral Researcher', 'Lecturer', 'Research Assistant'],
    studentLevels: ['Undergraduate', 'Postgraduate', 'Masters', 'Doctoral'],
    careerStages: ['undergraduate', 'postgraduate', 'masters', 'doctoral', 'postdoctoral', 'early-career'],
    languages: ['English', 'French', 'Swahili', 'Yoruba', 'Hausa'],
    sectors: ['education', 'government', 'ngo'],
    researchLifecycleStages: ['funding', 'project', 'dataset', 'manuscript', 'publication'],
    publicationHistory: false,
    grantHistory: false,
    journalReadership: [],
    customAudienceIds: [],
    lookalikeAudienceIds: [],
    retargetingAudienceIds: ['retargeting-funding-engagers'],
    estimatedReach: 95_000,
  },
  {
    id: 'aud-biomedical-data',
    name: 'Biomedical & Health Data Scientists',
    description: 'Researchers applying data science to health, biomedical, and public-health questions.',
    countries: ['United Kingdom', 'Germany', 'Switzerland', 'United States', 'South Africa', 'Kenya'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: ['Biomedical Data Science', 'Medicine', 'Public Health', 'Epidemiology'],
    disciplines: ['Biomedical Data Science', 'Bioinformatics', 'Public Health', 'Biostatistics'],
    researchInterests: ['biomedical data', 'bioinformatics', 'health data', 'clinical datasets'],
    orcidDisciplines: ['Biomedical Science', 'Computer Science'],
    researchKeywords: ['biomedical', 'genomics', 'health data', 'clinical', 'data science'],
    academicRanks: ['Research Scientist', 'Postdoctoral Researcher', 'Associate Professor', 'Professor'],
    studentLevels: ['Doctoral'],
    careerStages: ['postdoctoral', 'mid-career', 'senior'],
    languages: ['English', 'German'],
    sectors: ['healthcare', 'industry', 'education'],
    researchLifecycleStages: ['dataset', 'analysis', 'manuscript', 'publication'],
    publicationHistory: true,
    grantHistory: true,
    hIndexRange: { min: 5, max: 80 },
    journalReadership: [],
    customAudienceIds: [],
    lookalikeAudienceIds: [],
    retargetingAudienceIds: ['retargeting-dataset-downloaders'],
    estimatedReach: 84_000,
  },
  {
    id: 'aud-hei-leadership',
    name: 'Higher Education Leadership',
    description: 'University administrators, deans, and senior faculty shaping institutional strategy.',
    countries: ['United Kingdom', 'Netherlands', 'Nigeria', 'Ghana', 'South Africa', 'United States', 'Canada'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: ['Education', 'Higher Education', 'University Administration'],
    disciplines: ['Higher Education', 'Educational Leadership', 'Policy'],
    researchInterests: ['higher education', 'institutional strategy', 'accreditation', 'research policy'],
    orcidDisciplines: [],
    researchKeywords: ['university', 'institution', 'leadership', 'policy', 'accreditation'],
    academicRanks: ['Associate Professor', 'Professor', 'Principal Investigator', 'Open to All'],
    studentLevels: [],
    careerStages: ['mid-career', 'senior'],
    languages: ['English', 'French'],
    sectors: ['education', 'government'],
    researchLifecycleStages: ['funding', 'project', 'conference'],
    publicationHistory: true,
    conferenceAttendance: true,
    journalReadership: [],
    customAudienceIds: [],
    lookalikeAudienceIds: [],
    retargetingAudienceIds: [],
    estimatedReach: 62_000,
  },
  {
    id: 'aud-open-science',
    name: 'Open Science & Research Integrity Advocates',
    description: 'Researchers, publishers, and integrity officers championing open access and reproducible research.',
    countries: ['Netherlands', 'United Kingdom', 'Germany', 'United States', 'South Africa', 'Kenya'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: ['Open Science', 'Research Integrity', 'Library'],
    disciplines: ['Open Research', 'Research Integrity', 'Scholarly Communication', 'Data Management'],
    researchInterests: ['open access', 'research integrity', 'reproducibility', 'data sharing', 'preprints'],
    orcidDisciplines: [],
    researchKeywords: ['open access', 'diamond', 'gold', 'preprint', 'reproducibility', 'integrity'],
    academicRanks: ['Lecturer', 'Senior Lecturer', 'Associate Professor', 'Professor'],
    studentLevels: [],
    careerStages: ['early-career', 'mid-career', 'senior'],
    languages: ['English', 'Dutch', 'German'],
    sectors: ['publisher', 'funding-agency', 'membership-organisation', 'education'],
    researchLifecycleStages: ['manuscript', 'publication', 'citation'],
    publicationHistory: true,
    journalReadership: [],
    customAudienceIds: [],
    lookalikeAudienceIds: [],
    retargetingAudienceIds: [],
    estimatedReach: 71_000,
  },
  {
    id: 'aud-global-postdocs',
    name: 'Global Postdoctoral Researchers',
    description: 'Postdocs worldwide open to fellowships, conferences, jobs, and cross-border collaborations.',
    countries: ['United Kingdom', 'Netherlands', 'Germany', 'Switzerland', 'France', 'United States', 'Canada', 'Japan', 'Australia', 'Singapore'],
    states: [],
    cities: [],
    institutions: [],
    departments: [],
    faculties: [],
    disciplines: [],
    researchInterests: ['fellowship', 'postdoc', 'career', 'collaboration', 'conference'],
    orcidDisciplines: [],
    researchKeywords: ['postdoctoral', 'fellowship', 'career development', 'international collaboration'],
    academicRanks: ['Postdoctoral Researcher', 'Research Associate', 'Research Scientist'],
    studentLevels: ['Doctoral'],
    careerStages: ['postdoctoral', 'early-career'],
    languages: ['English'],
    sectors: ['education', 'industry'],
    researchLifecycleStages: ['funding', 'project', 'manuscript', 'publication', 'conference'],
    publicationHistory: true,
    conferenceAttendance: true,
    journalReadership: [],
    customAudienceIds: [],
    lookalikeAudienceIds: ['lookalike-global-postdocs'],
    retargetingAudienceIds: [],
    estimatedReach: 145_000,
  },
];

export const CUSTOM_AUDIENCES: CustomAudience[] = [
  {
    id: 'custom-african-nlp',
    name: 'African NLP Community (upload)',
    source: 'upload',
    criteria: ['Members of African NLP workshops', 'Authors in African language resources', 'Scholarly subscribers'],
    size: 8_400,
    createdAt: '2026-04-12',
    advertiserId: 'adv-scholatia-open-research-press',
  },
  {
    id: 'custom-integrity-officers',
    name: 'Research Integrity Officers (platform)',
    source: 'platform',
    criteria: ['Users with research-integrity interest', 'Verified reviewer accounts', 'Editorial board members'],
    size: 3_200,
    createdAt: '2026-05-02',
    advertiserId: 'adv-scholatia-open-research-press',
  },
];

export const LOOKALIKE_AUDIENCES: LookalikeAudience[] = [
  {
    id: 'lookalike-nlp-researchers',
    name: 'NLP Researchers — Lookalike (5%)',
    seedAudienceId: 'aud-nlp-researchers',
    similarityPercent: 5,
    size: 210_000,
    countries: ['United Kingdom', 'Germany', 'Netherlands', 'United States', 'India', 'China'],
  },
  {
    id: 'lookalike-global-postdocs',
    name: 'Global Postdocs — Lookalike (4%)',
    seedAudienceId: 'aud-global-postdocs',
    similarityPercent: 4,
    size: 310_000,
    countries: ['United Kingdom', 'Germany', 'France', 'United States', 'Japan', 'Canada'],
  },
];

export const RETARGETING_AUDIENCES: RetargetingAudience[] = [
  {
    id: 'retargeting-submission-visitors',
    name: 'Manuscript submission visitors (30d)',
    source: 'visitors',
    lookbackDays: 30,
    size: 12_600,
  },
  {
    id: 'retargeting-funding-engagers',
    name: 'Funding page engagers (60d)',
    source: 'engagers',
    lookbackDays: 60,
    size: 9_100,
  },
  {
    id: 'retargeting-dataset-downloaders',
    name: 'Dataset downloaders (45d)',
    source: 'converters',
    lookbackDays: 45,
    size: 7_300,
  },
];

// ---------------------------------------------------------------------------
// Advertisers
// ---------------------------------------------------------------------------

export const ADVERTISERS: AdvertiserAccount[] = [
  {
    id: 'adv-scholar-profile',
    name: 'Dr. Kofi Mensah',
    kind: 'scholatia-promote',
    accountType: 'individual',
    said: RESEARCHERS[0].identity.said,
    billing: {
      defaultMethod: 'Credits',
      methods: ['Credits', 'Stripe', 'PayPal'],
      billingEmail: 'kofi.mensah@scholatia.org',
      balance: 450,
      creditBalance: 250,
      autoRecharge: true,
      paymentHistory: [
        { id: 'pay-1001', amount: 200, currency: 'USD', method: 'Stripe', status: 'paid', billedAt: '2026-07-01', description: 'Campaign prepayment — research visibility', campaignId: 'cam-paper-promotion', invoiceNumber: 'INV-2026-0041' },
        { id: 'pay-1002', amount: 120, currency: 'USD', method: 'Credits', status: 'paid', billedAt: '2026-07-15', description: 'Premium promotion bundle — citation growth', campaignId: 'cam-citation-growth', invoiceNumber: 'INV-2026-0088' },
      ],
    },
    advertisementLibrary: ['cr-paper-headline', 'cr-profile-visibility'],
    verificationStatus: 'Verified',
    trustScore: 92,
    analytics: {
      totalCampaigns: 2,
      activeCampaigns: 2,
      totalSpend: 320,
      totalImpressions: 1_240_000,
      totalClicks: 18_600,
      totalConversions: 720,
      averageCtr: 1.5,
      averageCpc: 0.86,
      averageCpa: 22.2,
      lifetimeValue: 940,
    },
    joinedAt: '2025-03-18',
    tags: ['researcher', 'individual', 'internal'],
  },
  {
    id: 'adv-scholatia-open-research-press',
    name: 'Scholatia Open Research Press',
    kind: 'scholatia-ads',
    accountType: 'organization',
    companyProfile: {
      industry: 'Publishing',
      website: 'https://press.scholatia.org',
      country: 'Netherlands',
      city: 'Amsterdam',
      description: 'Independent open-access scholarly publisher serving the global research community.',
      sizeBand: '51-200',
      representativeName: 'Emma de Vries',
      representativeEmail: 'ads@scholatia-press.org',
    },
    billing: {
      defaultMethod: 'Institutional Billing',
      methods: ['Institutional Billing', 'Stripe', 'Bank Transfer'],
      billingEmail: 'billing@scholatia-press.org',
      taxId: 'NL-ING-2017',
      balance: 5_400,
      creditBalance: 0,
      autoRecharge: false,
      paymentHistory: [
        { id: 'pay-2001', amount: 3_000, currency: 'EUR', method: 'Bank Transfer', status: 'paid', billedAt: '2026-06-28', description: 'Enterprise campaign — journal launch Q3', campaignId: 'cam-journal-launch', invoiceNumber: 'INV-2026-0022' },
        { id: 'pay-2002', amount: 800, currency: 'EUR', method: 'Stripe', status: 'paid', billedAt: '2026-07-10', description: 'Featured listing subscription — flagship journal', invoiceNumber: 'INV-2026-0066' },
      ],
    },
    campaignManagerId: 'cm-de-vries',
    advertisementLibrary: ['cr-journal-launch', 'cr-journal-banner', 'cr-conference-native'],
    verificationStatus: 'Trusted',
    trustScore: 95,
    analytics: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalSpend: 4_600,
      totalImpressions: 8_900_000,
      totalClicks: 102_000,
      totalConversions: 2_150,
      averageCtr: 1.15,
      averageCpc: 1.32,
      averageCpa: 48.4,
      lifetimeValue: 12_800,
    },
    joinedAt: '2025-11-02',
    tags: ['publisher', 'organization', 'external', 'enterprise'],
  },
  {
    id: 'adv-pan-african-research-foundation',
    name: 'Pan-African Research Foundation',
    kind: 'scholatia-ads',
    accountType: 'organization',
    companyProfile: {
      industry: 'Philanthropy',
      website: 'https://parf.example.org',
      country: 'Ghana',
      city: 'Accra',
      description: 'Foundation funding early-career researchers and capacity building across Africa.',
      sizeBand: '11-50',
      representativeName: 'Ama Owusu',
      representativeEmail: 'programmes@parf.example.org',
    },
    billing: {
      defaultMethod: 'Wallet',
      methods: ['Wallet', 'Bank Transfer', 'Flutterwave'],
      billingEmail: 'finance@parf.example.org',
      balance: 2_150,
      creditBalance: 0,
      autoRecharge: false,
      paymentHistory: [
        { id: 'pay-3001', amount: 1_000, currency: 'USD', method: 'Flutterwave', status: 'paid', billedAt: '2026-07-05', description: 'Funding call promotion — scholars programme', campaignId: 'cam-funding-call', invoiceNumber: 'INV-2026-0050' },
      ],
    },
    advertisementLibrary: ['cr-funding-call', 'cr-scholarship-native'],
    verificationStatus: 'Verified',
    trustScore: 90,
    analytics: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalSpend: 1_900,
      totalImpressions: 3_100_000,
      totalClicks: 31_000,
      totalConversions: 1_080,
      averageCtr: 1.0,
      averageCpc: 0.74,
      averageCpa: 24.5,
      lifetimeValue: 4_300,
    },
    joinedAt: '2026-01-14',
    tags: ['foundation', 'funding-agency', 'organization', 'external'],
  },
  {
    id: 'adv-vectordynamics-labs',
    name: 'VectorDynamics Labs',
    kind: 'scholatia-ads',
    accountType: 'organization',
    companyProfile: {
      industry: 'Laboratory Equipment & Software',
      website: 'https://vectordynamics.example.com',
      country: 'United Kingdom',
      city: 'Cambridge',
      description: 'Scientific software and lab automation tools for research institutions.',
      sizeBand: '201-500',
      representativeName: 'Dr. Priya Sharma',
      representativeEmail: 'marketing@vectordynamics.example.com',
    },
    billing: {
      defaultMethod: 'Stripe',
      methods: ['Stripe', 'PayPal', 'Agency Billing'],
      billingEmail: 'accounts@vectordynamics.example.com',
      balance: 3_250,
      creditBalance: 0,
      autoRecharge: true,
      paymentHistory: [
        { id: 'pay-4001', amount: 1_500, currency: 'GBP', method: 'Stripe', status: 'paid', billedAt: '2026-07-20', description: 'Course enrolment campaign — computational methods', campaignId: 'cam-course-enrolment', invoiceNumber: 'INV-2026-0099' },
      ],
    },
    advertisementLibrary: ['cr-software-course', 'cr-equipment-banner'],
    verificationStatus: 'Verified',
    trustScore: 86,
    analytics: {
      totalCampaigns: 1,
      activeCampaigns: 0,
      totalSpend: 1_500,
      totalImpressions: 2_400_000,
      totalClicks: 24_000,
      totalConversions: 640,
      averageCtr: 1.0,
      averageCpc: 0.95,
      averageCpa: 33.1,
      lifetimeValue: 2_100,
    },
    joinedAt: '2026-03-09',
    tags: ['industry', 'software', 'lab-supplier', 'organization', 'external'],
  },
];

// ---------------------------------------------------------------------------
// Creatives
// ---------------------------------------------------------------------------

export const AD_CREATIVES: AdCreative[] = [
  {
    id: 'cr-paper-headline',
    name: 'Paper promotion — headline card',
    headline: 'Introducing a 50-language multilingual parsing framework',
    primaryText: 'Read the full research paper behind the Multilingual Parsing Framework and explore the open dataset.',
    callToAction: 'Read the paper',
    format: 'sponsored-post',
    promotedObjectId: 'promo-publication-0',
    label: 'Sponsored',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-profile-visibility',
    name: 'Profile visibility — native recommendation',
    headline: 'Follow Dr. Kofi Mensah on Scholatia',
    primaryText: 'Computational linguist at the University of Accra. Multilingual NLP, dependency parsing, transfer learning.',
    callToAction: 'Follow profile',
    format: 'sponsored-recommendation',
    promotedObjectId: 'promo-researcher-ojuri',
    label: 'Recommended For You',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-journal-launch',
    name: 'Journal launch — submissions objective',
    headline: 'Now accepting submissions: Journal of Open Research',
    primaryText: 'Submit your open research article to a Diamond open-access venue with transparent peer review.',
    callToAction: 'Submit manuscript',
    format: 'sponsored-journal',
    promotedObjectId: 'promo-journal-scholatia-open-research',
    label: 'Sponsored Journal',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-journal-banner',
    name: 'Journal homepage banner',
    headline: 'Diamond Open Access. Transparent Review. Global Reach.',
    primaryText: 'Scholatia Open Research Press journals indexed in DOAJ and Crossref.',
    callToAction: 'Explore journals',
    format: 'homepage-banner',
    promotedObjectId: 'promo-publisher-scholatia-press',
    label: 'Featured',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-conference-native',
    name: 'Conference registration — native card',
    headline: 'Join the 2026 Multilingual NLP Symposium',
    primaryText: 'Register before the early-bird deadline and present your latest work to a global audience.',
    callToAction: 'Register now',
    format: 'native-advertisement',
    promotedObjectId: 'promo-conference-multilingual-nlp',
    label: 'Sponsored Conference',
    status: 'paused',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-funding-call',
    name: 'Funding call — early-career researchers',
    headline: 'Pan-African Scholars Programme now open',
    primaryText: 'Up to $40,000 for early-career researchers across Africa. Apply by the October deadline.',
    callToAction: 'Apply now',
    format: 'featured-funding',
    promotedObjectId: 'promo-funding-fp-001',
    label: 'Recommended',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-scholarship-native',
    name: 'Scholarship — native recommendation',
    headline: 'Doctoral scholarships for African NLP research',
    primaryText: 'Fully funded doctoral scholarships with mentorship, travel, and conference support.',
    callToAction: 'Learn more',
    format: 'sponsored-recommendation',
    promotedObjectId: 'promo-funding-fp-004',
    label: 'Suggested',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-software-course',
    name: 'Software course enrolment',
    headline: 'Master computational research methods',
    primaryText: 'VectorDynamics certified course for researchers — reproducibility, automation, and scale.',
    callToAction: 'Enrol now',
    format: 'featured-software-tool',
    promotedObjectId: 'promo-project-multilingual-parsing-framework',
    label: 'Promoted',
    status: 'in-review',
    reviewStatus: 'pending',
  },
  {
    id: 'cr-equipment-banner',
    name: 'Lab equipment banner',
    headline: 'Automate your lab with VectorDynamics',
    primaryText: 'Reliable lab automation and scientific software trusted by 400+ research institutions.',
    callToAction: 'Request a demo',
    format: 'sidebar-advertisement',
    promotedObjectId: 'promo-institution-vector-labs',
    label: 'Sponsored',
    status: 'active',
    reviewStatus: 'approved',
  },
  {
    id: 'cr-video-ai-tool',
    name: 'AI research assistant — video (future-ready)',
    headline: 'Meet ScholarAI — your research copilot',
    primaryText: 'AI tool that summarizes literature, drafts reviews, and finds collaborators. Video coming soon.',
    callToAction: 'Watch video',
    format: 'video-advertisement',
    promotedObjectId: 'promo-ai-tool-scholarai',
    label: 'AI Recommendation',
    status: 'in-review',
    reviewStatus: 'pending',
  },
];

// ---------------------------------------------------------------------------
// Ad sets & campaigns
// ---------------------------------------------------------------------------

const USD = { currency: 'USD' } as const;

export const AD_SETS: AdSet[] = [
  {
    id: 'set-paper-reach',
    name: 'Paper promotion — NLP researchers',
    campaignId: 'cam-paper-promotion',
    audienceId: 'aud-nlp-researchers',
    placements: ['home-feed', 'research-feed', 'ai-recommendations', 'weekly-digests'],
    pricingModel: 'CPC',
    bidAmount: 0.9,
    ...USD,
    budget: { total: 400, currency: 'USD', mode: 'lifetime', spent: 218 },
    schedule: { startDate: '2026-07-01', endDate: '2026-08-15', timezone: 'UTC' },
    status: 'active',
    creatives: ['cr-paper-headline'],
  },
  {
    id: 'set-profile-visibility',
    name: 'Profile visibility — African early-career',
    campaignId: 'cam-profile-visibility',
    audienceId: 'aud-african-early-career',
    placements: ['researcher-profiles', 'sidebar-cards', 'trending-widgets'],
    pricingModel: 'CPM',
    bidAmount: 6,
    ...USD,
    budget: { total: 250, currency: 'USD', mode: 'lifetime', spent: 102 },
    schedule: { startDate: '2026-07-10', endDate: '2026-08-10', timezone: 'UTC' },
    status: 'active',
    creatives: ['cr-profile-visibility'],
  },
  {
    id: 'set-journal-submissions',
    name: 'Journal launch — global submissions',
    campaignId: 'cam-journal-launch',
    audienceId: 'aud-open-science',
    placements: ['journal-pages', 'search-results', 'email-newsletters', 'weekly-digests'],
    pricingModel: 'CPR',
    bidAmount: 14,
    ...USD,
    budget: { total: 1_800, currency: 'USD', mode: 'daily', dailyCap: 60, spent: 1_140 },
    schedule: { startDate: '2026-06-25', endDate: '2026-08-31', timezone: 'UTC' },
    status: 'active',
    creatives: ['cr-journal-launch'],
  },
  {
    id: 'set-publisher-brand',
    name: 'Publisher branding — institutional',
    campaignId: 'cam-publisher-brand',
    audienceId: 'aud-hei-leadership',
    placements: ['top-banners', 'featured-carousel', 'institution-pages'],
    pricingModel: 'CPM',
    bidAmount: 8,
    ...USD,
    budget: { total: 1_200, currency: 'USD', mode: 'fixed-package', spent: 1_200 },
    schedule: { startDate: '2026-06-01', endDate: '2026-07-31', timezone: 'UTC' },
    status: 'completed',
    creatives: ['cr-journal-banner'],
  },
  {
    id: 'set-conference-registration',
    name: 'Conference registration — postdocs',
    campaignId: 'cam-conference-registration',
    audienceId: 'aud-global-postdocs',
    placements: ['conference-pages', 'email-newsletters', 'push-notifications'],
    pricingModel: 'CPR',
    bidAmount: 18,
    ...USD,
    budget: { total: 900, currency: 'USD', mode: 'lifetime', spent: 420 },
    schedule: { startDate: '2026-07-05', endDate: '2026-08-20', timezone: 'UTC' },
    status: 'paused',
    creatives: ['cr-conference-native'],
  },
  {
    id: 'set-funding-call',
    name: 'Funding call — African early-career',
    campaignId: 'cam-funding-call',
    audienceId: 'aud-african-early-career',
    placements: ['funding-page', 'email-newsletters', 'ai-recommendations'],
    pricingModel: 'CPL',
    bidAmount: 2.5,
    ...USD,
    budget: { total: 1_200, currency: 'USD', mode: 'lifetime', spent: 690 },
    schedule: { startDate: '2026-07-01', endDate: '2026-09-30', timezone: 'UTC' },
    status: 'active',
    creatives: ['cr-funding-call', 'cr-scholarship-native'],
  },
  {
    id: 'set-course-enrolment',
    name: 'Course enrolment — research software',
    campaignId: 'cam-course-enrolment',
    audienceId: 'aud-biomedical-data',
    placements: ['marketplace', 'recommendation-panels', 'search-results'],
    pricingModel: 'CPC',
    bidAmount: 1.1,
    ...USD,
    budget: { total: 1_500, currency: 'USD', mode: 'daily', dailyCap: 50, spent: 0 },
    schedule: { startDate: '2026-08-01', endDate: '2026-09-15', timezone: 'UTC' },
    status: 'in-review',
    creatives: ['cr-software-course'],
  },
  {
    id: 'set-ai-tool',
    name: 'AI research assistant — video (future-ready)',
    campaignId: 'cam-ai-tool',
    audienceId: 'aud-nlp-researchers',
    placements: ['ai-recommendations', 'top-banners', 'featured-carousel'],
    pricingModel: 'CPM',
    bidAmount: 10,
    ...USD,
    budget: { total: 2_000, currency: 'USD', mode: 'premium-bundle', spent: 0 },
    schedule: { startDate: '2026-08-15', endDate: '2026-10-31', timezone: 'UTC' },
    status: 'in-review',
    creatives: ['cr-video-ai-tool'],
  },
];

export const AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'cam-paper-promotion',
    name: 'Multilingual Parsing Framework — paper promotion',
    advertiserId: 'adv-scholar-profile',
    objective: 'citation-growth',
    status: 'active',
    adSets: ['set-paper-reach'],
    createdAt: '2026-06-28',
    updatedAt: '2026-07-25',
  },
  {
    id: 'cam-profile-visibility',
    name: 'Profile visibility — follow campaign',
    advertiserId: 'adv-scholar-profile',
    objective: 'profile-visibility',
    status: 'active',
    adSets: ['set-profile-visibility'],
    createdAt: '2026-07-06',
    updatedAt: '2026-07-25',
  },
  {
    id: 'cam-journal-launch',
    name: 'Journal of Open Research — launch',
    advertiserId: 'adv-scholatia-open-research-press',
    objective: 'journal-submissions',
    status: 'active',
    adSets: ['set-journal-submissions'],
    createdAt: '2026-06-20',
    updatedAt: '2026-07-28',
  },
  {
    id: 'cam-publisher-brand',
    name: 'Press branding — institutional leaders',
    advertiserId: 'adv-scholatia-open-research-press',
    objective: 'publisher-branding',
    status: 'completed',
    adSets: ['set-publisher-brand'],
    createdAt: '2026-05-28',
    updatedAt: '2026-07-31',
  },
  {
    id: 'cam-conference-registration',
    name: 'Multilingual NLP Symposium — registration',
    advertiserId: 'adv-scholatia-open-research-press',
    objective: 'conference-registration',
    status: 'paused',
    adSets: ['set-conference-registration'],
    createdAt: '2026-07-02',
    updatedAt: '2026-07-18',
  },
  {
    id: 'cam-funding-call',
    name: 'Pan-African Scholars Programme',
    advertiserId: 'adv-pan-african-research-foundation',
    objective: 'funding-call-promotion',
    status: 'active',
    adSets: ['set-funding-call'],
    createdAt: '2026-06-24',
    updatedAt: '2026-07-26',
  },
  {
    id: 'cam-course-enrolment',
    name: 'Computational research methods — enrolment',
    advertiserId: 'adv-vectordynamics-labs',
    objective: 'course-enrolment',
    status: 'in-review',
    adSets: ['set-course-enrolment'],
    createdAt: '2026-07-28',
    updatedAt: '2026-07-28',
  },
  {
    id: 'cam-ai-tool',
    name: 'ScholarAI — video campaign (future-ready)',
    advertiserId: 'adv-vectordynamics-labs',
    objective: 'awareness',
    status: 'in-review',
    adSets: ['set-ai-tool'],
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
];

// ---------------------------------------------------------------------------
// Placements
// ---------------------------------------------------------------------------

const placement = (input: {
  id: string;
  placement: AdPlacement;
  adSetId?: string;
  creativeId?: string;
  label: SponsoredLabel;
  priority: number;
  status: SponsoredPlacement['status'];
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}): SponsoredPlacement => ({ ...input, currency: 'USD' });

export const SPONSORED_PLACEMENTS: SponsoredPlacement[] = [
  placement({ id: 'plc-home-journal', placement: 'home-feed', adSetId: 'set-journal-submissions', creativeId: 'cr-journal-launch', label: 'Sponsored Journal', priority: 92, status: 'live', startDate: '2026-06-25', endDate: '2026-08-31', impressions: 1_240_000, clicks: 18_600, conversions: 540, spend: 486 }),
  placement({ id: 'plc-home-paper', placement: 'home-feed', adSetId: 'set-paper-reach', creativeId: 'cr-paper-headline', label: 'Sponsored', priority: 88, status: 'live', startDate: '2026-07-01', endDate: '2026-08-15', impressions: 620_000, clicks: 11_160, conversions: 340, spend: 218 }),
  placement({ id: 'plc-research-paper', placement: 'research-feed', adSetId: 'set-paper-reach', creativeId: 'cr-paper-headline', label: 'Promoted', priority: 85, status: 'live', startDate: '2026-07-01', endDate: '2026-08-15', impressions: 410_000, clicks: 7_380, conversions: 210, spend: 144 }),
  placement({ id: 'plc-journal-submit', placement: 'journal-pages', adSetId: 'set-journal-submissions', creativeId: 'cr-journal-launch', label: 'Sponsored Journal', priority: 95, status: 'live', startDate: '2026-06-25', endDate: '2026-08-31', impressions: 880_000, clicks: 14_960, conversions: 420, spend: 391 }),
  placement({ id: 'plc-funding-call', placement: 'funding-page', adSetId: 'set-funding-call', creativeId: 'cr-funding-call', label: 'Recommended', priority: 90, status: 'live', startDate: '2026-07-01', endDate: '2026-09-30', impressions: 730_000, clicks: 10_220, conversions: 380, spend: 512 }),
  placement({ id: 'plc-funding-newsletter', placement: 'email-newsletters', adSetId: 'set-funding-call', creativeId: 'cr-scholarship-native', label: 'Suggested', priority: 82, status: 'live', startDate: '2026-07-08', endDate: '2026-09-30', impressions: 145_000, clicks: 2_900, conversions: 110, spend: 178 }),
  placement({ id: 'plc-discover-profile', placement: 'discovery', adSetId: 'set-profile-visibility', creativeId: 'cr-profile-visibility', label: 'Recommended For You', priority: 78, status: 'live', startDate: '2026-07-10', endDate: '2026-08-10', impressions: 240_000, clicks: 3_360, conversions: 150, spend: 102 }),
  placement({ id: 'plc-ai-paper', placement: 'ai-recommendations', adSetId: 'set-paper-reach', creativeId: 'cr-paper-headline', label: 'AI Recommendation', priority: 94, status: 'live', startDate: '2026-07-01', endDate: '2026-08-15', impressions: 380_000, clicks: 6_840, conversions: 190, spend: 133 }),
  placement({ id: 'plc-banner-publisher', placement: 'top-banners', adSetId: 'set-publisher-brand', creativeId: 'cr-journal-banner', label: 'Featured', priority: 70, status: 'ended', startDate: '2026-06-01', endDate: '2026-07-31', impressions: 2_300_000, clicks: 20_700, conversions: 480, spend: 1_200 }),
  placement({ id: 'plc-conference-post', placement: 'conference-pages', adSetId: 'set-conference-registration', creativeId: 'cr-conference-native', label: 'Sponsored Conference', priority: 86, status: 'paused', startDate: '2026-07-05', endDate: '2026-08-20', impressions: 560_000, clicks: 8_960, conversions: 240, spend: 420 }),
  placement({ id: 'plc-carousel-publisher', placement: 'featured-carousel', adSetId: 'set-publisher-brand', creativeId: 'cr-journal-banner', label: 'Editor\'s Choice', priority: 74, status: 'ended', startDate: '2026-06-15', endDate: '2026-07-31', impressions: 1_050_000, clicks: 9_450, conversions: 210, spend: 620 }),
  placement({ id: 'plc-sidebar-profile', placement: 'sidebar-cards', adSetId: 'set-profile-visibility', creativeId: 'cr-profile-visibility', label: 'Popular Near You', priority: 80, status: 'live', startDate: '2026-07-10', endDate: '2026-08-10', impressions: 310_000, clicks: 4_030, conversions: 160, spend: 118 }),
];

// ---------------------------------------------------------------------------
// AI forecasts
// ---------------------------------------------------------------------------

const FORECAST_PROFILE: AdTargetProfile = {
  id: 'profile-focus',
  name: 'Focus researcher (Dr. Kofi Mensah)',
  country: 'Ghana',
  institution: RESEARCHERS[0].position.institution,
  faculty: RESEARCHERS[0].position.faculty,
  disciplines: [RESEARCHERS[0].position.faculty, ...RESEARCHERS[0].researchAreas.map((area) => area.name)],
  researchInterests: RESEARCHERS[0].interests.map((interest) => interest.name),
  researchKeywords: researcherKeywords(RESEARCHERS[0]),
  academicRank: 'Research Scientist',
  careerStage: 'mid-career',
  languages: ['English', 'French'],
  sector: 'education',
  researchLifecycleStages: ['manuscript', 'submission', 'publication', 'conference', 'citation'],
  signals: {
    hasPublications: true,
    hasGrants: true,
    attendedConferences: true,
    hasInstitutionAffiliation: true,
    hasOrcidProfile: true,
    journalReadership: [],
    citationLevel: 'medium',
    hIndex: 18,
    totalCitations: 2_340,
  },
};

export const AD_FORECASTS: AdForecast[] = [
  forecastCampaign({
    objective: 'citation-growth',
    audiences: AD_AUDIENCES,
    adSets: AD_SETS.filter((set) => set.campaignId === 'cam-paper-promotion'),
    creatives: AD_CREATIVES.filter((creative) => creative.promotedObjectId === 'promo-publication-0'),
    promotedObjects: PROMOTABLE_OBJECTS,
    currency: 'USD',
    promotedObjectId: 'promo-publication-0',
    profile: FORECAST_PROFILE,
    campaignId: 'cam-paper-promotion',
  }),
  forecastCampaign({
    objective: 'journal-submissions',
    audiences: AD_AUDIENCES,
    adSets: AD_SETS.filter((set) => set.campaignId === 'cam-journal-launch'),
    creatives: AD_CREATIVES.filter((creative) => creative.promotedObjectId === 'promo-journal-scholatia-open-research'),
    promotedObjects: PROMOTABLE_OBJECTS,
    currency: 'USD',
    promotedObjectId: 'promo-journal-scholatia-open-research',
    profile: FORECAST_PROFILE,
    campaignId: 'cam-journal-launch',
  }),
  forecastCampaign({
    objective: 'funding-call-promotion',
    audiences: AD_AUDIENCES,
    adSets: AD_SETS.filter((set) => set.campaignId === 'cam-funding-call'),
    creatives: AD_CREATIVES.filter((creative) => creative.promotedObjectId === 'promo-funding-fp-001'),
    promotedObjects: PROMOTABLE_OBJECTS,
    currency: 'USD',
    promotedObjectId: 'promo-funding-fp-001',
    profile: FORECAST_PROFILE,
    campaignId: 'cam-funding-call',
  }),
];

// ---------------------------------------------------------------------------
// Fraud signals
// ---------------------------------------------------------------------------

export const AD_FRAUD_SIGNALS: AdFraudSignal[] = [
  ...detectFraudSignals({
    campaignId: 'cam-paper-promotion',
    advertiserId: 'adv-scholar-profile',
    clicks: 18_600,
    impressions: 1_240_000,
    conversions: 720,
    suspiciousClicks: 860,
    suspiciousImpressions: 12_400,
    suspiciousConversions: 12,
    detectedAt: '2026-07-20',
  }),
  ...detectFraudSignals({
    campaignId: 'cam-journal-launch',
    advertiserId: 'adv-scholatia-open-research-press',
    clicks: 102_000,
    impressions: 8_900_000,
    conversions: 2_150,
    suspiciousClicks: 2_040,
    suspiciousImpressions: 44_500,
    suspiciousConversions: 0,
    detectedAt: '2026-07-22',
  }),
  ...detectFraudSignals({
    campaignId: 'cam-funding-call',
    advertiserId: 'adv-pan-african-research-foundation',
    clicks: 31_000,
    impressions: 3_100_000,
    conversions: 1_080,
    suspiciousClicks: 6_200,
    suspiciousImpressions: 310_000,
    suspiciousConversions: 40,
    detectedAt: '2026-07-24',
  }),
];

// ---------------------------------------------------------------------------
// Review queue
// ---------------------------------------------------------------------------

export const AD_REVIEW_QUEUE: AdReviewRecord[] = [
  {
    id: 'rev-0001',
    targetId: 'cr-software-course',
    targetKind: 'creative',
    checks: ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'needs-review',
    notes: 'AI moderation flags commercial claims; academic integrity check passed. Manual review required.',
    createdAt: '2026-07-28',
  },
  {
    id: 'rev-0002',
    targetId: 'cr-video-ai-tool',
    targetKind: 'creative',
    checks: ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'pending',
    createdAt: '2026-07-29',
  },
  {
    id: 'rev-0003',
    targetId: 'cam-course-enrolment',
    targetKind: 'campaign',
    checks: ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'needs-review',
    notes: 'Budget cap 2x daily average; flagged for approval.',
    createdAt: '2026-07-29',
  },
  {
    id: 'rev-0004',
    targetId: 'cr-paper-headline',
    targetKind: 'creative',
    checks: ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'approved',
    decidedBy: 'platform-reviewer',
    decidedAt: '2026-06-30',
    notes: 'All checks cleared; academic integrity verified against the source DOI.',
    createdAt: '2026-06-28',
  },
  {
    id: 'rev-0005',
    targetId: 'cr-funding-call',
    targetKind: 'creative',
    checks: ['manual-moderation', 'ai-moderation', 'academic-integrity', 'spam-detection', 'fraud-detection'],
    status: 'approved',
    decidedBy: 'platform-reviewer',
    decidedAt: '2026-06-26',
    notes: 'Funding call verified against the agency programme record.',
    createdAt: '2026-06-24',
  },
];

// ---------------------------------------------------------------------------
// Campaign analytics
// ---------------------------------------------------------------------------

const campaignMetrics = (campaignId: string, campaignName: string, input: Parameters<typeof aggregateMetrics>[0]): AdCampaignAnalytics => {
  const metrics = aggregateMetrics(input);
  const funnel = buildFunnel(input);
  const timeOfDay = Array.from({ length: 24 }, (_, hour) => {
    const share = 0.02 + 0.07 * Math.exp(-Math.pow(hour - 14, 2) / 24);
    return { hour, impressions: Math.round(input.impressions * share), clicks: Math.round(input.clicks * share), conversions: Math.round(input.conversions * share), spend: Math.round(input.spend * share) };
  });
  const deviceSplit = (index: number) => Math.max(1, Math.round(input.impressions * index));
  const devices: AdCampaignAnalytics['devices'] = [
    { device: 'Desktop', impressions: deviceSplit(0.48), clicks: Math.round(input.clicks * 0.52), conversions: Math.round(input.conversions * 0.55), ctr: 0 },
    { device: 'Laptop', impressions: deviceSplit(0.22), clicks: Math.round(input.clicks * 0.24), conversions: Math.round(input.conversions * 0.22), ctr: 0 },
    { device: 'Tablet', impressions: deviceSplit(0.1), clicks: Math.round(input.clicks * 0.09), conversions: Math.round(input.conversions * 0.08), ctr: 0 },
    { device: 'Mobile', impressions: deviceSplit(0.2), clicks: Math.round(input.clicks * 0.15), conversions: Math.round(input.conversions * 0.15), ctr: 0 },
  ];
  for (const device of devices) {
    device.ctr = Math.round((device.clicks / device.impressions) * 10000) / 100;
  }
  const referrals: AdCampaignAnalytics['referrals'] = [
    { source: 'Home feed', impressions: Math.round(input.impressions * 0.35), clicks: Math.round(input.clicks * 0.38), conversions: Math.round(input.conversions * 0.36) },
    { source: 'Discovery', impressions: Math.round(input.impressions * 0.22), clicks: Math.round(input.clicks * 0.24), conversions: Math.round(input.conversions * 0.25) },
    { source: 'AI recommendations', impressions: Math.round(input.impressions * 0.18), clicks: Math.round(input.clicks * 0.2), conversions: Math.round(input.conversions * 0.22) },
    { source: 'Email newsletters', impressions: Math.round(input.impressions * 0.12), clicks: Math.round(input.clicks * 0.1), conversions: Math.round(input.conversions * 0.11) },
    { source: 'Direct / other', impressions: Math.round(input.impressions * 0.13), clicks: Math.round(input.clicks * 0.08), conversions: Math.round(input.conversions * 0.06) },
  ];
  const geography: AdCampaignAnalytics['geography'] = [
    { country: 'United Kingdom', impressions: Math.round(input.impressions * 0.24), clicks: Math.round(input.clicks * 0.26), conversions: Math.round(input.conversions * 0.28), spend: Math.round(input.spend * 0.26) },
    { country: 'Netherlands', impressions: Math.round(input.impressions * 0.16), clicks: Math.round(input.clicks * 0.18), conversions: Math.round(input.conversions * 0.19), spend: Math.round(input.spend * 0.18) },
    { country: 'Germany', impressions: Math.round(input.impressions * 0.15), clicks: Math.round(input.clicks * 0.16), conversions: Math.round(input.conversions * 0.16), spend: Math.round(input.spend * 0.16) },
    { country: 'Nigeria', impressions: Math.round(input.impressions * 0.14), clicks: Math.round(input.clicks * 0.13), conversions: Math.round(input.conversions * 0.12), spend: Math.round(input.spend * 0.13) },
    { country: 'Kenya', impressions: Math.round(input.impressions * 0.09), clicks: Math.round(input.clicks * 0.08), conversions: Math.round(input.conversions * 0.08), spend: Math.round(input.spend * 0.08) },
    { country: 'South Africa', impressions: Math.round(input.impressions * 0.08), clicks: Math.round(input.clicks * 0.07), conversions: Math.round(input.conversions * 0.07), spend: Math.round(input.spend * 0.07) },
    { country: 'Other', impressions: Math.round(input.impressions * 0.14), clicks: Math.round(input.clicks * 0.12), conversions: Math.round(input.conversions * 0.1), spend: Math.round(input.spend * 0.12) },
  ];
  const disciplines: AdCampaignAnalytics['disciplines'] = [
    { discipline: 'Computational Linguistics', impressions: Math.round(input.impressions * 0.32), clicks: Math.round(input.clicks * 0.34), conversions: Math.round(input.conversions * 0.36) },
    { discipline: 'Computer Science', impressions: Math.round(input.impressions * 0.24), clicks: Math.round(input.clicks * 0.25), conversions: Math.round(input.conversions * 0.25) },
    { discipline: 'Biomedical Data Science', impressions: Math.round(input.impressions * 0.18), clicks: Math.round(input.clicks * 0.16), conversions: Math.round(input.conversions * 0.14) },
    { discipline: 'Higher Education', impressions: Math.round(input.impressions * 0.12), clicks: Math.round(input.clicks * 0.11), conversions: Math.round(input.conversions * 0.11) },
    { discipline: 'Other', impressions: Math.round(input.impressions * 0.14), clicks: Math.round(input.clicks * 0.14), conversions: Math.round(input.conversions * 0.14) },
  ];
  const demographics: AdCampaignAnalytics['demographics'] = [
    { label: 'Postdoctoral researchers', impressions: Math.round(input.impressions * 0.26), reach: Math.round(input.impressions * 0.2), clicks: Math.round(input.clicks * 0.28) },
    { label: 'Doctoral candidates', impressions: Math.round(input.impressions * 0.22), reach: Math.round(input.impressions * 0.17), clicks: Math.round(input.clicks * 0.24) },
    { label: 'Early-career faculty', impressions: Math.round(input.impressions * 0.18), reach: Math.round(input.impressions * 0.14), clicks: Math.round(input.clicks * 0.18) },
    { label: 'Senior faculty', impressions: Math.round(input.impressions * 0.14), reach: Math.round(input.impressions * 0.11), clicks: Math.round(input.clicks * 0.12) },
    { label: 'Industry researchers', impressions: Math.round(input.impressions * 0.12), reach: Math.round(input.impressions * 0.09), clicks: Math.round(input.clicks * 0.1) },
    { label: 'Students', impressions: Math.round(input.impressions * 0.08), reach: Math.round(input.impressions * 0.06), clicks: Math.round(input.clicks * 0.08) },
  ];
  const budgetUtilization = input.spend > 0 ? Math.min(100, Math.round((input.spend / (input.spend * 1.6)) * 100)) : 0;
  const heatMap: AdCampaignAnalytics['heatMap'] = [
    { placement: 'home-feed', impressions: Math.round(input.impressions * 0.3), clicks: Math.round(input.clicks * 0.32), ctr: 0 },
    { placement: 'research-feed', impressions: Math.round(input.impressions * 0.18), clicks: Math.round(input.clicks * 0.2), ctr: 0 },
    { placement: 'journal-pages', impressions: Math.round(input.impressions * 0.2), clicks: Math.round(input.clicks * 0.19), ctr: 0 },
    { placement: 'ai-recommendations', impressions: Math.round(input.impressions * 0.14), clicks: Math.round(input.clicks * 0.16), ctr: 0 },
    { placement: 'email-newsletters', impressions: Math.round(input.impressions * 0.1), clicks: Math.round(input.clicks * 0.08), ctr: 0 },
    { placement: 'sidebar-cards', impressions: Math.round(input.impressions * 0.08), clicks: Math.round(input.clicks * 0.05), ctr: 0 },
  ];
  for (const point of heatMap) {
    point.ctr = Math.round((point.clicks / point.impressions) * 10000) / 100;
  }
  return {
    campaignId,
    campaignName,
    metrics,
    funnel,
    demographics,
    geography,
    disciplines,
    timeOfDay,
    devices,
    referrals,
    heatMap,
    budgetUtilization,
  };
};

export const AD_CAMPAIGN_ANALYTICS: AdCampaignAnalytics[] = [
  campaignMetrics('cam-paper-promotion', 'Multilingual Parsing Framework — paper promotion', {
    impressions: 1_240_000,
    reach: 92_000,
    clicks: 18_600,
    conversions: 720,
    engagement: 4_200,
    downloads: 310,
    registrations: 120,
    submissions: 96,
    bookmarks: 640,
    followersGained: 380,
    citationIncrease: 24,
    profileVisits: 1_900,
    bookPurchases: 0,
    grantApplications: 42,
    leads: 210,
    spend: 218,
    revenue: 640,
  }),
  campaignMetrics('cam-profile-visibility', 'Profile visibility — follow campaign', {
    impressions: 550_000,
    reach: 46_000,
    clicks: 7_390,
    conversions: 310,
    engagement: 1_800,
    downloads: 0,
    registrations: 0,
    submissions: 0,
    bookmarks: 0,
    followersGained: 420,
    citationIncrease: 0,
    profileVisits: 2_100,
    bookPurchases: 0,
    grantApplications: 0,
    leads: 0,
    spend: 220,
    revenue: 340,
  }),
  campaignMetrics('cam-journal-launch', 'Journal of Open Research — launch', {
    impressions: 2_120_000,
    reach: 180_000,
    clicks: 33_600,
    conversions: 960,
    engagement: 7_800,
    downloads: 0,
    registrations: 0,
    submissions: 610,
    bookmarks: 1_100,
    followersGained: 0,
    citationIncrease: 0,
    profileVisits: 0,
    bookPurchases: 0,
    grantApplications: 0,
    leads: 0,
    spend: 877,
    revenue: 2_450,
  }),
  campaignMetrics('cam-publisher-brand', 'Press branding — institutional leaders', {
    impressions: 3_350_000,
    reach: 240_000,
    clicks: 30_150,
    conversions: 690,
    engagement: 5_400,
    downloads: 0,
    registrations: 0,
    submissions: 0,
    bookmarks: 0,
    followersGained: 520,
    citationIncrease: 0,
    profileVisits: 0,
    bookPurchases: 0,
    grantApplications: 0,
    leads: 210,
    spend: 1_820,
    revenue: 2_600,
  }),
  campaignMetrics('cam-conference-registration', 'Multilingual NLP Symposium — registration', {
    impressions: 560_000,
    reach: 41_000,
    clicks: 8_960,
    conversions: 240,
    engagement: 2_100,
    downloads: 0,
    registrations: 180,
    submissions: 0,
    bookmarks: 0,
    followersGained: 0,
    citationIncrease: 0,
    profileVisits: 0,
    bookPurchases: 0,
    grantApplications: 0,
    leads: 0,
    spend: 420,
    revenue: 1_080,
  }),
  campaignMetrics('cam-funding-call', 'Pan-African Scholars Programme', {
    impressions: 875_000,
    reach: 64_000,
    clicks: 13_120,
    conversions: 490,
    engagement: 3_400,
    downloads: 0,
    registrations: 0,
    submissions: 0,
    bookmarks: 0,
    followersGained: 0,
    citationIncrease: 0,
    profileVisits: 0,
    bookPurchases: 0,
    grantApplications: 310,
    leads: 410,
    spend: 690,
    revenue: 2_800,
  }),
];

// ---------------------------------------------------------------------------
// Aggregate statistics, analytics & portfolio
// ---------------------------------------------------------------------------

export const AD_STATISTICS: AdvertisingStatistics = computeAdvertisingStatistics({
  campaigns: AD_CAMPAIGNS,
  advertisers: ADVERTISERS,
  promotableObjects: PROMOTABLE_OBJECTS,
  audiences: AD_AUDIENCES,
  placements: SPONSORED_PLACEMENTS,
  campaignAnalytics: AD_CAMPAIGN_ANALYTICS,
  fraudSignals: AD_FRAUD_SIGNALS,
  reviewQueue: AD_REVIEW_QUEUE,
  forecasts: AD_FORECASTS,
});

export const AD_ANALYTICS: AdvertisingAnalytics = computeAdvertisingAnalytics({
  campaigns: AD_CAMPAIGNS,
  placements: SPONSORED_PLACEMENTS,
  campaignAnalytics: AD_CAMPAIGN_ANALYTICS,
  audiences: AD_AUDIENCES,
});

export const FEATURED_CAMPAIGN = AD_CAMPAIGNS.find((campaign) => campaign.id === 'cam-journal-launch') ?? AD_CAMPAIGNS[0];
export const FEATURED_CAMPAIGN_ANALYTICS = AD_CAMPAIGN_ANALYTICS.find((analytics) => analytics.campaignId === FEATURED_CAMPAIGN.id) ?? AD_CAMPAIGN_ANALYTICS[0];
export const FEATURED_FORECAST = AD_FORECASTS[0];
export const FEATURED_ADVERTISER = ADVERTISERS[1];
export const FEATURED_PLACEMENT = SPONSORED_PLACEMENTS.find((placement) => placement.status === 'live') ?? SPONSORED_PLACEMENTS[0];

export const ADVERTISING_PORTFOLIO: AdvertisingPortfolio = {
  statistics: AD_STATISTICS,
  analytics: AD_ANALYTICS,
  promotableObjects: PROMOTABLE_OBJECTS,
  advertisers: ADVERTISERS,
  campaigns: AD_CAMPAIGNS,
  adSets: AD_SETS,
  creatives: AD_CREATIVES,
  audiences: AD_AUDIENCES,
  customAudiences: CUSTOM_AUDIENCES,
  lookalikeAudiences: LOOKALIKE_AUDIENCES,
  retargetingAudiences: RETARGETING_AUDIENCES,
  placements: SPONSORED_PLACEMENTS,
  forecasts: AD_FORECASTS,
  fraudSignals: AD_FRAUD_SIGNALS,
  reviewQueue: AD_REVIEW_QUEUE,
  campaignAnalytics: AD_CAMPAIGN_ANALYTICS,
};
