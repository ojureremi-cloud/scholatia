# Scholatia Discovery Platform Architecture

## Purpose

The Discovery Platform implements the unified search surface of the Scholatia
ecosystem. It is the platform-wide layer that lets a single query reach
researchers, journals, conferences, institutions, publishers, projects,
publications, datasets, manuscripts, and funding opportunities. The module does
**not** introduce a new lifecycle stage and does **not** own its own records;
instead it derives a single searchable index from the existing placeholder
modules and keeps a live reference back to every original record.

The module provides a route, a component library, a placeholder data model, and
strong TypeScript types for describing the full discovery ecosystem: the unified
index, facets, filters, queries, ranked results, suggestions, curated
collections, rankings, cross-module relationships, a recent-activity timeline,
analytics, statistics, and the aggregate `DiscoveryPortfolio`.

The module is **additive**: it reuses the existing design system, existing page
patterns, existing placeholder modules, and the existing
`ResearchLifecycleEngine`. It introduces no new packages, no duplicate records,
no APIs, no database, no server actions, no authentication changes, and no
external search dependency.

## Relationship to the Research Lifecycle

- Discovery is a cross-module layer, like Publishers and Institutions, and does
  NOT own a lifecycle stage. It surfaces records that belong to other stages:
  funding (stage 5), projects (stage 6), datasets (stage 8), manuscripts
  (submission stage 10 and peer review), publications (publication stage 11),
  and conferences (conference stage 12).
- `DISCOVERY_LIFECYCLE_STAGE_ID` is explicitly `undefined` in
  `constants/placeholder-discovery.ts` to make this cross-module position
  explicit and testable.
- Individual `DiscoveryItem.stageId` values are copied from the original source
  record (e.g. a manuscript's current stage), never redefined — the lifecycle
  definitions remain sourced from the `ResearchLifecycleEngine`
  (`lib/lifecycle.ts`).
- Every `DiscoveryItem` keeps `sourceId` (a SAID, a journal id, a conference id,
  a DOI, a grant id) and a canonical `url` to the original record, so discovery
  never duplicates data.

## Entity model

Types live in `types/discovery.ts`.

| Entity | Description |
|---|---|
| `DiscoveryEntityType` | The ten indexable entity types: researcher, journal, conference, institution, publisher, project, publication, dataset, manuscript, funding. |
| `DiscoveryCategory` | `'all'` plus every entity type, for browsing the index by module. |
| `DiscoveryItem` | A single entry in the unified searchable index: id, entity type, source id, title, summary, description, keywords, research areas, authors, organizations, country, continent, year, status, tags, base relevance score, canonical url, date added, optional lifecycle stage id. |
| `DiscoveryFacet` | A browse dimension with count: entity type, discipline, country, continent, year, status. |
| `DiscoveryFilter` | An active refinement derived from a facet or category with a type vocabulary. |
| `DiscoveryQuery` | The search query shape: text, category, filters, page, page size, sort mode (`relevance`/`recent`/`title`), scope (`all`/`scholatia`/`global`). |
| `DiscoveryResult` | A ranked match: item, relevance score, and the `matchedFields` that contributed. |
| `DiscoveryRanking` | A leaderboard: label, basis, optional metric, and ranked items. |
| `DiscoverySuggestion` | A search suggestion: query, type (`historical`/`popular`/`trending`/`recommended`/`recent`), optional count, optional entity type. |
| `DiscoveryCollection` | A curated theme: title, description, cover icon, matched items, optional entity type, curator, updated date, theme. |
| `DiscoveryRelationship` | A derived cross-module edge: source and target titles/types/ids, relation label, weight. |
| `DiscoveryTimelineEntry` | Recent activity: date, title, detail, entity type. |
| `CategoryDiscoveryStat`, `DisciplineDiscoveryStat`, `ContinentDiscoveryStat`, `KeywordDiscoveryStat` | Analytic tallies for the index. |
| `DiscoveryAnalytics` | Aggregate analytics: totals, searches, unique searches, click-through rate, average relevance, items by category/discipline/continent, top keywords, trending topics. |
| `DiscoveryStatistics` | Statistic-card level aggregates: totals per module, countries, continents, disciplines, keywords, collections, top keyword, average score. |
| `DiscoveryPortfolio` | Aggregate root of the module: statistics, analytics, items, categories, facets, collections, suggestions, rankings, relationships, timeline. |

## Component map

All discovery components live in `components/discovery/` and are re-exported
from `components/discovery/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Button`) and follow the same conventions as
`components/publishers/*`, `components/funding/*`, and `components/institutions/*`.

| Component | Responsibility |
|---|---|
| `DiscoveryBadge` | Entity-type badge with per-type accent color and icon, shared across cards. |
| `DiscoveryResultCard` | Ranked result card: badge, match percentage, titled link to the source record, summary, year/country/status chips, organizations footer. |
| `DiscoverySearchBar` | Controlled search input with submit handler and placeholder copy. |
| `DiscoveryCategoryTabs` | Category pill tabs (`All` plus each entity type) for scoping the index. |
| `DiscoveryFacetPanel` | Facet list grouped by dimension with counts and toggle selection. |
| `DiscoveryFilterPanel` | Active-filter chips with per-filter remove and clear-all. |
| `DiscoveryExplorer` | Interactive client composition: search bar, category tabs, facet panel, active filters, result grid, and empty state wired to `searchDiscoveryItems`. |
| `DiscoveryStatistics` | `StatisticCard` grid: searchable items, researchers, journals, conferences, institutions, publishers, projects, publications, datasets, manuscripts, funding, keywords, disciplines, average relevance. |
| `DiscoveryAnalytics` | Analytics panels: search activity, items by category, top disciplines, top keywords. |
| `TrendingTopics` | Grid of trending suggestion cards. |
| `PopularSearches` | Grid of popular suggestion cards. |
| `RecentSearches` | Grid of recent suggestion cards. |
| `DiscoverySuggestionCard` | A suggestion row: query, optional entity icon, type badge, count. |
| `DiscoveryCollectionCard` | A curated collection card: cover icon, item count, title, description, curator, updated date. |
| `FeaturedCollection` | Large spotlight for one collection with its top four items. |
| `DiscoveryRankingCard` | A leaderboard card: label, basis, ranked items with position badges, badges, and score. |
| `DiscoveryRelationshipCard` | Grid of cross-module relationship edges with weight bars. |
| `DiscoveryTimeline` | Recent activity rendered through the shared `Timeline` primitive. |
| `SearchScopeSelector` | Scope pills (`Everything`/`Scholatia`/`Global`). |
| `AdvancedSearchPanel` | Form for discipline, year range, country, and status refinements. |
| `SearchEmptyState` | Empty-results state with reset action. |
| `format` | Shared formatting helpers (`formatDate`, `formatCompactNumber`, `formatYear`) and entity type labels/icons. |

## Route map

| Route | Page | Section |
|---|---|---|
| `/discovery` | `app/discovery/page.tsx` | Search explorer, index statistics, trending topics, popular searches, recent searches, featured collection, curated collections, rankings, advanced search, analytics, cross-module relationships, recent activity timeline, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern.
Entity detail routes remain the source modules' own routes; `DiscoveryItem.url`
values are inferred (`/module/:id`) because only `/researchers/[username]` has a
live detail route today.

## Dependency graph

```
Discovery module
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stage ids consulted)
  ├── types/research.ts           (ResearchLifecycleStageId)
  ├── types/discovery.ts          (discovery entity model — new)
  ├── constants/placeholder-discovery.ts    (unified index + derived surfaces — new)
  ├── constants/placeholder-researchers.ts  (researchers — SAID index)
  ├── constants/placeholder-journals.ts     (journals)
  ├── constants/placeholder-conferences.ts  (conferences)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── constants/placeholder-publishers.ts   (publishers)
  ├── constants/placeholder-research.ts     (projects, publications)
  ├── constants/placeholder-datasets.ts     (datasets)
  ├── constants/placeholder-manuscripts.ts  (manuscripts)
  ├── constants/placeholder-funding.ts      (funding opportunities)
  ├── components/discovery/*     (component library — new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, Alert, StatisticCard, Timeline)
  └── app/discovery/page.tsx      (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
index entry is derived from existing placeholder identity (SAIDs, journal ids,
conference ids, DOIs, grant ids), so no data is duplicated.

## Placeholder data

`constants/placeholder-discovery.ts` provides:

- **~135 unified index entries** mapped from existing records: 23 researchers,
  11 journals, 11 conferences, 21 institutions, 13 publishers, 8 projects, 14
  workspace publications, 11 datasets, 9 manuscripts, and 8 funding
  opportunities. Each entry carries a `sourceId` and a canonical `url` back to
  the original record.
- **Country → continent mapping** covering every distinct source country.
- **Facets** derived by tallying entity type, discipline, country, continent,
  year, and status across the index.
- **Suggestions**: trending, popular, recent, and recommended query surfaces.
- **6 curated collections** matched by keyword across the index (Open Science &
  Research Integrity, Responsible AI & Computational Linguistics, and more).
- **7 rankings**: top-cited researchers, impact-factor journals,
  most-downloaded datasets, open funding, manuscript readiness, and project
  progress.
- **48 derived cross-module relationships**: journals to publishers,
  researchers to institutions, manuscripts to target journals, conferences to
  proceedings publishers, datasets to institutions, publications to journals,
  projects to researchers, and funding to agencies.
- **24 timeline entries** of recent platform activity across the modules.
- Derived aggregates: `DISCOVERY_ANALYTICS`, `DISCOVERY_STATISTICS`,
  `DISCOVERY_PORTFOLIO`, `FEATURED_COLLECTION`, `FEATURED_DISCOVERY_ITEM`, plus
  `createDefaultDiscoveryQuery()` and `searchDiscoveryItems()` (local keyword
  ranking that reports the matched fields for each result).

## Future extensions

- Hosted search index (e.g. Meilisearch) replacing `searchDiscoveryItems` local
  ranking, with typo tolerance, relevance tuning, and highlight snippets.
- Live crossref/ISSN, grant registry, and institution data connectors feeding
  the unified index.
- Personalized recommendations driven by the research profile (SAID) and
  `DiscoverySuggestion` types.
- Saved searches, alerting on new index entries, and export of result sets.
- Pagination, sort modes (`relevance`/`recent`/`title`), and the
  `all`/`scholatia`/`global` scope model wired end to end.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/discovery.ts` are the schema seed.
