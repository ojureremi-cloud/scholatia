# Scholatia Academic Advertising & Sponsored Content Architecture

## Purpose

The Academic Advertising & Sponsored Content platform is the monetization
layer of the Scholatia ecosystem. It makes **every academic object promotable**
— research papers, preprints, journals, conferences, calls for papers, funding
opportunities, datasets, books, publishers, institutions, research centres and
laboratories, research projects, researcher and student profiles, academic
events, webinars, workshops, courses, job vacancies, scholarships, fellowships,
grants, patents, startups, marketplace listings, equipment, software, AI tools,
and academic services.

The module ships two advertiser surfaces on the same campaign machinery:

- **Scholatia Promote** — internal. Verified Scholatia users promote their own
  academic content (a paper, a journal, a conference, a funding call, a
  dataset, a profile). Promotions are tied to the owner's verified SAID.
- **Scholatia Ads** — external. Advertisers without academic profiles
  (universities, government agencies, NGOs, foundations, publishers, suppliers,
  software vendors, recruiters, scholarship providers, EdTech companies,
  professional associations, corporate sponsors) run branded campaigns.

Every advertisement passes through the review pipeline — manual moderation, AI
moderation, academic-integrity checks, spam detection, and fraud detection —
before it is eligible for a placement.

The module does **not** introduce a new lifecycle stage and does **not** own
its own records. Every `PromotableObject` is a live reference to an existing
Scholatia record (a SAID, a journal id, a conference id, a DOI, a grant id, a
project id). Targeting, budgeting, forecasting, fraud detection, and analytics
are pure engine functions that never re-implement data.

The module is **additive**: it reuses the existing design system, existing page
patterns, and existing placeholder modules. It introduces no new packages, no
duplicate records, no APIs, no database writes, no server actions, no
authentication changes, and no external model dependency.

## Relationship to the Research Lifecycle

- Advertising is a platform-wide monetization layer, like Publishers,
  Institutions, and Discovery, and does **not** own a lifecycle stage. It
  promotes records owned by every other stage (idea through knowledge
  transfer) by keeping the source record's canonical `stageId` on the
  promotable reference.
- `PromotableObject.stageId` reuses the existing
  `ResearchLifecycleStageId` union from `types/research.ts` so stage semantics
  never diverge.
- `AD_CAREER_STAGES` reuses `CareerStage` from `types/funding.ts` and
  `AD_RESEARCHER_POSITIONS` reuses `ResearcherPositionType` from
  `types/researcher.ts` — the audience engine targets the same career
  vocabulary the rest of the platform uses.

## Entity model

Types live in `types/ads.ts`.

| Entity | Description |
|---|---|
| `PromotableEntityType` | The 31 promotable object categories across the whole ecosystem. |
| `PromotableObject` | A live reference to a promotable record in any module: entity type, source id, title, summary, canonical url, keywords, discipline, research areas, authors, organizations, country, lifecycle stage, tags, and added date. |
| `AdObjective` | 25 objectives modeled on Meta Ads Manager and Google Ads (awareness, reach, conference registration, journal submissions, dataset downloads, book sales, grant applications, citation growth, profile visibility, …). |
| `SponsoredLabel`, `AdFormat`, `AdPlacement`, `AdPricingModel`, `AdBudgetMode`, `AdPaymentMethod` | Disclosure labels, creative formats, 21 natural placement surfaces, pricing models (CPC/CPM/CPR/CPS/CPD/CPL/CPA/Fixed/Subscription/Bundle), budget envelopes, and payment rails. |
| `AdAcademicRank`, `AdStudentLevel`, `AdSector`, `AdCitationLevel` | Academic targeting vocabularies. |
| `AdContextualSignals` | Lifecycle-contextual signals: publications, grants, conference attendance, institution affiliation, ORCID, journal readership, citation level, h-index, citations. |
| `AdAudience` | Full audience definition over the academic graph: countries, institutions, departments, faculties, disciplines, research interests, keywords, academic ranks, student levels, career stages, languages, sectors, lifecycle stages, ranges, and reach estimates. |
| `AdTargetProfile` | The profile of a user the targeting engine decides against, derived from the existing SAID identity and research profile. |
| `CustomAudience`, `LookalikeAudience`, `RetargetingAudience` | Saved audiences from uploads/platform criteria, lookalikes from a seed audience, and retargeting audiences from prior engagement. |
| `AdvertiserAccount` | An advertiser account bundling kind (`scholatia-promote` / `scholatia-ads`), company profile, billing, campaign manager, advertisement library, verification status, trust score, analytics, and joined date. |
| `AdCompanyProfile`, `AdPaymentRecord`, `AdBillingInfo`, `AdvertiserAnalytics` | Company, payment history, billing (balance, credits, auto-recharge), and advertiser-level analytics. |
| `AdCreative` | A creative variant: headline, primary text, call to action, format, disclosure label, status, review status, and the promoted object reference. |
| `AdSchedule`, `AdBudget`, `AdSet`, `AdCampaign` | The Ads Manager hierarchy: campaigns → ad sets → creatives, with schedules, budgets, bids, placements, and lifecycle status. |
| `SponsoredPlacementStatus`, `SponsoredPlacement` | A live sponsored placement on a natural surface with disclosure label, auction priority, status, schedule, and delivery counters. |
| `AdForecast` | An AI-generated recommendation: best audience, budget, duration, pricing model, expected reach/impressions/clicks/registrations/submissions/downloads/conversions/CTR/CPC/CPA, quality and relevance scores, ROI, confidence, and rationale. |
| `AdFraudType`, `AdFraudSeverity`, `AdFraudStatus`, `AdFraudSignal` | Fraud taxonomy (fake click, bot traffic, duplicate impression, invalid conversion, click farm, abuse, spam campaign, policy violation) and per-signal evidence. |
| `AdReviewCheck`, `AdReviewStatus`, `AdReviewRecord` | The review pipeline: manual moderation, AI moderation, academic integrity, spam detection, fraud detection, and per-target review records. |
| `AdMetrics`, `AdFunnelStep`, `AdTimeOfDayPoint`, `AdDeviceStat`, `AdReferralStat`, `AdGeographyStat`, `AdDisciplineStat`, `AdDemographicStat`, `AdHeatPoint`, `AdCampaignAnalytics` | The full per-campaign analytics surface. |
| `AdvertisingStatistics`, `AdvertisingAnalytics`, `AdvertisingPortfolio` | Aggregate statistics, marketplace analytics, and the module's aggregate root. |

## Component map

All advertising components live in `components/ads/` and are re-exported from
`components/ads/index.ts`. They consume existing UI primitives (`PageLayout`,
`PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`, `StatisticCard`,
`Badge`, `SectionCard`) and follow the same conventions as
`components/intelligence/*` and `components/discovery/*`.

| Component | Responsibility |
|---|---|
| `AdvertisingStatistics` | `StatisticCard` grid: campaigns, promotable objects, advertisers, placements, impressions, conversions, spend, quality & trust. |
| `AdvertisingAnalytics` | Marketplace analytics: revenue by objective, campaigns by status, spend by placement, top campaigns, audience reach by discipline. |
| `PromotableObjectCard` | A promotable record reference card with entity badge, keywords, lifecycle stage, country, and added date. |
| `AdvertiserCard` | Advertiser account card with kind, verification, trust, spend, campaigns, and LTV. |
| `CampaignCard` | Campaign card with status, objective, advertiser, budget utilization, and linked ad sets. |
| `AdSetCard` | Ad set card with audience, placements, pricing model, bid, budget utilization, remaining budget, and creatives. |
| `CreativeCard` | Creative preview with disclosure label, review status, headline, primary text, call to action, and promoted object. |
| `AudienceCard` | Audience definition card with disciplines, academic ranks, and countries. |
| `SponsoredPlacementCard` | Placement card with disclosure label, status, priority, impressions, clicks, CTR, and spend. |
| `ForecastCard` | AI forecast card with confidence, audience, quality/relevance/ROI, expected metrics, and rationale. |
| `FraudSignalCard` | Fraud signal card with type, severity, status, invalid counters, and evidence. |
| `ReviewQueueCard` | Review record card with target, checks, status, and notes. |
| `CampaignAnalyticsCard` | The deep per-campaign analytics surface: funnel, devices, geography, placement heat, referrals, and time-of-day delivery. |
| `AdsBadge` | Named badges over the shared `Badge` primitive (`CampaignStatusBadge`, `ReviewStatusBadge`, `FraudSeverityBadge`, `VerificationBadge`, `SponsoredLabelBadge`, `ObjectiveBadge`). |
| `format` | Shared formatting helpers (`formatCurrency`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatRoi`, `formatDate`, `formatObjectiveLabel`, `formatPricingModel`, `formatPlacement`, `formatCampaignStatus`, `formatReviewStatus`, `formatBudgetMode`, `formatFraudSeverity`, `formatFraudType`, `formatEntityType`, `entityTypeIcon`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/ads` | `app/ads/page.tsx` | Featured AI forecast, advertising statistics, featured promotable object, promotable catalog, featured campaign, all campaigns, ad sets, creatives, target audiences, featured placement, live sponsored placements, featured advertiser, all advertisers, marketplace analytics, featured campaign analytics, full analytics surface, review queue, fraud signals, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Entity detail routes remain the source modules' own routes; every promoted
surface references the original `url`.

## Dependency graph

```
Advertising module
  ├── lib/ads.ts                (pure advertising engine — new)
  ├── lib/lifecycle.ts          (ResearchLifecycleStageId consulted)
  ├── types/ads.ts              (advertising entity model — new)
  ├── types/research.ts         (ResearchLifecycleStageId)
  ├── types/funding.ts          (CareerStage, CurrencyCode)
  ├── types/researcher.ts       (ResearcherProfile, ResearcherPositionType)
  ├── types/identity.ts         (JournalProfile)
  ├── types/conference.ts       (ConferenceRecord)
  ├── types/institution.ts      (Institution)
  ├── types/publisher.ts        (Publisher)
  ├── types/dataset.ts          (Dataset)
  ├── types/manuscript.ts       (Manuscript)
  ├── constants/placeholder-ads.ts    (derived advertising surfaces — new)
  ├── constants/placeholder-researchers.ts  (researchers — SAID index)
  ├── constants/placeholder-journals.ts     (journals)
  ├── constants/placeholder-conferences.ts  (conferences)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── constants/placeholder-publishers.ts   (publishers)
  ├── constants/placeholder-research.ts     (projects, workspace publications)
  ├── constants/placeholder-datasets.ts     (datasets)
  ├── constants/placeholder-manuscripts.ts  (manuscripts)
  ├── constants/placeholder-funding.ts      (funding opportunities)
  ├── constants/placeholder-profile.ts      (publication entries)
  ├── components/ads/*          (component library — new)
  ├── components/layout/*       (PageLayout, PageHeader)
  ├── components/ui/*           (Container, Button, SectionTitle, Alert, StatisticCard, Badge, SectionCard)
  ├── hooks/useAds.ts           (Ads Manager state hook — new)
  └── app/ads/page.tsx          (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
promotable object is computed from existing placeholder identity (SAIDs, journal
ids, conference ids, DOIs, grant ids, project ids), so no data is duplicated.

## Placeholder data

`constants/placeholder-ads.ts` provides:

- **`PROMOTABLE_OBJECTS`** — derived from all ten source placeholder modules via
  per-module mapping functions (`promoPublication`, `promoJournal`,
  `promoConference`, `promoInstitution`, `promoPublisher`, `promoDataset`,
  `promoManuscript`, `promoFunding`, `promoProject`, `promoPublicationEntry`,
  `promoResearcher`), each keeping the original `sourceId` and canonical `url`.
- **6 target audiences** (`AD_AUDIENCES`) defined over the academic graph, plus
  custom, lookalike, and retargeting audiences.
- **4 advertiser accounts** (`ADVERTISERS`) — one internal Scholatia Promote
  account and three external Scholatia Ads organizations — with billing,
  verification, trust scores, and advertiser analytics.
- **10 creatives** (`AD_CREATIVES`) spanning sponsored posts, native
  recommendations, homepage banners, featured funding, sidebar advertisements,
  and a future-ready video format.
- **8 ad sets** (`AD_SETS`) and **8 campaigns** (`AD_CAMPAIGNS`) with the full
  lifecycle, budgets, schedules, bids, and objectives.
- **12 sponsored placements** (`SPONSORED_PLACEMENTS`) on home feed, research
  feed, journal pages, funding page, discovery, AI recommendations, email
  newsletters, top banners, conference pages, featured carousel, and sidebar
  cards.
- **3 AI forecasts** (`AD_FORECASTS`) computed by `forecastCampaign` against the
  platform's focus researcher profile.
- **Fraud signals** (`AD_FRAUD_SIGNALS`) computed by `detectFraudSignals`, and a
  **5-record review queue** (`AD_REVIEW_QUEUE`).
- **6 campaign analytics** (`AD_CAMPAIGN_ANALYTICS`) computed by
  `aggregateMetrics` and `buildFunnel` with device, geography, discipline,
  demographic, time-of-day, referral, and placement-heat breakdowns.
- Derived aggregates: `AD_STATISTICS`, `AD_ANALYTICS`, the aggregate
  `ADVERTISING_PORTFOLIO`, and per-surface featured picks
  (`FEATURED_CAMPAIGN`, `FEATURED_CAMPAIGN_ANALYTICS`, `FEATURED_FORECAST`,
  `FEATURED_ADVERTISER`, `FEATURED_PLACEMENT`, `FEATURED_PROMOTABLE`).

## Utilities

`lib/ads.ts` provides pure, strongly typed engine helpers so the placeholder
data and the Ads Manager page never re-implement advertising logic:

- **Promotable registry**: `registerPromotableObject`, `registerPromotableObjects`,
  `listPromotableObjects`, `getPromotableObject`, `createPromotableObject` — any
  future module exposes a `Promote` action through these.
- **Campaign lifecycle**: `CAMPAIGN_STATUS_TRANSITIONS`, `canTransitionCampaign`,
  `transitionCampaignStatus`, `setCampaignStatus`, and the convenience actions
  `activateCampaign`, `pauseCampaign`, `resumeCampaign`, `stopCampaign`.
- **Budget**: `calculateBudgetUtilization`, `remainingBudget`, `pacingDailySpend`.
- **Metrics**: `calculateCtr`, `calculateCpc`, `calculateCpm`, `calculateCpa`,
  `calculateConversionRate`, `calculateRoi`, `aggregateMetrics`.
- **Targeting**: `scoreAudienceMatch`, `matchesAudience`, `recommendAudiences`,
  `recommendBestAudience` (fuzzy keyword matching over the academic graph).
- **Relevance & quality**: `scoreAdRelevance`, `scoreCampaignQuality`.
- **AI optimization**: `recommendPricingModel`, `recommendDurationDays`,
  `recommendBudgetAmount`, `recommendedPlacements`, `selectPlacements`,
  `forecastCampaign`.
- **Fraud & review**: `detectFraudSignals`, `aggregateFraudRisk`,
  `evaluateReview`, `createReviewRecord`.
- **Analytics**: `buildFunnel`, `buildDeviceStats`, `computeAdvertisingStatistics`,
  `computeAdvertisingAnalytics`, `buildAdvertisingPortfolio`.
- **Formatting**: `pricingModelUnit`, `AD_OBJECTIVE_LABELS`, `adObjectiveLabel`.

## Hook

`hooks/useAds.ts` exposes the Ads Manager state: the advertising portfolio,
campaigns and ad sets, per-campaign ad-set lookup, the lifecycle actions
(`activate`, `pause`, `resume`, `stop`), a direct status setter, and per-set
budget helpers (`budgetOf`).

## Future extensions

- Live payment rails, invoice generation, and credit/wallet top-up replacing the
  placeholder billing records.
- The advertising auction: real-time priority bidding across placements using
  the `priority` field and `scoreCampaignQuality`.
- Review pipeline automation: reviewer queues, appeal flows, and policy
  citations replacing the placeholder review records.
- Fraud detection telemetry: device fingerprinting, IP reputation, and
  invalid-traffic reconciliation feeding `detectFraudSignals`.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/ads.ts` and the schema in `db/schema.sql` are the
  schema seed.
