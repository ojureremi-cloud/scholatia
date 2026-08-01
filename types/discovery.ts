import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * The unified scholarly discovery layer of the Scholatia ecosystem.
 *
 * The Discovery module is the platform-wide search surface over every existing
 * module. It does NOT introduce a new lifecycle stage and does NOT own its own
 * records; instead it derives a single searchable index from the existing
 * Researchers, Journals, Conferences, Institutions, Publishers, Projects,
 * Publications, Datasets, Manuscripts, and Funding placeholder modules. Every
 * discovery result references its original source identity (a SAID, a journal
 * id, a conference id, a DOI, a grant id) so no data is duplicated.
 */

export type DiscoveryEntityType =
  | 'researcher'
  | 'journal'
  | 'conference'
  | 'institution'
  | 'publisher'
  | 'project'
  | 'publication'
  | 'dataset'
  | 'manuscript'
  | 'funding';

/**
 * Aggregation category for browsing. `all` is the union of every entity type.
 */
export type DiscoveryCategory = 'all' | DiscoveryEntityType;

/**
 * A single entry in the unified searchable index. Every field is derived from
 * the original source record; `sourceId` and `url` keep the reference live.
 */
export interface DiscoveryItem {
  id: string;
  entityType: DiscoveryEntityType;
  /** Original source identity (SAID, journalId, conferenceId, DOI, grant id). */
  sourceId: string;
  title: string;
  summary: string;
  description?: string;
  keywords: string[];
  discipline?: string;
  researchAreas: string[];
  authors?: string[];
  organizations?: string[];
  country?: string;
  continent?: string;
  year?: string;
  status?: string;
  tags: string[];
  /** Base relevance weight used to rank results within a category. */
  score: number;
  /** Canonical route to the original record within the app. */
  url: string;
  /** ISO date used for recency ranking. */
  dateAdded: string;
  /** Canonical lifecycle stage id of the source record, when applicable. */
  stageId?: ResearchLifecycleStageId;
}

export interface DiscoveryFacet {
  id: string;
  name: string;
  category: 'entityType' | 'discipline' | 'country' | 'continent' | 'year' | 'status';
  count: number;
}

export interface DiscoveryFilter {
  id: string;
  label: string;
  type: 'category' | 'discipline' | 'country' | 'continent' | 'year' | 'status' | 'keyword';
  value: string;
  count?: number;
  active?: boolean;
}

export interface DiscoveryQuery {
  query: string;
  category: DiscoveryCategory;
  filters: DiscoveryFilter[];
  page: number;
  pageSize: number;
  sortBy: 'relevance' | 'recent' | 'title';
  scope: 'all' | 'scholatia' | 'global';
}

/**
 * A single match produced by ranking the index against a query. `matchedFields`
 * records which item fields contributed to the match.
 */
export interface DiscoveryResult {
  item: DiscoveryItem;
  relevanceScore: number;
  matchedFields: string[];
}

export interface DiscoveryRanking {
  id: string;
  label: string;
  items: DiscoveryItem[];
  basis: string;
  metric?: string;
}

export interface DiscoverySuggestion {
  id: string;
  query: string;
  type: 'historical' | 'popular' | 'trending' | 'recommended' | 'recent';
  count?: number;
  entityType?: DiscoveryEntityType;
}

export interface DiscoveryCollection {
  id: string;
  title: string;
  description: string;
  coverIcon: string;
  items: DiscoveryItem[];
  entityType?: DiscoveryEntityType;
  curator: string;
  updatedAt: string;
  theme?: string;
}

export interface DiscoveryRelationship {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: DiscoveryEntityType;
  targetId: string;
  targetTitle: string;
  targetType: DiscoveryEntityType;
  relation: string;
  weight: number;
}

export interface DiscoveryTimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: DiscoveryEntityType;
}

export interface CategoryDiscoveryStat {
  entityType: DiscoveryEntityType;
  count: number;
}

export interface DisciplineDiscoveryStat {
  discipline: string;
  count: number;
}

export interface ContinentDiscoveryStat {
  continent: string;
  count: number;
}

export interface KeywordDiscoveryStat {
  keyword: string;
  count: number;
}

export interface DiscoveryAnalytics {
  totalItems: number;
  totalCategories: number;
  searches: number;
  uniqueSearches: number;
  clickThroughRate: number;
  averageRelevance: number;
  itemsByCategory: CategoryDiscoveryStat[];
  itemsByDiscipline: DisciplineDiscoveryStat[];
  itemsByContinent: ContinentDiscoveryStat[];
  topKeywords: KeywordDiscoveryStat[];
  trendingTopics: DiscoverySuggestion[];
}

export interface DiscoveryStatistics {
  totalItems: number;
  totalResearchers: number;
  totalJournals: number;
  totalConferences: number;
  totalInstitutions: number;
  totalPublishers: number;
  totalProjects: number;
  totalPublications: number;
  totalDatasets: number;
  totalManuscripts: number;
  totalFunding: number;
  totalCountries: number;
  totalContinents: number;
  totalDisciplines: number;
  totalKeywords: number;
  totalCollections: number;
  topKeyword: string;
  averageScore: number;
}

/**
 * Aggregate root of the module: the full index plus derived browsing,
 * ranking, suggestion, collection, relationship, timeline, analytics, and
 * statistics surfaces.
 */
export interface DiscoveryPortfolio {
  statistics: DiscoveryStatistics;
  analytics: DiscoveryAnalytics;
  items: DiscoveryItem[];
  categories: DiscoveryCategory[];
  facets: DiscoveryFacet[];
  collections: DiscoveryCollection[];
  suggestions: DiscoverySuggestion[];
  rankings: DiscoveryRanking[];
  relationships: DiscoveryRelationship[];
  timeline: DiscoveryTimelineEntry[];
}
