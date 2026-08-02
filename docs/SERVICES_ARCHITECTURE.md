# Scholatia Research Services Marketplace Architecture

## Purpose

The Research Services Marketplace is the **professional services layer** of the
Scholatia ecosystem — "Upwork + Fiverr + ResearchGate Consulting" specialised
for research itself. Researchers buy and sell writing, editing, statistical
analysis, qualitative analysis, grant writing, literature reviews, research
design, publication support, conference abstracts, data work, mentoring,
tutoring, and publication strategy — delivered by verified academic providers.

The module is **additive by design**. It does **not** own records and does
**not** duplicate any module data:

- Every **provider** reuses an existing researcher identity
  (`researcherUsername` + `researcherSaid`) when the provider is a Scholatia
  researcher, so no identity is duplicated.
- Every **service** is a live reference to the source record it services
  (`sourceId` + `sourceEntity`) — a project id, a dataset id, a grant id, a
  manuscript id, a journal id, or a conference id.
- Every **service** is promotable through the Advertising module
  (`servicePromotableObject`) and searchable through the Discovery module
  (`toDiscoveryItem`).
- Every **order, review, milestone, and dispute** flows through the Commerce and
  Trust engines while delivery is tracked through the Advertising module's
  placement analytics (impressions, clicks, inquiries, conversions, CTR, CPC,
  ROI).

The module reuses the existing design system, page patterns, and the
Marketplace, Commerce, Advertising, Researchers, Institutions, Discovery,
Intelligence, Funding, RBAC, and Authentication modules. It introduces no new
packages, no duplicate records, no APIs, no database writes, no server actions,
and no external model dependency.

## Relationship to the Research Lifecycle

- The Research Services Marketplace is a platform-wide services layer and does
  **not** own a lifecycle stage. Each service references the lifecycle stages it
  serves through `stageIds` and `toDiscoveryItem` maps a service to its canonical
  `ResearchLifecycleStageId` (statistical analysis serves `analysis`, grant
  writing serves `funding`, editing serves `manuscript`, journal selection serves
  `publication`, conference abstracts serve `conference`, and so on).
- `ResearchLifecycleStageId` from `types/research.ts` is reused; the lifecycle
  engine in `lib/lifecycle.ts` is referenced by type id only and is never
  mutated.
- `CurrencyCode` from `types/funding.ts` prices every service, package, order,
  and dispute — conversions are explicit through the Commerce engine and never
  implied.
- `PromotableEntityType` from `types/ads.ts` and `DiscoveryEntityType` from
  `types/discovery.ts` bridge services to the Advertising and Discovery modules
  without duplicating records.

## Entity model

Types live in `types/services.ts`.

| Entity | Description |
|---|---|
| `ServiceCategory`, `ServiceCategoryGroup`, `ServiceType`, `ServiceProviderType`, `ServiceStatus`, `ServicePriceInterval`, `ServicePrice`, `ServiceDiscount` | The forty research-service categories organised into twelve coarse groups, what a service physically delivers, the provider types that can sell, pricing in a declared currency with interval semantics, and discounts. |
| `ServicePackage` | A tiered offer within a provider's service (Basic / Standard / Premium) with its own price, delivery days, revisions, and includes. |
| `ServiceRatingDistribution`, `ServiceRatingSummary`, `ServiceReview` | Ratings and authenticated, verified-purchase reviews tied to services and providers. |
| `ServiceProviderBadge`, `ServiceProviderSkill`, `ServiceProviderCertification`, `ServiceProviderAvailability`, `ServicePortfolioItem`, `ServiceTestimonial`, `ServiceProvider` | The provider profile: trust badges, skills, certifications, availability, portfolio, testimonials, rating, response time, completed jobs, and the reused researcher identity (`researcherUsername` + `researcherSaid`). |
| `ServiceBoostLevel`, `ServiceAdMetrics`, `ServiceRequirement`, `Service` | The service listing: category/group/type, price and packages, rating, engagement counters, keywords/areas/disciplines, `stageIds`, delivery and revisions, source reference (`sourceId` + `sourceEntity`), promotion flags and ad placement metrics. |
| `ServiceOrderStatus`, `ServicePaymentStatus`, `ServiceOrderMilestone`, `ServiceOrder` | Service orders: purchasable through the Commerce engine, tracked milestone by milestone. |
| `ServiceDisputeStatus`, `ServiceDispute` | Disputes raised against orders with refund state. |
| `ServiceCategoryStat`, `ServiceTopService`, `ServiceTopProvider`, `ServiceStatistics`, `ServiceMarketplaceAnalytics`, `ProviderStatistics` | Engine-derived category stats, top services and providers, headline statistics, and marketplace analytics. |
| `ServiceRecommendationType`, `ServiceRecommendation` | AI recommendations surfaced by the Intelligence layer for providers, services, categories, packages, mentors, editors, and statisticians. |
| `ServicePortfolio` | The module's aggregate root: statistics, analytics, providers, services, categories, packages, reviews, testimonials, portfolios, orders, milestones, disputes, recommendations, and discovery items. |
| Vocabularies | `SERVICE_CATEGORIES`, `SERVICE_CATEGORY_LABELS`, `SERVICE_CATEGORY_ICONS`, `SERVICE_CATEGORY_GROUPS`, `SERVICE_CATEGORY_GROUP_LABELS`, `SERVICE_CATEGORY_GROUP_ICONS`, `SERVICE_CATEGORY_TO_GROUP`, `SERVICE_PROVIDER_TYPES`, `SERVICE_PROVIDER_TYPE_LABELS`, `SERVICE_TYPES`, `SERVICE_TYPE_LABELS`, `SERVICE_STATUSES`, `SERVICE_PRICE_INTERVALS`, `SERVICE_BADGES`, `SERVICE_ORDER_STATUSES`, `SERVICE_PAYMENT_STATUSES`, `SERVICE_DISPUTE_STATUSES`, `SERVICE_BOOST_LEVELS`, `SERVICE_RECOMMENDATION_TYPES`, `SERVICE_DELIVERY_BASE_DAYS`, `SERVICE_TO_DISCOVERY_ENTITY`, and the `servicePromotableEntityType` helper. |

## Component map

All services components live in `components/services/` and are re-exported from
`components/services/index.ts`. They consume the existing UI primitives
(`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`,
`StatisticCard`, `Badge`) and follow the same conventions as
`components/marketplace/*`, `components/ads/*`, and `components/commerce/*`.

| Component | Responsibility |
|---|---|
| `ServiceStatistics` | Headline marketplace statistics (live services, providers, revenue, rating, orders, delivery, milestones, promotion) and provider statistics. |
| `ServiceAnalytics` | Platform analytics: impressions, views, inquiries, orders, conversion, revenue, average order value, repeat buyers, top services, top providers, and top markets. |
| `ServiceSearchPanel` | Controlled search panel — free-text query, category, sort, and price range wired to the engine filter/sort. |
| `ServiceCategoryTabs` | Controlled group filter chips (All + twelve groups with counts). |
| `ServiceBrowser` | Client composition owning `useServices` once and wiring the search panel, category tabs, result count, and the results grid with favorites. |
| `ServiceCard` | Service listing card with price (list/effective/discount), delivery estimate, rating, badges, provider link, tags, and engagement counters. |
| `ServiceCategoryCard` | Category group card with icon, label, and service count. |
| `ServicePackageCard` | Tiered package pricing card with engine-derived effective price and delivery estimate. |
| `ServiceProviderCard` | Provider card with availability, badges, rating, completed jobs, and response time. |
| `ProviderHeader` | Provider profile hero with identity reuse, skills, portfolio, and certifications. |
| `ServiceRatingCard` | Rating summary with star distribution bars. |
| `ServiceReviewCard` | Authenticated, verified-purchase review card. |
| `ServiceOrderCard` | Order card with order number, status, payment status, amount, deadline, and embedded milestone tracker. |
| `MilestoneTracker` | Milestone progress bar (`milestoneProgress`) and per-milestone status list. |
| `ServiceDisputeCard` | Dispute card with status, subject, description, and refund state. |
| `RecommendationCard` | AI recommendation card with type, score, confidence, and reasons. |
| `TestimonialCard` | Provider testimonial card. |
| `PortfolioCard` | Provider portfolio item card. |
| `ServiceBundleCard` | Bundle pricing card with list total, bundle price, saving, and member services. |
| `RelatedServicesList` | Related and bought-together service grids derived by the engine. |
| `ServicePromotionCard` | Promotable-service card with boost level, sponsored label, and ad metrics (impressions, clicks, inquiries, conversions, CTR, CPC, ROI). |
| `DiscoveryCard` | A service rendered as its unified discovery row. |
| `ServiceBadge` | Named badges over the shared `Badge` primitive (`ServiceStatusBadge`, `CategoryBadge`, `GroupBadge`, `ServiceTypeBadge`, `ProviderTypeBadge`, `OrderStatusBadge`, `ServicePaymentStatusBadge`, `DisputeStatusBadge`, `MilestoneStatusBadge`, `AvailabilityBadge`, `BoostLevelBadge`, `RecommendationTypeBadge`, `ProviderBadgeTag`, `SponsoredBadge`, `FeaturedBadge`, `DiscountBadge`). |
| `format` | Shared formatting helpers (`formatCurrency`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatDate`, `formatPrice`, `formatInterval`, `formatCategory`, `formatGroup`, `formatServiceType`, `formatProviderType`, and the status formatters). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/services` | `app/services/page.tsx` | Services statistics, services analytics, browse (search panel + category tabs + results), categories, featured service spotlight + packages + rating, top rated, newest, popular, providers, featured provider, reviews, order lifecycle + milestones, disputes, AI recommendations, bundles, related & bought together, promotable services, discovery rows, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Service detail (`/services/{id}`) and provider profile
(`/services/providers/{username}`) routes are canonical in-app targets built by
`buildServiceUrl` and `buildProviderUrl`; their detail pages remain future work.

## Order & delivery flow

```
service → package → order (Commerce engine pricing/payment/escrow)
       → milestone-by-milestone delivery (milestoneProgress)
       → review + rating (aggregateServiceReviews)
       → dispute → resolved → refund (ServiceDispute)
```

- Purchases flow through the Commerce engine; the services layer only references
  the order's service, package, provider, buyer, amount, and currency.
- Delivery is tracked milestone by milestone; progress and on-time delivery are
  derived by the engine, never re-implemented in the UI.
- Reviews are authenticated and verified-purchase flagged; ratings aggregate into
  `ServiceRatingSummary` distributions.

## Discovery & advertising integration

```
service → toDiscoveryItem        → unified, searchable Discovery row
service → servicePromotableObject → PromotableObject registered for Advertising
service → servicePromotableEntityType → closest PromotableEntityType
```

- `SERVICE_DISCOVERY_ITEMS` derives a discovery row per service (keywords,
  research areas, organizations, lifecycle stage, score, canonical URL).
- `SERVICE_PROMOTABLE_OBJECTS` registers every service through
  `registerPromotableObjects`, and boosted services carry `ServiceAdMetrics`
  (impressions, clicks, inquiries, conversions, CTR, CPC, ROI) tracked through
  the Advertising module's campaign analytics.

## Dependency graph

```
Services module
  ├── lib/services.ts         (pure services engine — new)
  ├── lib/ads.ts              (createPromotableObject, registerPromotableObjects)
  ├── lib/commerce.ts         (formatCurrency, pricing rails)
  ├── types/services.ts       (services entity model — new)
  ├── types/funding.ts        (CurrencyCode, CareerStage)
  ├── types/discovery.ts      (DiscoveryEntityType, DiscoveryItem)
  ├── types/research.ts       (ResearchLifecycleStageId)
  ├── types/researcher.ts     (ResearcherPositionType)
  ├── types/intelligence.ts   (IntelligenceConfidence)
  ├── types/ads.ts            (AdPlacement, PromotableEntityType, SponsoredLabel)
  ├── constants/placeholder-services.ts (derived services data — new)
  ├── constants/placeholder-researchers.ts (researcher identities)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── components/services/*   (component library — new)
  ├── components/layout/*     (PageLayout, PageHeader)
  ├── components/ui/*         (Container, Button, SectionTitle, Alert, StatisticCard, Badge, SearchBox, Select, Input)
  ├── hooks/useServices.ts    (services state hook — new)
  ├── db/schema.sql           (services tables — appended)
  └── app/services/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every provider references an existing researcher identity where applicable, and
every service references its source record, so no data is duplicated.

## Placeholder data

`constants/placeholder-services.ts` provides:

- **Providers** (`PROVIDERS`) — derived from `ProviderSeed` records that reuse
  researcher identities from `placeholder-researchers` and institutions from
  `placeholder-institutions`, with skills, certifications, availability,
  portfolio, and testimonials.
- **Services** (`SERVICES`) — derived from `ServiceSeed` records across the
  forty categories, with pricing, discounts, packages, ratings, engagement
  counters, keywords, research areas, disciplines, career stages, lifecycle
  `stageIds`, source references, and promotion flags.
- **Category counts** (`SERVICE_CATEGORY_GROUP_COUNTS`) — derived from the
  service catalog grouped by `ServiceCategoryGroup`.
- **Reviews** (`REVIEWS`) and **testimonials** (`TESTIMONIALS`) — derived per
  service and per provider.
- **Orders** (`ORDERS`), **milestones** (`MILESTONES`), and **disputes**
  (`DISPUTES`) — service purchases spanning every `ServiceOrderStatus` and
  `ServicePaymentStatus`.
- **Recommendations** (`RECOMMENDATIONS`) — AI recommendations across every
  `ServiceRecommendationType` with intelligence confidence.
- **Bundles** (`SERVICE_BUNDLES`) — curated service combinations priced below
  their individual totals.
- **Discovery & advertising** — `SERVICE_DISCOVERY_ITEMS` (via
  `toDiscoveryItems`), `SERVICE_PROMOTABLE_OBJECTS` (via
  `registerPromotableObjects`), and `SERVICE_AD_ENTITY_TYPE`.
- Derived aggregates: `PROVIDER_STATISTICS` (via `providerStatistics`),
  `SERVICE_STATISTICS` (via `serviceStatistics`), `SERVICE_ANALYTICS` (via
  `marketplaceAnalytics`), the aggregate `SERVICE_PORTFOLIO`, curated slices
  (`TOP_RATED_SERVICES`, `NEWEST_SERVICES`, `POPULAR_SERVICES`,
  `SEARCH_SERVICE_RESULTS`), and featured picks (`FEATURED_SERVICE`,
  `FEATURED_PROVIDER`, `FEATURED_REVIEW`, `FEATURED_ORDER`,
  `FEATURED_MILESTONE`, `FEATURED_DISPUTE`, `FEATURED_RECOMMENDATION`,
  `FEATURED_BUNDLE`, `FEATURED_PROVIDER_URL`, `CHEAPEST_SERVICE_PRICE`,
  `FEATURED_SERVICE_DELIVERY`, `RELATED_TO_FEATURED`, `BOUGHT_TOGETHER`).

## Utilities

`lib/services.ts` provides pure, strongly typed engine helpers so the
placeholder data and the Services page never re-implement services logic:

- **URLs**: `SERVICE_ROOT`, `SERVICE_PROVIDER_ROOT`, `buildServiceUrl`,
  `buildProviderUrl`.
- **Pricing**: `effectiveServicePrice`, `serviceListPrice`,
  `serviceDiscountPercent`, `isServiceDiscounted`, `serviceFromPrice`,
  `standardPackage`.
- **Delivery**: `estimateDelivery` (scales the category base turnaround by
  revisions and package).
- **Reviews & ratings**: `emptyServiceRating`, `serviceRatingDistribution`,
  `calculateRatings`, `aggregateServiceReviews`, `providerRatings`.
- **Search, filtering, ranking**: `serviceKeywords`, `scoreServiceRelevance`,
  `filterServices`, `sortServices`, `searchServices`, `recommendServices`,
  `topRated`, `newest`, `featuredServices`, `relatedServices`,
  `frequentlyBoughtTogether`.
- **Providers**: `providerByUsername`, `servicesByProvider`,
  `providerPortfolio`, `providerSkillNames`, `scoreProviderQuality`,
  `recommendProviders`, `sortProviders`, `availableProviders`.
- **Bundles**: `bundleServices` (list total, discount, bundle price) and the
  `ServiceBundle` shape.
- **Milestones & orders**: `milestoneProgress`, `orderMilestones`,
  `SERVICE_ORDER_STATUS_TRANSITIONS`, `canTransitionServiceOrder`.
- **Statistics & analytics**: `providerStatistics`, `serviceStatistics`,
  `marketplaceAnalytics` (top services/providers, by category/status/country),
  `buildServiceRecommendation`.
- **Integration**: `toDiscoveryItem`/`toDiscoveryItems`,
  `servicePromotableObject`.

## Hook

`hooks/useServices.ts` exposes the services state: the aggregate portfolio,
query/category/group/sort/price-range filtering with `filtered` (via
`filterServices` + `sortServices`), free-text `searchResults` (via
`searchServices`), a favorites set seeded from portfolio engagement,
`toggleFavorite`/`isFavorite`, bundle saving (`toggleBundleSave`/
`isBundleSaved`), and the derived `relatedToFeatured`/`boughtTogether` slices.

## Schema

`db/schema.sql` appends the services-only tables (service providers, provider
skills, provider certifications, provider portfolio, provider testimonials,
services, service packages, service reviews, service orders, service order
milestones, service disputes, service recommendations, service bundles, bundle
services, service discovery items, service promotable objects). They reference
`service_providers` and `services` internally, reference existing module
identities (`researcherUsername`, `institutionId`, `sourceId`) as text ids where
a record exists, and never duplicate marketplace, commerce, advertising, or
discovery data.

## Future extensions

- Service detail (`/services/{id}`) and provider profile
  (`/services/providers/{username}`) routes rendering the existing cards in full.
- Live ordering connecting service orders to the Commerce rails (escrow,
  settlement, invoices) and the Advertising auction for boost bidding.
- Milestone approval workflows and dispute mediation flowing through the Trust
  module.
- Provider onboarding, KYC, and verification surfacing `researcherSaid`
  identity reuse.
- Persistence when the platform-wide persistence phase lands; the types in
  `types/services.ts` and the schema in `db/schema.sql` are the schema seed.
