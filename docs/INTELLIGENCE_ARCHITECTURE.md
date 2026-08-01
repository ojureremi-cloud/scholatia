# Scholatia Scholarly Intelligence Platform Architecture

## Purpose

The Scholarly Intelligence Platform is the analytical layer of the Scholatia
ecosystem. It applies derived intelligence to the existing modules — insights,
recommendations, trends, predictions, research gaps, forecasts, expertise
matches, collaboration pairings, and an ecosystem knowledge graph. The module
does **not** introduce a new lifecycle stage and does **not** own its own
records; instead every signal is derived from the existing placeholder modules
(Researchers, Journals, Conferences, Publishers, Institutions, Projects,
Funding, Datasets, Manuscripts, and Discovery) and keeps a live reference back
to the original source identity (a SAID, a journal id, a conference id, a DOI,
or a grant id) so no data is duplicated.

The module provides a route, a component library, placeholder data with derived
surfaces, shared utilities, and strong TypeScript types describing the full
analytical surface: insights, recommendations (funding, journal, conference,
dataset, institution), research trends, emerging topics, citation predictions,
expertise matches, research gaps, scenario forecasts, knowledge graph nodes and
edges, analytics, statistics, and the aggregate `IntelligencePortfolio`.

The module is **additive**: it reuses the existing design system, existing page
patterns, existing placeholder modules, and the existing
`ResearchLifecycleEngine`. It introduces no new packages, no duplicate records,
no APIs, no database, no server actions, no authentication changes, and no
external model dependency.

## Relationship to the Research Lifecycle

- Intelligence is a cross-module analytical layer, like Publishers,
  Institutions, and Discovery, and does **not** own a lifecycle stage. It
  observes records owned by other stages: funding (stage 5), projects (stage 6),
  datasets (stage 8), manuscripts (submission stage 10 and peer review),
  publications (publication stage 11), and conferences (conference stage 12).
- `INTELLIGENCE_LIFECYCLE_STAGE_ID` is intentionally absent: the module derives
  signals rather than owning lifecycle state, so no stage constant is defined.
- Every recommendation, trend, prediction, gap, and graph element keeps the
  original `sourceId` and a canonical `url` back to the source record, so the
  intelligence layer never duplicates data.

## Entity model

Types live in `types/intelligence.ts`.

| Entity | Description |
|---|---|
| `IntelligenceConfidence` | Calibration level for every derived signal: `high` / `medium` / `low`. |
| `IntelligenceInsightSeverity`, `IntelligenceInsightType` | Narrative severity (`info` / `positive` / `warning` / `critical`) and type (`signal` / `warning` / `opportunity` / `trend` / `prediction` / `gap` / `recommendation`). |
| `IntelligenceInsight` | A narrative insight generated from derived signals, with an optional target entity type and source id. |
| `ResearcherSummary` | Compact researcher identity reused across collaboration and expertise surfaces. |
| `Recommendation` | Base recommendation against a specific source record: entity type, source id, url, score, confidence, reasons. |
| `FundingRecommendation` | Funding opportunity matched to a researcher profile with match breakdown and eligibility. |
| `JournalRecommendation` | Journal matched to a manuscript or discipline with impact factor, quartile, and fit score. |
| `ConferenceRecommendation` | Conference matched to research areas with dates and registration/submission status. |
| `DatasetRecommendation` | Dataset matched to interests with download and citation signals. |
| `InstitutionRecommendation` | Institution matched to a discipline with trust score and research areas. |
| `ResearchTrend` | Momentum signal for a topic derived from the unified index (`-100` to `+100`). |
| `EmergingTopic` | A topic early in its adoption curve with novelty, momentum, potential, and adoption stage. |
| `CollaborationSuggestion` | A pairing of two researchers with shared interests, complementary skills, and overlap/potential scores. |
| `CitationPrediction`, `CitationPredictionPoint` | Projected citation trajectory for a publication or researcher. |
| `ExpertiseMatch` | A researcher matched to a topic with supporting evidence. |
| `ResearchGap` | An under-served topic with severity, opportunity score, evidence, and recommendations. |
| `ForecastScenario`, `ResearchForecast` | Scenario-based projections (accelerated / reference / contained) for a topic. |
| `KnowledgeGraphNode`, `KnowledgeGraphEdge` | Nodes referencing source records plus directed relationships with weight. |
| `IntelligenceAnalytics`, `IntelligenceStatistics` | Aggregate analytic tallies and statistic-card level aggregates. |
| `IntelligencePortfolio` | Aggregate root of the module: statistics, analytics, and every derived surface. |

## Component map

All intelligence components live in `components/intelligence/` and are
re-exported from `components/intelligence/index.ts`. They consume existing UI
primitives (`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`,
`Container`, `StatisticCard`, `Badge`) and follow the same conventions as
`components/discovery/*`, `components/funding/*`, and
`components/institutions/*`.

| Component | Responsibility |
|---|---|
| `AIInsightCard` | Insight card with severity badge, insight type, target entity, tags, and date. |
| `IntelligenceBadge` | Named `ConfidenceBadge` and `SeverityBadge` over the shared `Badge` primitive. |
| `IntelligenceStatistics` | `StatisticCard` grid: insights, recommendations, trends, predictions, confidence, knowledge graph, monitored countries, top topic. |
| `RecommendationCard` | Generic recommendation card with entity badge, confidence, reasons, and fit score. |
| `FundingRecommendationCard` | Funding match card with agency, amount, deadline, duration, and per-criterion breakdown. |
| `JournalRecommendationCard` | Journal match card with impact factor, quartile, and fit score. |
| `ConferenceRecommendationCard` | Conference match card with dates, location, and registration/submission status. |
| `DatasetRecommendationCard` | Dataset match card with DOI, downloads, citations, and access. |
| `InstitutionRecommendationCard` | Institution match card with country, continent, trust score, and research areas. |
| `ResearchTrendCard` | Trend card with momentum direction, magnitude bar, record counts, and signal sources. |
| `TrendingResearchMap` | Trends grouped by discipline with momentum bars. |
| `EmergingTopicCard` | Emerging topic card with novelty / momentum / potential bars and adoption stage. |
| `CollaborationSuggestionCard` | Collaboration pair card with the two researchers, shared interests, complementary skills, and scores. |
| `CitationPredictionCard` | Citation projection card with current/projected counts and an inline sparkline. |
| `ExpertiseMatchCard` | Researcher-to-topic match card with evidence and optional gap note. |
| `ResearchGapCard` | Research gap card with severity, opportunity bar, evidence, and recommendations. |
| `ResearchForecastCard` | Forecast card with projected growth and scenario probabilities. |
| `KnowledgeGraph` | SVG ecosystem graph: weighted nodes by module color, labeled edges, and an edge list. |
| `IntelligenceAnalytics` | Analytics panels: recommendations by type, insights/gaps by severity, trends by discipline, model metrics, top emerging topics. |
| `format` | Shared formatting helpers (`formatConfidence`, `formatSeverity`, `formatInsightType`, `formatScore`, `formatCompactNumber`, `formatNumber`, `formatCurrency`, `formatDateLabel`, momentum helpers). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/intelligence` | `app/intelligence/page.tsx` | Featured insight, derived insights, statistics, featured trend, trend map, featured emerging topic, emerging topics, featured recommendation, funding/journal/conference/dataset/institution recommendations, full recommendation feed, citation predictions, featured collaboration pair, collaboration pairs, expertise matches, research gaps, forecasts, knowledge graph, analytics, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it, mirroring how the other analytical layers are reached. Entity detail routes
remain the source modules' own routes; every derived surface references the
original `url`.

## Dependency graph

```
Intelligence module
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stage ids consulted)
  ├── lib/intelligence.ts         (pure analytical utilities — new)
  ├── types/intelligence.ts       (intelligence entity model — new)
  ├── types/discovery.ts          (DiscoveryEntityType)
  ├── constants/placeholder-intelligence.ts   (derived analytical surfaces — new)
  ├── constants/placeholder-researchers.ts    (researchers — SAID index)
  ├── constants/placeholder-journals.ts       (journals)
  ├── constants/placeholder-conferences.ts    (conferences)
  ├── constants/placeholder-institutions.ts   (institutions)
  ├── constants/placeholder-publishers.ts     (publishers)
  ├── constants/placeholder-research.ts       (projects, workspace publications)
  ├── constants/placeholder-datasets.ts       (datasets)
  ├── constants/placeholder-manuscripts.ts    (manuscripts)
  ├── constants/placeholder-funding.ts        (funding opportunities)
  ├── constants/placeholder-discovery.ts      (unified index + relationships)
  ├── constants/placeholder-profile.ts        (publication entries)
  ├── components/intelligence/*  (component library — new)
  ├── components/discovery/*      (entity type icons/labels)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, Alert, StatisticCard, Badge)
  └── app/intelligence/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
derived surface is computed from existing placeholder identity (SAIDs, journal
ids, conference ids, DOIs, grant ids), so no data is duplicated.

## Placeholder data

`constants/placeholder-intelligence.ts` provides:

- **Researcher summaries** for every researcher plus the platform focus
  researcher used for personalised recommendation surfaces.
- **10 research trends** with momentum, growth rate, direction, and the index
  modules that contributed each signal.
- **8 emerging topics** with novelty, momentum, potential, adoption stage, and
  contributing sources.
- **Collaboration suggestions** computed from shared research keywords across
  researcher pairs, filtered to at most 6 ranked pairings.
- **Citation predictions** for the leading researchers and workspace
  publications with current vs. projected counts and 12–24 month horizons.
- **Expertise matches** linking each leading trend to its best-matched
  researcher with evidence.
- **Funding, journal, conference, dataset, and institution recommendations**
  matched to the closest researcher's discipline profile, each referencing the
  original source id and canonical url.
- **Research gaps** derived from emerging topics missing funding calls,
  datasets, journals, or conferences.
- **Scenario forecasts** (accelerated / reference / contained) for the leading
  trends.
- **Knowledge graph nodes and edges** projected from the unified discovery index
  and its cross-module relationships, keeping source ids and urls.
- **8 narrative insights** across trend, gap, funding, prediction, collaboration,
  journal, emerging-topic, and graph signals.
- Derived aggregates: `INTELLIGENCE_STATISTICS`, `INTELLIGENCE_ANALYTICS`, and
  the aggregate `INTELLIGENCE_PORTFOLIO`, plus per-surface featured picks
  (`FEATURED_INSIGHT`, `FEATURED_TREND`, `FEATURED_EMERGING_TOPIC`,
  `FEATURED_RECOMMENDATION`, `FEATURED_FUNDING_RECOMMENDATION`,
  `FEATURED_COLLABORATION`, `FEATURED_PREDICTION`).

## Utilities

`lib/intelligence.ts` provides pure, strongly typed helpers that operate on the
derived surfaces so ranking, filtering, and confidence logic is never
re-implemented in data or pages:

- `CONFIDENCE_RANK`, `resolveConfidence`, and `averageConfidence`
- `sortRecommendationsByScore` and `filterRecommendationsByEntityType`
- `filterInsightsBySeverity`
- `findBestTrendForDiscipline` and `sortTrendsByMomentum`

## Future extensions

- Live connectors (Crossref/OpenAlex citations, grant registries, journal and
  conference metadata) replacing the derived placeholder signals.
- Personalised intelligence keyed to the signed-in researcher's SAID instead of
  the fixed focus researcher.
- Ranking models and confidence calibration fed by real engagement data.
- Export of analytics and portfolio snapshots, and alerting on new gaps,
  trends, and funding matches.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/intelligence.ts` are the schema seed.
