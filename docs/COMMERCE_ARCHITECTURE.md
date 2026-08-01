# Scholatia Commerce & Marketplace Engine Architecture

## Purpose

The Commerce module is the **financial operating system** of the Scholatia
ecosystem. It does **not** introduce a new lifecycle stage and does **not** own
records — everything that can be bought, sold, subscribed to, booked, promoted,
or monetized flows through this engine: marketplace products and services,
advertising campaigns, boosted posts, featured and sponsored listings, vendor
memberships, subscription plans, premium analytics, future API access,
enterprise licensing, and future grant disbursements.

Every record references an existing module record:

- Every **product or service** is a live reference to a marketplace listing
  (`sourceId` + `sourceEntity`), an advertising campaign, a publication, a
  conference, a dataset, or a funding opportunity.
- Every **order** references catalog products; every **wallet transaction**
  references an existing order, subscription, campaign, boost, refund, or
  disbursement.
- Every **invoice, receipt, commission, escrow, settlement, and revenue line**
  is derived by the pure engine in `lib/commerce.ts` — the placeholder data and
  the Commerce page never re-implement pricing, taxes, coupons, commissions,
  wallet bookkeeping, subscriptions, boosts, or analytics by hand.

The module is **provider-independent**. No real payment API is integrated. The
payment-gateway abstraction models future integration with **Paystack,
Flutterwave, Stripe, PayPal, Wise, bank transfer, Apple Pay, and Google Pay**
(plus the platform Wallet and Credits), each advertising its currencies,
methods, and capabilities — without live credentials.

The module is **additive**: it reuses the existing design system, existing page
patterns, the Marketplace, Advertising, Researchers, Institutions, Publishers,
Journals, Conferences, Discovery, Intelligence, Funding, RBAC, and
Authentication modules. It introduces no new packages, no duplicate records, no
APIs, no database writes, no server actions, no authentication changes, and no
external model dependency.

## Relationship to the Research Lifecycle

- The Commerce module is a platform-wide transactional layer, like Publishers,
  Institutions, Discovery, and Advertising, and does **not** own a lifecycle
  stage. Its products map to the stages they serve through their source records
  (a statistical-analysis service serves `analysis`, a grant-writing service
  serves `funding`, an equipment rental serves `knowledge-transfer`).
- `CurrencyCode` from `types/funding.ts` is reused for every price, wallet
  balance, commission, escrow, and settlement — no conversion is ever implied.
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
| `CommercePaymentProvider`, `CommercePaymentMethod`, `CommerceGatewayCapabilities`, `CommerceGatewayProvider` | The provider-independent gateway abstraction: Paystack, Flutterwave, Stripe, PayPal, Wise, Bank Transfer, Apple Pay, Google Pay, Wallet, Credits — each with currencies, methods, recurring/escrow/refunds/payouts/verification capabilities. |
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
| `CommerceTransactionKind`, `CommerceTransaction` | The ledger feeding the revenue report: purchase, subscription, advertising, boost, featured, sponsored, membership, premium-analytics, api-access, enterprise-licensing, refund, payout, disbursement. |
| `CommerceRevenueReport`, `CommercePlatformAnalytics`, `CommerceStatistics`, `CommercePortfolio` | Aggregate revenue by stream/period/method, platform analytics (MRR/ARR, wallet balances, escrow, payouts, conversion, growth), headline statistics, and the module's aggregate root. |
| Vocabularies | `COMMERCE_PRODUCT_TYPES`, `COMMERCE_PRODUCT_TYPE_LABELS`, `COMMERCE_PAYMENT_PROVIDERS`, `COMMERCE_PAYMENT_METHODS`, `COMMERCE_ORDER_STATUSES`, `COMMERCE_SUBSCRIBER_TYPES`, `COMMERCE_SUBSCRIBER_TYPE_LABELS`, `COMMERCE_WALLET_TRANSACTION_TYPES`, `COMMERCE_REFUND_REASONS`, `COMMERCE_TRANSACTION_KINDS`, `COMMERCE_REVENUE_STREAMS`, `COMMERCE_PROMOTION_KINDS`, `COMMERCE_BOOST_TIERS`, and rate constants (`COMMERCE_PLATFORM_FEE_RATE`, `COMMERCE_MARKETPLACE_COMMISSION_RATE`, `COMMERCE_WITHDRAWAL_FEE_RATE`, `COMMERCE_DEFAULT_TAX_RATE`, `COMMERCE_CURRENT_DATE`). |

## Component map

All commerce components live in `components/commerce/` and are re-exported from
`components/commerce/index.ts`. They consume the existing UI primitives
(`PageLayout`, `PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`,
`StatisticCard`, `Badge`) and follow the same conventions as
`components/marketplace/*` and `components/ads/*`.

| Component | Responsibility |
|---|---|
| `ShoppingCart` | Cart card with itemised lines, quantity, coupon, and the full order calculation (subtotal, discount, tax, total) via `calculateOrder`. |
| `CheckoutSummary` | Checkout pipeline card with step indicator and payable breakdown (subtotal, discount, tax, platform fee, total). |
| `OrderCard` | Order card with order number, item lines, totals, order/payment status, payment method, and notes. |
| `OrderHistory` | Lifetime order value plus the most recent orders in a compact ledger. |
| `InvoiceCard` | Invoice card with itemised lines, discount, tax, fees, due date, and status. |
| `ReceiptCard` | Receipt card with merchant, payment method, itemised lines, paid date, and status. |
| `WalletCard` | Wallet card with total, available, and pending balances over a slate surface. |
| `WalletHistory` | Wallet activity ledger with credit/debit direction, amount, type, and reference. |
| `TransactionCard` | Ledger transaction card with kind, method, provider, reference, and amount. |
| `SubscriptionCard` | Active subscription card with status, billing cycle, price, and monthly/annual equivalents via `subscriptionMonthlyAmount`/`subscriptionAnnualAmount`. |
| `PricingCard` | Subscription plan card with per-seat cost, annual discount via `calculateSubscriptionCost`, and feature list. |
| `CommissionCard` | Marketplace commission card with gross sale, rate, amount, and paid status. |
| `RevenueDashboard` | Platform revenue dashboard: gross/net revenue, commissions, fees, refunds, split by stream, period, and payment method. |
| `CouponCard` | Coupon card with code, value, applicability validated by `validateCoupon`, and usage. |
| `PromotionCard` | Promotion card with kind, discount, window, live state, and estimated reach via `estimatePromotionReach`. |
| `DiscountCard` | Product pricing card with list/effective price, discount percent, and savings via `effectiveProductPrice`/`productDiscountPercent`. |
| `EscrowCard` | Escrow card with amount, buyer/vendor, held/released dates, and status. |
| `PayoutCard` | Settlement/payout card with amount, provider, and scheduled/completed dates. |
| `VendorRevenueCard` | Vendor earnings card with gross sales, commissions, fees, refunds, net, available, pending, and lifetime earnings. |
| `MarketplaceSalesCard` | Marketplace sales surface: orders, revenue, AOV, conversion, growth, and refund rate from statistics + analytics. |
| `FinancialAnalyticsCard` | Platform financial surface: MRR, ARR, active subscriptions, wallet balances, escrow, payouts, and coupon redemptions. |
| `CommerceBadge` | Named badges over the shared `Badge` primitive (`OrderStatusBadge`, `PaymentStatusBadge`, `PaymentMethodBadge`, `ProductTypeBadge`, `WalletStatusBadge`, `WalletTransactionTypeBadge`, `SubscriptionStatusBadge`, `SubscriberTypeBadge`, `BillingCycleBadge`, `CouponStatusBadge`, `PromotionKindBadge`, `RefundStatusBadge`, `RefundReasonBadge`, `InvoiceStatusBadge`, `ReceiptStatusBadge`, `EscrowStatusBadge`, `SettlementStatusBadge`, `CommissionStatusBadge`, `TransactionKindBadge`). |
| `format` | Shared formatting helpers (`formatCurrency`, `formatNumber`, `formatCompactNumber`, `formatPercent`, `formatDate`, `formatPrice`, `formatInterval`, `formatProductType`, `invoiceSummary`, and the status formatters). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/commerce` | `app/commerce/page.tsx` | Commerce statistics, catalog, shopping carts, checkout summary, order lifecycle + order history, invoices, receipts, wallets + wallet history, subscription plans, active subscriptions, commissions, escrows, settlements, vendor revenue, coupons, promotions, boost previews, ledger transactions, payment gateway abstraction, revenue dashboard, financial dashboard, featured order, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it. Order, invoice, wallet, and subscription detail routes remain the source
modules' own routes.

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
  ├── components/commerce/*   (component library — new)
  ├── components/layout/*     (PageLayout, PageHeader)
  ├── components/ui/*         (Container, Button, SectionTitle, Alert, StatisticCard, Badge)
  ├── hooks/useCommerce.ts    (commerce state hook — new)
  ├── db/schema.sql           (commerce tables — appended)
  └── app/commerce/page.tsx   (route — new)
```

The module depends only on existing infrastructure plus its own new files.
Every product, order, wallet transaction, invoice, receipt, commission, escrow,
and settlement references an existing source record, so no data is duplicated.

## Placeholder data

`constants/placeholder-commerce.ts` provides:

- **Products & services** (`PRODUCTS`) — derived from `ProductSeed` records that
  reference real marketplace vendors (`vendor-ibadan-statistics-lab`,
  `vendor-dr-smith`, `vendor-adebayo-energy-consulting`,
  `vendor-university-of-ibadan`, `vendor-scholatia-press`,
  `vendor-oxford-academic-services`) and real listings (`listing-statistical-analysis`,
  `listing-academic-editing`, `listing-gis-spatial-analysis`), an advertising
  campaign (`cam-journal-launch`), publications, datasets, and funding.
- **Carts** (`CARTS`) — the ojuri researcher cart (with `RESEARCH10` coupon)
  and the University of Ibadan institutional cart.
- **Coupons** (`COUPONS`) and **promotions** (`PROMOTIONS`) — percent/fixed
  coupons (including `RESEARCH10`, `INSTITUTION20`, `FLASH30`, `VENDORPRO`,
  `WELCOME15`, and the expired `SUMMER2025`) and windowed promotions with
  budgets and product coverage.
- **Orders** (`ORDERS`) — 14 orders derived through `calculateOrder` from real
  buyers (researchers `ojuri`, `smith`, `adebayo`, `maria`, `jscholar`, the
  institution `SAID-INST-0000`, publisher `scholatia-press`, journal `JNL-001`,
  and the advertiser `adv-scholatia-open-research-press`) across every payment
  method and order state.
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
- **Transactions** (`TRANSACTIONS`) — the ledger feeding the revenue report.
- **Tax rates** (`TAX_RATES`), **platform fees** (`PLATFORM_FEES`), **gateway
  providers** (`GATEWAY_PROVIDERS` via `providerCapabilities`), and **billing
  addresses** (`BILLING_ADDRESSES`).
- **Boost previews** (`BOOST_PREVIEWS` via `calculateBoostCost`) and
  **promotion-reach previews** (`PROMOTION_REACH_PREVIEWS` via
  `estimatePromotionReach`).
- Derived aggregates: `COMMERCE_STATISTICS` (via `computeCommerceStatistics`),
  `COMMERCE_ANALYTICS` (via `computePlatformAnalytics`),
  `COMMERCE_REVENUE_REPORT` (via `computeRevenueReport`), the aggregate
  `COMMERCE_PORTFOLIO` (via `buildCommercePortfolio`), and per-surface featured
  picks (`FEATURED_PRODUCT`, `FEATURED_CART`, `FEATURED_ORDER`,
  `FEATURED_INVOICE`, `FEATURED_RECEIPT`, `FEATURED_WALLET`,
  `FEATURED_SUBSCRIPTION`, `FEATURED_SUBSCRIPTION_PLAN`, `FEATURED_COUPON`,
  `FEATURED_PROMOTION`, `FEATURED_ESCROW`, `FEATURED_SETTLEMENT`,
  `FEATURED_COMMISSION`, `FEATURED_VENDOR_EARNINGS`, `FEATURED_TRANSACTION`,
  `FEATURED_PAYMENT`, `FEATURED_GATEWAY`).

## Utilities

`lib/commerce.ts` provides pure, strongly typed engine helpers so the
placeholder data and the Commerce page never re-implement financial logic:

- **Pricing & discounts**: `calculateDiscount`, `discountPercentOf`,
  `productDiscount`, `productDiscountPercent`, `effectiveProductPrice`.
- **Coupons & promotions**: `validateCoupon`, `calculateCoupon`,
  `isCouponActive`, `activeCoupons`, `isPromotionActive`, `activePromotions`,
  `estimatePromotionReach`.
- **Taxes, fees, commissions**: `calculateTax`, `taxAmount`,
  `calculatePlatformFee`, `calculateMarketplaceCommission`,
  `calculateVendorRevenue`, `calculateWithdrawalFee`.
- **Orders**: `cartSubtotal`, `cartCount`, `calculateGrandTotal`,
  `calculateOrder` (per-item totals, coupon validation, tax line, platform
  fee).
- **Refunds**: `calculateRefund`, `REFUND_STATUS_ORDER`.
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
  `pendingSettlements`, `completedSettlements`, `vendorEarningsFor`.
- **Payment gateway abstraction**: `GATEWAY_CAPABILITIES`,
  `providerCapabilities`, `getGatewayProvider`, `enabledGatewayProviders`,
  `providersForMethod`, `allCommerceProviders`.
- **Aggregates**: `computeRevenueReport` (by stream, period, method),
  `computePlatformAnalytics` (MRR/ARR, wallet balances, escrow, payouts,
  coupons, refund rate, conversion, growth), `computeCommerceStatistics`,
  `buildCommercePortfolio`, plus the default engine export with the headline
  functions.

## Hook

`hooks/useCommerce.ts` exposes the commerce state: the aggregate portfolio,
statistics, analytics, revenue report, and the filtered product catalog
(query/category with `filteredProducts`), the interactive carts (add/remove/
update quantity, apply coupon), engine-computed cart calculations
(`selectedCalculation` via `calculateOrder`), coupon validation
(`couponStatusOf`), active coupons and promotions, enabled gateway providers,
`providersFor` lookups, boost previews, and per-tier boost cost estimates.

## Schema

`db/schema.sql` appends the commerce-only tables (products, carts, cart items,
orders, order items, payment intents, payments, refunds, invoices, receipts,
coupons, promotions, wallets, wallet transactions, subscription plans,
subscriptions, commissions, escrows, vendor earnings, settlements,
transactions, tax rates, platform fees, gateway providers, billing addresses).
They reference `marketplace_vendors` and `marketplace_products` where a record
exists and never duplicate marketplace or advertising data.

## Future extensions

- Live payment rails (Paystack, Flutterwave, Stripe, PayPal, Wise, bank
  transfer, Apple Pay, Google Pay) replacing the gateway abstraction with real
  credentials, webhooks, and KYC — the capabilities and intent records are the
  integration seed.
- Real escrow, settlement scheduling, and wallet top-ups replacing the
  placeholder billing records.
- Checkout and order detail routes, wallet pages, and subscription management
  surfaces.
- The advertising auction integrating `sponsored`/`boosted` products with the
  Advertising module's quality scores.
- Grant disbursement automation flowing through the wallet and transaction
  ledger.
- Persistence when the platform-wide persistence phase lands; the types in
  `types/commerce.ts` and the schema in `db/schema.sql` are the schema seed.
