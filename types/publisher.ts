import type { JournalQuartile, OpenAccessStatus } from '@/types/identity';
import type { CurrencyCode } from '@/types/funding';

/**
 * The scholarly publisher layer of the Scholatia ecosystem.
 *
 * The Publishers module is the platform-wide layer under which journals,
 * conferences, and proceedings are published. It does NOT introduce a new
 * lifecycle stage; instead it sits across the existing publication stage
 * (stage 11) and conference stage (stage 12), reusing the canonical
 * `ResearchLifecycleEngine` and the journal, conference, manuscript, dataset,
 * institution, researcher, and funding placeholder modules for every
 * cross-module reference.
 */

export type PublisherType =
  | 'commercial'
  | 'university-press'
  | 'learned-society'
  | 'open-access'
  | 'non-profit'
  | 'institutional';

export type PublisherVerificationStatus = 'Verified' | 'Trusted' | 'Pending';

export interface PublishingDivision {
  id: string;
  name: string;
  type:
    | 'Journals'
    | 'Books'
    | 'Conferences'
    | 'Open Access'
    | 'Education'
    | 'Reference';
  description?: string;
  countries?: string[];
  outputCount?: number;
}

export interface Imprint {
  id: string;
  name: string;
  foundedYear?: number;
  focusAreas: string[];
  description?: string;
  countries?: string[];
  openAccess?: boolean;
}

export interface BookSeries {
  id: string;
  name: string;
  discipline: string;
  description?: string;
  editors: string[];
  volumes?: number;
  active: boolean;
  openAccess?: boolean;
}

export interface PublisherJournalRef {
  journalId: string;
  title: string;
  issn?: string;
  discipline?: string;
  openAccessStatus?: OpenAccessStatus;
  quartile?: JournalQuartile;
  impactFactor?: number;
  country?: string;
}

export interface PublisherConferenceRef {
  conferenceId: string;
  title: string;
  eventType?: string;
  city?: string;
  country?: string;
  date?: string;
}

export interface ProceedingsRef {
  proceedingsId: string;
  title: string;
  conferenceId?: string;
  conference?: string;
  year?: string;
  volume?: string;
  numberOfPapers?: number;
  issn?: string;
  doiPrefix?: string;
  publicationStatus?: 'Published' | 'In Production' | 'Planned';
}

export type PublisherBookType =
  | 'Monograph'
  | 'Edited Volume'
  | 'Textbook'
  | 'Reference Work'
  | 'Handbook'
  | 'Proceedings';

export interface PublisherBook {
  id: string;
  title: string;
  authors: string[];
  series?: string;
  year?: string;
  pages?: number;
  isbn?: string;
  type: PublisherBookType;
  openAccess?: boolean;
}

export interface EditorialOffice {
  id: string;
  city: string;
  country: string;
  continent: string;
  region?: string;
  roles: string[];
  staffCount?: number;
  focus?: string;
}

export interface PublishingPolicy {
  id: string;
  name: string;
  type:
    | 'Open Access'
    | 'Peer Review'
    | 'Research Integrity'
    | 'Ethics'
    | 'Data Sharing'
    | 'Copyright'
    | 'Licensing'
    | 'Plagiarism'
    | 'Diversity'
    | 'Transparency'
    | 'Transformative Agreements';
  status: 'Active' | 'Under Review' | 'Draft';
  effectiveDate?: string;
  scope?: string;
  description?: string;
}

export interface PublishingMetrics {
  journals: number;
  conferences: number;
  proceedings: number;
  bookSeries: number;
  books: number;
  articlesPublished: number;
  citations: number;
  downloads: number;
  openAccessShare: number;
  acceptanceRate?: number;
  editorialOffices: number;
  countriesServed: number;
  annualRevenue?: number;
  currency?: CurrencyCode;
}

export interface PublisherRelationshipRef {
  id: string;
  title: string;
  detail?: string;
}

/**
 * Cross-module references owned by a publisher. Every entry reuses existing
 * placeholder identity (a journal id, a conference id, a dataset DOI, a SAID,
 * a grant id) so no data is duplicated.
 */
export interface PublisherRelationships {
  journals: PublisherRelationshipRef[];
  conferences: PublisherRelationshipRef[];
  proceedings: PublisherRelationshipRef[];
  manuscripts: PublisherRelationshipRef[];
  datasets: PublisherRelationshipRef[];
  projects: PublisherRelationshipRef[];
  publications: PublisherRelationshipRef[];
  researchers: PublisherRelationshipRef[];
  institutions: PublisherRelationshipRef[];
  grants: PublisherRelationshipRef[];
}

export type PublisherTimelineEntryType =
  | 'Founded'
  | 'Publication'
  | 'Partnership'
  | 'Anniversary'
  | 'Acquisition'
  | 'Launch'
  | 'Award';

export interface PublisherTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: PublisherTimelineEntryType;
}

export interface JournalByTypeStat {
  type: PublisherType;
  count: number;
}

export interface ContinentPublisherStat {
  continent: string;
  count: number;
}

export interface DivisionOutputStat {
  division: string;
  count: number;
}

export interface PublisherAnalytics {
  totalPublishers: number;
  totalJournals: number;
  totalConferences: number;
  totalProceedings: number;
  totalBookSeries: number;
  totalBooks: number;
  totalEditorialOffices: number;
  countriesServed: number;
  continentsServed: number;
  totalArticlesPublished: number;
  totalCitations: number;
  totalDownloads: number;
  averageTrustScore: number;
  openAccessShare: number;
  publishersByType: JournalByTypeStat[];
  publishersByContinent: ContinentPublisherStat[];
  outputByDivision: DivisionOutputStat[];
}

export interface PublisherStatistics {
  totalPublishers: number;
  totalJournals: number;
  totalConferences: number;
  totalProceedings: number;
  totalBookSeries: number;
  totalBooks: number;
  totalEditorialOffices: number;
  countriesServed: number;
  continentsServed: number;
  openAccessPublishers: number;
  verifiedPublishers: number;
  trustedPublishers: number;
  totalArticlesPublished: number;
  totalCitations: number;
  totalDownloads: number;
  averageAcceptanceRate: number;
  averageTrustScore: number;
}

/**
 * The aggregate publisher record. Mirrors the cross-module position of the
 * platform and embeds the full publishing ecosystem: divisions, imprints,
 * book series, editorial offices, publishing policies, metrics, journal and
 * conference portfolios, proceedings, books, a timeline, and cross-module
 * relationships.
 */
export interface Publisher {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  logo: string;
  type: PublisherType;
  headquarters: string;
  city: string;
  country: string;
  continent: string;
  countriesServed: string[];
  foundedYear?: number;
  description: string;
  mission?: string;
  website: string;
  verificationStatus: PublisherVerificationStatus;
  trustScore: number;
  openAccess?: boolean;
  divisions: PublishingDivision[];
  imprints: Imprint[];
  bookSeries: BookSeries[];
  editorialOffices: EditorialOffice[];
  policies: PublishingPolicy[];
  metrics: PublishingMetrics;
  journals: PublisherJournalRef[];
  conferences: PublisherConferenceRef[];
  proceedings: ProceedingsRef[];
  books: PublisherBook[];
  timeline: PublisherTimelineEntry[];
  relationships: PublisherRelationships;
}

export interface PublisherPortfolio {
  statistics: PublisherStatistics;
  analytics: PublisherAnalytics;
  publishers: Publisher[];
  featuredPublisher: Publisher;
  relationships: PublisherRelationships;
  categories: PublisherType[];
}
