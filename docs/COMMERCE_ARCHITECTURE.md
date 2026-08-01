# Scholatia Commerce & Marketplace Engine Architecture

## Purpose

The Commerce module is the **financial operating system** of the Scholatia
ecosystem. It does **not** introduce a new lifecycle stage and does **not** own
records — everything that can be bought, sold, subscribed to, booked, promoted,
or monetized flows through this engine: marketplace products and services,
advertising campaigns, boosted posts, featured and sponsored listings, vendor
memberships, subscription plans, premium analytics, API access, enterprise
licensing, AI services, digital downloads, product bundles, seat-based
licences, and grant disbursements.

Every record references an existing module record:

- Every **product or service** is a live reference to a marketplace listing
  (`sourceId` + `sourceEntity`), an advertising campaign, a publication, a
  conference, a dataset, a discovery item, or a funding opportunity.
- Every **order** references catalog products; every **wallet transaction**
  references an existing order, subscription, campaign, boost, refund, or
  disbursement.
- Every **invoice, receipt, commission, escrow, settlement, bundle, licence,
  purchase-history line, participant-earnings row, relationship, and revenue
  line** is derived by the pure engine in `lib/commerce.ts` — the placeholder
  data and the Commerce page never re-implement pricing, taxes, coupons,
  commissions, wallet bookkeeping, subscriptions, boosts, analytics, or
  currency conversion by hand.

The module is **provider-independent**. No real payment API is integrated. The
payment-gateway abstraction models future integration with **Paystack,
Flutterwave, Stripe, PayPal, Razorpay, Wise, bank transfer, Institutional
Invoice, Apple Pay, and Google Pay** (plus the platform Wallet and Credits),
each advertising its currencies, methods, and capabilities — without live
credentials.

The module is **additive**: it reuses the existing design system, existing page
patterns, the Marketplace, Advertising, Researchers, Institutions, Publishers,
Journals, Conferences, Datasets, Discovery, Intelligence, Funding, RBAC, and
Authentication modules. It introduces no new packages, no duplicate records, no
APIs, no database writes, no server actions, no authentication changes, and no
external model dependency.

## Relationship to the Research Lifecycle

- The Commerce module is a platform-wide transactional layer, like Publishers,
  Institutions, Discovery, and Advertising, and does **not** own a lifecycle
  stage. Its products map to the stages they serve through their source records
  (a statistical-analysis service serves `analysis`, a grant-writing service
  serves `funding`, an equipment rental serves `knowledge-transfer`).
- `ResearchLifecycleStageId` from `types/research.ts` is reused by
  `CommerceLifecycleCoverage` — a derived map showing which commerce surfaces
  serve each of the 15 lifecycle stages (idea → knowledge transfer). The
  lifecycle engine is referenced by type id only; the Commerce module never
  mutates lifecycle records.
- `CurrencyCode` from `types/funding.ts` is reused for every price, wallet
  balance, commission, escrow, settlement, currency rail, and exchange-rate
  quote — conversions are explicit through `convertCurrency` and never implied.
- `PromotableObject` from `types/ads.ts` bridges boosted posts and sponsored
  listings to the Advertising module, and `AdCampaign` ids are referenced by
  advertising products.

## Entity model

Types live in `types/commerce.ts`.

| Entity | Description |
|---|---|
| `CommerceProductType`, `CommerceProductStatus`, `CommercePriceInterval`, `CommercePrice`, `CommerceProduct` | The catalog: what a line item physically represents (product, service, digital/physical product, equipment, course, subscription-plan, advertising-campaign, boosted-post, featured/sponsored listing, vendor-membership, premium-analytics, api-access, enterprise-license), pricing in a declared currency with interval semantics, stock, and a live `sourceId`/`sourceEntity` reference. |
| `CommerceCartItem`, `CommerceCart` | Shopping carts holding live catalog references with quantity, unit price, optional coupon code, and updated timestamp. |
| `CommerceOrderStatus`, `CommerceOrderItem`, `CommerceOrder` | Orders with item lines, subtotal/discount/coupon/tax/platform-fee/total, currency, order status, payment status, method, and invoice/receipt references. |
| `CommerceCheckoutStep`, `CommerceBillingAddress`, `CommerceShippingInfo` | The checkout pipeline (cart → billing → payment → review → processing → confirmation), billing addresses, and the reserved future shipping shape. |
| `CommercePaymentProvider`, `CommercePaymentMethod`, `CommerceGatewayCapabilities`, `CommerceGatewayProvider` | The provider-independent gateway abstraction: Paystack, Flutterwave, Stripe, PayPal, Razorpay, Wise, Bank Transfer, Institutional Invoice, Apple Pay, Google Pay, Wallet, Credits — each with currencies, methods, recurring/escrow/refunds/payouts/verification capabilities. |
| `CommercePaymentIntent`, `CommercePayment` | Provider-independent intents and captured payments with method, provider, escrow flag, reference, and date. |
| `CommerceRefundStatus`, `CommerceRefundReason`, `CommerceRefund` | The refund workflow with reason, note, decision, and amounts. |
| `CommerceDiscountKind`, `CommerceDiscount`, `CommerceCoupon`, `CommercePromotionKind`, `CommercePromotion` | Discounts, coupons (percent/fixed applied to product, vendor, category, cart, or subscription with minimum spend, usage caps, and validity windows), and windowed promotions (sale, flash-sale, seasonal, launch, bundle, featured, sponsored, boosted) with optional budget. |
| `CommerceWalletStatus`, `CommerceWalletTransactionType`, `CommerceWallet`, `CommerceWalletTransaction` | Wallets with balance, available/pending/frozen balances, lifetime credits/debits, and the double-entry transaction ledger with direction and balance-after. |
| `CommerceInvoiceStatus`, `CommerceInvoiceLine`, `CommerceTaxLine`, `CommerceInvoice`, `CommerceReceiptStatus`, `CommerceReceipt` | Itemised invoices with tax lines, fees, and due date; paid receipts with merchant and payment method. |
| `CommerceTaxRate`, `CommercePlatformFeeScope`, `CommercePlatformFee` | Tax-rate rules per jurisdiction and platform fee schedules per scope (marketplace, advertising, subscription, payout, disbursement). |
| `CommerceSubscriberType`, `CommerceBillingCycle`, `CommerceSubscriptionPlan`, `CommerceSubscriptionStatus`, `CommerceSubscription` | Plans for researchers, institutions, publishers, journals, conferences, companies, advertisers, and marketplace vendors with per-seat pricing, billing cycles, and auto-renew. |
| `CommerceCommissionStatus`, `CommerceCommission` | Marketplace commission per order with gross amount, rate, and paid status. |
| `CommerceEscrowStatus`, `CommerceEscrow` | Funds held until delivery confirmation or dispute resolution, then released to the vendor or back to the buyer. |
| `CommerceVendorEarnings` | Per-vendor gross sales, commissions, fees, refunds, net earnings, available/pending/lifetime balances for a period. |
| `CommerceSettlementStatus`, `CommerceSettlement` | Scheduled payouts to vendors across Paystack, Flutterwave, Wise, and bank transfer. |
| `CommerceCurrency`, `CommerceExchangeRate` | The settlement rails (14 currencies, no implied conversion) and the quoted conversion table powering `convertCurrency` / `findExchangeRate`. |
| `CommercePricingModel`, `COMMERCE_PRICING_MODELS` | How a price is determined: fixed, tiered, usage-based, credit-based, subscription, negotiable, auction. |
| `CommerceBundleStatus`, `CommerceBundle` | Groups of catalog products sold together at a discounted price — list total, bundle price, savings, and saving percent are all engine-computed. |
| `CommerceProductVariant` | Purchasable configurations of a product (cohort, duration, seats, tier) with own SKU, attributes, unit price, and stock. |
| `CommerceLicenseStatus`, `CommerceLicenseeType`, `CommerceLicense` | Seat-based entitlements granted for a term to institutions, publishers, journals, conferences, researchers, and companies. |
| `CommercePurchaseRecord` | A single line of purchase history derived from placed orders, with live source references. |
| `CommerceRevenueParticipantType`, `CommerceParticipantEarnings` | Per-participant revenue after fees, commissions, and refunds across the institution, publisher, researcher, and vendor segments. |
| `CommerceRelationshipKind`, `CommerceRelationship` | Directed references between existing module identities and the commerce surfaces they touch (buys, sells, subscribes, settles, disburses, promotes, licenses). |
| `CommerceLifecycleCoverage` | Which commerce surfaces serve each `ResearchLifecycleStageId`, with example product ids. |
| `CommerceTransactionKind`, `CommerceTransaction` | The ledger feeding the revenue report: purchase, subscription, advertising, boost, featured, sponsored, membership, premium-analytics, api-access, enterprise-licensing, ai-services, digital-download, refund, payout, disbursement. |
| `CommerceRevenueReport`, `CommercePlatformAnalytics`, `CommerceStatistics`, `CommercePortfolio` | Aggregate revenue by stream/period/method (including `aiServicesRevenue` and `downloadRevenue`), platform analytics (MRR/ARR, wallet balances, escrow, payouts, conversion, growth), headline statistics, and the module's aggregate root — which now carries currencies, exchange rates, bundles, variants, licences, purchase history, participant earnings, relationships, and lifecycle coverage. |
| `CommerceFinancialReport` | A closed monthly accounting period (`YYYY-MM`) with gross revenue, platform fees, commissions, refunds, net revenue, and revenue-by-stream — derived from `CommerceRevenueReport` by `computeFinancialReports`. |
| Vocabularies | `COMMERCE_PRODUCT_TYPES`, `COMMERCE_PRODUCT_TYPE_LABELS`, `COMMERCE_PAYMENT_PROVIDERS`, `COMMERCE_PAYMENT_METHODS`, `COMMERCE_ORDER_STATUSES`, `COMMERCE_SUBSCRIBER_TYPES`, `COMMERCE_SUBSCRIBER_TYPE_LABELS`, `COMMERCE_WALLET_TRANSACTION_TYPES`, `COMMERCE_REFUND_REASONS`, `COMMERCE_TRANSACTION_KINDS`, `COMMERCE_REVENUE_STREAMS`, `COMMERCE_PROMOTION_KINDS`, `COMMERCE_BOOST_TIERS`, `COMMERCE_CURRENCIES`, `COMMERCE_PRICING_MODELS`, `COMMERCE_BUNDLE_STATUSES`, `COMMERCE_LICENSE_STATUSES`, `COMMERCE_RELATIONSHIP_KINDS`, and rate constants (`COMMERCE_PLATFORM_FEE_RATE`, `COMMERCE_MARKETPLACE_COMMISSION_RATE`, `COMMERCE_WITHDRAWAL_FEE_RATE`, `COMMERCE_DEFAULT_TAX_RATE`, `COMMERCE_CURRENT_DATE`). |

## Component map

All commerce components live in `components/commerce/` and are re-exported from
`components/commerce/index.ts`. They consume the existing UI primitives
(`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`,
`StatisticCard`, `Badge`) and follow the same conventions as
`components/marketplace/*` and `components/ads/*`.

| Component | Responsibility |
|---|---|
| `ShoppingCart` | Cart card with itemised lines, quantity, coupon, and the full order calculation (subtotal, discount, tax, total) via `calculateOrder`. |
| `CheckoutSummary`, `CheckoutCard` | Checkout pipeline cards with step indicator (cart → billing → payment → review → processing → confirmation) and payable breakdown. |
| `BillingProfileCard` | Saved billing address card for researchers, institutions, and publishers. |
| `BillingAddressCard` | Billing address card with full address block, contact details, and default flag. |
| `OrderCard` | Order card with order number, item lines, totals, order/payment status, payment method, and notes. |
| `OrderHistory` | Lifetime order value plus the most recent orders in a compact ledger. |
| `InvoiceCard` | Invoice card with itemised lines, discount, tax, fees, due date, and status. |
| `ReceiptCard` | Receipt card with merchant, payment method, itemised lines, paid date, and status. |
| `WalletCard` | Wallet card with total, available, and pending balances over a slate surface. |
| `WalletBalance` | Wallet balance breakdown: total, available, pending, frozen, and lifetime credits/debits. |
| `WalletHistory` | Wallet activity ledger with credit/debit direction, amount, type, and reference. |
| `TransactionCard` | Ledger transaction card with kind, method, provider, reference, and amount. |
| `RefundCard` | Refund card with number, amount, reason, note, decision metadata, and status. |
| `PaymentMethodCard` | Payment rail card showing which enabled gateways support a method via `providersForMethod`. |
| `SubscriptionCard` | Active subscription card with status, billing cycle, price, and monthly/annual equivalents via `subscriptionMonthlyAmount`/`subscriptionAnnualAmount`. |
| `PricingCard` | Subscription plan card with per-seat cost, annual discount via `calculateSubscriptionCost`, and feature list. |
| `CommissionCard` | Marketplace commission card with gross sale, rate, amount, and paid status. |
| `RevenueDashboard`, `MarketplaceRevenueCard`, `MarketplaceFinanceCard`, `RevenueCard` | Platform revenue dashboards: gross/net revenue, commissions, fees, refunds, split by stream (marketplace, advertising, subscriptions, AI services), period, and payment method — `MarketplaceFinanceCard` presents the net position as proportional bars. |
| `VendorFinanceCard`, `CustomerFinanceCard` | Vendor period finance (gross, fees, commissions, refunds, net, lifetime, pending) and customer finance (lifetime spend, wallet balance, orders, subscriptions, purchases). |
| `CouponCard` | Coupon card with code, value, applicability validated by `validateCoupon`, and usage. |
| `PromotionCard` | Promotion card with kind, discount, window, live state, and estimated reach via `estimatePromotionReach`. |
| `DiscountCard`, `ProductCard` | Product pricing cards with list/effective price, discount percent, savings, and tags via `effectiveProductPrice`/`productDiscountPercent`. |
| `EscrowCard` | Escrow card with amount, buyer/vendor, held/released dates, and status. |
| `PayoutCard`, `SettlementCard` | Settlement/payout cards — `SettlementCard` additionally shows the gross → commission → platform fee → withdrawal fee → net waterfall via `calculateSettlement`. |
| `VendorRevenueCard`, `ParticipantEarningsCard` | Vendor and participant earnings cards with gross, fees, commissions, refunds, net, available, pending, and lifetime balances. |
| `InstitutionRevenueCard`, `PublisherRevenueCard`, `ResearcherRevenueCard` | Segment revenue panels for institutional, publisher/journal, and researcher participants. |
| `MarketplaceSalesCard` | Marketplace sales surface: orders, revenue, AOV, conversion, growth, and refund rate from statistics + analytics. |
| `CommerceStatistics`, `CommerceAnalytics`, `AnalyticsDashboard` | Headline commerce statistics and deeper platform analytics (AOV, conversion, refund rate, growth) composed into a dashboard. |
| `FinancialAnalyticsCard` | Platform financial surface: MRR, ARR, active subscriptions, wallet balances, escrow, payouts, and coupon redemptions. |
| `FinancialAnalytics`, `RevenueChart` | Revenue analytics (gross/net, fees, commissions, MRR, ARR, AOV, refund rate) and the monthly revenue curve charted from the ledger's `byPeriod`. |
| `BundleCard` | Bundle pricing card with member products, list total, bundle price, savings, and saving percent. |
| `VariantCard` | Product variant card with attributes, unit price, and stock. |
| `LicenseCard` | Seat-based licence card with licensee, term, value, and status. |
| `CurrencyCard`, `ExchangeRateCard` | Settlement-rail currency card and quoted conversion-rate card. |
| `TaxCard` | Tax-rate rule card with jurisdiction and applicability. |
| `DigitalDownloadCard` | Digital download purchase card with format, quantity, and total. |
| `PurchaseHistoryCard` | Purchase-history ledger derived from placed orders. |
| `RelationshipCard` | Directed cross-module relationship card. |
| `LifecycleCoverageList` | The commerce surfaces serving each research lifecycle stage. |
| `CommerceBadge` | Named badges over the shared `Badge` primitive (`OrderStatusBadge`, `PaymentStatusBadge`, `PaymentMethodBadge`, `ProductTypeBadge`, `WalletStatusBadge`, `WalletTransactionTypeBadge`, `SubscriptionStatusBadge`, `SubscriberTypeBadge`, `BillingCycleBadge`, `CouponStatusBadge`, `PromotionKindBadge`, `RefundStatusBadge`, `RefundReasonBadge`, `InvoiceStatusBadge`, `ReceiptStatusBadge`, `EscrowStatusBadge`, `SettlementStatusBadge`, `CommissionStatusBadge`, `TransactionKindBadge`, `BundleStatusBadge`, `LicenseStatusBadge`, `PricingModelBadge`, `ParticipantTypeBadge`, `RelationshipKindBadge`). |
| `format` | Shared formatting helpers (`formatCurrency`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatDate`, `formatPrice`, `formatInterval`, `formatProductType`, `invoiceSummary`, `formatPricingModel`, `formatBundleStatus`, `formatLicenseStatus`, `formatParticipantType`, `formatRelationshipKind`, and the status formatters). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/commerce` | `app/commerce/page.tsx` | Commerce statistics, financial dashboard, revenue analytics + revenue chart, financial reports, catalog, featured products & bundles, shopping carts, checkout, billing profiles & addresses, order lifecycle + order history, invoices, receipts, refunds, wallets + wallet balance + wallet history, subscription plans, active subscriptions, commissions, escrows, settlements + payout maths, vendor revenue, marketplace/vendor/customer finance, participant earnings, institution/publisher/researcher revenue, marketplace revenue, AI services & digital downloads, purchase history, bundles, variants, licences, currencies & exchange rates, tax rates, commerce relationships, lifecycle coverage, coupons, promotions, boost previews, ledger transactions, payment gateway abstraction + payment methods, revenue dashboard, financial dashboard, featured order, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Order, invoice, wallet, and subscription detail routes remain the source
modules' own routes.

## Revenue flow

Every revenue line flows through a single ledger:

```
catalog → order (calculateOrder)
       → transaction (kind, amount, method, provider)
       → computeRevenueReport
         ├── byStream  (marketplace, advertising, subscription, boost, featured,
         │              sponsored, membership, premium-analytics, api-access,
         │              enterprise-licensing, ai-services, digital-download)
         ├── byPeriod  (transaction.createdAt month)
         └── byMethod  (payments by method)
```

- Purchases, subscriptions, advertising, boosts, featured and sponsored
  listings, memberships, premium analytics, AI services, and digital downloads
  are all `CommerceTransactionKind` members and aggregate into
  `COMMERCE_REVENUE_STREAMS` without special-casing.
- `aiServicesRevenue` and `downloadRevenue` are first-class fields on
  `CommerceRevenueReport`; the AI service (`prod-ai-discovery-analytics`) and
  dataset download (`prod-dataset-download`) products reference live
  `DISCOVERY_ITEMS` and `DATASETS` records.
- Revenue by participant segment is derived in `COMMERCE_PARTICIPANT_EARNINGS`
  from orders grouped by buyer (`institution`, `publisher`, `researcher`,
  `vendor`) after platform fees and refunds.

## Payment flow

```
cart → billing address → payment intent (buildPaymentIntent)
     → captured payment (intentToPayment)
     → wallet/credits double-entry or provider capture
     → order paymentStatus paid → receipt (generateReceipt)
```

- The gateway abstraction (`CommerceGatewayProvider`) advertises currencies,
  methods, and capabilities; `providersForMethod` and
  `enabledGatewayProviders` drive provider selection without a live API.
- Wallets and credits are first-class rails (`Wallet`, `Credits`); institution
  billing, mobile money, PayPal, cards, and bank transfer are modelled through
  providers (Paystack, Flutterwave, Stripe, PayPal, Wise, Bank Transfer, Apple
  Pay, Google Pay).
- Every captured payment has a method, provider, reference, escrow flag, and
  date; paid orders generate receipts.

## Commission flow

```
order.total → calculateMarketplaceCommission
            → CommerceCommission (per vendor per order)
            → CommerceVendorEarnings (gross − commission − fees − refunds)
            → ParticipantEarnings (per segment, via computeParticipantEarnings)
```

- Commissions are tracked per order with gross amount, rate, and paid status,
  and flow into both vendor earnings and participant earnings.
- The commission rate is a declared constant (`COMMERCE_MARKETPLACE_COMMISSION_RATE`)
  and every calculation passes through the engine.

## Settlement flow

```
vendor earnings → calculateSettlement
               → { gross, commission, platformFee, withdrawalFee, net }
               → CommerceSettlement (scheduled → processing → completed)
               → wallet commission-payout credits (recomputeWalletBalance)
```

- `calculateSettlement` accepts an object input (`{ gross, ...rate overrides,
  currency }`) and returns the full waterfall; the `SETTLEMENTS` production data
  and the `SettlementCard` both derive from it.
- Settlements use the payout platform fee scope
  (`COMMERCE_WITHDRAWAL_FEE_RATE`) and move through scheduled, processing, and
  completed states across Paystack, Flutterwave, Wise, and bank transfer.

## Lifecycle

`COMMERCE_LIFECYCLE_COVERAGE` maps each of the 15 `ResearchLifecycleStageId`
stages to the commerce surfaces that serve it (AI discovery analytics for
`idea` and `impact`, grant disbursements for `funding`, dataset downloads for
`dataset`, editing and analysis services for `manuscript`/`analysis`, call-for-
papers campaigns for `publication`/`conference`, curriculum toolkits for
`knowledge-transfer`, and so on). The lifecycle engine is only referenced by
type id — the Commerce module stays additive.

## Dependency graph

```
Commerce module
  ├── lib/commerce.ts         (pure financial engine — new)
  ├── lib/marketplace.ts      (marketplace pricing/vendor records)
  ├── lib/ads.ts              (PromotableObject, AdCampaign references)
  ├── types/commerce.ts       (commerce entity model — new)
  ├── types/funding.ts        (CurrencyCode)
  ├── types/ads.ts            (PromotableObject, AdCampaign)
  ├── types/research.ts       (ResearchLifecycleStageId)
  ├── constants/placeholder-commerce.ts  (derived commerce data — new)
  ├── constants/placeholder-marketplace.ts (vendors, listings)
  ├── constants/placeholder-ads.ts       (campaigns)
  ├── constants/placeholder-researchers.ts (researchers)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── constants/placeholder-publishers.ts  (publishers)
  ├── constants/placeholder-journals.ts    (journals)
  ├── constants/placeholder-conferences.ts (conferences)
  ├── constants/placeholder-datasets.ts    (dataset downloads)
  ├── constants/placeholder-discovery.ts   (AI discovery analytics)
  ├── components/commerce/*   (component library — new)
  ├── components/layout/*     (PageLayout, PageHeader)
  ├── components/ui/*         (Container, Button, SectionTitle, Alert, StatisticCard, Badge)
  ├── hooks/useCommerce.ts    (commerce state hook — new)
  ├── db/schema.sql           (commerce tables — appended)
  └── app/commerce/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every product, order, wallet transaction, invoice, receipt, commission, escrow,
settlement, bundle, variant, licence, purchase-history line, relationship, and
currency quote references an existing source record, so no data is duplicated.

## Placeholder data

`constants/placeholder-commerce.ts` provides:

- **Products & services** (`PRODUCTS`) — derived from `ProductSeed` records that
  reference real marketplace vendors (`vendor-ibadan-statistics-lab`,
  `vendor-dr-smith`, `vendor-adebayo-energy-consulting`,
  `vendor-university-of-ibadan`, `vendor-scholatia-press`,
  `vendor-oxford-academic-services`), real listings
  (`listing-statistical-analysis`, `listing-academic-editing`,
  `listing-gis-spatial-analysis`), an advertising campaign
  (`cam-journal-launch`), publications, datasets (`DATASETS[0]`), and discovery
  items (`DISCOVERY_ITEMS[0]`) — including the AI discovery analytics and
  licensed dataset download products.
- **Carts** (`CARTS`) — the ojuri researcher cart (with `RESEARCH10` coupon)
  and the University of Ibadan institutional cart.
- **Coupons** (`COUPONS`) and **promotions** (`PROMOTIONS`) — percent/fixed
  coupons (including `RESEARCH10`, `INSTITUTION20`, `FLASH30`, `VENDORPRO`,
  `WELCOME15`, and the expired `SUMMER2025`) and windowed promotions with
  budgets and product coverage.
- **Orders** (`ORDERS`) — 16 orders derived through `calculateOrder` from real
  buyers (researchers `ojuri`, `smith`, `adebayo`, `maria`, `jscholar`, the
  institution `SAID-INST-0000`, publisher `scholatia-press`, journal `JNL-001`,
  the advertiser `adv-scholatia-open-research-press`, and the conference
  `siri-conf`) across every payment method and order state — including the AI
  service and dataset download purchases.
- **Invoices** (`INVOICES`) and **receipts** (`RECEIPTS`) — derived through
  `generateInvoiceNumber` and `generateReceipt`.
- **Payments** (`PAYMENTS`) and **payment intents** (`PAYMENT_INTENTS`) — the
  provider-independent rail across Paystack, Stripe, Wise, PayPal, mobile
  money, wallet, credits, and institution billing.
- **Refunds** (`REFUNDS`) — completed and processing refunds.
- **Subscription plans** (`SUBSCRIPTION_PLANS`) — eight plans across every
  subscriber type, and **subscriptions** (`SUBSCRIPTIONS`) derived through
  `calculateSubscriptionCost`.
- **Wallets** (`WALLETS`) and **wallet transactions** (`WALLET_TRANSACTIONS`) —
  researcher, vendor, and institution wallets with balances recomputed by
  `recomputeWalletBalance`, including commission payouts, marketplace
  purchases, subscription payments, refunds, withdrawals, and a pending grant
  disbursement.
- **Commissions** (`COMMISSIONS`), **vendor earnings** (`VENDOR_EARNINGS`),
  **escrows** (`ESCROWS`), and **settlements** (`SETTLEMENTS`) — the full
  monetization and payout pipeline.
- **Transactions** (`TRANSACTIONS`) — the ledger feeding the revenue report,
  including `ai-services` and `digital-download` kinds.
- **Tax rates** (`TAX_RATES`), **platform fees** (`PLATFORM_FEES`), **gateway
  providers** (`GATEWAY_PROVIDERS` via `providerCapabilities`), and **billing
  addresses** (`BILLING_ADDRESSES`).
- **Currencies & exchange rates** — `COMMERCE_CURRENCIES` (14 settlement rails,
  re-exported from the type vocabulary) and `COMMERCE_EXCHANGE_RATES` (quoted
  conversions, e.g. USD→GBP, USD→NGN).
- **Bundles** (`COMMERCE_BUNDLES` via `calculateBundlePrice`), **variants**
  (`COMMERCE_PRODUCT_VARIANTS`), and **licences** (`COMMERCE_LICENSES`)
  referencing the catalog products and institution/publisher/journal/conference
  identities.
- **Purchase history** (`COMMERCE_PURCHASE_HISTORY` via
  `purchaseHistoryFromOrders`, enriched with product types and source
  references) and **participant earnings** (`COMMERCE_PARTICIPANT_EARNINGS`) by
  buyer segment.
- **Relationships** (`COMMERCE_RELATIONSHIPS`) and **lifecycle coverage**
  (`COMMERCE_LIFECYCLE_COVERAGE`) tying commerce surfaces back to module
  identities and the research lifecycle.
- **Boost previews** (`BOOST_PREVIEWS` via `calculateBoostCost`) and
  **promotion-reach previews** (`PROMOTION_REACH_PREVIEWS` via
  `estimatePromotionReach`).
- Derived aggregates: `COMMERCE_STATISTICS` (via `computeCommerceStatistics`),
  `COMMERCE_ANALYTICS` (via `computePlatformAnalytics`),
  `COMMERCE_REVENUE_REPORT` (via `computeRevenueReport`),
  `FINANCIAL_REPORTS` (via `computeFinancialReports` — closed monthly accounting
  periods), the aggregate
  `COMMERCE_PORTFOLIO` (via `buildCommercePortfolio`), and per-surface featured
  picks (`FEATURED_PRODUCT`, `FEATURED_CART`, `FEATURED_ORDER`,
  `FEATURED_INVOICE`, `FEATURED_RECEIPT`, `FEATURED_WALLET`,
  `FEATURED_SUBSCRIPTION`, `FEATURED_SUBSCRIPTION_PLAN`, `FEATURED_COUPON`,
  `FEATURED_PROMOTION`, `FEATURED_ESCROW`, `FEATURED_SETTLEMENT`,
  `FEATURED_COMMISSION`, `FEATURED_VENDOR_EARNINGS`, `FEATURED_TRANSACTION`,
  `FEATURED_PAYMENT`, `FEATURED_GATEWAY`, `FEATURED_CURRENCY`,
  `FEATURED_EXCHANGE_RATE`, `FEATURED_BUNDLE`, `FEATURED_PRODUCT_VARIANT`,
  `FEATURED_LICENSE`, `FEATURED_PURCHASE_RECORD`,
  `FEATURED_PARTICIPANT_EARNINGS`, `FEATURED_FINANCIAL_REPORT`).

## Utilities

`lib/commerce.ts` provides pure, strongly typed engine helpers so the
placeholder data and the Commerce page never re-implement financial logic:

- **Pricing & discounts**: `calculateDiscount`, `discountPercentOf`,
  `productDiscount`, `productDiscountPercent`, `effectiveProductPrice`,
  `formatCurrency` (locale-aware).
- **Coupons & promotions**: `validateCoupon`, `calculateCoupon`,
  `isCouponActive`, `activeCoupons`, `isPromotionActive`, `activePromotions`,
  `estimatePromotionReach`.
- **Taxes, fees, commissions**: `calculateTax`, `taxAmount`,
  `calculatePlatformFee`, `calculateMarketplaceCommission`,
  `calculateVendorRevenue`, `calculateWithdrawalFee`.
- **Orders**: `cartSubtotal`, `cartCount`, `calculateGrandTotal`,
  `calculateOrder` (per-item totals, coupon validation, tax line, platform
  fee).
- **Refunds**: `calculateRefund`, `REFUND_STATUS_ORDER`, `refundsForOrder`,
  `refundedTotalForOrder`, `canRefundOrder`.
- **Invoices & receipts & payments**: `generateInvoiceNumber`, `invoiceSubtotal`,
  `invoiceTotal`, `generateReceiptNumber`, `generateReceipt`,
  `buildPaymentIntent`, `intentToPayment`.
- **Wallet system**: `walletAvailableBalance`, `walletSpendableBalance`,
  `createWalletTransaction`, `applyWalletTransaction`, `recomputeWalletBalance`,
  `walletTransactionsFor`.
- **Subscriptions**: `cycleMonths`, `calculateSubscriptionCost`,
  `subscriptionMonthlyAmount`, `subscriptionAnnualAmount`,
  `isSubscriptionActive`, `subscriptionRenewalDue`, `activeSubscriptions`,
  `calculateMrr`, `calculateArr`.
- **Boosts**: `calculateBoostCost` against `COMMERCE_BOOST_TIERS`.
- **Escrow, commissions, settlements**: `activeEscrows`,
  `pendingSettlements`, `completedSettlements`, `vendorEarningsFor`,
  `calculateSettlement` (gross → commission → platform fee → withdrawal fee →
  net).
- **Currencies**: `convertCurrency`, `findExchangeRate`.
- **Bundles & variants**: `calculateBundlePrice` (list total, bundle price,
  savings, saving percent), `variantPrice`.
- **Ledger & history**: `purchaseHistoryFromOrders`,
  `sortTransactionsByDate`, `filterTransactionsByKind`, `sortOrdersByDate`,
  `filterOrdersByStatus`.
- **Participant earnings**: `computeParticipantEarnings` (aggregates orders,
  commissions, and refunds per participant).
- **Payment gateway abstraction**: `GATEWAY_CAPABILITIES`,
  `providerCapabilities`, `getGatewayProvider`, `enabledGatewayProviders`,
  `providersForMethod`, `allCommerceProviders`.
- **Aggregates**: `computeRevenueReport` (by stream, period, method, including
  AI services and downloads), `computePlatformAnalytics` (MRR/ARR, wallet
  balances, escrow, payouts, coupons, refund rate, conversion, growth),
  `computeCommerceStatistics`, `computeFinancialReports` (closed monthly
  accounting periods with fees, commissions, refunds, and net),
  `buildCommercePortfolio`, plus the default
  engine export with the headline functions.

## Hook

`hooks/useCommerce.ts` exposes the commerce state: the aggregate portfolio,
statistics, analytics, revenue report, financial reports, the filtered product
catalog
(query/category with `filteredProducts`), featured products and bundles, the
interactive carts (add/remove/update quantity, apply coupon), engine-computed
cart calculations (`selectedCalculation` via `calculateOrder`), coupon
validation (`couponStatusOf`), active coupons and promotions, enabled gateway
providers, `providersFor` lookups, boost previews, per-tier boost cost
estimates, and the new 1.9D surfaces (currencies, exchange rates, bundles,
variants, licences, purchase history, participant earnings, relationships, and
lifecycle coverage).

## Schema

`db/schema.sql` appends the commerce-only tables (products, carts, cart items,
orders, order items, payment intents, payments, refunds, invoices, receipts,
coupons, promotions, wallets, wallet transactions, subscription plans,
subscriptions, commissions, escrows, vendor earnings, settlements,
transactions, tax rates, platform fees, gateway providers, billing addresses,
currencies, exchange rates, bundles, bundle products, product variants,
licences, purchase history, participant earnings, commerce relationships,
lifecycle coverage, payment methods, financial reports). They reference
`marketplace_vendors` and
`marketplace_products` where a record exists and never duplicate marketplace or
advertising data.

## Future extensions

- Live payment rails (Paystack, Flutterwave, Stripe, PayPal, Razorpay, Wise,
  bank transfer, institutional invoice, Apple Pay, Google Pay) replacing the
  gateway abstraction with real
  credentials, webhooks, and KYC — the capabilities and intent records are the
  integration seed.
- Real escrow, settlement scheduling, wallet top-ups, and automated payout
  reconciliation replacing the placeholder billing records.
- Checkout and order detail routes, wallet pages, subscription management, and
  a dedicated `/commerce/licenses` and `/commerce/bundles` surface.
- Live FX feeds replacing the quoted `COMMERCE_EXCHANGE_RATES` table, with
  `convertCurrency` switching to a stored rate provider.
- The advertising auction integrating `sponsored`/`boosted` products with the
  Advertising module's quality scores.
- Grant disbursement automation flowing through the wallet and transaction
  ledger.
- AI services and digital-download fulfillment hooks wired to the Discovery,
  Trust, and Datasets modules.
- Persistence when the platform-wide persistence phase lands; the types in
  `types/commerce.ts` and the schema in `db/schema.sql` are the schema seed.
