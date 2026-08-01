import type {
  DiscoveryAnalytics,
  DiscoveryCategory,
  DiscoveryCollection,
  DiscoveryEntityType,
  DiscoveryFacet,
  DiscoveryItem,
  DiscoveryPortfolio,
  DiscoveryRanking,
  DiscoveryRelationship,
  DiscoveryStatistics,
  DiscoverySuggestion,
  DiscoveryTimelineEntry,
} from '@/types/discovery';
import type { ResearchLifecycleStageId } from '@/types/research';
import type { JournalProfile } from '@/types/identity';
import type { Institution } from '@/types/institution';
import type { Publisher } from '@/types/publisher';
import type { WorkspaceProject } from '@/constants/placeholder-research';
import type { PublicationEntry } from '@/constants/placeholder-profile';
import type { Dataset } from '@/types/dataset';
import type { Manuscript } from '@/types/manuscript';
import type { FundingOpportunity } from '@/types/funding';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { PUBLISHERS } from '@/constants/placeholder-publishers';
import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS } from '@/constants/placeholder-research';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';

/**
 * The Scholarly Discovery layer of the Scholatia ecosystem.
 *
 * Discovery is the platform-wide search surface over every existing module. It
 * does NOT introduce a new lifecycle stage and does NOT own its own records;
 * instead it derives a single unified search index from the existing
 * Researchers, Journals, Conferences, Institutions, Publishers, Projects,
 * Publications, Datasets, Manuscripts, and Funding placeholder modules. Every
 * `DiscoveryItem` carries the original source identity (a SAID, a journal id,
 * a conference id, a DOI, a grant id) so the underlying record is never
 * duplicated.
 */

const COUNTRY_TO_CONTINENT: Record<string, string> = {
  'United Kingdom': 'Europe',
  'Netherlands': 'Europe',
  'Germany': 'Europe',
  'Switzerland': 'Europe',
  'Austria': 'Europe',
  'France': 'Europe',
  'Hungary': 'Europe',
  'Portugal': 'Europe',
  'European Union': 'Europe',
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Nigeria': 'Africa',
  'Ghana': 'Africa',
  'Kenya': 'Africa',
  'South Africa': 'Africa',
  'Uganda': 'Africa',
  'Tanzania': 'Africa',
  'Rwanda': 'Africa',
  'Senegal': 'Africa',
  'Zimbabwe': 'Africa',
  'C\u00f4te d\u2019Ivoire': 'Africa',
  'Japan': 'Asia',
  'China': 'Asia',
  'India': 'Asia',
  'South Korea': 'Asia',
  'Bangladesh': 'Asia',
  'Pakistan': 'Asia',
  'Singapore': 'Asia',
  'Argentina': 'South America',
  'Brazil': 'South America',
  'Chile': 'South America',
  'Colombia': 'South America',
  'Peru': 'South America',
};

function continentFor(country: string | undefined): string | undefined {
  if (!country) return undefined;
  return COUNTRY_TO_CONTINENT[country] ?? 'Global';
}

function yearOf(date: string | undefined): string | undefined {
  if (!date) return undefined;
  const match = date.match(/^(20\d{2}|\d{4})/);
  return match ? match[1] : undefined;
}

function journalLatestYear(journal: JournalProfile): string | undefined {
  const issueYears = journal.issues.map((issue) => issue.year).filter(Boolean);
  if (issueYears.length) {
    return issueYears.sort().pop();
  }
  const volumeYears = journal.volumes.map((volume) => volume.year).filter(Boolean);
  if (volumeYears.length) {
    return volumeYears.sort().pop();
  }
  return undefined;
}

function researcherItems(): DiscoveryItem[] {
  return RESEARCHERS.map((researcher) => {
    const keywords = Array.from(
      new Set([
        ...researcher.interests.flatMap((interest) => [interest.name, ...interest.keywords]),
        ...researcher.researchAreas.map((area) => area.name),
        ...researcher.skills.map((skill) => skill.name),
        ...(researcher.position.researchFocus ?? []),
      ])
    );
    return {
      id: `researcher-${researcher.username}`,
      entityType: 'researcher',
      sourceId: researcher.identity.said,
      title: researcher.displayName,
      summary: researcher.headline ?? `${researcher.position.title} at ${researcher.position.institution}`,
      description: researcher.biography.professionalSummary,
      keywords: keywords.slice(0, 12),
      discipline: researcher.position.faculty || researcher.interests[0]?.category,
      researchAreas: researcher.researchAreas.map((area) => area.name),
      authors: [researcher.displayName],
      organizations: [researcher.position.institution],
      country: researcher.country,
      continent: continentFor(researcher.country),
      year: yearOf(researcher.identity.memberSince),
      status: String(researcher.verification.verificationLevel),
      tags: researcher.interests.map((interest) => interest.name).slice(0, 6),
      score: researcher.verification.trustScore,
      url: `/researchers/${researcher.username}`,
      dateAdded: researcher.identity.memberSince,
    };
  });
}

function journalItems(): DiscoveryItem[] {
  return JOURNALS.map((journal) => {
    const latestYear = journalLatestYear(journal);
    return {
      id: `journal-${journal.journalId}`,
      entityType: 'journal',
      sourceId: journal.journalId,
      title: journal.journalTitle,
      summary: journal.aimsAndScope ?? journal.discipline ?? 'Peer-reviewed scholarly journal',
      description: journal.editorialPolicy,
      keywords: Array.from(
        new Set([
          ...journal.researchAreas,
          ...(journal.discipline ? [journal.discipline] : []),
          ...(journal.indexingServices ?? []),
          ...(journal.impactMetrics?.quartile ? [journal.impactMetrics.quartile] : []),
        ])
      ),
      discipline: journal.discipline,
      researchAreas: journal.researchAreas,
      organizations: [journal.publisher, journal.institution].filter((entry): entry is string => Boolean(entry)),
      country: journal.country,
      continent: continentFor(journal.country),
      year: latestYear,
      status: journal.openAccessStatus,
      tags: [journal.publicationType, journal.reviewModel].filter(Boolean),
      score: journal.trustScore,
      url: `/journals/${journal.journalId}`,
      dateAdded: latestYear ? `${latestYear}-01-01` : '2024-01-01',
      stageId: 'publication',
    };
  });
}

function conferenceItems(): DiscoveryItem[] {
  return CONFERENCES.map((conference) => ({
    id: `conference-${conference.conferenceId}`,
    entityType: 'conference',
    sourceId: conference.conferenceId,
    title: conference.title,
    summary: conference.theme ?? conference.description ?? 'Academic research conference',
    description: conference.description,
    keywords: Array.from(
      new Set([
        ...(conference.keywords ?? []),
        ...conference.researchAreas,
        ...(conference.eventType ? [conference.eventType] : []),
        ...(conference.theme ? [conference.theme] : []),
      ])
    ),
    discipline: conference.researchAreas[0],
    researchAreas: conference.researchAreas,
    organizations: [conference.institution, conference.venue].filter((entry): entry is string => Boolean(entry)),
    country: conference.country,
    continent: continentFor(conference.country),
    year: yearOf(conference.startDate),
    status: conference.registrationStatus,
    tags: [conference.eventType, conference.theme].filter((tag): tag is string => Boolean(tag)),
    score: conference.trustScore,
    url: `/conferences/${conference.conferenceId}`,
    dateAdded: conference.startDate ?? '2026-01-01',
    stageId: 'conference',
  }));
}

function institutionItems(): DiscoveryItem[] {
  return INSTITUTIONS.map((institution: Institution) => {
    const profile = institution.profile;
    return {
      id: `institution-${institution.said}`,
      entityType: 'institution',
      sourceId: institution.said,
      title: profile.institutionName,
      summary: profile.mission ?? profile.description ?? 'Research institution',
      description: profile.description,
      keywords: Array.from(new Set([...profile.researchAreas, ...profile.academicDisciplines, ...profile.faculties])),
      discipline: profile.academicDisciplines[0],
      researchAreas: profile.researchAreas,
      organizations: [profile.institutionName],
      country: institution.country,
      continent: continentFor(institution.country),
      year: profile.foundedYear ? String(profile.foundedYear) : undefined,
      status: profile.verificationStatus,
      tags: [profile.institutionType, profile.acronym].filter((tag): tag is string => Boolean(tag)),
      score: profile.trustScore,
      url: `/institutions/${institution.said}`,
      dateAdded: profile.foundedYear ? `${profile.foundedYear}-01-01` : '2024-01-01',
    };
  });
}

function publisherItems(): DiscoveryItem[] {
  return PUBLISHERS.map((publisher: Publisher) => {
    const journalDisciplines = publisher.journals
      .map((ref) => ref.discipline)
      .filter((discipline): discipline is string => Boolean(discipline));
    return {
      id: `publisher-${publisher.id}`,
      entityType: 'publisher',
      sourceId: publisher.id,
      title: publisher.name,
      summary: publisher.description,
      description: publisher.mission,
      keywords: Array.from(
        new Set([
          publisher.type,
          publisher.acronym,
          ...publisher.countriesServed,
          ...journalDisciplines,
          ...publisher.bookSeries.map((series) => series.discipline),
        ])
      ),
      discipline: publisher.type,
      researchAreas: Array.from(new Set([...journalDisciplines, ...publisher.bookSeries.map((series) => series.discipline)])),
      organizations: [publisher.name],
      country: publisher.country,
      continent: publisher.continent,
      year: publisher.foundedYear ? String(publisher.foundedYear) : undefined,
      status: publisher.verificationStatus,
      tags: [publisher.type, publisher.acronym].filter(Boolean),
      score: publisher.trustScore,
      url: `/publishers/${publisher.id}`,
      dateAdded: publisher.foundedYear ? `${publisher.foundedYear}-01-01` : '2024-01-01',
    };
  });
}

function projectItems(): DiscoveryItem[] {
  return WORKSPACE_PROJECTS.map((project: WorkspaceProject) => {
    const startYear = project.period?.match(/^(\d{4})/)?.[1];
    return {
      id: `project-${project.id}`,
      entityType: 'project',
      sourceId: project.id,
      title: project.name,
      summary: project.description,
      keywords: Array.from(
        new Set([project.category, project.role, ...project.collaborators, ...(project.fundingSource ? [project.fundingSource] : [])])
      ),
      discipline: project.category,
      researchAreas: [],
      authors: project.collaborators,
      organizations: [],
      country: undefined,
      continent: undefined,
      year: startYear,
      status: project.status,
      tags: [project.category, project.role].filter(Boolean),
      score: project.progress,
      url: `/projects/${project.id}`,
      dateAdded: startYear ? `${startYear}-01-01` : '2024-01-01',
      stageId: 'project',
    };
  });
}

function publicationItems(): DiscoveryItem[] {
  return WORKSPACE_PUBLICATIONS.map((publication: PublicationEntry) => ({
    id: `publication-${publication.doi}`,
    entityType: 'publication',
    sourceId: publication.doi,
    title: publication.title,
    summary: `${publication.journal} \u00b7 ${publication.year}`,
    description: publication.type,
    keywords: Array.from(new Set([publication.type, publication.journal])),
    discipline: publication.type,
    researchAreas: [],
    authors: publication.authors,
    organizations: [publication.journal],
    country: undefined,
    continent: undefined,
    year: publication.year,
    status: publication.type,
    tags: [publication.type, publication.journal].filter(Boolean),
    score: Math.min(100, publication.citations),
    url: `/publications/${publication.doi}`,
    dateAdded: `${publication.year}-01-01`,
    stageId: 'publication',
  }));
}

function datasetItems(): DiscoveryItem[] {
  return DATASETS.map((dataset: Dataset) => ({
    id: `dataset-${dataset.id}`,
    entityType: 'dataset',
    sourceId: dataset.doi,
    title: dataset.title,
    summary: dataset.description,
    keywords: Array.from(new Set([...dataset.metadata.subjects, ...dataset.tags, ...dataset.collections])),
    discipline: dataset.metadata.subjects[0],
    researchAreas: dataset.metadata.subjects,
    authors: dataset.contributors.map((contributor) => contributor.name),
    organizations: [dataset.institution].filter(Boolean),
    country: undefined,
    continent: undefined,
    year: yearOf(dataset.publishedAt),
    status: dataset.access,
    tags: [dataset.status, dataset.access].filter(Boolean),
    score: Math.min(100, Math.round(Math.log10(dataset.statistics.downloads + 1) * 20)),
    url: `/datasets/${dataset.id}`,
    dateAdded: dataset.publishedAt ?? '2024-01-01',
    stageId: 'dataset',
  }));
}

function manuscriptItems(): DiscoveryItem[] {
  return MANUSCRIPTS.map((manuscript: Manuscript) => ({
    id: `manuscript-${manuscript.id}`,
    entityType: 'manuscript',
    sourceId: manuscript.id,
    title: manuscript.title,
    summary: manuscript.description,
    keywords: Array.from(new Set([...manuscript.metadata.keywords, ...manuscript.metadata.subjects, ...manuscript.tags])),
    discipline: manuscript.metadata.subjects[0],
    researchAreas: manuscript.metadata.subjects,
    authors: manuscript.authors.map((author) => author.name),
    organizations: [manuscript.institution].filter(Boolean),
    country: undefined,
    continent: undefined,
    year: yearOf(manuscript.createdAt),
    status: manuscript.status,
    tags: [manuscript.status].filter(Boolean),
    score: manuscript.readiness.score,
    url: `/manuscripts/${manuscript.id}`,
    dateAdded: manuscript.createdAt,
    stageId: manuscript.stageId,
  }));
}

function fundingItems(): DiscoveryItem[] {
  return FUNDING_OPPORTUNITIES.map((opportunity: FundingOpportunity) => ({
    id: `funding-${opportunity.id}`,
    entityType: 'funding',
    sourceId: opportunity.id,
    title: opportunity.title,
    summary: opportunity.summary,
    keywords: Array.from(
      new Set([
        ...opportunity.researchAreas,
        ...opportunity.tags,
        opportunity.agencyName,
        opportunity.category,
        opportunity.careerStage,
        ...opportunity.countries,
      ])
    ),
    discipline: opportunity.category,
    researchAreas: opportunity.researchAreas,
    organizations: [opportunity.agencyName],
    country: opportunity.countries[0],
    continent: opportunity.continents[0],
    year: yearOf(opportunity.deadline),
    status: opportunity.status,
    tags: [opportunity.category, opportunity.grantType, opportunity.careerStage].filter(Boolean),
    score: Math.min(100, 60 + Math.round((opportunity.funding.typical ?? 100000) / 100000)),
    url: `/funding/${opportunity.id}`,
    dateAdded: opportunity.deadline,
    stageId: 'funding',
  }));
}

/**
 * The unified, derived discovery index. Every entry references its original
 * source identity so nothing is duplicated.
 */
export const DISCOVERY_ITEMS: DiscoveryItem[] = [
  ...researcherItems(),
  ...journalItems(),
  ...conferenceItems(),
  ...institutionItems(),
  ...publisherItems(),
  ...projectItems(),
  ...publicationItems(),
  ...datasetItems(),
  ...manuscriptItems(),
  ...fundingItems(),
];

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  'all',
  'researcher',
  'journal',
  'conference',
  'institution',
  'publisher',
  'project',
  'publication',
  'dataset',
  'manuscript',
  'funding',
];

function tally(values: Array<string | undefined>): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function buildFacets(): DiscoveryFacet[] {
  const facets: DiscoveryFacet[] = [];

  const byType = tally(DISCOVERY_ITEMS.map((item) => item.entityType));
  byType.forEach((entry) => {
    facets.push({
      id: `type-${entry.value}`,
      name: entry.value,
      category: 'entityType',
      count: entry.count,
    });
  });

  const byDiscipline = tally(DISCOVERY_ITEMS.map((item) => item.discipline)).slice(0, 12);
  byDiscipline.forEach((entry) => {
    facets.push({ id: `discipline-${entry.value}`, name: entry.value, category: 'discipline', count: entry.count });
  });

  const byCountry = tally(DISCOVERY_ITEMS.map((item) => item.country)).slice(0, 12);
  byCountry.forEach((entry) => {
    facets.push({ id: `country-${entry.value}`, name: entry.value, category: 'country', count: entry.count });
  });

  const byContinent = tally(DISCOVERY_ITEMS.map((item) => item.continent));
  byContinent.forEach((entry) => {
    facets.push({ id: `continent-${entry.value}`, name: entry.value, category: 'continent', count: entry.count });
  });

  const byYear = tally(DISCOVERY_ITEMS.map((item) => item.year)).slice(0, 10);
  byYear.forEach((entry) => {
    facets.push({ id: `year-${entry.value}`, name: entry.value, category: 'year', count: entry.count });
  });

  const byStatus = tally(DISCOVERY_ITEMS.map((item) => item.status)).slice(0, 12);
  byStatus.forEach((entry) => {
    facets.push({ id: `status-${entry.value}`, name: entry.value, category: 'status', count: entry.count });
  });

  return facets;
}

export const DISCOVERY_FACETS: DiscoveryFacet[] = buildFacets();

const ALL_KEYWORDS = Array.from(new Set(DISCOVERY_ITEMS.flatMap((item) => item.keywords)));

const TOP_KEYWORDS = tally(DISCOVERY_ITEMS.flatMap((item) => item.keywords)).slice(0, 10).map((entry) => ({
  keyword: entry.value,
  count: entry.count,
}));

export const DISCOVERY_SUGGESTIONS: DiscoverySuggestion[] = [
  { id: 'sug-trend-1', query: 'Responsible AI', type: 'trending', count: 1284, entityType: 'conference' },
  { id: 'sug-trend-2', query: 'Open access publishing', type: 'trending', count: 1120, entityType: 'journal' },
  { id: 'sug-trend-3', query: 'Language documentation', type: 'trending', count: 982, entityType: 'dataset' },
  { id: 'sug-trend-4', query: 'Public health in Africa', type: 'trending', count: 861, entityType: 'researcher' },
  { id: 'sug-trend-5', query: 'Climate research funding', type: 'trending', count: 743, entityType: 'funding' },
  { id: 'sug-pop-1', query: 'Multilingual NLP', type: 'popular', count: 5310, entityType: 'publication' },
  { id: 'sug-pop-2', query: 'Dependency parsing', type: 'popular', count: 4821, entityType: 'publication' },
  { id: 'sug-pop-3', query: 'Machine learning', type: 'popular', count: 4110, entityType: 'researcher' },
  { id: 'sug-pop-4', query: 'Digital humanities', type: 'popular', count: 3904, entityType: 'manuscript' },
  { id: 'sug-recent-1', query: 'Treebanks v3.1', type: 'recent', count: 214 },
  { id: 'sug-recent-2', query: 'SIRI 2026 proceedings', type: 'recent', count: 180 },
  { id: 'sug-recent-3', query: 'Low-resource parsing', type: 'recent', count: 166 },
  { id: 'sug-rec-1', query: 'Featured collection: Open Science', type: 'recommended', entityType: 'journal' },
  { id: 'sug-rec-2', query: 'Top cited researchers', type: 'recommended', entityType: 'researcher' },
  { id: 'sug-rec-3', query: 'Open funding deadlines', type: 'recommended', entityType: 'funding' },
];

const COLLECTION_DEFINITIONS: Array<{
  id: string;
  title: string;
  description: string;
  coverIcon: string;
  theme: string;
  keywords: string[];
}> = [
  {
    id: 'col-open-science',
    title: 'Open Science & Research Integrity',
    description:
      'Journals, datasets, conferences, and manuscripts championing open access, reproducibility, and verified scholarly communication.',
    coverIcon: '\ud83d\udd13',
    theme: 'sky',
    keywords: ['open access', 'open science', 'research integrity', 'reproducibility', 'peer review'],
  },
  {
    id: 'col-responsible-ai',
    title: 'Responsible AI & Computational Linguistics',
    description:
      'Researchers, journals, datasets, and events shaping responsible AI, natural language processing, and multilingual language technology.',
    coverIcon: '\ud83e\udd16',
    theme: 'violet',
    keywords: [
      'artificial intelligence',
      'nlp',
      'natural language processing',
      'machine learning',
      'language',
      'computation',
      'parsing',
    ],
  },
  {
    id: 'col-public-health-africa',
    title: 'Public Health in Africa',
    description:
      'Researchers, institutions, and projects addressing infectious disease, maternal health, and health systems across the continent.',
    coverIcon: '\ud83e\ude7a',
    theme: 'emerald',
    keywords: ['public health', 'malaria', 'tropical', 'infectious', 'maternal', 'epidemiology', 'health'],
  },
  {
    id: 'col-climate-environment',
    title: 'Climate & Environmental Research',
    description: 'Journals, datasets, and conferences advancing climate science, conservation, and environmental sustainability.',
    coverIcon: '\ud83c\udf0d',
    theme: 'green',
    keywords: ['climate', 'environment', 'sustainability', 'biodiversity', 'earth', 'ocean'],
  },
  {
    id: 'col-language-documentation',
    title: 'Language Documentation & Heritage',
    description: 'Datasets, manuscripts, and researchers preserving under-resourced and endangered languages.',
    coverIcon: '\ud83d\udcdc',
    theme: 'amber',
    keywords: ['language documentation', 'endangered language', 'heritage', 'linguistics', 'corpus'],
  },
  {
    id: 'col-early-career-funding',
    title: 'Early Career Research Funding',
    description: 'Open funding opportunities across fellowship, doctoral, and postdoctoral schemes for early-stage researchers.',
    coverIcon: '\ud83c\udf93',
    theme: 'rose',
    keywords: ['early-career', 'doctoral', 'postdoctoral', 'fellowship', 'scholarship'],
  },
];

function buildCollections(): DiscoveryCollection[] {
  return COLLECTION_DEFINITIONS.map((definition) => {
    const items = DISCOVERY_ITEMS.filter((item) =>
      definition.keywords.some((keyword) =>
        item.keywords.some((itemKeyword) => itemKeyword.toLowerCase().includes(keyword.toLowerCase()))
      )
    ).slice(0, 6);
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      coverIcon: definition.coverIcon,
      items,
      curator: 'Scholatia Discovery Curators',
      updatedAt: '2026-07-31',
      theme: definition.theme,
      ...(items.length ? {} : { entityType: 'journal' as DiscoveryEntityType }),
    };
  });
}

export const DISCOVERY_COLLECTIONS: DiscoveryCollection[] = buildCollections();

const COLLECTION_ITEM_IDS = new Set(DISCOVERY_COLLECTIONS.flatMap((collection) => collection.items.map((item) => item.id)));
const COLLECTION_FEATURED = DISCOVERY_ITEMS.filter((item) => COLLECTION_ITEM_IDS.has(item.id)).slice(0, 6);

function buildRankings(): DiscoveryRanking[] {
  const researcherItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'researcher').map((item) => [item.sourceId, item])
  );
  const topResearchers = [...RESEARCHERS]
    .sort((a, b) => b.metrics.totalCitations - a.metrics.totalCitations)
    .slice(0, 5)
    .map((researcher) => researcherItemById.get(researcher.identity.said))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const journalItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'journal').map((item) => [item.sourceId, item])
  );
  const topJournals = [...JOURNALS]
    .sort((a, b) => (b.impactMetrics?.impactFactor ?? 0) - (a.impactMetrics?.impactFactor ?? 0))
    .slice(0, 5)
    .map((journal) => journalItemById.get(journal.journalId))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const conferenceItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'conference').map((item) => [item.sourceId, item])
  );
  const upcomingConferences = [...CONFERENCES]
    .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
    .slice(0, 5)
    .map((conference) => conferenceItemById.get(conference.conferenceId))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const datasetItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'dataset').map((item) => [item.sourceId, item])
  );
  const topDatasets = [...DATASETS]
    .sort((a, b) => b.statistics.downloads - a.statistics.downloads)
    .slice(0, 5)
    .map((dataset) => datasetItemById.get(dataset.doi))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const fundingItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'funding').map((item) => [item.sourceId, item])
  );
  const openFunding = FUNDING_OPPORTUNITIES.filter((opportunity) => opportunity.status === 'open')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5)
    .map((opportunity) => fundingItemById.get(opportunity.id))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const manuscriptItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'manuscript').map((item) => [item.sourceId, item])
  );
  const topManuscripts = [...MANUSCRIPTS]
    .sort((a, b) => b.readiness.score - a.readiness.score)
    .slice(0, 5)
    .map((manuscript) => manuscriptItemById.get(manuscript.id))
    .filter((item): item is DiscoveryItem => Boolean(item));

  const projectItemById = new Map(
    DISCOVERY_ITEMS.filter((item) => item.entityType === 'project').map((item) => [item.sourceId, item])
  );
  const topProjects = [...WORKSPACE_PROJECTS]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .map((project) => projectItemById.get(project.id))
    .filter((item): item is DiscoveryItem => Boolean(item));

  return [
    {
      id: 'rank-top-cited-researchers',
      label: 'Top cited researchers',
      basis: 'Researchers ranked by total citations across the platform.',
      metric: 'totalCitations',
      items: topResearchers,
    },
    {
      id: 'rank-top-journals',
      label: 'Top ranked journals',
      basis: 'Journals ranked by impact factor within the portfolio.',
      metric: 'impactFactor',
      items: topJournals,
    },
    {
      id: 'rank-upcoming-conferences',
      label: 'Upcoming conferences',
      basis: 'Conferences ordered by upcoming start date.',
      items: upcomingConferences,
    },
    {
      id: 'rank-most-downloaded-datasets',
      label: 'Most downloaded datasets',
      basis: 'Datasets ranked by total downloads.',
      metric: 'downloads',
      items: topDatasets,
    },
    {
      id: 'rank-open-funding',
      label: 'Open funding opportunities',
      basis: 'Currently open opportunities ordered by upcoming deadline.',
      items: openFunding,
    },
    {
      id: 'rank-high-readiness-manuscripts',
      label: 'Highest publication readiness',
      basis: 'Manuscripts ranked by publication readiness score.',
      metric: 'readiness',
      items: topManuscripts,
    },
    {
      id: 'rank-active-projects',
      label: 'Most advanced projects',
      basis: 'Workspace projects ranked by completion progress.',
      metric: 'progress',
      items: topProjects,
    },
  ];
}

export const DISCOVERY_RANKINGS: DiscoveryRanking[] = buildRankings();

function buildRelationships(): DiscoveryRelationship[] {
  const itemById = new Map(DISCOVERY_ITEMS.map((item) => [item.id, item]));
  const relationships: DiscoveryRelationship[] = [];
  const seen = new Set<string>();

  const relate = (
    source: DiscoveryItem,
    target: DiscoveryItem,
    relation: string
  ) => {
    const key = `${source.id}->${target.id}->${relation}`;
    if (seen.has(key)) return;
    seen.add(key);
    relationships.push({
      id: `rel-${relationships.length + 1}`,
      sourceId: source.id,
      sourceTitle: source.title,
      sourceType: source.entityType,
      targetId: target.id,
      targetTitle: target.title,
      targetType: target.entityType,
      relation,
      weight: Math.round((source.score + target.score) / 2),
    });
  };

  const publisherByName = new Map(PUBLISHERS.map((publisher) => [publisher.name, publisher.id]));

  for (const journal of JOURNALS) {
    const journalItem = itemById.get(`journal-${journal.journalId}`);
    const publisherId = journal.publisher ? publisherByName.get(journal.publisher) : undefined;
    if (journalItem && publisherId) {
      const publisherItem = itemById.get(`publisher-${publisherId}`);
      if (publisherItem) relate(journalItem, publisherItem, 'Published by');
    }
  }

  const institutionByName = new Map(INSTITUTIONS.map((institution) => [institution.profile.institutionName, institution.said]));

  for (const researcher of RESEARCHERS) {
    const researcherItem = itemById.get(`researcher-${researcher.username}`);
    const institutionId = institutionByName.get(researcher.position.institution);
    if (researcherItem && institutionId) {
      const institutionItem = itemById.get(`institution-${institutionId}`);
      if (institutionItem) relate(researcherItem, institutionItem, 'Affiliated with');
    }
  }

  const journalByTitle = new Map(JOURNALS.map((journal) => [journal.journalTitle.toLowerCase(), journal.journalId]));

  for (const manuscript of MANUSCRIPTS) {
    const manuscriptItem = itemById.get(`manuscript-${manuscript.id}`);
    const targetJournal = manuscript.targetJournals[0]?.journal;
    if (manuscriptItem && targetJournal) {
      const journalItem = itemById.get(`journal-${targetJournal.journalId}`);
      if (journalItem) relate(manuscriptItem, journalItem, 'Targets journal');
    }
  }

  for (const conference of CONFERENCES) {
    const conferenceItem = itemById.get(`conference-${conference.conferenceId}`);
    const proceedings = conference.proceedings;
    if (conferenceItem && proceedings?.publisher) {
      const publisherId = publisherByName.get(proceedings.publisher);
      if (publisherId) {
        const publisherItem = itemById.get(`publisher-${publisherId}`);
        if (publisherItem) relate(conferenceItem, publisherItem, 'Proceedings published by');
      }
    }
  }

  for (const dataset of DATASETS) {
    const datasetItem = itemById.get(`dataset-${dataset.id}`);
    const institutionId = institutionByName.get(dataset.institution);
    if (datasetItem && institutionId) {
      const institutionItem = itemById.get(`institution-${institutionId}`);
      if (institutionItem) relate(datasetItem, institutionItem, 'Hosted at');
    }
  }

  for (const publication of WORKSPACE_PUBLICATIONS) {
    const publicationItem = itemById.get(`publication-${publication.doi}`);
    const journalId = journalByTitle.get(publication.journal.toLowerCase());
    if (publicationItem && journalId) {
      const journalItem = itemById.get(`journal-${journalId}`);
      if (journalItem) relate(publicationItem, journalItem, 'Published in');
    }
  }

  for (const project of WORKSPACE_PROJECTS) {
    const projectItem = itemById.get(`project-${project.id}`);
    if (!projectItem) continue;
    for (const collaborator of project.collaborators.slice(0, 2)) {
      const researcher = RESEARCHERS.find(
        (candidate) =>
          candidate.displayName.toLowerCase().includes(collaborator.toLowerCase()) ||
          collaborator.toLowerCase().includes(candidate.displayName.toLowerCase())
      );
      if (researcher) {
        const researcherItem = itemById.get(`researcher-${researcher.username}`);
        if (researcherItem) relate(projectItem, researcherItem, 'Collaborates with');
      }
    }
  }

  for (const funding of FUNDING_OPPORTUNITIES) {
    const fundingItem = itemById.get(`funding-${funding.id}`);
    const publisherId = publisherByName.get(funding.agencyName);
    if (fundingItem && publisherId) {
      const publisherItem = itemById.get(`publisher-${publisherId}`);
      if (publisherItem) relate(fundingItem, publisherItem, 'Agency');
    }
  }

  return relationships.slice(0, 48);
}

export const DISCOVERY_RELATIONSHIPS: DiscoveryRelationship[] = buildRelationships();

function buildTimeline(): DiscoveryTimelineEntry[] {
  const entries: DiscoveryTimelineEntry[] = [
    ...DATASETS.map((dataset) => ({
      id: `timeline-dataset-${dataset.id}`,
      date: dataset.publishedAt ?? '',
      title: dataset.title,
      detail: 'Dataset published',
      type: 'dataset' as DiscoveryEntityType,
    })),
    ...MANUSCRIPTS.map((manuscript) => ({
      id: `timeline-manuscript-${manuscript.id}`,
      date: manuscript.createdAt ?? '',
      title: manuscript.title,
      detail: `Manuscript ${manuscript.status.replace(/-/g, ' ')}`,
      type: 'manuscript' as DiscoveryEntityType,
    })),
    ...CONFERENCES.map((conference) => ({
      id: `timeline-conference-${conference.conferenceId}`,
      date: conference.startDate ?? '',
      title: conference.title,
      detail: 'Conference announced',
      type: 'conference' as DiscoveryEntityType,
    })),
    ...FUNDING_OPPORTUNITIES.map((opportunity) => ({
      id: `timeline-funding-${opportunity.id}`,
      date: opportunity.deadline,
      title: opportunity.title,
      detail: `Funding deadline (${opportunity.status})`,
      type: 'funding' as DiscoveryEntityType,
    })),
  ].filter((entry) => Boolean(entry.date));
  return entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 24);
}

export const DISCOVERY_TIMELINE: DiscoveryTimelineEntry[] = buildTimeline();

const byCategory = DISCOVERY_CATEGORIES.filter((category) => category !== 'all').map((category) => {
  const entityType = category as DiscoveryEntityType;
  return {
    entityType,
    count: DISCOVERY_ITEMS.filter((item) => item.entityType === entityType).length,
  };
});

const byDiscipline = tally(DISCOVERY_ITEMS.map((item) => item.discipline))
  .slice(0, 8)
  .map((entry) => ({ discipline: entry.value, count: entry.count }));

const byContinent = tally(DISCOVERY_ITEMS.map((item) => item.continent))
  .map((entry) => ({ continent: entry.value, count: entry.count }));

export const DISCOVERY_ANALYTICS: DiscoveryAnalytics = {
  totalItems: DISCOVERY_ITEMS.length,
  totalCategories: DISCOVERY_CATEGORIES.length,
  searches: 14820,
  uniqueSearches: 3120,
  clickThroughRate: 4.7,
  averageRelevance: 86,
  itemsByCategory: byCategory,
  itemsByDiscipline: byDiscipline,
  itemsByContinent: byContinent,
  topKeywords: TOP_KEYWORDS,
  trendingTopics: DISCOVERY_SUGGESTIONS.filter((suggestion) => suggestion.type === 'trending').slice(0, 5),
};

export const DISCOVERY_STATISTICS: DiscoveryStatistics = {
  totalItems: DISCOVERY_ITEMS.length,
  totalResearchers: RESEARCHERS.length,
  totalJournals: JOURNALS.length,
  totalConferences: CONFERENCES.length,
  totalInstitutions: INSTITUTIONS.length,
  totalPublishers: PUBLISHERS.length,
  totalProjects: WORKSPACE_PROJECTS.length,
  totalPublications: WORKSPACE_PUBLICATIONS.length,
  totalDatasets: DATASETS.length,
  totalManuscripts: MANUSCRIPTS.length,
  totalFunding: FUNDING_OPPORTUNITIES.length,
  totalCountries: new Set(DISCOVERY_ITEMS.map((item) => item.country).filter(Boolean)).size,
  totalContinents: new Set(DISCOVERY_ITEMS.map((item) => item.continent).filter(Boolean)).size,
  totalDisciplines: new Set(DISCOVERY_ITEMS.map((item) => item.discipline).filter(Boolean)).size,
  totalKeywords: ALL_KEYWORDS.length,
  totalCollections: DISCOVERY_COLLECTIONS.length,
  topKeyword: TOP_KEYWORDS[0]?.keyword ?? 'research',
  averageScore: Math.round(DISCOVERY_ITEMS.reduce((sum, item) => sum + item.score, 0) / DISCOVERY_ITEMS.length),
};

export const DISCOVERY_PORTFOLIO: DiscoveryPortfolio = {
  statistics: DISCOVERY_STATISTICS,
  analytics: DISCOVERY_ANALYTICS,
  items: DISCOVERY_ITEMS,
  categories: DISCOVERY_CATEGORIES,
  facets: DISCOVERY_FACETS,
  collections: DISCOVERY_COLLECTIONS,
  suggestions: DISCOVERY_SUGGESTIONS,
  rankings: DISCOVERY_RANKINGS,
  relationships: DISCOVERY_RELATIONSHIPS,
  timeline: DISCOVERY_TIMELINE,
};

export const FEATURED_COLLECTION = DISCOVERY_COLLECTIONS[0];
export const FEATURED_DISCOVERY_ITEM = COLLECTION_FEATURED[0] ?? DISCOVERY_ITEMS[0];

/**
 * Build a default discovery query for the placeholder search experience.
 */
export function createDefaultDiscoveryQuery(): {
  query: string;
  category: DiscoveryCategory;
  page: number;
  pageSize: number;
  sortBy: 'relevance';
  scope: 'all';
} {
  return {
    query: '',
    category: 'all',
    page: 1,
    pageSize: 9,
    sortBy: 'relevance',
    scope: 'all',
  };
}

/**
 * Rank the unified index against a free-text query, returning matched items
 * and the fields that contributed to each match. Placeholder local ranking;
 * a hosted search index (e.g. Meilisearch) will replace this later.
 */
export function searchDiscoveryItems(
  items: DiscoveryItem[],
  query: string,
  category: DiscoveryCategory = 'all',
  limit = 9
): { item: DiscoveryItem; relevanceScore: number; matchedFields: string[] }[] {
  const normalized = query.trim().toLowerCase();
  const terms = normalized.split(/\s+/).filter(Boolean);
  const scoped = category === 'all' ? items : items.filter((item) => item.entityType === category);

  const results = scoped
    .map((item) => {
      const matchedFields: string[] = [];
      let score = item.score;
      if (terms.length === 0) {
        matchedFields.push('score');
      }
      for (const term of terms) {
        if (item.title.toLowerCase().includes(term)) {
          matchedFields.push('title');
          score += 40;
        }
        if (item.keywords.some((keyword) => keyword.toLowerCase().includes(term))) {
          matchedFields.push('keywords');
          score += 25;
        }
        if (item.researchAreas.some((area) => area.toLowerCase().includes(term))) {
          matchedFields.push('researchAreas');
          score += 20;
        }
        if (item.summary.toLowerCase().includes(term)) {
          matchedFields.push('summary');
          score += 12;
        }
        if (item.tags.some((tag) => tag.toLowerCase().includes(term))) {
          matchedFields.push('tags');
          score += 10;
        }
      }
      return { item, relevanceScore: score, matchedFields };
    })
    .filter((result) => (terms.length === 0 ? true : result.matchedFields.length > 0))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.slice(0, limit);
}

export const DISCOVERY_LIFECYCLE_STAGE_ID: ResearchLifecycleStageId | undefined = undefined;
