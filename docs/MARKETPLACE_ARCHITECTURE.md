# Scholatia Academic Marketplace Architecture

## Purpose

The Academic Marketplace is the platform-wide commercial and transactional
layer of the Scholatia ecosystem — "Amazon + LinkedIn + Upwork + Fiverr +
Alibaba + ResearchGate Marketplace" for academia. Researchers, universities,
laboratories, publishers, companies, NGOs, and consultants list **services,
products, equipment, courses, and jobs** across twelve category families and
seventeen vendor types. Buyers search, filter, review, rate, favorite,
wishlist, book, order, invoice, pay, refund, and dispute — all driven by a pure
engine that never re-implements data.

The module does **not** introduce a new lifecycle stage and does **not** own
records. It sits across every existing stage (funding, project, dataset,
analysis, manuscript, submission, peer-review, publication, conference,
citation, impact, knowledge-transfer) and connects back to the Researchers,
Journals, Conferences, Publishers, Institutions, Discovery, Intelligence,
Advertising, RBAC, and Authentication modules for every cross-module reference:

- Every **listing** is a live reference to the source record it sells or
  services (`sourceId` + `sourceEntity`: a project, dataset, journal,
  conference, funding opportunity, manuscript, publisher, or publication DOI).
- Every **listing is searchable** through the Discovery module via
  `toDiscoveryItem(s)`.
- Every **listing is promotable** through the Advertising module via
  `listingPromotableObject` / `listingPromotableEntityType` and the promotable
  registry.
- **AI recommendations** (`MarketplaceRecommendation`) bridge the marketplace
  and non-marketplace modules (journals, reviewers, grants, conferences,
  publishers, collaborators) using the existing `DiscoveryEntityType` and
  `IntelligenceConfidence` vocabularies.
- **Guest advertisers** (companies without Scholatia accounts) purchase
  campaigns through the Scholatia Ads surface with no account required.

The module is **additive**: it reuses the existing design system, existing page
patterns, and existing placeholder modules. It introduces no new packages, no
duplicate records, no APIs, no database writes, no server actions, no
authentication changes, and no external model dependency.

## Relationship to the Research Lifecycle

- The Marketplace is a platform-wide transactional layer, like Publishers,
  Institutions, Discovery, and Advertising, and does **not** own a lifecycle
  stage. Every listing keeps `stageIds: ResearchLifecycleStageId[]` from
  `types/research.ts`, so a statistical-analysis listing serves the `analysis`
  stage, a grant-writing listing serves `funding`, and a science-kit listing
  serves `knowledge-transfer`.
- `careerStages` reuses `CareerStage` from `types/funding.ts`, and vendor
  positions reuse `ResearcherPositionType` from `types/researcher.ts`, so the
  marketplace targets the same career vocabulary as the rest of the platform.
- `CurrencyCode` from `types/funding.ts` is reused for every price — no
  conversion is ever implied.

## Entity model

Types live in `types/marketplace.ts`.

| Entity | Description |
|---|---|
| `MarketplaceCategory` | The twelve category families (research-services, academic-writing, publication-services, conference-services, education, laboratory-services, equipment, funding-services, recruitment, consulting, digital-products, physical-products). |
| `MarketplaceVendorType` | The seventeen vendor types (researcher, student, university, publisher, conference-organizer, laboratory, company, government-agency, ngo, freelancer, consultant, startup, professional-society, library, bookstore, software-vendor, equipment-manufacturer). |
| `MarketplaceListingType`, `MarketplaceListingStatus` | What a listing physically represents (service, digital product, physical product, equipment, course, job) and its lifecycle (draft → pending-review → active / paused / sold-out / archived). |
| `MarketplacePrice`, `MarketplacePriceInterval`, `MarketplaceDiscount`, `MarketplaceAvailability`, `MarketplaceAvailabilitySlot` | Pricing in a declared currency with interval semantics, percent/fixed discounts, and inventory/deliverability plus bookable time slots. |
| `MarketplaceRatingSummary`, `MarketplaceRatingDistribution`, `MarketplaceReview` | Star distributions and verified-purchase reviews carrying the reviewer's original SAID. |
| `MarketplaceVendorBadge`, `MarketplacePortfolioItem`, `MarketplaceVendor` | Vendor trust badges, portfolio work, and the vendor record (verification, trust score, rating, researcher identity link, skills, categories). |
| `MarketplaceStorefront` | A vendor's storefront at a canonical store URL with its own policies (returns, refunds, delivery, terms), categories, and featured listings. |
| `MarketplaceListing` | The full listing record: pricing, discount, keywords, research areas, target audiences, career stages, lifecycle stages, inventory, rating, favorites, orders, views, featured/sponsored/best-seller flags, verification, badges, tags, status, canonical URL, and source reference. |
| `MarketplaceOrderStatus`, `MarketplacePaymentStatus`, `MarketplaceOrderItem`, `MarketplaceOrder` | Orders with item lines, subtotal/discount/total, currency, status, payment status, and delivery scheduling. |
| `MarketplaceInvoiceLine`, `MarketplaceInvoiceStatus`, `MarketplaceInvoice` | Itemised invoices with tax, fees, due date, and paid date. |
| `MarketplacePaymentMethod`, `MarketplacePaymentStatusRecord`, `MarketplacePayment` | Payments across card, bank transfer, mobile money, PayPal, escrow, wallet, and institution billing, with escrow flags. |
| `MarketplaceRefundStatus`, `MarketplaceRefund` | The refund workflow with reason, decision, and amounts. |
| `MarketplaceDisputeStatus`, `MarketplaceDisputeSeverity`, `MarketplaceDisputeMessage`, `MarketplaceDispute` | Buyer disputes triaged by severity with a message thread and investigation state. |
| `MarketplaceCouponType`, `MarketplaceCouponAppliesTo`, `MarketplaceCouponStatus`, `MarketplaceCoupon` | Coupons applied to a listing, vendor, category, or cart with usage caps and minimum spend. |
| `MarketplacePromotionKind`, `MarketplacePromotion` | Windowed sales, flash sales, bundles, sponsored features, seasonal, and launch promotions over groups of listings. |
| `MarketplaceBundleItem`, `MarketplaceBundle` | Curated multi-listing packages with a combined list price and bundle discount. |
| `MarketplaceBookingStatus`, `MarketplaceBooking` | Bookable services with schedule, duration, timezone, and online/onsite location. |
| `MarketplaceMessage`, `MarketplaceConversation` | Buyer–vendor messaging threads tied to an order and listing. |
| `MarketplaceNotificationType`, `MarketplaceNotification` | Order updates, payments, refunds, disputes, messages, reviews, booking reminders, promotions, price drops, and back-in-stock alerts. |
| `MarketplaceWishlist`, `MarketplaceRecentlyViewed` | Saved-for-later groups and per-user recent-view history. |
| `MarketplaceGuestAdvertiser` | An external advertiser with no Scholatia account, with purchased campaign ids, promoted listings, and advertiser analytics. |
| `MarketplaceRecommendationType`, `MarketplaceRecommendation` | AI recommendations (vendor, listing, service, product, consultant, collaborator, journal, reviewer, grant, conference, publisher, storefront) with score, `IntelligenceConfidence`, reasons, and source bridge. |
| `MarketplaceCategoryStat`, `MarketplaceListingStat`, `MarketplaceVendorStat`, `MarketplaceSalesDayPoint` | Analytics building blocks. |
| `MarketplaceSalesDashboard`, `MarketplaceRevenueDashboard`, `MarketplaceAnalytics`, `MarketplaceStatistics`, `MarketplacePortfolio` | Aggregate dashboards, analytics, statistics, and the module's aggregate root. |
| Vocabularies | `MARKETPLACE_CATEGORIES`, `MARKETPLACE_CATEGORY_LABELS`, `MARKETPLACE_CATEGORY_ICONS`, `MARKETPLACE_SUBCATEGORIES`, `MARKETPLACE_VENDOR_TYPES`, `MARKETPLACE_VENDOR_TYPE_LABELS`, `MARKETPLACE_LISTING_TYPES`, `MARKETPLACE_LISTING_TYPE_LABELS`, `MARKETPLACE_VENDOR_BADGES`, `MARKETPLACE_ORDER_STATUSES`, `MARKETPLACE_PAYMENT_METHODS`. |

## Component map

All marketplace components live in `components/marketplace/` and are
re-exported from `components/marketplace/index.ts`. They consume existing UI
primitives (`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`,
`Container`, `StatisticCard`, `Badge`) and follow the same conventions as
`components/ads/*`, `components/intelligence/*`, and `components/discovery/*`.

| Component | Responsibility |
|---|---|
| `MarketplaceStatistics` | `StatisticCard` grid: revenue, orders, vendors, listings, categories, rating, bookings, coupons & promotions, conversion, disputes. |
| `MarketplaceAnalytics` | Analytics surface: impressions, revenue, engagement, activity, revenue by category, top listings, and top vendors. |
| `SalesDashboard` | Vendor sales dashboard: gross/net revenue, refunds, order volume, conversion, daily revenue curve, and top products. |
| `RevenueDashboard` | Platform revenue dashboard: commission, vendor payouts, refunds, net revenue, split by category, country, and payment method. |
| `MarketplaceCategories` | The twelve category families with icons, subcategory tags, and links. |
| `MarketplaceSearchPanel` | Client search/filter/sort panel that routes through `filterListings` and `sortListings` from the engine. |
| `VendorCard` | Vendor card with verification, trust score, rating, badges, location, identity, and store link. |
| `StorefrontCard` | Storefront card with store URL, categories, featured listings, and the four policies. |
| `ListingCard` | Listing card with effective/compare-at pricing, discount, rating, inventory, delivery, flags, research areas, and views/favorites. |
| `ReviewCard` | Verified-purchase review card with rating, comment, helpful votes, and reviewer identity. |
| `OrderCard` | Order card with order number, items, totals, status, payment status, and notes. |
| `InvoiceCard` | Invoice card with itemised lines, fees, total, and payment due date. |
| `PaymentCard` | Payment card with method, escrow state, reference, and amount. |
| `RefundCard` | Refund card with reason, decision, and amount. |
| `DisputeCard` | Dispute card with severity, status, description, and the message thread. |
| `CouponCard` | Coupon card with code, value, applicability (validated by `applyCoupon`), and usage. |
| `PromotionCard` | Promotion card with kind, discount, window, and covered listings. |
| `BundleCard` | Bundle card with items, list total, bundle price, and savings. |
| `BookingCard` | Booking card with schedule, duration, timezone, location, and status. |
| `ConversationCard` | Conversation card with participants, thread preview, and linked order. |
| `NotificationCard` | Notification card with type, read state, recipient, and timestamp. |
| `WishlistCard` | Wishlist card with saved listings and owner. |
| `GuestAdvertiserCard` | External advertiser card with spend, campaigns, conversions, ROI, and verification. |
| `RecommendationCard` | AI recommendation card with type, score, confidence, reasons, tags, and audience. |
| `MarketplaceBadge` | Named badges over the shared `Badge` primitive (`OrderStatusBadge`, `PaymentStatusBadge`, `PaymentMethodBadge`, `BookingStatusBadge`, `RefundStatusBadge`, `DisputeStatusBadge`, `DisputeSeverityBadge`, `CouponStatusBadge`, `ListingStatusBadge`, `PromotionKindBadge`, `InvoiceStatusBadge`, `CategoryBadge`, `VendorTypeBadge`, `ListingTypeBadge`, `InventoryStatusBadge`, `VerifiedVendorBadge`). |
| `format` | Shared formatting helpers (`formatCurrency`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatDate`, `formatPrice`, `formatInterval`, `formatCategory`, `categoryIcon`, `formatVendorType`, `formatListingType`, `formatRating`, `formatStars`, `listingPricing`, and the status formatters). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/marketplace` | `app/marketplace/page.tsx` | Marketplace statistics, twelve category families, featured vendor, featured storefront, all storefronts, all vendors, featured listing, catalog search panel, reviews, orders, invoices, payments, refunds, disputes, featured coupon, all coupons, featured promotion, all promotions, featured bundle, all bundles, bookings, conversations, notifications, wishlists, guest advertisers, featured recommendation, all recommendations, sales dashboard, revenue dashboard, marketplace analytics, placeholder alert. |
| `/store/{slug}` | (future) | Vendor storefront pages — every `StorefrontCard` and `VendorCard` links via `buildStoreUrl`. |
| `/marketplace/listings/{id}` | (future) | Listing detail pages — every `ListingCard` links via `buildListingUrl`. |

The route uses the existing `Button href` pattern so module pages can link to
it. Entity detail routes remain the source modules' own routes; every listing
and recommendation references the original `url`.

## Dependency graph

```
Marketplace module
  ├── lib/marketplace.ts         (pure marketplace engine — new)
  ├── lib/ads.ts                 (createPromotableObject / registerPromotableObjects)
  ├── lib/index.ts               (engine barrel — updated)
  ├── types/marketplace.ts       (marketplace entity model — new)
  ├── types/discovery.ts         (DiscoveryEntityType, DiscoveryItem)
  ├── types/research.ts          (ResearchLifecycleStageId)
  ├── types/funding.ts           (CareerStage, CurrencyCode)
  ├── types/researcher.ts        (ResearcherProfile, ResearcherPositionType)
  ├── types/ads.ts               (PromotableObject)
  ├── types/intelligence.ts      (IntelligenceConfidence)
  ├── constants/placeholder-marketplace.ts  (derived marketplace data — new)
  ├── constants/placeholder-researchers.ts  (researchers — SAID index)
  ├── constants/placeholder-journals.ts     (journals)
  ├── constants/placeholder-conferences.ts  (conferences)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── constants/placeholder-publishers.ts   (publishers)
  ├── constants/placeholder-research.ts     (projects, research team)
  ├── constants/placeholder-datasets.ts     (datasets)
  ├── constants/placeholder-manuscripts.ts  (manuscripts)
  ├── constants/placeholder-funding.ts      (funding opportunities)
  ├── constants/placeholder-profile.ts      (publication entries)
  ├── components/marketplace/*   (component library — new)
  ├── components/layout/*        (PageLayout, PageHeader)
  ├── components/ui/*            (Container, Button, SectionTitle, Alert, StatisticCard, Badge)
  ├── hooks/useMarketplace.ts    (marketplace state hook — new)
  └── app/marketplace/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every vendor references a researcher identity when applicable, and every
listing references the original source record, so no data is duplicated.

## Placeholder data

`constants/placeholder-marketplace.ts` provides:

- **Vendors** (`VENDORS`) — derived from `VendorSeed` records that reference
  researcher identities (`researcherUsername`), each with verification, trust
  score, rating (computed by `ratingFromReviews`), badges, skills, categories,
  and a portfolio.
- **Storefronts** (`STOREFRONTS`) — one per vendor, with canonical store URLs,
  categories, featured listings, and the four trading policies.
- **Listings** (`LISTINGS`) — derived from `ListingSeed` records across all
  twelve categories, each computing effective price, rating, inventory, flags,
  keywords, and a live source reference.
- **Reviews** (`REVIEWS`) — generated deterministically per listing near the
  target average, with verified-purchase flags and reviewer identities.
- **Orders** (`ORDERS`), **invoices** (`INVOICES`), **payments** (`PAYMENTS`),
  **refunds** (`REFUNDS`), and **disputes** (`DISPUTES`) — the full
  transactional lifecycle derived from the listings.
- **Coupons** (`COUPONS`), **promotions** (`PROMOTIONS`), and **bundles**
  (`BUNDLES`) — windowed discounts and curated packages.
- **Bookings** (`BOOKINGS`), **conversations/messages** (`CONVERSATIONS`,
  `MESSAGES`), **notifications** (`NOTIFICATIONS`), **wishlists** (`WISHLISTS`),
  and **recently viewed** (`RECENTLY_VIEWED`).
- **Guest advertisers** (`GUEST_ADVERTISERS`) — external companies purchasing
  campaigns with no Scholatia account.
- **Recommendations** (`RECOMMENDATIONS`) — AI recommendations derived from
  `searchListings`/`scoreListingRelevance` and live references to journals,
  conferences, funding, researchers, and publishers.
- Derived aggregates: `MARKETPLACE_STATISTICS` (via `computeMarketplaceStatistics`),
  `MARKETPLACE_ANALYTICS` (via `computeMarketplaceAnalytics`),
  `MARKETPLACE_SALES_DASHBOARD` (via `computeSalesDashboard`),
  `MARKETPLACE_REVENUE_DASHBOARD` (via `computeRevenueDashboard`),
  `MARKETPLACE_DISCOVERY_ITEMS` (via `toDiscoveryItems`),
  `MARKETPLACE_PROMOTABLE_OBJECTS` (via `registerPromotableObjects`), the
  aggregate `MARKETPLACE_PORTFOLIO`, and per-surface featured picks
  (`FEATURED_VENDOR`, `FEATURED_STOREFRONT`, `FEATURED_LISTING`,
  `FEATURED_PROMOTION`, `FEATURED_BUNDLE`, `FEATURED_COUPON`,
  `FEATURED_RECOMMENDATION`).

## Utilities

`lib/marketplace.ts` provides pure, strongly typed engine helpers so the
placeholder data and the Marketplace page never re-implement marketplace logic:

- **URLs**: `buildStoreUrl`, `buildStoreSubdomain`, `buildListingUrl` with the
  canonical `/store/{slug}` and `/marketplace/listings/{id}` patterns.
- **Pricing**: `effectivePrice`, `listPrice`, `discountPercentOf`, `isOnSale`.
- **Reviews & ratings**: `emptyRating`, `ratingDistributionFrom`,
  `ratingFromReviews`, `aggregateReviews`.
- **Search, filtering, ranking**: `listingKeywords`, `scoreListingRelevance`,
  `filterListings` (query, category, type, price, currency, career stage,
  country, verified/featured/sponsored/on-sale/in-stock), `sortListings`
  (relevance, recent, price asc/desc, rating, popularity), `searchListings`.
- **Vendor intelligence**: `vendorBySlug`, `listingsByVendor`,
  `scoreVendorQuality`, `recommendVendors`, `recommendListings`.
- **Order lifecycle**: `ORDER_STATUS_TRANSITIONS`, `canTransitionOrder`,
  `orderSubtotal`, `orderTotal`.
- **Coupons, invoices, bundles**: `applyCoupon` (validates status, usage,
  validity, minimum spend), `invoiceTotal`, `bundleListTotal`,
  `computeBundlePrice`.
- **Bookings & availability**: `isSlotAvailable`, `availableSlots`.
- **Messages & notifications**: `unreadCount`, `conversationBetween`.
- **Dashboards**: `computeSalesDashboard`, `computeRevenueDashboard`,
  `computeMarketplaceAnalytics`, `computeMarketplaceStatistics`.
- **Discovery & advertising integration**: `toDiscoveryItem`, `toDiscoveryItems`
  (Discovery searchable rows), `listingPromotableEntityType`,
  `listingPromotableObject` (Advertising promotable objects).

## Hook

`hooks/useMarketplace.ts` exposes the marketplace state: the aggregate
portfolio, the search/query/category/sort state with engine-computed results
(`filtered`), favorite toggling, wishlist membership, notification read state
with `unread` counts, order status transitions gated by `canTransitionOrder`,
coupon validation via `applyCoupon`, and effective price lookups.

## Future extensions

- Live payment rails, escrow, invoices, and wallet top-up replacing the
  placeholder billing records; real payment methods and currencies.
- Storefront and listing detail routes at `/store/{slug}` and
  `/marketplace/listings/{id}`.
- Vendor onboarding and verification: business documents, identity checks, and
  bank details feeding the `verified` and `trustScore` fields.
- The advertising auction integrating `sponsored` listings with
  `scoreCampaignQuality` from the Advertising module.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/marketplace.ts` and the schema in `db/schema.sql`
  are the schema seed.
