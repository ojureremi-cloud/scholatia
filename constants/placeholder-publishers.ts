import { WORKSPACE_PROJECTS, WORKSPACE_PUBLICATIONS, RESEARCH_TEAM } from '@/constants/placeholder-research';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { FUNDING_GRANTS } from '@/constants/placeholder-funding';
import type {
  BookSeries,
  ContinentPublisherStat,
  DivisionOutputStat,
  EditorialOffice,
  Imprint,
  JournalByTypeStat,
  ProceedingsRef,
  Publisher,
  PublisherAnalytics,
  PublisherConferenceRef,
  PublisherJournalRef,
  PublisherPortfolio,
  PublisherRelationships,
  PublisherRelationshipRef,
  PublisherStatistics,
  PublisherTimelineEntry,
  PublisherType,
  PublishingDivision,
  PublishingMetrics,
  PublishingPolicy,
} from '@/types/publisher';

/**
 * Placeholder data for the Scholarly Publisher Platform (Phase 1.6).
 *
 * Publishing is the platform-wide layer under which journals, conferences, and
 * proceedings are published. It does NOT introduce a new lifecycle stage;
 * instead it sits across the existing publication stage (stage 11) and
 * conference stage (stage 12) of the canonical research lifecycle.
 *
 * The portfolio covers 12 publishers spanning commercial, university press,
 * learned society, and open access publishers: the Scholatia Press flagship
 * plus Elsevier, Springer Nature, Wiley, Taylor & Francis, Emerald, Sage,
 * IEEE, ACM, Oxford University Press, University of Hawaiʻi Press, and
 * University of Ghana Press.
 *
 * Journals and conference proceedings published by Scholatia Press,
 * University of Hawaiʻi Press, and University of Ghana Press are derived
 * directly from the existing `JOURNALS` and `CONFERENCES` placeholder records
 * so no data is duplicated. Cross-module relationships (projects, datasets,
 * manuscripts, journals, conferences, proceedings, publications, researchers,
 * institutions, grants) are sourced from the existing placeholder modules.
 */

const PROJECT_POOL: PublisherRelationshipRef[] = WORKSPACE_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  detail: `Status: ${project.status}`,
}));

const DATASET_POOL: PublisherRelationshipRef[] = DATASETS.map((dataset) => ({
  id: dataset.id,
  title: dataset.title,
  detail: dataset.doi,
}));

const MANUSCRIPT_POOL: PublisherRelationshipRef[] = MANUSCRIPTS.map((manuscript) => ({
  id: manuscript.id,
  title: manuscript.title,
  detail: `Status: ${manuscript.status}`,
}));

const JOURNAL_POOL: PublisherRelationshipRef[] = JOURNALS.map((journal) => ({
  id: journal.journalId,
  title: journal.journalTitle,
  detail: journal.country ?? 'International journal',
}));

const CONFERENCE_POOL: PublisherRelationshipRef[] = CONFERENCES.map((conference) => ({
  id: conference.conferenceId,
  title: conference.shortTitle ?? conference.title,
  detail: `${conference.city ?? 'Location'} · ${conference.startDate ?? conference.conferenceCode}`,
}));

const PROCEEDINGS_POOL: PublisherRelationshipRef[] = CONFERENCES.flatMap((conference) =>
  conference.proceedings
    ? [
        {
          id: conference.proceedings.id,
          title: conference.proceedings.title,
          detail: `${conference.proceedings.publisher} · ${conference.proceedings.year}`,
        },
      ]
    : []
);

const PUBLICATION_POOL: PublisherRelationshipRef[] = WORKSPACE_PUBLICATIONS.map((publication) => ({
  id: `pub-${publication.doi}`,
  title: publication.title,
  detail: `${publication.journal} · ${publication.year}`,
}));

const RESEARCHER_POOL: PublisherRelationshipRef[] = [
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
  (entry, index, self) => self.findIndex((candidate) => candidate.id === entry.id) === index
);

const INSTITUTION_POOL: PublisherRelationshipRef[] = INSTITUTIONS.map((institution) => ({
  id: institution.said,
  title: institution.profile.institutionName,
  detail: `${institution.profile.city ?? 'City'} · ${institution.country}`,
}));

const GRANT_POOL: PublisherRelationshipRef[] = FUNDING_GRANTS.map((grant) => ({
  id: grant.id,
  title: grant.title,
  detail: grant.agencyName,
}));

function sliceRotate<T>(items: T[], index: number, count: number): T[] {
  if (items.length === 0) return [];
  const start = (index * 3) % items.length;
  const rotated = [...items.slice(start), ...items.slice(0, start)];
  return rotated.slice(0, Math.min(count, items.length));
}

function buildRelationships(index: number): PublisherRelationships {
  return {
    journals: sliceRotate(JOURNAL_POOL, index, 3),
    conferences: sliceRotate(CONFERENCE_POOL, index, 3),
    proceedings: sliceRotate(PROCEEDINGS_POOL, index, 2),
    manuscripts: sliceRotate(MANUSCRIPT_POOL, index, 3),
    datasets: sliceRotate(DATASET_POOL, index, 3),
    projects: sliceRotate(PROJECT_POOL, index, 4),
    publications: sliceRotate(PUBLICATION_POOL, index, 4),
    researchers: sliceRotate(RESEARCHER_POOL, index, 4),
    institutions: sliceRotate(INSTITUTION_POOL, index, 3),
    grants: sliceRotate(GRANT_POOL, index, 3),
  };
}

function div(
  id: string,
  name: string,
  type: PublishingDivision['type'],
  description: string,
  outputCount: number,
  countries?: string[]
): PublishingDivision {
  return { id, name, type, description, outputCount, countries };
}

function imprint(
  id: string,
  name: string,
  foundedYear: number,
  focusAreas: string[],
  description: string,
  countries: string[],
  openAccess: boolean
): Imprint {
  return { id, name, foundedYear, focusAreas, description, countries, openAccess };
}

function series(
  id: string,
  name: string,
  discipline: string,
  editors: string[],
  volumes: number,
  active: boolean,
  openAccess: boolean,
  description?: string
): BookSeries {
  return { id, name, discipline, editors, volumes, active, openAccess, description };
}

function office(
  id: string,
  city: string,
  country: string,
  continent: string,
  roles: string[],
  staffCount: number,
  focus: string,
  region?: string
): EditorialOffice {
  return { id, city, country, continent, roles, staffCount, focus, region };
}

function policy(
  id: string,
  name: string,
  type: PublishingPolicy['type'],
  status: PublishingPolicy['status'],
  effectiveDate: string,
  scope: string,
  description: string
): PublishingPolicy {
  return { id, name, type, status, effectiveDate, scope, description };
}

function jref(
  journalId: string,
  title: string,
  discipline: string,
  openAccessStatus: PublisherJournalRef['openAccessStatus'],
  quartile: PublisherJournalRef['quartile'],
  impactFactor: number,
  issn?: string,
  country?: string
): PublisherJournalRef {
  return { journalId, title, discipline, openAccessStatus, quartile, impactFactor, issn, country };
}

function cref(
  conferenceId: string,
  title: string,
  eventType: string,
  city: string,
  country: string,
  date: string
): PublisherConferenceRef {
  return { conferenceId, title, eventType, city, country, date };
}

function pref(
  proceedingsId: string,
  title: string,
  conferenceId: string,
  conference: string,
  year: string,
  numberOfPapers: number,
  publicationStatus: ProceedingsRef['publicationStatus'],
  issn?: string,
  doiPrefix?: string,
  volume?: string
): ProceedingsRef {
  return {
    proceedingsId,
    title,
    conferenceId,
    conference,
    year,
    numberOfPapers,
    publicationStatus,
    issn,
    doiPrefix,
    volume,
  };
}

function book(
  id: string,
  title: string,
  authors: string[],
  type: Publisher['books'][number]['type'],
  year: string,
  pages: number,
  isbn: string,
  series?: string,
  openAccess?: boolean
): Publisher['books'][number] {
  return { id, title, authors, type, year, pages, isbn, series, openAccess };
}

function timelineEntry(
  id: string,
  date: string,
  title: string,
  detail: string,
  type: PublisherTimelineEntry['type']
): PublisherTimelineEntry {
  return { id, date, title, detail, type };
}

function deriveJournals(publisherName: string): PublisherJournalRef[] {
  return JOURNALS.filter((journal) => journal.publisher === publisherName).map((journal) => ({
    journalId: journal.journalId,
    title: journal.journalTitle,
    issn: journal.issn,
    discipline: journal.discipline,
    openAccessStatus: journal.openAccessStatus,
    quartile: journal.impactMetrics?.quartile,
    impactFactor: journal.impactMetrics?.impactFactor,
    country: journal.country,
  }));
}

function deriveConferences(publisherName: string): PublisherConferenceRef[] {
  return CONFERENCES.filter((conference) => conference.proceedings?.publisher === publisherName).map(
    (conference) => ({
      conferenceId: conference.conferenceId,
      title: conference.shortTitle ?? conference.title,
      eventType: conference.eventType,
      city: conference.city,
      country: conference.country,
      date: conference.startDate,
    })
  );
}

function deriveProceedings(publisherName: string): ProceedingsRef[] {
  return CONFERENCES.flatMap((conference) =>
    conference.proceedings && conference.proceedings.publisher === publisherName
      ? [
          {
            proceedingsId: conference.proceedings.id,
            title: conference.proceedings.title,
            conferenceId: conference.conferenceId,
            conference: conference.shortTitle ?? conference.title,
            year: conference.proceedings.year,
            volume: conference.proceedings.volume,
            numberOfPapers: conference.proceedings.numberOfPapers,
            issn: conference.proceedings.issn,
            doiPrefix: conference.proceedings.doiPrefix,
            publicationStatus: conference.proceedings.publicationStatus,
          },
        ]
      : []
  );
}

function makePublisher(index: number, overrides: Partial<Publisher>): Publisher {
  const base: Publisher = {
    id: `publisher-${index}`,
    name: '',
    shortName: '',
    acronym: '',
    logo: '📚',
    type: 'commercial',
    headquarters: '',
    city: '',
    country: '',
    continent: 'Europe',
    countriesServed: [],
    description: '',
    website: 'https://example.com',
    verificationStatus: 'Trusted',
    trustScore: 80,
    divisions: [],
    imprints: [],
    bookSeries: [],
    editorialOffices: [],
    policies: [],
    metrics: {
      journals: 0,
      conferences: 0,
      proceedings: 0,
      bookSeries: 0,
      books: 0,
      articlesPublished: 0,
      citations: 0,
      downloads: 0,
      openAccessShare: 0,
      editorialOffices: 0,
      countriesServed: 0,
    },
    journals: [],
    conferences: [],
    proceedings: [],
    books: [],
    timeline: [],
    relationships: buildRelationships(index),
    ...overrides,
  };

  return base;
}

export const PUBLISHERS: Publisher[] = [
  makePublisher(0, {
    id: 'scholatia-press',
    name: 'Scholatia Press',
    shortName: 'Scholatia Press',
    acronym: 'SP',
    logo: '📖',
    type: 'open-access',
    headquarters: 'Cambridge, United Kingdom',
    city: 'Cambridge',
    country: 'United Kingdom',
    continent: 'Europe',
    countriesServed: [
      'United Kingdom',
      'Nigeria',
      'Kenya',
      'Ghana',
      'South Africa',
      'United States',
      'India',
      'Japan',
      'China',
      'Brazil',
      'Australia',
      'Germany',
    ],
    foundedYear: 2019,
    description:
      'The open access publishing arm of the Scholatia scholarly ecosystem, publishing peer-reviewed journals, conference proceedings, and books in the languages and disciplines of the communities it serves.',
    mission:
      'To publish rigorous, community-owned scholarship with equitable, barrier-free access across the global research lifecycle.',
    website: 'https://scholatia.org/press',
    verificationStatus: 'Verified',
    trustScore: 96,
    openAccess: true,
    divisions: [
      div('sp-div-journals', 'Scholatia Journal Division', 'Journals', 'Open access peer-reviewed journals across the Scholatia research lifecycle.', 9, ['United Kingdom', 'Nigeria', 'Kenya', 'Ghana']),
      div('sp-div-conferences', 'Conference Proceedings', 'Conferences', 'Peer-reviewed proceedings for the Scholatia conference portfolio.', 8, ['United Kingdom', 'Ghana', 'United States', 'Côte d’Ivoire']),
      div('sp-div-books', 'Book Programmes', 'Books', 'Monographs and edited volumes in the language documentation and African scholarship space.', 12, ['United Kingdom', 'United States', 'Ghana']),
      div('sp-div-oa', 'Open Access Programme', 'Open Access', 'Diamond and gold open access infrastructure for the Scholatia community.', 24, ['Global']),
    ],
    imprints: [
      imprint('sp-imp-1', 'Scholatia Language Press', 2020, ['Language Documentation', 'Linguistics', 'Revitalisation'], 'Language documentation and revitalisation monographs.', ['United Kingdom', 'United States', 'Australia'], true),
      imprint('sp-imp-2', 'Scholatia Africa', 2021, ['African Studies', 'Public Health', 'Education'], 'African scholarship in African voices.', ['Ghana', 'Nigeria', 'Kenya', 'South Africa'], true),
      imprint('sp-imp-3', 'Scholatia Methods', 2022, ['Data Science', 'Methods', 'Open Science'], 'Methods books and open science guides.', ['United Kingdom', 'United States', 'India'], true),
    ],
    bookSeries: [
      series('sp-ser-1', 'Studies in Language Documentation', 'Linguistics', ['Dr. Kelechi Okafor', 'Prof. Ama Owusu'], 14, true, true, 'A peer-reviewed monograph series on endangered and under-documented languages.'),
      series('sp-ser-2', 'Scholatia Open Methods', 'Data Science', ['Dr. Jane Scholar', 'Dr. Grace Mwangi'], 6, true, true, 'Open methods and reproducibility guides for the research lifecycle.'),
      series('sp-ser-3', 'African Public Health Briefs', 'Public Health', ['Prof. Kwame Mensah', 'Dr. Amina Yusuf'], 9, true, false, 'Concise, evidence-based briefs on public health across Africa.'),
    ],
    editorialOffices: [
      office('sp-off-1', 'Cambridge', 'United Kingdom', 'Europe', ['Editorial Direction', 'Production', 'Marketing'], 24, 'Head office and editorial direction.'),
      office('sp-off-2', 'Accra', 'Ghana', 'Africa', ['Editorial', 'Peer Review Coordination'], 8, 'African editorial hub.'),
      office('sp-off-3', 'Nairobi', 'Kenya', 'Africa', ['Submissions', 'Community Outreach'], 6, 'Author support for East Africa.'),
    ],
    policies: [
      policy('sp-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2020-01-01', 'All journals', 'All Scholatia Press journals are diamond or gold open access with no article processing charges for authors.'),
      policy('sp-pol-2', 'Peer Review Policy', 'Peer Review', 'Active', '2020-01-01', 'All journals and proceedings', 'Double-anonymous peer review is the default across all journals and conference proceedings.'),
      policy('sp-pol-3', 'Research Integrity Policy', 'Research Integrity', 'Active', '2021-06-01', 'All publications', 'COPE-aligned integrity standards covering authorship, conflict of interest, and retraction.'),
      policy('sp-pol-4', 'Data Sharing Policy', 'Data Sharing', 'Under Review', '2024-03-15', 'Lifecycle datasets', 'Every publication must include a data availability statement linking to the Scholatia dataset record.'),
    ],
    metrics: {
      journals: deriveJournals('Scholatia Press').length,
      conferences: deriveConferences('Scholatia Press').length,
      proceedings: deriveProceedings('Scholatia Press').length,
      bookSeries: 3,
      books: 5,
      articlesPublished: 640,
      citations: 18500,
      downloads: 1420000,
      openAccessShare: 100,
      acceptanceRate: 38,
      editorialOffices: 3,
      countriesServed: 12,
      annualRevenue: 4200000,
      currency: 'GBP',
    },
    journals: deriveJournals('Scholatia Press'),
    conferences: deriveConferences('Scholatia Press'),
    proceedings: deriveProceedings('Scholatia Press'),
    books: [
      book('sp-book-1', 'Documenting the Kaingang Language', ['Dr. Kelechi Okafor', 'Dr. Sofia Ferreira'], 'Monograph', '2023', 284, '978-0-0000-0001-1', 'Studies in Language Documentation', true),
      book('sp-book-2', 'Reproducible Research Workflows', ['Dr. Jane Scholar', 'Dr. Kwame Mensah'], 'Handbook', '2024', 356, '978-0-0000-0002-8', 'Scholatia Open Methods', true),
      book('sp-book-3', 'The Open Access Imperative', ['Prof. Ama Owusu', 'Dr. Grace Mwangi'], 'Edited Volume', '2022', 412, '978-0-0000-0003-5', 'Scholatia Open Methods', true),
      book('sp-book-4', 'Public Health Systems in West Africa', ['Prof. Kwame Mensah'], 'Textbook', '2023', 520, '978-0-0000-0004-2', 'African Public Health Briefs'),
      book('sp-book-5', 'Proceedings: Scholatia Research Conference 2025', ['Scholatia Press'], 'Proceedings', '2025', 342, '978-0-0000-0005-9'),
    ],
    timeline: [
      timelineEntry('sp-tim-1', '2019-03-01', 'Scholatia Press founded', 'Established as the open access publisher for the Scholatia ecosystem.', 'Founded'),
      timelineEntry('sp-tim-2', '2020-01-01', 'First journals launched', 'Nine open access journals launched across the research lifecycle.', 'Launch'),
      timelineEntry('sp-tim-3', '2021-06-01', 'COPE membership', 'Admitted to the Committee on Publication Ethics.', 'Award'),
      timelineEntry('sp-tim-4', '2023-05-15', 'Accra editorial office', 'Opened the African editorial hub in Accra, Ghana.', 'Partnership'),
      timelineEntry('sp-tim-5', '2024-03-01', 'Open Methods series', 'Published volume one of the Scholatia Open Methods series.', 'Publication'),
    ],
  }),
  makePublisher(1, {
    id: 'elsevier',
    name: 'Elsevier',
    shortName: 'Elsevier',
    acronym: 'EL',
    logo: '🧬',
    type: 'commercial',
    headquarters: 'Amsterdam, Netherlands',
    city: 'Amsterdam',
    country: 'Netherlands',
    continent: 'Europe',
    countriesServed: [
      'Netherlands',
      'United States',
      'United Kingdom',
      'Germany',
      'China',
      'India',
      'Japan',
      'Brazil',
      'Australia',
      'Canada',
      'France',
      'Spain',
    ],
    foundedYear: 1880,
    description:
      'A global information analytics and scholarly publishing company, publishing research in health sciences, life sciences, physical sciences, and the social sciences.',
    mission: 'To advance research and health science by providing the world with information and analytics.',
    website: 'https://www.elsevier.com',
    verificationStatus: 'Verified',
    trustScore: 94,
    divisions: [
      div('el-div-1', 'Health Sciences', 'Journals', 'Medical and health research journals including The Lancet and Cell.', 2800),
      div('el-div-2', 'Physical Sciences', 'Journals', 'Chemistry, physics, engineering, and materials science journals.', 1800),
      div('el-div-3', 'Books Division', 'Books', 'Reference works, handbooks, and textbooks.', 1200),
      div('el-div-4', 'Analytics', 'Education', 'Data analytics products for research intelligence.', 15),
    ],
    imprints: [
      imprint('el-imp-1', 'Academic Press', 1941, ['Reference', 'Life Sciences'], 'Scientific books and journals.', ['United States', 'United Kingdom'], false),
      imprint('el-imp-2', 'Morgan Kaufmann', 1984, ['Computer Science', 'Data Systems'], 'Computer science professional and academic titles.', ['United States'], false),
      imprint('el-imp-3', 'Gulf Professional Publishing', 1983, ['Engineering', 'Petroleum'], 'Engineering reference and professional books.', ['United States', 'United Kingdom'], false),
    ],
    bookSeries: [
      series('el-ser-1', 'Advances in Cancer Research', 'Life Sciences', ['Dr. K. D. Tew', 'Prof. P. B. Fisher'], 165, true, false),
      series('el-ser-2', 'Handbook of Clinical Neurology', 'Medicine', ['Prof. M. J. Aminoff', 'Prof. F. Boller'], 180, true, false),
    ],
    editorialOffices: [
      office('el-off-1', 'Amsterdam', 'Netherlands', 'Europe', ['Global Editorial', 'Production'], 900, 'Headquarters and global editorial.'),
      office('el-off-2', 'Oxford', 'United Kingdom', 'Europe', ['STM Editorial'], 420, 'Science, technology, and medicine editorial.'),
      office('el-off-3', 'Cambridge, MA', 'United States', 'North America', ['Health Sciences Editorial'], 380, 'North American health sciences.'),
      office('el-off-4', 'Beijing', 'China', 'Asia', ['Regional Office'], 120, 'Greater China operations.'),
    ],
    policies: [
      policy('el-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2018-01-01', 'Gold and hybrid journals', 'Supports gold, green, and hybrid open access routes across its journal portfolio.'),
      policy('el-pol-2', 'Publishing Ethics', 'Ethics', 'Active', '2016-05-01', 'All publications', 'COPE-compliant publishing ethics and misconduct procedures.'),
      policy('el-pol-3', 'Research Data Policy', 'Data Sharing', 'Active', '2019-11-01', 'Data journals and repositories', 'Requires research data statements and supports Mendeley Data.'),
    ],
    metrics: {
      journals: 2800,
      conferences: 60,
      proceedings: 45,
      bookSeries: 2,
      books: 1200,
      articlesPublished: 680000,
      citations: 32000000,
      downloads: 890000000,
      openAccessShare: 32,
      acceptanceRate: 12,
      editorialOffices: 4,
      countriesServed: 12,
      annualRevenue: 2800000000,
      currency: 'EUR',
    },
    journals: [
      jref('lancet', 'The Lancet', 'Medicine', 'Hybrid', 'Q1', 98.4, '0140-6736', 'United Kingdom'),
      jref('cell', 'Cell', 'Life Sciences', 'Hybrid', 'Q1', 45.5, '0092-8674', 'United States'),
      jref('pattern-recognition', 'Pattern Recognition', 'Computer Science', 'Hybrid', 'Q1', 7.7, '0031-3203', 'United Kingdom'),
    ],
    conferences: [
      cref('el-conf-1', 'Lancet Summit on Global Health', 'International Conference', 'London', 'United Kingdom', '2026-06-14'),
      cref('el-conf-2', 'Cell Symposium: Systems Biology', 'Symposium', 'Cambridge', 'United Kingdom', '2026-09-02'),
    ],
    proceedings: [
      pref('el-proc-1', 'Lancet Summit on Global Health 2026', 'lancet-summit-2026', 'Lancet Summit on Global Health', '2026', 320, 'Published', '0301-1001', '10.1000/elancet'),
    ],
    books: [
      book('el-book-1', 'Principles of Neural Science', ['Eric R. Kandel', 'James H. Schwartz'], 'Textbook', '2021', 1640, '978-0-1257-4614-4'),
      book('el-book-2', 'The Elements of Statistical Learning', ['Trevor Hastie', 'Robert Tibshirani'], 'Reference Work', '2009', 745, '978-0-3878-4857-0'),
    ],
    timeline: [
      timelineEntry('el-tim-1', '1880-01-01', 'Elsevier founded', 'Founded in Rotterdam as a publishing house bearing the Elsevier family name.', 'Founded'),
      timelineEntry('el-tim-2', '1991-01-01', 'Cell Press acquired', 'Acquired Cell Press, adding Cell and its sister journals.', 'Acquisition'),
      timelineEntry('el-tim-3', '2013-01-01', 'Reed Elsevier rebrand', 'Rebranded from Reed Elsevier to RELX Group with Elsevier as the academic arm.', 'Anniversary'),
      timelineEntry('el-tim-4', '2020-06-01', 'Transformative agreements', 'Signed national transformative open access agreements across Europe.', 'Partnership'),
    ],
  }),
  makePublisher(2, {
    id: 'springer-nature',
    name: 'Springer Nature',
    shortName: 'Springer Nature',
    acronym: 'SN',
    logo: '🌍',
    type: 'commercial',
    headquarters: 'Berlin, Germany',
    city: 'Berlin',
    country: 'Germany',
    continent: 'Europe',
    countriesServed: [
      'Germany',
      'United States',
      'United Kingdom',
      'China',
      'India',
      'Japan',
      'France',
      'Netherlands',
      'Switzerland',
      'Australia',
      'Canada',
      'Brazil',
    ],
    foundedYear: 2015,
    description:
      'A global academic publishing company formed from the merger of Springer Science+Business Media and Nature Publishing Group.',
    mission: 'To advance discovery and open up research to the benefit of society.',
    website: 'https://www.springernature.com',
    verificationStatus: 'Verified',
    trustScore: 93,
    divisions: [
      div('sn-div-1', 'Nature Portfolio', 'Journals', 'The Nature-branded family of research and review journals.', 160),
      div('sn-div-2', 'Springer Journals', 'Journals', 'The Springer scientific and technical journal programme.', 2200),
      div('sn-div-3', 'Books', 'Books', 'Monographs, textbooks, and reference works.', 15000),
      div('sn-div-4', 'Open Research', 'Open Access', 'Fully open access journals and platforms including Scientific Reports.', 600),
    ],
    imprints: [
      imprint('sn-imp-1', 'Palgrave Macmillan', 1843, ['Humanities', 'Social Sciences'], 'Humanities and social science scholarship.', ['United Kingdom', 'United States'], false),
      imprint('sn-imp-2', 'Springer', 1842, ['Science', 'Technology', 'Medicine'], 'The founding Springer science imprint.', ['Germany', 'United States'], false),
      imprint('sn-imp-3', 'Apress', 2002, ['Technology', 'Programming'], 'Practical technology and developer books.', ['United States'], false),
    ],
    bookSeries: [
      series('sn-ser-1', 'Lecture Notes in Computer Science', 'Computer Science', ['Prof. D. Hutchison', 'Prof. M. Naor'], 15400, true, false),
      series('sn-ser-2', 'Nature Reviews Drug Discovery', 'Life Sciences', ['Dr. J. K. Willmann'], 1, true, true),
    ],
    editorialOffices: [
      office('sn-off-1', 'Berlin', 'Germany', 'Europe', ['Global Editorial', 'Books'], 800, 'Headquarters and books programme.'),
      office('sn-off-2', 'London', 'United Kingdom', 'Europe', ['Nature Portfolio'], 500, 'Nature-branded journals.'),
      office('sn-off-3', 'New York', 'United States', 'North America', ['Open Research', 'STM'], 350, 'North American editorial and open research.'),
      office('sn-off-4', 'Tokyo', 'Japan', 'Asia', ['Regional Office'], 90, 'Japan and Asia Pacific.'),
    ],
    policies: [
      policy('sn-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2015-01-01', 'Open Research portfolio', 'Transformative agreements and fully open access journals under the Open Research brand.'),
      policy('sn-pol-2', 'Research Integrity', 'Research Integrity', 'Active', '2020-09-01', 'All publications', 'COPE-aligned integrity and image screening for all manuscripts.'),
      policy('sn-pol-3', 'Data Policy', 'Data Sharing', 'Active', '2017-04-01', 'Research data', 'Recommends data availability statements across its journals.'),
    ],
    metrics: {
      journals: 2900,
      conferences: 80,
      proceedings: 70,
      bookSeries: 2,
      books: 15000,
      articlesPublished: 470000,
      citations: 19000000,
      downloads: 610000000,
      openAccessShare: 30,
      acceptanceRate: 15,
      editorialOffices: 4,
      countriesServed: 12,
      annualRevenue: 2500000000,
      currency: 'EUR',
    },
    journals: [
      jref('nature', 'Nature', 'Multidisciplinary', 'Hybrid', 'Q1', 50.5, '0028-0836', 'United Kingdom'),
      jref('scientific-reports', 'Scientific Reports', 'Multidisciplinary', 'Open Access', 'Q1', 3.8, '2045-2322', 'United Kingdom'),
      jref('nature-machine-intelligence', 'Nature Machine Intelligence', 'Computer Science', 'Hybrid', 'Q1', 23.8, '2522-5839', 'United Kingdom'),
    ],
    conferences: [
      cref('sn-conf-1', 'Nature Conferences: Machine Intelligence', 'International Conference', 'Heidelberg', 'Germany', '2026-10-18'),
      cref('sn-conf-2', 'Springer Forum on Open Research', 'Symposium', 'Berlin', 'Germany', '2026-04-22'),
    ],
    proceedings: [
      pref('sn-proc-1', 'Springer Forum on Open Research 2026', 'sn-forum-2026', 'Springer Forum on Open Research', '2026', 145, 'In Production', '0302-9743', '10.1007/snforum'),
    ],
    books: [
      book('sn-book-1', 'Artificial Intelligence: A Modern Approach', ['Stuart Russell', 'Peter Norvig'], 'Textbook', '2020', 1115, '978-0-1346-1099-3'),
      book('sn-book-2', 'The Nature of Computation', ['Cristopher Moore', 'Stephan Mertens'], 'Monograph', '2011', 985, '978-0-1992-3321-4'),
    ],
    timeline: [
      timelineEntry('sn-tim-1', '1842-01-01', 'Springer founded', 'Julius Springer founded the Springer publishing house in Berlin.', 'Founded'),
      timelineEntry('sn-tim-2', '1869-11-04', 'Nature launched', 'The first issue of Nature was published in London.', 'Launch'),
      timelineEntry('sn-tim-3', '2015-05-01', 'Springer Nature formed', 'Merger of Springer Science+Business Media and Nature Publishing Group.', 'Anniversary'),
      timelineEntry('sn-tim-4', '2021-03-01', 'First national OA agreement', 'Signed the German Projekt DEAL transformative agreement.', 'Partnership'),
    ],
  }),
  makePublisher(3, {
    id: 'wiley',
    name: 'Wiley',
    shortName: 'Wiley',
    acronym: 'WY',
    logo: '📚',
    type: 'commercial',
    headquarters: 'Hoboken, New Jersey, United States',
    city: 'Hoboken',
    country: 'United States',
    continent: 'North America',
    countriesServed: [
      'United States',
      'United Kingdom',
      'Germany',
      'China',
      'India',
      'Japan',
      'Australia',
      'Canada',
      'Brazil',
      'Singapore',
      'Netherlands',
      'France',
    ],
    foundedYear: 1807,
    description:
      'A global publisher delivering scientific, technical, medical, and scholarly research, education, and learning materials.',
    mission: 'To unlock human potential by advancing knowledge through research, publishing, and education.',
    website: 'https://www.wiley.com',
    verificationStatus: 'Verified',
    trustScore: 92,
    divisions: [
      div('wy-div-1', 'Research Publishing', 'Journals', 'STM journals across physical, life, and social sciences.', 1900),
      div('wy-div-2', 'Books', 'Books', 'Academic monographs, textbooks, and reference works.', 3200),
      div('wy-div-3', 'Learning', 'Education', 'Educational materials and learning platforms.', 900),
    ],
    imprints: [
      imprint('wy-imp-1', 'Wiley-VCH', 1921, ['Chemistry', 'Materials'], 'German-language and international chemistry and materials publishing.', ['Germany', 'United States'], false),
      imprint('wy-imp-2', 'Jossey-Bass', 1967, ['Education', 'Leadership'], 'Education and leadership professional books.', ['United States'], false),
      imprint('wy-imp-3', 'Wiley-Blackwell', 2007, ['STM', 'Social Sciences'], 'The merged Blackwell science and humanities imprint.', ['United States', 'United Kingdom'], false),
    ],
    bookSeries: [
      series('wy-ser-1', 'Materials Science and Technology', 'Materials Science', ['Prof. R. W. Cahn'], 27, true, false),
      series('wy-ser-2', 'Wiley Series in Probability and Statistics', 'Statistics', ['Prof. N. Balakrishnan'], 120, true, false),
    ],
    editorialOffices: [
      office('wy-off-1', 'Hoboken', 'United States', 'North America', ['Global Editorial', 'Books'], 700, 'Headquarters.'),
      office('wy-off-2', 'Oxford', 'United Kingdom', 'Europe', ['STM Editorial'], 450, 'European research editorial.'),
      office('wy-off-3', 'Weinheim', 'Germany', 'Europe', ['Chemistry Editorial'], 220, 'Chemistry and materials journals.'),
    ],
    policies: [
      policy('wy-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2017-01-01', 'Hybrid and gold journals', 'Offers gold and hybrid open access options across its journal portfolio.'),
      policy('wy-pol-2', 'Ethical Publishing Policy', 'Ethics', 'Active', '2018-02-01', 'All publications', 'COPE-aligned ethics, authorship, and misconduct standards.'),
      policy('wy-pol-3', 'Transformative Agreements', 'Transformative Agreements', 'Under Review', '2024-01-01', 'National consortia', 'Negotiating transformative agreements with national library consortia.'),
    ],
    metrics: {
      journals: 1900,
      conferences: 40,
      proceedings: 30,
      bookSeries: 2,
      books: 3200,
      articlesPublished: 300000,
      citations: 12000000,
      downloads: 420000000,
      openAccessShare: 28,
      acceptanceRate: 14,
      editorialOffices: 3,
      countriesServed: 12,
      annualRevenue: 1900000000,
      currency: 'USD',
    },
    journals: [
      jref('advanced-materials', 'Advanced Materials', 'Materials Science', 'Hybrid', 'Q1', 27.4, '0935-9648', 'Germany'),
      jref('angewandte-chemie', 'Angewandte Chemie International Edition', 'Chemistry', 'Hybrid', 'Q1', 16.6, '1433-7851', 'Germany'),
      jref('journal-of-forecasting', 'Journal of Forecasting', 'Economics', 'Hybrid', 'Q2', 2.7, '0277-6693', 'United Kingdom'),
    ],
    conferences: [
      cref('wy-conf-1', 'Wiley Materials Science Congress', 'International Conference', 'Boston', 'United States', '2026-07-08'),
    ],
    proceedings: [
      pref('wy-proc-1', 'Wiley Materials Science Congress 2026', 'wy-matsci-2026', 'Wiley Materials Science Congress', '2026', 210, 'Planned', '0731-4902', '10.1002/wymsc'),
    ],
    books: [
      book('wy-book-1', 'Statistics for Business and Economics', ['Paul Newbold', 'William L. Carlson'], 'Textbook', '2019', 832, '978-0-1327-6058-8'),
      book('wy-book-2', 'An Introduction to Machine Learning', ['Miroslav Kubat'], 'Textbook', '2021', 348, '978-3-0308-1935-0'),
    ],
    timeline: [
      timelineEntry('wy-tim-1', '1807-01-01', 'Wiley founded', 'Charles Wiley opened a print shop in Manhattan.', 'Founded'),
      timelineEntry('wy-tim-2', '2007-02-01', 'Wiley-Blackwell formed', 'Acquired Blackwell Publishing to form Wiley-Blackwell.', 'Acquisition'),
      timelineEntry('wy-tim-3', '2019-06-01', 'Partnered with Hindawi', 'Acquired Hindawi to expand its open access portfolio.', 'Partnership'),
    ],
  }),
  makePublisher(4, {
    id: 'taylor-and-francis',
    name: 'Taylor & Francis',
    shortName: 'Taylor & Francis',
    acronym: 'T&F',
    logo: '📐',
    type: 'commercial',
    headquarters: 'London, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    continent: 'Europe',
    countriesServed: [
      'United Kingdom',
      'United States',
      'Australia',
      'India',
      'China',
      'Japan',
      'Canada',
      'Germany',
      'Singapore',
      'South Africa',
      'Brazil',
      'Netherlands',
    ],
    foundedYear: 1852,
    description:
      'A global publisher of academic journals, books, and online media, part of Informa plc, spanning the humanities, social sciences, and science.',
    mission: 'To connect people with the knowledge they need to advance research and society.',
    website: 'https://www.tandfonline.com',
    verificationStatus: 'Verified',
    trustScore: 91,
    divisions: [
      div('tf-div-1', 'Journals', 'Journals', 'Humanities, social science, and STM journals.', 2700),
      div('tf-div-2', 'Books', 'Books', 'Academic monographs and textbooks.', 2600),
      div('tf-div-3', 'CRC Press', 'Books', 'Science, technology, engineering, and mathematics professional books.', 1800),
    ],
    imprints: [
      imprint('tf-imp-1', 'Routledge', 1851, ['Humanities', 'Social Sciences'], 'A leading global academic publisher in the humanities and social sciences.', ['United Kingdom', 'United States'], false),
      imprint('tf-imp-2', 'CRC Press', 1903, ['Engineering', 'Mathematics'], 'STEM reference and professional publishing.', ['United States', 'United Kingdom'], false),
      imprint('tf-imp-3', 'Psychology Press', 1975, ['Psychology', 'Cognition'], 'Psychology research and reference titles.', ['United Kingdom', 'United States'], false),
    ],
    bookSeries: [
      series('tf-ser-1', 'Routledge Advances in Sociology', 'Sociology', ['Prof. P. Sztompka'], 420, true, false),
      series('tf-ser-2', 'Computational Mathematics', 'Mathematics', ['Prof. A. Quarteroni'], 90, true, false),
    ],
    editorialOffices: [
      office('tf-off-1', 'London', 'United Kingdom', 'Europe', ['Global Editorial'], 600, 'Headquarters.'),
      office('tf-off-2', 'New York', 'United States', 'North America', ['HSS Editorial'], 350, 'Humanities and social sciences.'),
      office('tf-off-3', 'Boca Raton', 'United States', 'North America', ['CRC Press'], 180, 'STEM professional publishing.'),
    ],
    policies: [
      policy('tf-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2016-01-01', 'Gold and hybrid journals', 'Open select programme and gold open access options across journals.'),
      policy('tf-pol-2', 'Ethics and Integrity', 'Research Integrity', 'Active', '2019-01-01', 'All publications', 'COPE-aligned standards for authorship, peer review, and misconduct.'),
      policy('tf-pol-3', 'Diversity and Inclusion', 'Diversity', 'Active', '2021-01-01', 'Editorial boards', 'Commitments to diverse editorial boards and inclusive publishing.'),
    ],
    metrics: {
      journals: 2700,
      conferences: 30,
      proceedings: 20,
      bookSeries: 2,
      books: 2600,
      articlesPublished: 250000,
      citations: 9000000,
      downloads: 380000000,
      openAccessShare: 25,
      acceptanceRate: 16,
      editorialOffices: 3,
      countriesServed: 12,
      annualRevenue: 1200000000,
      currency: 'GBP',
    },
    journals: [
      jref('ijhcs', 'International Journal of Human-Computer Studies', 'Computer Science', 'Hybrid', 'Q1', 5.3, '1071-5819', 'United Kingdom'),
      jref('educational-psychology', 'Educational Psychology', 'Psychology', 'Hybrid', 'Q1', 2.9, '0144-3410', 'United Kingdom'),
    ],
    conferences: [
      cref('tf-conf-1', 'Routledge Social Science Forum', 'Symposium', 'London', 'United Kingdom', '2026-05-06'),
    ],
    proceedings: [
      pref('tf-proc-1', 'Routledge Social Science Forum 2026', 'tf-ssf-2026', 'Routledge Social Science Forum', '2026', 88, 'Planned', '0966-7355', '10.1080/tfssf'),
    ],
    books: [
      book('tf-book-1', 'Introduction to Human-Computer Interaction', ['Yvonne Rogers', 'Helen Sharp'], 'Textbook', '2019', 640, '978-1-1380-8029-9'),
      book('tf-book-2', 'The Routledge Companion to Sociology', ['Prof. P. Sztompka'], 'Reference Work', '2021', 720, '978-1-1383-3407-3', 'Routledge Advances in Sociology'),
    ],
    timeline: [
      timelineEntry('tf-tim-1', '1852-01-01', 'Taylor & Francis founded', 'Founded by William Francis and Richard Taylor in London.', 'Founded'),
      timelineEntry('tf-tim-2', '2004-01-01', 'Informa acquisition', 'Acquired by Informa plc, forming the academic division.', 'Acquisition'),
      timelineEntry('tf-tim-3', '2011-01-01', 'Routledge integration', 'Routledge fully integrated into the Taylor & Francis division.', 'Anniversary'),
    ],
  }),
  makePublisher(5, {
    id: 'emerald',
    name: 'Emerald Publishing',
    shortName: 'Emerald',
    acronym: 'EM',
    logo: '💎',
    type: 'commercial',
    headquarters: 'Leeds, United Kingdom',
    city: 'Leeds',
    country: 'United Kingdom',
    continent: 'Europe',
    countriesServed: [
      'United Kingdom',
      'United States',
      'India',
      'China',
      'Australia',
      'Canada',
      'Germany',
      'Nigeria',
      'South Africa',
      'Malaysia',
      'Brazil',
      'Singapore',
    ],
    foundedYear: 1967,
    description:
      'A scholarly publisher of journals and books in management, business, education, and library science, founded in the United Kingdom.',
    mission: 'To make a positive difference to individuals, organisations, and society through knowledge.',
    website: 'https://www.emeraldgrouppublishing.com',
    verificationStatus: 'Trusted',
    trustScore: 88,
    divisions: [
      div('em-div-1', 'Management and Business', 'Journals', 'Management, business, and leadership journals.', 180),
      div('em-div-2', 'Education', 'Education', 'Education research and practice journals.', 80),
      div('em-div-3', 'Emerald Books', 'Books', 'Monographs and edited collections.', 400),
    ],
    imprints: [
      imprint('em-imp-1', 'Emerald Insight', 2000, ['Journals', 'Case Studies'], 'Digital journal and case study platform.', ['United Kingdom', 'United States'], false),
      imprint('em-imp-2', 'Emerald Books', 2011, ['Business', 'Management'], 'Book programme across business and management.', ['United Kingdom'], false),
    ],
    bookSeries: [
      series('em-ser-1', 'Advances in Library and Information Science', 'Library Science', ['Prof. A. Katsirikou'], 40, true, false),
      series('em-ser-2', 'Emerald Studies in Higher Education', 'Education', ['Prof. J. Blackmore'], 30, true, false),
    ],
    editorialOffices: [
      office('em-off-1', 'Leeds', 'United Kingdom', 'Europe', ['Global Editorial'], 220, 'Headquarters.'),
      office('em-off-2', 'Bingley', 'United Kingdom', 'Europe', ['Production'], 90, 'Production and operations.'),
      office('em-off-3', 'Melbourne', 'Australia', 'Oceania', ['Regional Editorial'], 25, 'Asia Pacific regional office.'),
    ],
    policies: [
      policy('em-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2018-01-01', 'Gold journals', 'Gold open access options and a growing fully open journal portfolio.'),
      policy('em-pol-2', 'Research Impact Policy', 'Transparency', 'Active', '2020-01-01', 'All publications', 'Publishes transparent impact statements with every article.'),
    ],
    metrics: {
      journals: 260,
      conferences: 15,
      proceedings: 10,
      bookSeries: 2,
      books: 400,
      articlesPublished: 45000,
      citations: 1800000,
      downloads: 120000000,
      openAccessShare: 18,
      acceptanceRate: 20,
      editorialOffices: 3,
      countriesServed: 12,
      annualRevenue: 250000000,
      currency: 'GBP',
    },
    journals: [
      jref('jkm', 'Journal of Knowledge Management', 'Business', 'Hybrid', 'Q1', 6.6, '1367-3270', 'United Kingdom'),
      jref('benchmarking', 'Benchmarking: An International Journal', 'Management', 'Hybrid', 'Q2', 2.6, '1463-5771', 'United Kingdom'),
    ],
    conferences: [
      cref('em-conf-1', 'Emerald Management Conference', 'International Conference', 'Leeds', 'United Kingdom', '2026-06-25'),
    ],
    proceedings: [
      pref('em-proc-1', 'Emerald Management Conference 2026', 'em-mgmt-2026', 'Emerald Management Conference', '2026', 95, 'In Production', '1382-6980', '10.1108/emconf'),
    ],
    books: [
      book('em-book-1', 'Knowledge Management: An Integrated Approach', ['Prof. Jashapara'], 'Textbook', '2011', 448, '978-0-2737-2597-0'),
      book('em-book-2', 'Academic Libraries and the Digital Divide', ['Dr. L. Stover'], 'Monograph', '2022', 210, '978-1-8038-2683-0', 'Advances in Library and Information Science'),
    ],
    timeline: [
      timelineEntry('em-tim-1', '1967-01-01', 'Emerald founded', 'Founded as MCB University Press in Bradford, England.', 'Founded'),
      timelineEntry('em-tim-2', '2001-01-01', 'Rebranded as Emerald', 'Rebranded from MCB University Press to Emerald.', 'Anniversary'),
      timelineEntry('em-tim-3', '2015-01-01', 'Emerald publishing group', 'Restructured as Emerald Publishing with a global presence.', 'Launch'),
    ],
  }),
  makePublisher(6, {
    id: 'sage',
    name: 'Sage Publishing',
    shortName: 'Sage',
    acronym: 'SG',
    logo: '🌿',
    type: 'commercial',
    headquarters: 'Thousand Oaks, California, United States',
    city: 'Thousand Oaks',
    country: 'United States',
    continent: 'North America',
    countriesServed: [
      'United States',
      'United Kingdom',
      'India',
      'China',
      'Australia',
      'Canada',
      'Germany',
      'Japan',
      'South Korea',
      'Brazil',
      'South Africa',
      'Singapore',
    ],
    foundedYear: 1965,
    description:
      'An independent academic publisher of journals, books, and library products across the social sciences, STEM, and medicine.',
    mission: 'To provide the knowledge that enables and empowers individuals to make a positive difference.',
    website: 'https://us.sagepub.com',
    verificationStatus: 'Trusted',
    trustScore: 90,
    divisions: [
      div('sg-div-1', 'Social Sciences', 'Journals', 'Sociology, psychology, and political science journals.', 700),
      div('sg-div-2', 'STM', 'Journals', 'Science, technology, and medicine journals.', 300),
      div('sg-div-3', 'Sage Books', 'Books', 'Academic textbooks and reference works.', 1500),
      div('sg-div-4', 'Sage Open', 'Open Access', 'Fully open access journals and platforms.', 120),
    ],
    imprints: [
      imprint('sg-imp-1', 'SAGE Open', 2011, ['Open Access', 'Multidisciplinary'], 'Fully open access multidisciplinary journal.', ['United States', 'United Kingdom'], true),
      imprint('sg-imp-2', 'Corwin', 1990, ['Education', 'K-12'], 'Education professional development resources.', ['United States'], false),
      imprint('sg-imp-3', 'CQ Press', 1945, ['Politics', 'Reference'], 'Reference works in US politics.', ['United States'], false),
    ],
    bookSeries: [
      series('sg-ser-1', 'SAGE Benchmarks in Social Research', 'Sociology', ['Prof. D. Silverman'], 25, true, false),
      series('sg-ser-2', 'Research Methods for Social Scientists', 'Methodology', ['Prof. A. Bryman'], 18, true, false),
    ],
    editorialOffices: [
      office('sg-off-1', 'Thousand Oaks', 'United States', 'North America', ['Global Editorial'], 400, 'Headquarters.'),
      office('sg-off-2', 'London', 'United Kingdom', 'Europe', ['Social Sciences Editorial'], 300, 'European social sciences.'),
      office('sg-off-3', 'New Delhi', 'India', 'Asia', ['Regional Office'], 80, 'India and South Asia.'),
      office('sg-off-4', 'Singapore', 'Asia', 'Asia', ['Regional Office'], 60, 'Southeast Asia and the Pacific.'),
    ],
    policies: [
      policy('sg-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2015-01-01', 'SAGE Open portfolio', 'Fully open access and green OA options across the portfolio.'),
      policy('sg-pol-2', 'Ethics Policy', 'Ethics', 'Active', '2017-01-01', 'All publications', 'COPE-aligned authorship and research ethics standards.'),
      policy('sg-pol-3', 'Methodology Transparency', 'Transparency', 'Under Review', '2024-02-01', 'Quantitative research', 'Encourages reproducible methods and preregistration.'),
    ],
    metrics: {
      journals: 1000,
      conferences: 20,
      proceedings: 12,
      bookSeries: 2,
      books: 1500,
      articlesPublished: 180000,
      citations: 7000000,
      downloads: 290000000,
      openAccessShare: 20,
      acceptanceRate: 17,
      editorialOffices: 4,
      countriesServed: 12,
      annualRevenue: 900000000,
      currency: 'USD',
    },
    journals: [
      jref('jmr', 'Journal of Marketing Research', 'Marketing', 'Hybrid', 'Q1', 5.1, '0022-2437', 'United States'),
      jref('journal-of-management', 'Journal of Management', 'Management', 'Hybrid', 'Q1', 13.5, '0149-2063', 'United States'),
    ],
    conferences: [
      cref('sg-conf-1', 'SAGE Methods Festival', 'Symposium', 'London', 'United Kingdom', '2026-03-18'),
    ],
    proceedings: [
      pref('sg-proc-1', 'SAGE Methods Festival 2026', 'sg-methods-2026', 'SAGE Methods Festival', '2026', 120, 'Planned', '1079-5673', '10.1177/sgfest'),
    ],
    books: [
      book('sg-book-1', 'Research Design: Qualitative, Quantitative, and Mixed Methods', ['John W. Creswell', 'J. David Creswell'], 'Textbook', '2018', 304, '978-1-5063-8670-8'),
      book('sg-book-2', 'Social Research Methods', ['Alan Bryman'], 'Textbook', '2016', 768, '978-0-1996-8945-0', 'Research Methods for Social Scientists'),
    ],
    timeline: [
      timelineEntry('sg-tim-1', '1965-01-01', 'Sage founded', 'Founded by Sara Miller McCune in New York.', 'Founded'),
      timelineEntry('sg-tim-2', '2011-01-01', 'SAGE Open launched', 'Launched SAGE Open, a fully open access journal.', 'Launch'),
      timelineEntry('sg-tim-3', '2017-01-01', 'Open agreements', 'Signed open access agreements with research consortia.', 'Partnership'),
    ],
  }),
  makePublisher(7, {
    id: 'ieee',
    name: 'IEEE',
    shortName: 'IEEE Publishing',
    acronym: 'IEEE',
    logo: '🤖',
    type: 'learned-society',
    headquarters: 'Piscataway, New Jersey, United States',
    city: 'Piscataway',
    country: 'United States',
    continent: 'North America',
    countriesServed: [
      'United States',
      'China',
      'India',
      'Japan',
      'Germany',
      'United Kingdom',
      'Canada',
      'South Korea',
      'France',
      'Australia',
      'Brazil',
      'Singapore',
    ],
    foundedYear: 1963,
    description:
      'The world’s largest technical professional organisation dedicated to advancing technology, publishing journals, transactions, and conference proceedings in electrical engineering and computer science.',
    mission: 'To foster technological innovation and excellence for the benefit of humanity.',
    website: 'https://www.ieee.org',
    verificationStatus: 'Verified',
    trustScore: 97,
    divisions: [
      div('ieee-div-1', 'IEEE Journals', 'Journals', 'Journals and transactions across IEEE societies.', 290),
      div('ieee-div-2', 'IEEE Conferences', 'Conferences', 'The world’s largest conference portfolio in engineering.', 1900),
      div('ieee-div-3', 'IEEE Xplore', 'Reference', 'The digital library for IEEE publications and standards.', 1),
      div('ieee-div-4', 'Open Access', 'Open Access', 'Fully open access journals including IEEE Access.', 25),
    ],
    imprints: [
      imprint('ieee-imp-1', 'IEEE Computer Society', 1946, ['Computer Science', 'AI'], 'Computer science journals, magazines, and proceedings.', ['United States'], false),
      imprint('ieee-imp-2', 'IEEE Signal Processing Society', 1948, ['Signal Processing', 'AI'], 'Signal processing publications.', ['United States'], false),
    ],
    bookSeries: [
      series('ieee-ser-1', 'IEEE Press Series on Power Engineering', 'Engineering', ['Prof. M. El-Hawary'], 60, true, false),
      series('ieee-ser-2', 'IEEE Press Series on Digital and Mobile Communication', 'Communications', ['Prof. J. Proakis'], 40, true, false),
    ],
    editorialOffices: [
      office('ieee-off-1', 'Piscataway', 'United States', 'North America', ['Global Editorial', 'Production'], 500, 'Headquarters and IEEE Xplore.'),
      office('ieee-off-2', 'Washington, DC', 'United States', 'North America', ['Policy', 'Standards'], 150, 'Public policy and standards.'),
      office('ieee-off-3', 'Singapore', 'Asia', 'Asia', ['Regional Office'], 90, 'Asia Pacific operations.'),
      office('ieee-off-4', 'London', 'United Kingdom', 'Europe', ['Regional Office'], 60, 'Europe, Middle East, and Africa.'),
    ],
    policies: [
      policy('ieee-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2019-01-01', 'IEEE Access and gold journals', 'Supports gold, green, and transformative open access publishing.'),
      policy('ieee-pol-2', 'Plagiarism Policy', 'Plagiarism', 'Active', '2010-01-01', 'All publications', 'All submissions are screened for plagiarism with Crossref Similarity Check.'),
      policy('ieee-pol-3', 'Artificial Intelligence Policy', 'Research Integrity', 'Under Review', '2024-05-01', 'AI-generated content', 'Guidance on AI-generated text, images, and authorship disclosure.'),
    ],
    metrics: {
      journals: 290,
      conferences: 1900,
      proceedings: 1900,
      bookSeries: 2,
      books: 120,
      articlesPublished: 220000,
      citations: 14000000,
      downloads: 520000000,
      openAccessShare: 15,
      acceptanceRate: 30,
      editorialOffices: 4,
      countriesServed: 12,
      annualRevenue: 1600000000,
      currency: 'USD',
    },
    journals: [
      jref('ieee-tpami', 'IEEE Transactions on Pattern Analysis and Machine Intelligence', 'Computer Science', 'Hybrid', 'Q1', 20.8, '0162-8828', 'United States'),
      jref('ieee-access', 'IEEE Access', 'Engineering', 'Open Access', 'Q2', 3.4, '2169-3536', 'United States'),
    ],
    conferences: [
      cref('ieee-conf-1', 'IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)', 'International Conference', 'Nashville', 'United States', '2026-06-13'),
      cref('ieee-conf-2', 'IEEE International Conference on Robotics and Automation (ICRA)', 'International Conference', 'Kyoto', 'Japan', '2026-05-17'),
    ],
    proceedings: [
      pref('ieee-proc-1', 'CVPR 2026 Conference Proceedings', 'cvpr-2026', 'IEEE/CVF CVPR', '2026', 4200, 'Published', '1063-6919', '10.1109/CVPR'),
      pref('ieee-proc-2', 'ICRA 2026 Conference Proceedings', 'icra-2026', 'IEEE ICRA', '2026', 2800, 'In Production', '1050-4729', '10.1109/ICRA'),
    ],
    books: [
      book('ieee-book-1', 'The Art of Computer Programming', ['Donald E. Knuth'], 'Reference Work', '1968', 665, '978-0-2010-3804-5', 'IEEE Press'),
      book('ieee-book-2', 'Pattern Recognition and Machine Learning', ['Christopher M. Bishop'], 'Textbook', '2006', 738, '978-0-3873-1073-2'),
    ],
    timeline: [
      timelineEntry('ieee-tim-1', '1963-01-01', 'IEEE founded', 'Formed from the merger of the AIEE and the IRE.', 'Founded'),
      timelineEntry('ieee-tim-2', '1988-01-01', 'IEEE Xplore launched', 'The IEEE digital library went live.', 'Launch'),
      timelineEntry('ieee-tim-3', '2013-01-01', 'IEEE Access launched', 'Launched IEEE Access, a fully open access journal.', 'Launch'),
      timelineEntry('ieee-tim-4', '2021-01-01', 'Transformative agreements', 'Signed large-scale open access agreements with national consortia.', 'Partnership'),
    ],
  }),
  makePublisher(8, {
    id: 'acm',
    name: 'Association for Computing Machinery',
    shortName: 'ACM',
    acronym: 'ACM',
    logo: '⌨️',
    type: 'learned-society',
    headquarters: 'New York, New York, United States',
    city: 'New York',
    country: 'United States',
    continent: 'North America',
    countriesServed: [
      'United States',
      'China',
      'India',
      'Germany',
      'United Kingdom',
      'Canada',
      'Japan',
      'France',
      'Australia',
      'South Korea',
      'Brazil',
      'Switzerland',
    ],
    foundedYear: 1947,
    description:
      'The world’s largest computing society, publishing the ACM Digital Library, journals, magazines, and the proceedings of flagship computing conferences.',
    mission: 'To advance computing as a science and a profession.',
    website: 'https://www.acm.org',
    verificationStatus: 'Verified',
    trustScore: 95,
    divisions: [
      div('acm-div-1', 'ACM Journals', 'Journals', 'Computing journals and transactions.', 60),
      div('acm-div-2', 'ACM Conferences', 'Conferences', 'Flagship SIG conferences and proceedings.', 170),
      div('acm-div-3', 'ACM Books', 'Books', 'The ACM Books series for computing education.', 80),
      div('acm-div-4', 'ACM Digital Library', 'Reference', 'The digital library of ACM publications.', 1),
    ],
    imprints: [
      imprint('acm-imp-1', 'ACM SIGPLAN', 1969, ['Programming Languages'], 'Programming languages journals and proceedings.', ['United States'], false),
      imprint('acm-imp-2', 'ACM SIGCHI', 1982, ['Human-Computer Interaction'], 'HCI conferences and publications.', ['United States'], false),
      imprint('acm-imp-3', 'ACM Books', 2014, ['Computing', 'Education'], 'Monographs and reference volumes in computing.', ['United States', 'United Kingdom'], false),
    ],
    bookSeries: [
      series('acm-ser-1', 'ACM Books', 'Computer Science', ['Prof. M. J. Rosenblum'], 60, true, false),
      series('acm-ser-2', 'ACM Transactions on Database Systems Library', 'Databases', ['Prof. D. Suciu'], 12, true, false),
    ],
    editorialOffices: [
      office('acm-off-1', 'New York', 'United States', 'North America', ['Global Editorial', 'Digital Library'], 300, 'Headquarters.'),
      office('acm-off-2', 'Washington, DC', 'United States', 'North America', ['Public Policy'], 40, 'Computing policy.'),
      office('acm-off-3', 'London', 'United Kingdom', 'Europe', ['Regional Office'], 30, 'Europe operations.'),
    ],
    policies: [
      policy('acm-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2019-01-01', 'OpenTOC and ACM OPEN', 'ACM OPEN is a fully open access publishing model.'),
      policy('acm-pol-2', 'Authorship and Research Integrity', 'Research Integrity', 'Active', '2020-01-01', 'All publications', 'Policies on authorship, data availability, and generative AI.'),
      policy('acm-pol-3', 'Computing Research Ethics', 'Ethics', 'Active', '2018-01-01', 'All publications', 'Ethics review aligned with the ACM Code of Ethics.'),
    ],
    metrics: {
      journals: 60,
      conferences: 170,
      proceedings: 170,
      bookSeries: 2,
      books: 80,
      articlesPublished: 150000,
      citations: 11000000,
      downloads: 480000000,
      openAccessShare: 22,
      acceptanceRate: 28,
      editorialOffices: 3,
      countriesServed: 12,
      annualRevenue: 600000000,
      currency: 'USD',
    },
    journals: [
      jref('cacm', 'Communications of the ACM', 'Computer Science', 'Hybrid', 'Q1', 7.4, '0001-0782', 'United States'),
      jref('jacm', 'Journal of the ACM', 'Computer Science', 'Hybrid', 'Q1', 2.9, '0004-5411', 'United States'),
      jref('acm-computing-surveys', 'ACM Computing Surveys', 'Computer Science', 'Hybrid', 'Q1', 23.8, '0360-0300', 'United States'),
    ],
    conferences: [
      cref('acm-conf-1', 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining', 'International Conference', 'Barcelona', 'Spain', '2026-08-23'),
      cref('acm-conf-2', 'ACM CHI Conference on Human Factors in Computing Systems', 'International Conference', 'Berlin', 'Germany', '2026-05-10'),
    ],
    proceedings: [
      pref('acm-proc-1', 'KDD 2026 Conference Proceedings', 'kdd-2026', 'ACM SIGKDD', '2026', 1800, 'Published', '2331-8422', '10.1145/KDD'),
      pref('acm-proc-2', 'CHI 2026 Conference Proceedings', 'chi-2026', 'ACM CHI', '2026', 3200, 'In Production', '2471-0420', '10.1145/CHI'),
    ],
    books: [
      book('acm-book-1', 'The Handbook of Computational Linguistics', ['Prof. A. Clark'], 'Handbook', '2021', 480, '978-1-4503-8956-0', 'ACM Books'),
      book('acm-book-2', 'Introduction to Algorithms', ['Thomas H. Cormen', 'Charles E. Leiserson'], 'Textbook', '2009', 1312, '978-0-2620-3384-8'),
    ],
    timeline: [
      timelineEntry('acm-tim-1', '1947-01-01', 'ACM founded', 'Founded as the Eastern Association for Computing Machinery in New York.', 'Founded'),
      timelineEntry('acm-tim-2', '2001-01-01', 'ACM Digital Library launched', 'The ACM Digital Library went online.', 'Launch'),
      timelineEntry('acm-tim-3', '2014-01-01', 'ACM Books series', 'Launched the ACM Books monograph series.', 'Launch'),
    ],
  }),
  makePublisher(9, {
    id: 'oxford-university-press',
    name: 'Oxford University Press',
    shortName: 'OUP',
    acronym: 'OUP',
    logo: '🎓',
    type: 'university-press',
    headquarters: 'Oxford, United Kingdom',
    city: 'Oxford',
    country: 'United Kingdom',
    continent: 'Europe',
    countriesServed: [
      'United Kingdom',
      'United States',
      'India',
      'China',
      'Japan',
      'Australia',
      'Canada',
      'Germany',
      'France',
      'South Africa',
      'Brazil',
      'Netherlands',
    ],
    foundedYear: 1586,
    description:
      'The largest university press in the world, publishing academic journals, monographs, reference works, and educational materials.',
    mission: 'To further the University of Oxford’s objective of excellence in research, scholarship, and education.',
    website: 'https://global.oup.com',
    verificationStatus: 'Verified',
    trustScore: 96,
    divisions: [
      div('oup-div-1', 'Academic Journals', 'Journals', 'Journals across the humanities, social sciences, and sciences.', 530),
      div('oup-div-2', 'Books', 'Books', 'Monographs, reference works, and the Oxford handbooks.', 6000),
      div('oup-div-3', 'Education', 'Education', 'School and higher education materials.', 8000),
      div('oup-div-4', 'Oxford Open', 'Open Access', 'Fully open access journals and transformative agreements.', 90),
    ],
    imprints: [
      imprint('oup-imp-1', 'Oxford Academic', 2016, ['Journals', 'Reference'], 'Digital platform for OUP journals and reference.', ['United Kingdom', 'United States'], false),
      imprint('oup-imp-2', 'Oxford Handbooks', 2000, ['All disciplines'], 'Authoritative handbook series across disciplines.', ['United Kingdom', 'United States'], false),
      imprint('oup-imp-3', 'Clarendon Press', 1902, ['Science', 'Classics'], 'The academic book imprint of the press.', ['United Kingdom'], false),
    ],
    bookSeries: [
      series('oup-ser-1', 'Oxford Handbooks', 'Multidisciplinary', ['OUP Editorial Board'], 1200, true, false),
      series('oup-ser-2', 'Oxford Studies in Diachronic Linguistics', 'Linguistics', ['Prof. A. Giacalone Ramat'], 45, true, false),
    ],
    editorialOffices: [
      office('oup-off-1', 'Oxford', 'United Kingdom', 'Europe', ['Global Editorial', 'Books'], 900, 'Headquarters.'),
      office('oup-off-2', 'New York', 'United States', 'North America', ['Academic Editorial'], 400, 'North American academic publishing.'),
      office('oup-off-3', 'New Delhi', 'India', 'Asia', ['Regional Office'], 250, 'India and South Asia.'),
      office('oup-off-4', 'Cape Town', 'South Africa', 'Africa', ['Regional Office'], 60, 'Southern Africa operations.'),
    ],
    policies: [
      policy('oup-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2017-01-01', 'Oxford Open portfolio', 'Transformative agreements and the Oxford Open fully open access model.'),
      policy('oup-pol-2', 'Research Ethics Policy', 'Ethics', 'Active', '2019-01-01', 'All publications', 'COPE-aligned ethics and editorial standards.'),
      policy('oup-pol-3', 'Copyright and Licensing', 'Copyright', 'Active', '2016-01-01', 'All publications', 'Transparent copyright and CC licensing across the portfolio.'),
    ],
    metrics: {
      journals: 530,
      conferences: 25,
      proceedings: 15,
      bookSeries: 2,
      books: 6000,
      articlesPublished: 160000,
      citations: 6500000,
      downloads: 350000000,
      openAccessShare: 24,
      acceptanceRate: 18,
      editorialOffices: 4,
      countriesServed: 12,
      annualRevenue: 1100000000,
      currency: 'GBP',
    },
    journals: [
      jref('bioinformatics', 'Bioinformatics', 'Life Sciences', 'Hybrid', 'Q1', 5.8, '1367-4803', 'United Kingdom'),
      jref('jamia', 'Journal of the American Medical Informatics Association', 'Medicine', 'Hybrid', 'Q1', 6.4, '1067-5027', 'United States'),
      jref('restud', 'The Review of Economic Studies', 'Economics', 'Hybrid', 'Q1', 7.3, '0034-6527', 'United Kingdom'),
    ],
    conferences: [
      cref('oup-conf-1', 'Oxford University Press Linguistics Forum', 'Symposium', 'Oxford', 'United Kingdom', '2026-09-18'),
    ],
    proceedings: [
      pref('oup-proc-1', 'OUP Linguistics Forum 2026', 'oup-ling-2026', 'OUP Linguistics Forum', '2026', 75, 'Planned', '1351-0825', '10.1093/oupling'),
    ],
    books: [
      book('oup-book-1', 'The Oxford Handbook of Linguistics', ['Prof. B. Aarts'], 'Handbook', '2021', 928, '978-0-1988-6519-1', 'Oxford Handbooks'),
      book('oup-book-2', 'The Structure of Scientific Revolutions', ['Thomas S. Kuhn'], 'Monograph', '1962', 226, '978-0-2264-5808-3', 'Clarendon Press'),
    ],
    timeline: [
      timelineEntry('oup-tim-1', '1586-01-01', 'OUP founded', 'Printing began at the University of Oxford.', 'Founded'),
      timelineEntry('oup-tim-2', '1880-01-01', 'Modern OUP era', 'The press expanded beyond Oxford with the Clarendon Press renewal.', 'Anniversary'),
      timelineEntry('oup-tim-3', '2017-01-01', 'Oxford Open launched', 'Launched the Oxford Open open access programme.', 'Launch'),
    ],
  }),
  makePublisher(10, {
    id: 'university-of-hawaii-press',
    name: 'University of Hawaiʻi Press',
    shortName: 'U Hawaiʻi Press',
    acronym: 'UHP',
    logo: '🌺',
    type: 'university-press',
    headquarters: 'Honolulu, Hawaiʻi, United States',
    city: 'Honolulu',
    country: 'United States',
    continent: 'North America',
    countriesServed: [
      'United States',
      'Japan',
      'China',
      'South Korea',
      'Philippines',
      'Vietnam',
      'Indonesia',
      'New Zealand',
      'Australia',
      'Fiji',
      'Taiwan',
      'Guam',
    ],
    foundedYear: 1947,
    description:
      'The university press of the University of Hawaiʻi, publishing in Asian studies, Pacific studies, Asian American studies, linguistics, and the natural sciences.',
    mission: 'To publish works that enrich the cultural and intellectual life of Hawaiʻi and the wider Asia-Pacific region.',
    website: 'https://uhpress.hawaii.edu',
    verificationStatus: 'Verified',
    trustScore: 90,
    divisions: [
      div('uhp-div-1', 'Asian Studies', 'Books', 'Asian studies monographs and journals.', 30),
      div('uhp-div-2', 'Pacific Studies', 'Books', 'Pacific studies and Pacific Islands scholarship.', 25),
      div('uhp-div-3', 'Language and Linguistics', 'Journals', 'Language documentation and linguistics titles.', 12),
    ],
    imprints: [
      imprint('uhp-imp-1', 'Pali Text Society', 1881, ['Buddhism', 'Pali'], 'Scholarly editions of Pali texts.', ['United Kingdom', 'United States'], false),
      imprint('uhp-imp-2', 'Kolowalu Books', 1980, ['Hawaiian Culture'], 'General interest books on Hawaiʻi.', ['United States'], false),
    ],
    bookSeries: [
      series('uhp-ser-1', 'Oceanic Linguistics Special Publications', 'Linguistics', ['Prof. J. Lynch'], 40, true, false),
      series('uhp-ser-2', 'Spatial Habitus: Making and Meaning in Asia’s Architecture', 'Asian Studies', ['Prof. G. Barme'], 12, true, false),
    ],
    editorialOffices: [
      office('uhp-off-1', 'Honolulu', 'United States', 'North America', ['Editorial', 'Production'], 40, 'Headquarters.'),
      office('uhp-off-2', 'Tokyo', 'Japan', 'Asia', ['Distribution'], 5, 'Asia Pacific distribution.'),
    ],
    policies: [
      policy('uhp-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2020-01-01', 'Selected journals', 'Open access options for linguistics and Pacific studies titles.'),
      policy('uhp-pol-2', 'Language Documentation Ethics', 'Ethics', 'Active', '2021-01-01', 'Language documentation', 'Community consent and language community ethics requirements.'),
    ],
    metrics: {
      journals: 12,
      conferences: 1,
      proceedings: 1,
      bookSeries: 2,
      books: 40,
      articlesPublished: 1200,
      citations: 35000,
      downloads: 1800000,
      openAccessShare: 45,
      acceptanceRate: 40,
      editorialOffices: 2,
      countriesServed: 12,
      annualRevenue: 12000000,
      currency: 'USD',
    },
    journals: deriveJournals('University of Hawaiʻi Press'),
    conferences: deriveConferences('University of Hawaiʻi Press'),
    proceedings: deriveProceedings('University of Hawaiʻi Press'),
    books: [
      book('uhp-book-1', 'From a Native Daughter', ['Haunani-Kay Trask'], 'Monograph', '1999', 288, '978-0-8248-2059-4'),
      book('uhp-book-2', 'Oceanic Linguistics and the Language Documentation Movement', ['Prof. J. Lynch'], 'Edited Volume', '2023', 380, '978-0-8248-3334-1', 'Oceanic Linguistics Special Publications'),
    ],
    timeline: [
      timelineEntry('uhp-tim-1', '1947-01-01', 'University of Hawaiʻi Press founded', 'Established as the scholarly publisher of the University of Hawaiʻi.', 'Founded'),
      timelineEntry('uhp-tim-2', '1961-01-01', 'Oceanic Linguistics launched', 'Launched the Oceanic Linguistics journal.', 'Launch'),
      timelineEntry('uhp-tim-3', '2023-01-01', 'Language documentation programme', 'Expanded open access language documentation publishing.', 'Publication'),
    ],
  }),
  makePublisher(11, {
    id: 'university-of-ghana-press',
    name: 'University of Ghana Press',
    shortName: 'U Ghana Press',
    acronym: 'UGP',
    logo: '🌍',
    type: 'university-press',
    headquarters: 'Accra, Ghana',
    city: 'Accra',
    country: 'Ghana',
    continent: 'Africa',
    countriesServed: [
      'Ghana',
      'Nigeria',
      'Kenya',
      'South Africa',
      'United States',
      'United Kingdom',
      'Germany',
      'Canada',
      'India',
      'Japan',
      'China',
      'Brazil',
    ],
    foundedYear: 1962,
    description:
      'The scholarly publishing arm of the University of Ghana, publishing African scholarship in the humanities, social sciences, and sciences.',
    mission: 'To advance African scholarship and research dissemination across the continent and beyond.',
    website: 'https://www.ug.edu.gh/press',
    verificationStatus: 'Trusted',
    trustScore: 85,
    divisions: [
      div('ugp-div-1', 'Journal Programme', 'Journals', 'Peer-reviewed journals across the humanities and sciences.', 8),
      div('ugp-div-2', 'Book Programme', 'Books', 'Monographs and edited volumes in African studies.', 30),
      div('ugp-div-3', 'Conference Proceedings', 'Conferences', 'Proceedings for conferences hosted by the University of Ghana.', 5),
    ],
    imprints: [
      imprint('ugp-imp-1', 'Legon Press', 1972, ['African Studies', 'History'], 'The flagship academic imprint of the press.', ['Ghana', 'Nigeria'], false),
      imprint('ugp-imp-2', 'Ghana Educational Publishing', 1990, ['Education', 'Textbooks'], 'Educational materials for Ghanaian schools.', ['Ghana'], false),
    ],
    bookSeries: [
      series('ugp-ser-1', 'Legon Series in African Studies', 'African Studies', ['Prof. A. Adu Boahen'], 25, true, false),
      series('ugp-ser-2', 'Ghana Economic and Policy Studies', 'Economics', ['Prof. E. Aryeetey'], 15, true, false),
    ],
    editorialOffices: [
      office('ugp-off-1', 'Accra', 'Ghana', 'Africa', ['Editorial', 'Production'], 25, 'Headquarters.'),
      office('ugp-off-2', 'Legon', 'Ghana', 'Africa', ['Journal Coordination'], 8, 'Journal and conference coordination.'),
    ],
    policies: [
      policy('ugp-pol-1', 'Open Access Policy', 'Open Access', 'Active', '2021-01-01', 'Selected journals', 'Open access options for flagship journals.'),
      policy('ugp-pol-2', 'African Scholarship Ethics', 'Ethics', 'Active', '2022-01-01', 'All publications', 'Indigenous knowledge protection and research ethics requirements.'),
    ],
    metrics: {
      journals: 8,
      conferences: 1,
      proceedings: 1,
      bookSeries: 2,
      books: 30,
      articlesPublished: 600,
      citations: 18000,
      downloads: 900000,
      openAccessShare: 60,
      acceptanceRate: 42,
      editorialOffices: 2,
      countriesServed: 12,
      annualRevenue: 4000000,
      currency: 'GHS',
    },
    journals: [
      jref('legon-humanities', 'Legon Journal of the Humanities', 'Humanities', 'Open Access', 'Q3', 0.4, '2458-746X', 'Ghana'),
      jref('ghana-journal-of-science', 'Ghana Journal of Science', 'Multidisciplinary', 'Open Access', 'Q3', 0.5, '0855-144X', 'Ghana'),
    ],
    conferences: deriveConferences('University of Ghana Press'),
    proceedings: deriveProceedings('University of Ghana Press'),
    books: [
      book('ugp-book-1', 'A History of the University of Ghana', ['Prof. A. Adu Boahen'], 'Monograph', '1987', 480, '978-9-9634-2955-4', 'Legon Series in African Studies'),
      book('ugp-book-2', 'Ghana’s Economic Transformation', ['Prof. E. Aryeetey'], 'Edited Volume', '2021', 412, '978-9-9634-2956-1', 'Ghana Economic and Policy Studies'),
    ],
    timeline: [
      timelineEntry('ugp-tim-1', '1962-01-01', 'University of Ghana Press founded', 'Established to publish the research of the University of Ghana.', 'Founded'),
      timelineEntry('ugp-tim-2', '1972-01-01', 'Legon Press imprint', 'Launched the Legon Press academic imprint.', 'Launch'),
      timelineEntry('ugp-tim-3', '2021-01-01', 'Open access programme', 'Introduced open access for flagship journals.', 'Publication'),
    ],
  }),
];

export const FEATURED_PUBLISHER: Publisher = PUBLISHERS[0];

export const PUBLISHER_CATEGORIES: PublisherType[] = Array.from(
  new Set(PUBLISHERS.map((publisher) => publisher.type))
);

export const PUBLISHER_RELATIONSHIPS: PublisherRelationships = buildRelationships(0);

function buildPublisherStatistics(): PublisherStatistics {
  const publishers = PUBLISHERS;
  const sum = (key: keyof PublishingMetrics) =>
    publishers.reduce((total, publisher) => total + (publisher.metrics[key] as number), 0);
  const countries = new Set(publishers.flatMap((publisher) => publisher.countriesServed));
  const continents = new Set(publishers.map((publisher) => publisher.continent));
  const acceptanceRates = publishers
    .map((publisher) => publisher.metrics.acceptanceRate)
    .filter((rate): rate is number => rate !== undefined);
  const averageAcceptanceRate =
    acceptanceRates.length > 0
      ? Math.round(acceptanceRates.reduce((total, rate) => total + rate, 0) / acceptanceRates.length)
      : 0;
  return {
    totalPublishers: publishers.length,
    totalJournals: sum('journals'),
    totalConferences: sum('conferences'),
    totalProceedings: sum('proceedings'),
    totalBookSeries: sum('bookSeries'),
    totalBooks: sum('books'),
    totalEditorialOffices: sum('editorialOffices'),
    countriesServed: countries.size,
    continentsServed: continents.size,
    openAccessPublishers: publishers.filter((publisher) => publisher.openAccess).length,
    verifiedPublishers: publishers.filter((publisher) => publisher.verificationStatus === 'Verified').length,
    trustedPublishers: publishers.filter((publisher) => publisher.verificationStatus === 'Trusted').length,
    totalArticlesPublished: sum('articlesPublished'),
    totalCitations: sum('citations'),
    totalDownloads: sum('downloads'),
    averageAcceptanceRate,
    averageTrustScore: Math.round(
      publishers.reduce((total, publisher) => total + publisher.trustScore, 0) / publishers.length
    ),
  };
}

function buildPublisherAnalytics(): PublisherAnalytics {
  const publishers = PUBLISHERS;
  const sum = (key: keyof PublishingMetrics) =>
    publishers.reduce((total, publisher) => total + (publisher.metrics[key] as number), 0);
  const publishersByType: JournalByTypeStat[] = Array.from(new Set(publishers.map((publisher) => publisher.type)))
    .map((type) => ({
      type,
      count: publishers.filter((publisher) => publisher.type === type).length,
    }))
    .sort((a, b) => b.count - a.count);
  const publishersByContinent: ContinentPublisherStat[] = Array.from(
    new Set(publishers.map((publisher) => publisher.continent))
  )
    .map((continent) => ({
      continent,
      count: publishers.filter((publisher) => publisher.continent === continent).length,
    }))
    .sort((a, b) => b.count - a.count);
  const divisionTypes = Array.from(new Set(publishers.flatMap((publisher) => publisher.divisions.map((d) => d.type))));
  const outputByDivision: DivisionOutputStat[] = divisionTypes.map((division) => ({
    division,
    count: publishers
      .flatMap((publisher) => publisher.divisions)
      .filter((d) => d.type === division)
      .reduce((total, d) => total + (d.outputCount ?? 0), 0),
  }));
  return {
    totalPublishers: publishers.length,
    totalJournals: sum('journals'),
    totalConferences: sum('conferences'),
    totalProceedings: sum('proceedings'),
    totalBookSeries: sum('bookSeries'),
    totalBooks: sum('books'),
    totalEditorialOffices: sum('editorialOffices'),
    countriesServed: new Set(publishers.flatMap((publisher) => publisher.countriesServed)).size,
    continentsServed: new Set(publishers.map((publisher) => publisher.continent)).size,
    totalArticlesPublished: sum('articlesPublished'),
    totalCitations: sum('citations'),
    totalDownloads: sum('downloads'),
    averageTrustScore: Math.round(
      publishers.reduce((total, publisher) => total + publisher.trustScore, 0) / publishers.length
    ),
    openAccessShare: Math.round(
      (publishers.filter((publisher) => publisher.openAccess).length / publishers.length) * 100
    ),
    publishersByType,
    publishersByContinent,
    outputByDivision,
  };
}

export const PUBLISHER_PORTFOLIO_STATISTICS: PublisherStatistics = buildPublisherStatistics();

export const PUBLISHER_PORTFOLIO_ANALYTICS: PublisherAnalytics = buildPublisherAnalytics();

export const PUBLISHER_PORTFOLIO: PublisherPortfolio = {
  statistics: PUBLISHER_PORTFOLIO_STATISTICS,
  analytics: PUBLISHER_PORTFOLIO_ANALYTICS,
  publishers: PUBLISHERS,
  featuredPublisher: FEATURED_PUBLISHER,
  relationships: PUBLISHER_RELATIONSHIPS,
  categories: PUBLISHER_CATEGORIES,
};
