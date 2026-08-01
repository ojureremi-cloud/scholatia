import type { CurrencyCode } from '@/types/funding';
import type { ResearchLifecycleStageId } from '@/types/research';

/**
 * The Scholatia Commerce & Marketplace Engine of the Scholatia ecosystem.
 *
 * The Commerce module is the **financial operating system** for the entire
 * Scholatia ecosystem. It does NOT introduce a new lifecycle stage and does NOT
 * own records: everything that can be bought, sold, subscribed to, booked,
 * promoted, or monetized — marketplace products and services, advertising
 * campaigns, boosted posts, featured and sponsored listings, vendor
 * memberships, subscription plans, premium analytics, future API access and
 * enterprise licensing, and future grants disbursement — eventually flows
 * through this engine. Every order references existing module records; every
 * wallet transaction references an existing order, subscription, campaign, or
 * disbursement; and every invoice, receipt, commission, escrow, settlement, and
 * revenue report is derived from pure engine functions in `lib/commerce.ts`.
 *
 * The module is **provider-independent**: no real payment API is integrated.
 * Instead a payment-gateway abstraction layer (`CommercePaymentProvider`,
 * `CommerceGatewayProvider`, `CommercePaymentIntent`, `SUPPORTED_PAYMENT_PROVIDERS`)
 * models future integration with Paystack, Flutterwave, Stripe, PayPal, Wise,
 * bank transfer, Apple Pay, and Google Pay.
 */

// ---------------------------------------------------------------------------
// Products, services, catalog
// ---------------------------------------------------------------------------

/** What a commerce line item physically represents. */
export type CommerceProductType =
  | 'product'
  | 'service'
  | 'digital-product'
  | 'physical-product'
  | 'equipment'
  | 'course'
  | 'subscription-plan'
  | 'advertising-campaign'
  | 'boosted-post'
  | 'featured-listing'
  | 'sponsored-listing'
  | 'vendor-membership'
  | 'premium-analytics'
  | 'api-access'
  | 'enterprise-license';

export type CommerceProductStatus = 'draft' | 'active' | 'paused' | 'sold-out' | 'archived';

/** How a product's price is denominated. */
export type CommercePriceInterval =
  | 'one-time'
  | 'per-hour'
  | 'per-project'
  | 'per-month'
  | 'per-year'
  | 'per-credit'
  | 'per-seat'
  | 'per-word'
  | 'per-day';

export interface CommercePrice {
  amount: number;
  currency: CurrencyCode;
  interval?: CommercePriceInterval;
  /** List price before any discount, when discounted. */
  compareAt?: number;
}

/** A product or service sold through the Commerce engine. */
export interface CommerceProduct {
  id: string;
  sku: string;
  name: string;
  summary: string;
  description: string;
  type: CommerceProductType;
  category: string;
  price: CommercePrice;
  stock?: number;
  vendorId?: string;
  vendorName?: string;
  /** Live reference to the source record this product sells or services. */
  sourceId?: string;
  sourceEntity?: string;
  status: CommerceProductStatus;
  tags: string[];
  featured: boolean;
  createdDate: string;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Shopping cart, order items, orders
// ---------------------------------------------------------------------------

export interface CommerceCartItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
  vendorId?: string;
  /** Live reference to the promotable/boostable source when applicable. */
  promotableObjectId?: string;
}

export interface CommerceCart {
  id: string;
  ownerId?: string;
  items: CommerceCartItem[];
  couponCode?: string;
  updatedAt: string;
}

export type CommerceOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export interface CommerceOrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail?: string;
  items: CommerceOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  platformFee: number;
  total: number;
  currency: CurrencyCode;
  status: CommerceOrderStatus;
  paymentStatus: CommercePaymentStatus;
  paymentMethod?: CommercePaymentMethod;
  invoiceId?: string;
  receiptId?: string;
  placedAt: string;
  completedAt?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

export type CommerceCheckoutStep =
  | 'cart'
  | 'billing-address'
  | 'payment'
  | 'review'
  | 'processing'
  | 'confirmation';

export interface CommerceBillingAddress {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
}

/** Future physical fulfillment — reserved shape, not yet shipped. */
export interface CommerceShippingInfo {
  carrier: string;
  method: string;
  trackingNumber?: string;
  estimatedArrival?: string;
  shippedAt?: string;
  deliveredAt?: string;
  address?: CommerceBillingAddress;
}

// ---------------------------------------------------------------------------
// Payment gateway abstraction
// ---------------------------------------------------------------------------

/** Future payment providers the abstraction layer supports. */
export type CommercePaymentProvider =
  | 'Paystack'
  | 'Flutterwave'
  | 'Stripe'
  | 'PayPal'
  | 'Razorpay'
  | 'Wise'
  | 'Bank Transfer'
  | 'Institutional Invoice'
  | 'Apple Pay'
  | 'Google Pay'
  | 'Wallet'
  | 'Credits';

/** Provider-independent payment rails available today. */
export type CommercePaymentMethod =
  | 'card'
  | 'bank-transfer'
  | 'mobile-money'
  | 'paypal'
  | 'wallet'
  | 'credits'
  | 'escrow'
  | 'institution-billing'
  | 'apple-pay'
  | 'google-pay';

export type CommercePaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially-refunded'
  | 'cancelled';

/** Capabilities a provider advertises to the engine. */
export interface CommerceGatewayCapabilities {
  currencies: CurrencyCode[];
  methods: CommercePaymentMethod[];
  recurring: boolean;
  escrow: boolean;
  refunds: boolean;
  payouts: boolean;
  verification: boolean;
}

/** A configured payment-provider integration (no live credentials used yet). */
export interface CommerceGatewayProvider {
  id: string;
  provider: CommercePaymentProvider;
  displayName: string;
  enabled: boolean;
  sandbox: boolean;
  capabilities: CommerceGatewayCapabilities;
  /** Live account / secret placeholders — never committed for real keys. */
  publicKey?: string;
  supportedMethods: CommercePaymentMethod[];
}

/** A provider-independent payment intent the engine hands to any gateway. */
export interface CommercePaymentIntent {
  id: string;
  orderId?: string;
  invoiceId?: string;
  subscriptionId?: string;
  amount: number;
  currency: CurrencyCode;
  method: CommercePaymentMethod;
  provider: CommercePaymentProvider;
  description: string;
  metadata: Record<string, string>;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface CommercePayment {
  id: string;
  orderId?: string;
  invoiceId?: string;
  subscriptionId?: string;
  amount: number;
  currency: CurrencyCode;
  method: CommercePaymentMethod;
  provider: CommercePaymentProvider;
  status: CommercePaymentStatus;
  escrowed: boolean;
  reference?: string;
  intentId?: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Refunds
// ---------------------------------------------------------------------------

export type CommerceRefundStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed';

export type CommerceRefundReason =
  | 'defective'
  | 'not-as-described'
  | 'service-not-rendered'
  | 'late-delivery'
  | 'cancellation'
  | 'duplicate-charge'
  | 'buyers-remorse'
  | 'other';

export interface CommerceRefund {
  id: string;
  refundNumber: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: CurrencyCode;
  reason: CommerceRefundReason;
  note?: string;
  status: CommerceRefundStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

// ---------------------------------------------------------------------------
// Discounts, coupons, promotions
// ---------------------------------------------------------------------------

export type CommerceDiscountKind = 'percent' | 'fixed';

export interface CommerceDiscount {
  kind: CommerceDiscountKind;
  value: number;
  startsAt?: string;
  endsAt?: string;
  /** Maximum absolute discount a percent coupon may produce. */
  maximumAmount?: number;
}

export type CommerceCouponType = 'percent' | 'fixed';
export type CommerceCouponAppliesTo = 'product' | 'vendor' | 'category' | 'cart' | 'subscription';
export type CommerceCouponStatus = 'active' | 'expired' | 'disabled';

export interface CommerceCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: CommerceCouponType;
  value: number;
  appliesTo: CommerceCouponAppliesTo;
  targetId?: string;
  minimumSpend?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  timesUsed: number;
  validFrom: string;
  validUntil: string;
  status: CommerceCouponStatus;
}

export type CommercePromotionKind =
  | 'sale'
  | 'flash-sale'
  | 'seasonal'
  | 'launch'
  | 'bundle'
  | 'featured'
  | 'sponsored'
  | 'boosted';

export interface CommercePromotion {
  id: string;
  name: string;
  description: string;
  kind: CommercePromotionKind;
  discount: CommerceDiscount;
  startsAt: string;
  endsAt: string;
  productIds: string[];
  budget?: number;
  currency?: CurrencyCode;
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------

export type CommerceWalletStatus = 'active' | 'frozen' | 'closed';

export type CommerceWalletTransactionType =
  | 'credit'
  | 'debit'
  | 'refund'
  | 'withdrawal'
  | 'marketplace-purchase'
  | 'advertising-payment'
  | 'subscription-payment'
  | 'commission-payout'
  | 'boost-payment'
  | 'disbursement'
  | 'platform-fee'
  | 'adjustment';

export type CommerceWalletTransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface CommerceWallet {
  id: string;
  ownerId: string;
  ownerName: string;
  currency: CurrencyCode;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  frozenBalance: number;
  lifetimeCredits: number;
  lifetimeDebits: number;
  status: CommerceWalletStatus;
  createdAt: string;
  lastActivityAt: string;
}

export interface CommerceWalletTransaction {
  id: string;
  walletId: string;
  reference: string;
  type: CommerceWalletTransactionType;
  amount: number;
  /** Positive when the balance is credited, negative on debit. */
  direction: 'credit' | 'debit';
  balanceAfter: number;
  currency: CurrencyCode;
  description: string;
  /** Live reference to the source event when applicable. */
  sourceId?: string;
  sourceEntity?: string;
  status: CommerceWalletTransactionStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Invoice, receipt, taxes, fees
// ---------------------------------------------------------------------------

export type CommerceInvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface CommerceInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CommerceTaxLine {
  name: string;
  ratePercent: number;
  amount: number;
  jurisdiction?: string;
}

export interface CommerceInvoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  subscriptionId?: string;
  buyerId?: string;
  buyerName: string;
  lines: CommerceInvoiceLine[];
  subtotal: number;
  discount: number;
  taxLines: CommerceTaxLine[];
  tax: number;
  fees: number;
  total: number;
  currency: CurrencyCode;
  status: CommerceInvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
}

export type CommerceReceiptStatus = 'issued' | 'void' | 'duplicate';

export interface CommerceReceipt {
  id: string;
  receiptNumber: string;
  orderId?: string;
  invoiceId?: string;
  buyerId?: string;
  buyerName: string;
  items: CommerceInvoiceLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  paidAt: string;
  paymentMethod?: CommercePaymentMethod;
  status: CommerceReceiptStatus;
  merchantName: string;
}

/** A tax rate rule applied within a jurisdiction. */
export interface CommerceTaxRate {
  id: string;
  name: string;
  jurisdiction: string;
  ratePercent: number;
  appliesTo: 'goods' | 'services' | 'digital' | 'all';
}

export type CommercePlatformFeeScope = 'marketplace' | 'advertising' | 'subscription' | 'payout' | 'disbursement';

export interface CommercePlatformFee {
  id: string;
  scope: CommercePlatformFeeScope;
  ratePercent: number;
  minimum?: number;
  maximum?: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export type CommerceSubscriberType =
  | 'researcher'
  | 'institution'
  | 'publisher'
  | 'journal'
  | 'conference'
  | 'company'
  | 'advertiser'
  | 'marketplace-vendor';

export type CommerceBillingCycle = 'monthly' | 'quarterly' | 'annual';

export type CommerceSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past-due'
  | 'cancelled'
  | 'expired'
  | 'paused';

export interface CommerceSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  subscriberType: CommerceSubscriberType;
  price: CommercePrice;
  billingCycle: CommerceBillingCycle;
  features: string[];
  featured: boolean;
  status: 'active' | 'disabled';
}

export interface CommerceSubscription {
  id: string;
  subscriberId: string;
  subscriberName: string;
  subscriberType: CommerceSubscriberType;
  planId: string;
  planName: string;
  price: number;
  currency: CurrencyCode;
  billingCycle: CommerceBillingCycle;
  status: CommerceSubscriptionStatus;
  startedAt: string;
  nextBillingAt: string;
  cancelledAt?: string;
  autoRenew: boolean;
  seats?: number;
}

// ---------------------------------------------------------------------------
// Commission, escrow, vendor earnings, settlement
// ---------------------------------------------------------------------------

export type CommerceCommissionStatus = 'pending' | 'due' | 'paid';

export interface CommerceCommission {
  id: string;
  orderId: string;
  vendorId: string;
  grossAmount: number;
  ratePercent: number;
  amount: number;
  currency: CurrencyCode;
  status: CommerceCommissionStatus;
  createdAt: string;
  paidAt?: string;
}

export type CommerceEscrowStatus =
  | 'holding'
  | 'released'
  | 'refunded'
  | 'disputed'
  | 'cancelled';

export interface CommerceEscrow {
  id: string;
  orderId: string;
  buyerId?: string;
  vendorId: string;
  amount: number;
  currency: CurrencyCode;
  status: CommerceEscrowStatus;
  heldAt: string;
  releasedAt?: string;
  releasedTo?: string;
  note?: string;
}

export interface CommerceVendorEarnings {
  id: string;
  vendorId: string;
  vendorName: string;
  currency: CurrencyCode;
  grossSales: number;
  commissions: number;
  platformFees: number;
  refunds: number;
  adjustments: number;
  netEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  periodStart: string;
  periodEnd: string;
}

export type CommerceSettlementStatus = 'scheduled' | 'processing' | 'completed' | 'failed';

export interface CommerceSettlement {
  id: string;
  vendorId: string;
  vendorName: string;
  reference: string;
  amount: number;
  currency: CurrencyCode;
  provider: CommercePaymentProvider;
  status: CommerceSettlementStatus;
  scheduledAt: string;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// Transactions, revenue report, analytics
// ---------------------------------------------------------------------------

export type CommerceTransactionKind =
  | 'purchase'
  | 'refund'
  | 'subscription'
  | 'advertising'
  | 'boost'
  | 'featured'
  | 'sponsored'
  | 'membership'
  | 'premium-analytics'
  | 'api-access'
  | 'enterprise-licensing'
  | 'ai-services'
  | 'digital-download'
  | 'payout'
  | 'disbursement';

export interface CommerceTransaction {
  id: string;
  reference: string;
  kind: CommerceTransactionKind;
  amount: number;
  currency: CurrencyCode;
  status: CommercePaymentStatus;
  method?: CommercePaymentMethod;
  provider?: CommercePaymentProvider;
  orderId?: string;
  subscriptionId?: string;
  walletTransactionId?: string;
  description: string;
  createdAt: string;
}

export interface CommerceRevenueReport {
  grossRevenue: number;
  marketplaceRevenue: number;
  advertisingRevenue: number;
  subscriptionRevenue: number;
  boostedPostsRevenue: number;
  featuredListingsRevenue: number;
  sponsoredListingsRevenue: number;
  vendorMembershipsRevenue: number;
  premiumAnalyticsRevenue: number;
  apiAccessRevenue: number;
  enterpriseLicensingRevenue: number;
  aiServicesRevenue: number;
  downloadRevenue: number;
  platformFees: number;
  commissions: number;
  refunds: number;
  netRevenue: number;
  byStream: { stream: string; revenue: number }[];
  byPeriod: { period: string; revenue: number }[];
  byMethod: { method: CommercePaymentMethod; revenue: number }[];
}

export interface CommercePlatformAnalytics {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  totalWallets: number;
  totalWalletBalance: number;
  activeEscrows: number;
  pendingPayouts: number;
  completedSettlements: number;
  couponsUsed: number;
  refundRate: number;
  conversionRate: number;
  growthPercent: number;
}

export interface CommerceStatistics {
  totalProducts: number;
  activeProducts: number;
  totalServices: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalRefunds: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  totalCoupons: number;
  activeCoupons: number;
  activePromotions: number;
  totalWallets: number;
  totalWalletBalance: number;
  activeEscrows: number;
  completedSettlements: number;
  totalVendors: number;
  supportedProviders: number;
}

/** A closed accounting period of platform finance, reported in one currency. */
export interface CommerceFinancialReport {
  id: string;
  /** `YYYY-MM` accounting period the report covers. */
  period: string;
  currency: CurrencyCode;
  grossRevenue: number;
  platformFees: number;
  commissions: number;
  refunds: number;
  netRevenue: number;
  revenueByStream: { stream: string; revenue: number }[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Aggregate root
// ---------------------------------------------------------------------------

export interface CommercePortfolio {
  statistics: CommerceStatistics;
  analytics: CommercePlatformAnalytics;
  revenueReport: CommerceRevenueReport;
  products: CommerceProduct[];
  carts: CommerceCart[];
  orders: CommerceOrder[];
  invoices: CommerceInvoice[];
  receipts: CommerceReceipt[];
  payments: CommercePayment[];
  paymentIntents: CommercePaymentIntent[];
  refunds: CommerceRefund[];
  coupons: CommerceCoupon[];
  promotions: CommercePromotion[];
  wallets: CommerceWallet[];
  walletTransactions: CommerceWalletTransaction[];
  subscriptions: CommerceSubscription[];
  subscriptionPlans: CommerceSubscriptionPlan[];
  commissions: CommerceCommission[];
  escrows: CommerceEscrow[];
  vendorEarnings: CommerceVendorEarnings[];
  settlements: CommerceSettlement[];
  transactions: CommerceTransaction[];
  taxRates: CommerceTaxRate[];
  platformFees: CommercePlatformFee[];
  gatewayProviders: CommerceGatewayProvider[];
  billingAddresses: CommerceBillingAddress[];
  currencies: CommerceCurrency[];
  exchangeRates: CommerceExchangeRate[];
  bundles: CommerceBundle[];
  productVariants: CommerceProductVariant[];
  licenses: CommerceLicense[];
  purchaseHistory: CommercePurchaseRecord[];
  participantEarnings: CommerceParticipantEarnings[];
  relationships: CommerceRelationship[];
  lifecycleCoverage: CommerceLifecycleCoverage[];
}

// ---------------------------------------------------------------------------
// Const vocabularies
// ---------------------------------------------------------------------------

export const COMMERCE_PRODUCT_TYPES: readonly CommerceProductType[] = [
  'product',
  'service',
  'digital-product',
  'physical-product',
  'equipment',
  'course',
  'subscription-plan',
  'advertising-campaign',
  'boosted-post',
  'featured-listing',
  'sponsored-listing',
  'vendor-membership',
  'premium-analytics',
  'api-access',
  'enterprise-license',
];

export const COMMERCE_PRODUCT_TYPE_LABELS: Record<CommerceProductType, string> = {
  product: 'Product',
  service: 'Service',
  'digital-product': 'Digital Product',
  'physical-product': 'Physical Product',
  equipment: 'Equipment',
  course: 'Course',
  'subscription-plan': 'Subscription Plan',
  'advertising-campaign': 'Advertising Campaign',
  'boosted-post': 'Boosted Post',
  'featured-listing': 'Featured Listing',
  'sponsored-listing': 'Sponsored Listing',
  'vendor-membership': 'Vendor Membership',
  'premium-analytics': 'Premium Analytics',
  'api-access': 'API Access',
  'enterprise-license': 'Enterprise License',
};

export const COMMERCE_PAYMENT_PROVIDERS: readonly CommercePaymentProvider[] = [
  'Paystack',
  'Flutterwave',
  'Stripe',
  'PayPal',
  'Razorpay',
  'Wise',
  'Bank Transfer',
  'Institutional Invoice',
  'Apple Pay',
  'Google Pay',
  'Wallet',
  'Credits',
];

export const COMMERCE_PAYMENT_METHODS: readonly CommercePaymentMethod[] = [
  'card',
  'bank-transfer',
  'mobile-money',
  'paypal',
  'wallet',
  'credits',
  'escrow',
  'institution-billing',
  'apple-pay',
  'google-pay',
];

export const COMMERCE_ORDER_STATUSES: readonly CommerceOrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'completed',
  'cancelled',
  'refunded',
  'disputed',
];

export const COMMERCE_SUBSCRIBER_TYPES: readonly CommerceSubscriberType[] = [
  'researcher',
  'institution',
  'publisher',
  'journal',
  'conference',
  'company',
  'advertiser',
  'marketplace-vendor',
];

export const COMMERCE_SUBSCRIBER_TYPE_LABELS: Record<CommerceSubscriberType, string> = {
  researcher: 'Researcher',
  institution: 'Institution',
  publisher: 'Publisher',
  journal: 'Journal',
  conference: 'Conference',
  company: 'Company',
  advertiser: 'Advertiser',
  'marketplace-vendor': 'Marketplace Vendor',
};

export const COMMERCE_WALLET_TRANSACTION_TYPES: readonly CommerceWalletTransactionType[] = [
  'credit',
  'debit',
  'refund',
  'withdrawal',
  'marketplace-purchase',
  'advertising-payment',
  'subscription-payment',
  'commission-payout',
  'boost-payment',
  'disbursement',
  'platform-fee',
  'adjustment',
];

export const COMMERCE_REFUND_REASONS: readonly CommerceRefundReason[] = [
  'defective',
  'not-as-described',
  'service-not-rendered',
  'late-delivery',
  'cancellation',
  'duplicate-charge',
  'buyers-remorse',
  'other',
];

export const COMMERCE_TRANSACTION_KINDS: readonly CommerceTransactionKind[] = [
  'purchase',
  'refund',
  'subscription',
  'advertising',
  'boost',
  'featured',
  'sponsored',
  'membership',
  'premium-analytics',
  'api-access',
  'enterprise-licensing',
  'ai-services',
  'digital-download',
  'payout',
  'disbursement',
];

export const COMMERCE_REVENUE_STREAMS: readonly string[] = [
  'marketplace',
  'advertising',
  'subscription',
  'boosted-posts',
  'featured-listings',
  'sponsored-listings',
  'vendor-memberships',
  'premium-analytics',
  'api-access',
  'enterprise-licensing',
  'ai-services',
  'digital-download',
];

export const COMMERCE_PROMOTION_KINDS: readonly CommercePromotionKind[] = [
  'sale',
  'flash-sale',
  'seasonal',
  'launch',
  'bundle',
  'featured',
  'sponsored',
  'boosted',
];

export const COMMERCE_BOOST_TIERS: readonly { id: string; name: string; days: number; reachMultiplier: number; basePrice: number }[] = [
  { id: 'boost-starter', name: 'Starter Boost', days: 3, reachMultiplier: 2, basePrice: 15 },
  { id: 'boost-growth', name: 'Growth Boost', days: 7, reachMultiplier: 4, basePrice: 40 },
  { id: 'boost-scale', name: 'Scale Boost', days: 14, reachMultiplier: 7, basePrice: 85 },
  { id: 'boost-premium', name: 'Premium Boost', days: 30, reachMultiplier: 12, basePrice: 180 },
];

export const COMMERCE_PLATFORM_FEE_RATE = 0.08;
export const COMMERCE_MARKETPLACE_COMMISSION_RATE = 0.08;
export const COMMERCE_WITHDRAWAL_FEE_RATE = 0.015;
export const COMMERCE_DEFAULT_TAX_RATE = 0.05;

export const COMMERCE_CURRENT_DATE = '2026-07-31';

// ---------------------------------------------------------------------------
// Currencies, exchange rates, pricing models
// ---------------------------------------------------------------------------

/** A currency the Commerce engine can price, settle, and display in. */
export interface CommerceCurrency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  /** Decimal places used when rendering an amount. */
  minorUnit: number;
  /** Whether the currency is a designated settlement rail (wallet, payouts). */
  supported: boolean;
}

/** A quoted conversion between two currencies at a point in time. */
export interface CommerceExchangeRate {
  id: string;
  from: CurrencyCode;
  to: CurrencyCode;
  /** How many `to` units one `from` unit buys. */
  rate: number;
  updatedAt: string;
}

/** How a price is determined on the platform. */
export type CommercePricingModel =
  | 'fixed'
  | 'tiered'
  | 'usage-based'
  | 'credit-based'
  | 'subscription'
  | 'negotiable'
  | 'auction';

// ---------------------------------------------------------------------------
// Bundles, product variants, licences
// ---------------------------------------------------------------------------

export type CommerceBundleStatus = 'active' | 'draft' | 'expired';

/** A group of catalog products sold together at a discounted price. */
export interface CommerceBundle {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  currency: CurrencyCode;
  /** Sum of the members' current prices. */
  listTotal: number;
  /** The price the bundle sells for. */
  bundlePrice: number;
  /** Absolute saving vs the list total. */
  savings: number;
  /** Whole-number saving percent vs the list total. */
  savingsPercent: number;
  status: CommerceBundleStatus;
  featured: boolean;
  tags: string[];
}

/** A purchasable configuration of a product. */
export interface CommerceProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  unitPrice: number;
  currency: CurrencyCode;
  stock?: number;
  status: CommerceProductStatus;
}

export type CommerceLicenseStatus = 'active' | 'suspended' | 'expired' | 'cancelled';

export type CommerceLicenseeType =
  | 'institution'
  | 'publisher'
  | 'journal'
  | 'conference'
  | 'researcher'
  | 'company';

/** A seat-based entitlement granted for a term, referencing the licensed product. */
export interface CommerceLicense {
  id: string;
  licenseNumber: string;
  productId: string;
  productName: string;
  licenseeId: string;
  licenseeName: string;
  licenseeType: CommerceLicenseeType;
  seats: number;
  termMonths: number;
  price: number;
  currency: CurrencyCode;
  status: CommerceLicenseStatus;
  startsAt: string;
  expiresAt: string;
  issuedAt: string;
}

// ---------------------------------------------------------------------------
// Purchase history
// ---------------------------------------------------------------------------

/** A single line of an individual's or institution's purchase history. */
export interface CommercePurchaseRecord {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productType: CommerceProductType;
  quantity: number;
  unitPrice: number;
  total: number;
  currency: CurrencyCode;
  purchasedAt: string;
  /** Live reference to the source record when the product carries one. */
  sourceEntity?: string;
}

// ---------------------------------------------------------------------------
// Revenue sharing, commerce relationships, lifecycle coverage
// ---------------------------------------------------------------------------

export type CommerceRevenueParticipantType = 'institution' | 'publisher' | 'researcher' | 'vendor';

/** A participant's share of revenue in a period, after fees, commissions, and refunds. */
export interface CommerceParticipantEarnings {
  id: string;
  participantType: CommerceRevenueParticipantType;
  participantId: string;
  participantName: string;
  currency: CurrencyCode;
  grossRevenue: number;
  platformFees: number;
  commissions: number;
  refunds: number;
  netRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeRevenue: number;
  periodStart: string;
  periodEnd: string;
}

export type CommerceRelationshipKind =
  | 'buys'
  | 'sells'
  | 'subscribes'
  | 'settles'
  | 'disburses'
  | 'promotes'
  | 'licenses';

/** A directed reference between an existing module identity and a commerce surface. */
export interface CommerceRelationship {
  id: string;
  kind: CommerceRelationshipKind;
  fromEntity: string;
  fromId: string;
  toEntity: string;
  toId: string;
  description: string;
}

/** Which commerce surfaces serve each research lifecycle stage. */
export interface CommerceLifecycleCoverage {
  stage: ResearchLifecycleStageId;
  stageName: string;
  revenueStream: string;
  surfaces: string[];
  exampleProductIds: string[];
}

export const COMMERCE_CURRENCIES: readonly CommerceCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', minorUnit: 2, supported: true },
  { code: 'EUR', name: 'Euro', symbol: '€', minorUnit: 2, supported: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', minorUnit: 2, supported: true },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorUnit: 2, supported: true },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', minorUnit: 2, supported: true },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', minorUnit: 2, supported: true },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', minorUnit: 2, supported: true },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', minorUnit: 2, supported: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', minorUnit: 0, supported: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', minorUnit: 2, supported: true },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', minorUnit: 2, supported: true },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', minorUnit: 2, supported: true },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', minorUnit: 2, supported: true },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', minorUnit: 2, supported: true },
];

export const COMMERCE_PRICING_MODELS: readonly CommercePricingModel[] = [
  'fixed',
  'tiered',
  'usage-based',
  'credit-based',
  'subscription',
  'negotiable',
  'auction',
];

export const COMMERCE_RELATIONSHIP_KINDS: readonly CommerceRelationshipKind[] = [
  'buys',
  'sells',
  'subscribes',
  'settles',
  'disburses',
  'promotes',
  'licenses',
];

export const COMMERCE_LICENSE_STATUSES: readonly CommerceLicenseStatus[] = [
  'active',
  'suspended',
  'expired',
  'cancelled',
];

export const COMMERCE_BUNDLE_STATUSES: readonly CommerceBundleStatus[] = ['active', 'draft', 'expired'];
