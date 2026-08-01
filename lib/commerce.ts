import type {
  CommerceBillingAddress,
  CommerceBillingCycle,
  CommerceBundle,
  CommerceCart,
  CommerceCommission,
  CommerceCoupon,
  CommerceDiscount,
  CommerceEscrow,
  CommerceExchangeRate,
  CommerceFinancialReport,
  CommerceGatewayCapabilities,
  CommerceGatewayProvider,
  CommerceInvoice,
  CommerceInvoiceLine,
  CommerceOrder,
  CommerceOrderItem,
  CommerceParticipantEarnings,
  CommercePayment,
  CommercePaymentIntent,
  CommercePaymentMethod,
  CommercePaymentProvider,
  CommercePaymentStatus,
  CommercePlatformAnalytics,
  CommercePlatformFee,
  CommerceProduct,
  CommerceProductVariant,
  CommercePromotion,
  CommercePurchaseRecord,
  CommerceReceipt,
  CommerceRefund,
  CommerceRefundStatus,
  CommerceRevenueParticipantType,
  CommerceRevenueReport,
  CommerceSettlement,
  CommerceStatistics,
  CommerceSubscription,
  CommerceSubscriptionPlan,
  CommerceTaxLine,
  CommerceTaxRate,
  CommerceTransaction,
  CommerceTransactionKind,
  CommerceVendorEarnings,
  CommerceWallet,
  CommerceWalletTransaction,
  CommerceWalletTransactionStatus,
  CommerceWalletTransactionType,
  CommercePortfolio,
} from '@/types/commerce';
import {
  COMMERCE_BOOST_TIERS,
  COMMERCE_DEFAULT_TAX_RATE,
  COMMERCE_MARKETPLACE_COMMISSION_RATE,
  COMMERCE_PAYMENT_PROVIDERS,
  COMMERCE_PLATFORM_FEE_RATE,
  COMMERCE_REVENUE_STREAMS,
  COMMERCE_WITHDRAWAL_FEE_RATE,
} from '@/types/commerce';
import type { CurrencyCode } from '@/types/funding';

/**
 * Scholatia Commerce & Marketplace Engine (Phase 1.9B).
 *
 * The Commerce module is the **financial operating system** for the entire
 * Scholatia ecosystem. It does NOT own records and does NOT duplicate any
 * module data — every order references an existing product, listing, campaign,
 * or subscription; every wallet transaction references an existing order,
 * subscription, campaign, boost, or disbursement; every invoice, receipt,
 * commission, escrow, settlement, and revenue report is derived from these pure,
 * strongly typed helpers so the placeholder data and the Commerce page never
 * re-implement pricing, taxes, coupons, commissions, wallet bookkeeping,
 * subscriptions, boosts, or analytics by hand.
 *
 * The engine is **provider-independent**: it models a payment-gateway
 * abstraction (Paystack, Flutterwave, Stripe, PayPal, Wise, bank transfer,
 * Apple Pay, Google Pay) without integrating any live API.
 */

let sequence = 0;

/** Deterministic, monotonically increasing id generator for runtime records. */
export function commerceId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence.toString(36).padStart(5, '0')}`;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Pricing & discount engine
// ---------------------------------------------------------------------------

/** Effective unit price after applying a discount, in the declared currency. */
export function calculateDiscount(price: { amount: number; currency?: CurrencyCode }, discount?: CommerceDiscount): number {
  if (!discount) return roundMoney(price.amount);
  let effective = price.amount;
  if (discount.kind === 'fixed') {
    effective = Math.max(0, effective - discount.value);
  } else {
    effective = effective * (1 - discount.value / 100);
  }
  if (discount.maximumAmount != null) {
    const saved = price.amount - effective;
    if (saved > discount.maximumAmount) effective = Math.max(0, price.amount - discount.maximumAmount);
  }
  return roundMoney(effective);
}

/** Whole-number discount percent a discount currently produces. */
export function discountPercentOf(price: { amount: number; compareAt?: number }, discount?: CommerceDiscount): number {
  const list = price.compareAt ?? price.amount;
  const effective = calculateDiscount(price, discount);
  if (list <= 0 || effective >= list) return 0;
  return Math.round(((list - effective) / list) * 100);
}

/** Percentage the product's own discount produces, when present. */
export function productDiscountPercent(product: CommerceProduct): number {
  return discountPercentOf(product.price, productDiscount(product));
}

/** The active discount of a product, when its own discount shape is attached. */
export function productDiscount(product: CommerceProduct): CommerceDiscount | undefined {
  if (product.price.compareAt == null) return undefined;
  const list = product.price.compareAt;
  if (list <= product.price.amount) return undefined;
  const percent = Math.round(((list - product.price.amount) / list) * 100);
  return percent > 0 ? { kind: 'percent', value: percent } : undefined;
}

/** Effective price for a product after its own discount. */
export function effectiveProductPrice(product: CommerceProduct): number {
  return calculateDiscount(product.price, productDiscount(product));
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export type CommerceCouponValidation =
  | { valid: true; discount: number; total: number; coupon: CommerceCoupon }
  | { valid: false; reason: string };

/** Validate a coupon against a cart total at a point in time. */
export function validateCoupon(
  coupon: CommerceCoupon,
  cartTotal: number,
  today = new Date().toISOString(),
): CommerceCouponValidation {
  if (coupon.status !== 'active') return { valid: false, reason: 'Coupon is not active' };
  if (coupon.validFrom > today) return { valid: false, reason: 'Coupon has not started yet' };
  if (coupon.validUntil < today) return { valid: false, reason: 'Coupon has expired' };
  if (coupon.usageLimit != null && coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  if (coupon.minimumSpend != null && cartTotal < coupon.minimumSpend) {
    return { valid: false, reason: `Minimum spend of ${coupon.minimumSpend} required` };
  }
  const rawDiscount = coupon.type === 'percent' ? cartTotal * (coupon.value / 100) : coupon.value;
  const discount = coupon.maximumDiscount != null ? Math.min(rawDiscount, coupon.maximumDiscount) : rawDiscount;
  return {
    valid: true,
    discount: roundMoney(discount),
    total: roundMoney(Math.max(0, cartTotal - discount)),
    coupon,
  };
}

/** Discount only — null when the coupon is not applicable. */
export function calculateCoupon(
  coupon: CommerceCoupon,
  cartTotal: number,
  today = new Date().toISOString(),
): { discount: number; total: number } | null {
  const validation = validateCoupon(coupon, cartTotal, today);
  return validation.valid ? { discount: validation.discount, total: validation.total } : null;
}

export function isCouponActive(coupon: CommerceCoupon, today = new Date().toISOString()): boolean {
  return (
    coupon.status === 'active' &&
    coupon.validFrom <= today &&
    coupon.validUntil >= today &&
    (coupon.usageLimit == null || coupon.timesUsed < coupon.usageLimit)
  );
}

export function activeCoupons(coupons: readonly CommerceCoupon[], today = new Date().toISOString()): CommerceCoupon[] {
  return coupons.filter((coupon) => isCouponActive(coupon, today));
}

// ---------------------------------------------------------------------------
// Promotions
// ---------------------------------------------------------------------------

export function isPromotionActive(promotion: CommercePromotion, today = new Date().toISOString()): boolean {
  return promotion.startsAt <= today && promotion.endsAt >= today;
}

export function activePromotions(
  promotions: readonly CommercePromotion[],
  today = new Date().toISOString(),
): CommercePromotion[] {
  return promotions.filter((promotion) => isPromotionActive(promotion, today));
}

/** Expected reach of a promotion across an audience at a reference CPM. */
export function estimatePromotionReach(input: {
  promotion: CommercePromotion;
  audienceSize: number;
  baselineCpm?: number;
}): { reach: number; impressions: number; cost: number } {
  const baselineCpm = input.baselineCpm ?? 12;
  const budget = input.promotion.budget ?? 100;
  const multiplier = input.promotion.kind === 'boosted' ? 1.6 : input.promotion.kind === 'featured' ? 1.4 : input.promotion.kind === 'sponsored' ? 1.3 : 1;
  const impressions = Math.round((budget / baselineCpm) * 1000 * multiplier);
  const reach = Math.max(1, Math.min(input.audienceSize, Math.round(impressions * 0.75)));
  return { reach, impressions, cost: budget };
}

// ---------------------------------------------------------------------------
// Taxes, platform fees, commissions, vendor revenue
// ---------------------------------------------------------------------------

/** Build a tax line from a subtotal and a rate. */
export function calculateTax(input: {
  subtotal: number;
  ratePercent?: number;
  name?: string;
  jurisdiction?: string;
}): CommerceTaxLine {
  const ratePercent = input.ratePercent ?? COMMERCE_DEFAULT_TAX_RATE * 100;
  return {
    name: input.name ?? 'VAT',
    ratePercent,
    amount: roundMoney(input.subtotal * (ratePercent / 100)),
    jurisdiction: input.jurisdiction,
  };
}

/** Total tax for a subtotal given a rate in percent. */
export function taxAmount(subtotal: number, ratePercent: number): number {
  return roundMoney(subtotal * (ratePercent / 100));
}

/** Platform fee earned on an amount for a scope. */
export function calculatePlatformFee(input: {
  amount: number;
  scope: CommercePlatformFee['scope'];
  fee?: CommercePlatformFee;
}): { amount: number; ratePercent: number; scope: CommercePlatformFee['scope'] } {
  const ratePercent = input.fee?.ratePercent ?? COMMERCE_PLATFORM_FEE_RATE * 100;
  let fee = roundMoney(input.amount * (ratePercent / 100));
  if (input.fee?.minimum != null) fee = Math.max(input.fee.minimum, fee);
  if (input.fee?.maximum != null) fee = Math.min(input.fee.maximum, fee);
  return { amount: roundMoney(fee), ratePercent, scope: input.scope };
}

/** Marketplace commission earned on a gross sale. */
export function calculateMarketplaceCommission(input: {
  grossAmount: number;
  ratePercent?: number;
}): { grossAmount: number; ratePercent: number; amount: number } {
  const ratePercent = input.ratePercent ?? COMMERCE_MARKETPLACE_COMMISSION_RATE * 100;
  return {
    grossAmount: roundMoney(input.grossAmount),
    ratePercent,
    amount: roundMoney(input.grossAmount * (ratePercent / 100)),
  };
}

/** Net vendor revenue after commission and platform fees on a gross sale. */
export function calculateVendorRevenue(input: {
  grossAmount: number;
  commissionRatePercent?: number;
  platformFeeRatePercent?: number;
}): { grossAmount: number; commission: number; platformFee: number; net: number } {
  const commission = calculateMarketplaceCommission({
    grossAmount: input.grossAmount,
    ratePercent: input.commissionRatePercent,
  });
  const platformFee = calculatePlatformFee({
    amount: input.grossAmount,
    scope: 'marketplace',
    fee:
      input.platformFeeRatePercent != null
        ? { id: 'inline', scope: 'marketplace', ratePercent: input.platformFeeRatePercent, description: 'Inline platform fee' }
        : undefined,
  });
  return {
    grossAmount: roundMoney(input.grossAmount),
    commission: commission.amount,
    platformFee: platformFee.amount,
    net: roundMoney(input.grossAmount - commission.amount - platformFee.amount),
  };
}

/** Withdrawal fee on a payout amount. */
export function calculateWithdrawalFee(amount: number): number {
  return roundMoney(Math.max(1, amount * COMMERCE_WITHDRAWAL_FEE_RATE));
}

// ---------------------------------------------------------------------------
// Order engine
// ---------------------------------------------------------------------------

export type CommerceOrderCalculationOptions = {
  coupon?: CommerceCoupon | null;
  additionalDiscount?: number;
  taxRatePercent?: number;
  platformFeeRate?: number;
  currency?: CurrencyCode;
  today?: string;
};

export type CommerceOrderCalculation = {
  items: CommerceOrderItem[];
  subtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  tax: number;
  taxLine: CommerceTaxLine;
  platformFee: number;
  total: number;
  currency: CurrencyCode;
};

/** Cart line subtotal. */
export function cartSubtotal(items: readonly { unitPrice: number; quantity: number }[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
}

/** Total line quantity in a cart. */
export function cartCount(items: readonly { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** The grand total after subtotal, discounts, tax, and fees. */
export function calculateGrandTotal(input: {
  subtotal: number;
  discount?: number;
  tax?: number;
  platformFee?: number;
  fees?: number;
}): number {
  return roundMoney(
    Math.max(0, input.subtotal - (input.discount ?? 0) + (input.tax ?? 0) + (input.platformFee ?? 0) + (input.fees ?? 0)),
  );
}

/**
 * Full order calculation: per-item totals, coupon validation, tax line, and
 * platform fee. Returns an order-shaped summary without mutating any state.
 */
export function calculateOrder(
  items: readonly { productId: string; name: string; sku: string; quantity: number; unitPrice: number; currency: CurrencyCode }[],
  options: CommerceOrderCalculationOptions = {},
): CommerceOrderCalculation {
  const currency = options.currency ?? items[0]?.currency ?? 'USD';
  const subtotal = cartSubtotal(items);
  const couponValidation = options.coupon ? validateCoupon(options.coupon, subtotal, options.today) : null;
  const couponDiscount = couponValidation?.valid ? couponValidation.discount : 0;
  const discount = roundMoney(couponDiscount + (options.additionalDiscount ?? 0));
  const taxableBase = Math.max(0, subtotal - discount);
  const taxLine = calculateTax({ subtotal: taxableBase, ratePercent: options.taxRatePercent });
  const platformFee = calculatePlatformFee({ amount: taxableBase, scope: 'marketplace', fee: options.platformFeeRate != null ? { id: 'inline', scope: 'marketplace', ratePercent: options.platformFeeRate, description: 'Inline fee' } : undefined });
  const orderItems: CommerceOrderItem[] = items.map((item) => {
    const lineTotal = roundMoney(item.unitPrice * item.quantity);
    return {
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: roundMoney(item.unitPrice),
      discount: 0,
      total: lineTotal,
    };
  });
  return {
    items: orderItems,
    subtotal,
    discount,
    couponDiscount,
    couponCode: couponValidation?.valid ? options.coupon?.code : undefined,
    tax: taxLine.amount,
    taxLine,
    platformFee: platformFee.amount,
    total: calculateGrandTotal({ subtotal, discount, tax: taxLine.amount, platformFee: platformFee.amount }),
    currency,
  };
}

// ---------------------------------------------------------------------------
// Refunds
// ---------------------------------------------------------------------------

/** Refund calculation: gross amount, platform-recoverable fee, net to buyer. */
export function calculateRefund(input: {
  amount: number;
  paymentMethod?: CommercePaymentMethod;
  providerFeeRatePercent?: number;
}): { amount: number; providerFee: number; netToBuyer: number } {
  const feeRate = input.providerFeeRatePercent ?? 0.015 * 100;
  const providerFee = input.paymentMethod === 'card' || input.paymentMethod === 'apple-pay' || input.paymentMethod === 'google-pay'
    ? roundMoney(input.amount * (feeRate / 100))
    : 0;
  return {
    amount: roundMoney(input.amount),
    providerFee,
    netToBuyer: roundMoney(input.amount - providerFee),
  };
}

export const REFUND_STATUS_ORDER: readonly CommerceRefundStatus[] = ['requested', 'approved', 'processing', 'completed'];

// ---------------------------------------------------------------------------
// Invoices, receipts, payments
// ---------------------------------------------------------------------------

/** Sequential invoice number in a stable format: INV-2026-000001. */
export function generateInvoiceNumber(sequenceNumber: number, year = new Date().getFullYear()): string {
  return `INV-${year}-${String(sequenceNumber).padStart(6, '0')}`;
}

export function invoiceSubtotal(lines: readonly CommerceInvoiceLine[]): number {
  return roundMoney(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
}

export function invoiceTotal(input: {
  lines: readonly CommerceInvoiceLine[];
  discount?: number;
  taxRatePercent?: number;
  fees?: number;
  currency?: CurrencyCode;
}): Pick<CommerceInvoice, 'subtotal' | 'discount' | 'tax' | 'fees' | 'total'> {
  const subtotal = invoiceSubtotal(input.lines);
  const discount = roundMoney(input.discount ?? 0);
  const tax = taxAmount(Math.max(0, subtotal - discount), input.taxRatePercent ?? COMMERCE_DEFAULT_TAX_RATE * 100);
  const fees = roundMoney(input.fees ?? 0);
  return { subtotal, discount, tax, fees, total: calculateGrandTotal({ subtotal, discount, tax, fees }) };
}

/** A sequential receipt number: RCP-2026-000001. */
export function generateReceiptNumber(sequenceNumber: number, year = new Date().getFullYear()): string {
  return `RCP-${year}-${String(sequenceNumber).padStart(6, '0')}`;
}

/** Build a receipt from an order, an invoice, and a paid date. */
export function generateReceipt(input: {
  order: Pick<CommerceOrder, 'id' | 'orderNumber' | 'buyerId' | 'buyerName' | 'items' | 'subtotal' | 'discount' | 'tax' | 'total' | 'currency' | 'paymentMethod'>;
  sequenceNumber?: number;
  invoiceId?: string;
  paidAt?: string;
}): CommerceReceipt {
  const { order } = input;
  return {
    id: commerceId('receipt'),
    receiptNumber: generateReceiptNumber(input.sequenceNumber ?? 0),
    orderId: order.id,
    invoiceId: input.invoiceId,
    buyerId: order.buyerId,
    buyerName: order.buyerName,
    items: order.items.map((item) => ({ description: item.name, quantity: item.quantity, unitPrice: item.unitPrice, total: item.total })),
    subtotal: order.subtotal,
    discount: order.discount,
    tax: order.tax,
    total: order.total,
    currency: order.currency,
    paidAt: input.paidAt ?? new Date().toISOString(),
    paymentMethod: order.paymentMethod,
    status: 'issued',
    merchantName: 'Scholatia',
  };
}

/** Build a provider-independent payment intent for any gateway. */
export function buildPaymentIntent(input: {
  amount: number;
  currency: CurrencyCode;
  method: CommercePaymentMethod;
  provider: CommercePaymentProvider;
  description: string;
  orderId?: string;
  invoiceId?: string;
  subscriptionId?: string;
  metadata?: Record<string, string>;
}): CommercePaymentIntent {
  return {
    id: commerceId('intent'),
    orderId: input.orderId,
    invoiceId: input.invoiceId,
    subscriptionId: input.subscriptionId,
    amount: roundMoney(input.amount),
    currency: input.currency,
    method: input.method,
    provider: input.provider,
    description: input.description,
    metadata: input.metadata ?? {},
    status: 'created',
    createdAt: new Date().toISOString(),
  };
}

/** Convert a captured intent into a payment record. */
export function intentToPayment(intent: CommercePaymentIntent, status: CommercePaymentStatus = 'paid'): CommercePayment {
  return {
    id: commerceId('payment'),
    orderId: intent.orderId,
    invoiceId: intent.invoiceId,
    subscriptionId: intent.subscriptionId,
    amount: intent.amount,
    currency: intent.currency,
    method: intent.method,
    provider: intent.provider,
    status,
    escrowed: intent.method === 'escrow',
    reference: intent.id,
    intentId: intent.id,
    date: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Wallet system
// ---------------------------------------------------------------------------

/** The balance a wallet can spend right now. */
export function walletAvailableBalance(wallet: CommerceWallet): number {
  return roundMoney(wallet.availableBalance);
}

/** The balance a wallet can spend right now from its sub-accounts. */
export function walletSpendableBalance(wallet: CommerceWallet): number {
  return roundMoney(wallet.availableBalance);
}

/** Build a wallet transaction and compute the balance after the entry. */
export function createWalletTransaction(input: {
  walletId: string;
  type: CommerceWalletTransactionType;
  amount: number;
  direction: 'credit' | 'debit';
  currentBalance?: number;
  currency: CurrencyCode;
  description: string;
  sourceId?: string;
  sourceEntity?: string;
  status?: CommerceWalletTransactionStatus;
  createdAt?: string;
}): CommerceWalletTransaction {
  const amount = roundMoney(Math.abs(input.amount));
  const signed = input.direction === 'credit' ? amount : -amount;
  const balanceAfter = input.currentBalance != null ? roundMoney(input.currentBalance + signed) : signed;
  return {
    id: commerceId('wlt'),
    walletId: input.walletId,
    reference: `WLT-${new Date().toISOString().slice(0, 10)}-${sequence}`,
    type: input.type,
    amount,
    direction: input.direction,
    balanceAfter,
    currency: input.currency,
    description: input.description,
    sourceId: input.sourceId,
    sourceEntity: input.sourceEntity,
    status: input.status ?? 'completed',
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

/** Apply a wallet transaction to a wallet and return the updated wallet. */
export function applyWalletTransaction(
  wallet: CommerceWallet,
  transaction: CommerceWalletTransaction,
): CommerceWallet {
  const signed = transaction.direction === 'credit' ? transaction.amount : -transaction.amount;
  return {
    ...wallet,
    balance: roundMoney(wallet.balance + signed),
    availableBalance: roundMoney(wallet.availableBalance + (transaction.status === 'completed' ? signed : 0)),
    pendingBalance: roundMoney(wallet.pendingBalance + (transaction.status === 'pending' || transaction.status === 'processing' ? signed : 0)),
    lifetimeCredits: roundMoney(wallet.lifetimeCredits + (transaction.direction === 'credit' ? transaction.amount : 0)),
    lifetimeDebits: roundMoney(wallet.lifetimeDebits + (transaction.direction === 'debit' ? transaction.amount : 0)),
    lastActivityAt: transaction.createdAt,
  };
}

/** Recompute wallet balances from its full transaction history. */
export function recomputeWalletBalance(
  wallet: Pick<CommerceWallet, 'id' | 'ownerId' | 'ownerName' | 'currency' | 'status' | 'createdAt'>,
  transactions: readonly Pick<CommerceWalletTransaction, 'amount' | 'direction' | 'status' | 'createdAt'>[],
): CommerceWallet {
  let balance = 0;
  let available = 0;
  let pending = 0;
  let credits = 0;
  let debits = 0;
  let lastActivityAt = wallet.createdAt;
  for (const transaction of transactions) {
    const signed = transaction.direction === 'credit' ? transaction.amount : -transaction.amount;
    balance = roundMoney(balance + signed);
    if (transaction.status === 'completed') available = roundMoney(available + signed);
    else if (transaction.status === 'pending' || transaction.status === 'processing') pending = roundMoney(pending + signed);
    if (transaction.direction === 'credit') credits = roundMoney(credits + transaction.amount);
    else debits = roundMoney(debits + transaction.amount);
    if (transaction.createdAt > lastActivityAt) lastActivityAt = transaction.createdAt;
  }
  return {
    id: wallet.id,
    ownerId: wallet.ownerId,
    ownerName: wallet.ownerName,
    currency: wallet.currency,
    balance,
    availableBalance: Math.max(0, available),
    pendingBalance: Math.max(0, pending),
    frozenBalance: Math.max(0, balance - available - pending),
    lifetimeCredits: credits,
    lifetimeDebits: debits,
    status: wallet.status,
    createdAt: wallet.createdAt,
    lastActivityAt,
  };
}

export function walletTransactionsFor(
  transactions: readonly CommerceWalletTransaction[],
  walletId: string,
): CommerceWalletTransaction[] {
  return transactions.filter((transaction) => transaction.walletId === walletId);
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

const CYCLE_MONTHS: Record<CommerceBillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  annual: 12,
};

/** Months in a billing cycle. */
export function cycleMonths(cycle: CommerceBillingCycle): number {
  return CYCLE_MONTHS[cycle];
}

/** Per-cycle cost of a plan for a number of seats, with an annual discount. */
export function calculateSubscriptionCost(input: {
  plan: CommerceSubscriptionPlan;
  seats?: number;
  annualDiscountPercent?: number;
}): { perCycle: number; perMonth: number; perYear: number; discountApplied: number } {
  const seats = input.seats ?? 1;
  const base = roundMoney(input.plan.price.amount * seats);
  const annualDiscountPercent = input.annualDiscountPercent ?? (input.plan.billingCycle === 'annual' ? 20 : 0);
  const perCycle = input.plan.billingCycle === 'annual'
    ? roundMoney(base * (1 - annualDiscountPercent / 100))
    : base;
  const perMonth = roundMoney(perCycle / cycleMonths(input.plan.billingCycle));
  return {
    perCycle,
    perMonth,
    perYear: roundMoney(perCycle * (input.plan.billingCycle === 'annual' ? 1 : cycleMonths(input.plan.billingCycle))),
    discountApplied: roundMoney(base - perCycle),
  };
}

/** Normalised monthly-equivalent cost of a subscription. */
export function subscriptionMonthlyAmount(subscription: CommerceSubscription): number {
  return roundMoney(subscription.price / cycleMonths(subscription.billingCycle));
}

/** Normalised annual-equivalent cost of a subscription. */
export function subscriptionAnnualAmount(subscription: CommerceSubscription): number {
  return roundMoney(subscriptionMonthlyAmount(subscription) * 12);
}

/** Whether a subscription is active at a point in time. */
export function isSubscriptionActive(subscription: CommerceSubscription, today = new Date().toISOString()): boolean {
  if (subscription.status !== 'active' && subscription.status !== 'trialing') {
    return false;
  }
  return today >= subscription.startedAt;
}

/** Whether a subscription's next billing date has passed. */
export function subscriptionRenewalDue(subscription: CommerceSubscription, today = new Date().toISOString()): boolean {
  return isSubscriptionActive(subscription, today) && subscription.nextBillingAt < today;
}

export function activeSubscriptions(
  subscriptions: readonly CommerceSubscription[],
  today = new Date().toISOString(),
): CommerceSubscription[] {
  return subscriptions.filter((subscription) => isSubscriptionActive(subscription, today));
}

/** Monthly recurring revenue from active subscriptions. */
export function calculateMrr(subscriptions: readonly CommerceSubscription[], today = new Date().toISOString()): number {
  return roundMoney(
    activeSubscriptions(subscriptions, today).reduce((sum, subscription) => sum + subscriptionMonthlyAmount(subscription), 0),
  );
}

/** Annual recurring revenue from active subscriptions. */
export function calculateArr(subscriptions: readonly CommerceSubscription[], today = new Date().toISOString()): number {
  return roundMoney(calculateMrr(subscriptions, today) * 12);
}

// ---------------------------------------------------------------------------
// Boosts & promotion reach
// ---------------------------------------------------------------------------

/** Cost and expected reach of a boost tier against an audience. */
export function calculateBoostCost(input: {
  tierId?: string;
  audienceSize: number;
  currency?: CurrencyCode;
}): { tierId: string; name: string; days: number; reach: number; cost: number; cpm: number; currency: CurrencyCode } {
  const tier = COMMERCE_BOOST_TIERS.find((entry) => entry.id === input.tierId) ?? COMMERCE_BOOST_TIERS[1];
  const currency = input.currency ?? 'USD';
  const reach = Math.round(input.audienceSize * 0.1 * tier.reachMultiplier);
  const cost = roundMoney(tier.basePrice * (1 + input.audienceSize / 100_000));
  return { tierId: tier.id, name: tier.name, days: tier.days, reach, cost, cpm: roundMoney((cost / Math.max(1, reach)) * 1000), currency };
}

// ---------------------------------------------------------------------------
// Escrow, commissions, settlements
// ---------------------------------------------------------------------------

export function activeEscrows(escrows: readonly CommerceEscrow[], status: CommerceEscrow['status'][] = ['holding', 'disputed']): CommerceEscrow[] {
  return escrows.filter((escrow) => status.includes(escrow.status));
}

export function pendingSettlements(settlements: readonly CommerceSettlement[]): CommerceSettlement[] {
  return settlements.filter((settlement) => settlement.status === 'scheduled' || settlement.status === 'processing');
}

export function completedSettlements(settlements: readonly CommerceSettlement[]): CommerceSettlement[] {
  return settlements.filter((settlement) => settlement.status === 'completed');
}

export function vendorEarningsFor(
  earnings: readonly CommerceVendorEarnings[],
  vendorId: string,
): CommerceVendorEarnings | undefined {
  return earnings.find((entry) => entry.vendorId === vendorId);
}

// ---------------------------------------------------------------------------
// Payment gateway abstraction
// ---------------------------------------------------------------------------

const GATEWAY_CAPABILITIES: Record<CommercePaymentProvider, CommerceGatewayCapabilities> = {
  Paystack: { currencies: ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP'], methods: ['card', 'mobile-money', 'bank-transfer'], recurring: true, escrow: false, refunds: true, payouts: true, verification: true },
  Flutterwave: { currencies: ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP'], methods: ['card', 'mobile-money', 'bank-transfer'], recurring: true, escrow: false, refunds: true, payouts: true, verification: true },
  Stripe: { currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY'], methods: ['card', 'bank-transfer', 'apple-pay', 'google-pay'], recurring: true, escrow: false, refunds: true, payouts: true, verification: true },
  PayPal: { currencies: ['USD', 'EUR', 'GBP'], methods: ['paypal', 'card'], recurring: true, escrow: false, refunds: true, payouts: true, verification: true },
  Razorpay: { currencies: ['USD', 'INR', 'GBP'], methods: ['card', 'bank-transfer', 'mobile-money'], recurring: true, escrow: false, refunds: true, payouts: true, verification: true },
  Wise: { currencies: ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'INR'], methods: ['bank-transfer'], recurring: false, escrow: false, refunds: true, payouts: true, verification: true },
  'Bank Transfer': { currencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES', 'EGP', 'GHS', 'BRL', 'INR'], methods: ['bank-transfer'], recurring: false, escrow: false, refunds: true, payouts: true, verification: false },
  'Institutional Invoice': { currencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES', 'EGP', 'GHS'], methods: ['institution-billing'], recurring: true, escrow: false, refunds: false, payouts: false, verification: false },
  'Apple Pay': { currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'], methods: ['apple-pay', 'card'], recurring: true, escrow: false, refunds: true, payouts: false, verification: false },
  'Google Pay': { currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'INR'], methods: ['google-pay', 'card'], recurring: true, escrow: false, refunds: true, payouts: false, verification: false },
  Wallet: { currencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES', 'EGP', 'GHS'], methods: ['wallet', 'credits'], recurring: true, escrow: false, refunds: true, payouts: true, verification: false },
  Credits: { currencies: ['USD'], methods: ['credits', 'wallet'], recurring: true, escrow: false, refunds: true, payouts: false, verification: false },
};

/** Capabilities a provider advertises to the engine. */
export function providerCapabilities(provider: CommercePaymentProvider): CommerceGatewayCapabilities {
  return GATEWAY_CAPABILITIES[provider];
}

/** Find a configured provider record by name. */
export function getGatewayProvider(
  providers: readonly CommerceGatewayProvider[],
  provider: CommercePaymentProvider,
): CommerceGatewayProvider | undefined {
  return providers.find((entry) => entry.provider === provider);
}

/** Only enabled provider records. */
export function enabledGatewayProviders(providers: readonly CommerceGatewayProvider[]): CommerceGatewayProvider[] {
  return providers.filter((provider) => provider.enabled);
}

/** Configured provider records that support a payment method. */
export function providersForMethod(
  providers: readonly CommerceGatewayProvider[],
  method: CommercePaymentMethod,
): CommerceGatewayProvider[] {
  return providers.filter((provider) => provider.enabled && provider.supportedMethods.includes(method));
}

/** All known providers (for the abstraction surface regardless of config). */
export function allCommerceProviders(): CommercePaymentProvider[] {
  return [...COMMERCE_PAYMENT_PROVIDERS];
}

// ---------------------------------------------------------------------------
// Aggregates: statistics, analytics, revenue report
// ---------------------------------------------------------------------------

function orderRevenue(orders: readonly { total: number }[]): number {
  return roundMoney(orders.reduce((sum, order) => sum + order.total, 0));
}

const REVENUE_STREAM_BY_KIND: Record<CommerceTransactionKind, string> = {
  purchase: 'marketplace',
  subscription: 'subscription',
  advertising: 'advertising',
  boost: 'boosted-posts',
  featured: 'featured-listings',
  sponsored: 'sponsored-listings',
  membership: 'vendor-memberships',
  'premium-analytics': 'premium-analytics',
  'api-access': 'api-access',
  'enterprise-licensing': 'enterprise-licensing',
  'ai-services': 'ai-services',
  'digital-download': 'digital-download',
  refund: 'refunds',
  payout: 'payouts',
  disbursement: 'disbursements',
};

/** Aggregate the platform-wide revenue report from ledger records. */
export function computeRevenueReport(input: {
  transactions: readonly CommerceTransaction[];
  orders: readonly CommerceOrder[];
  payments: readonly CommercePayment[];
  refunds: readonly CommerceRefund[];
  subscriptions: readonly CommerceSubscription[];
}): CommerceRevenueReport {
  const { transactions, orders, payments, refunds } = input;
  const revenueKinds = new Set<CommerceTransactionKind>([
    'purchase',
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
  ]);

  const byStreamMap = new Map<string, number>();
  let grossRevenue = 0;
  for (const transaction of transactions) {
    if (revenueKinds.has(transaction.kind)) {
      grossRevenue = roundMoney(grossRevenue + transaction.amount);
      const stream = REVENUE_STREAM_BY_KIND[transaction.kind];
      byStreamMap.set(stream, roundMoney((byStreamMap.get(stream) ?? 0) + transaction.amount));
    }
  }

  const byStream = COMMERCE_REVENUE_STREAMS.map((stream) => ({
    stream,
    revenue: byStreamMap.get(stream) ?? 0,
  })).filter((entry) => entry.revenue > 0);

  const byPeriodMap = new Map<string, number>();
  for (const transaction of transactions) {
    if (revenueKinds.has(transaction.kind)) {
      const period = transaction.createdAt.slice(0, 7);
      byPeriodMap.set(period, roundMoney((byPeriodMap.get(period) ?? 0) + transaction.amount));
    }
  }
  const byPeriod = Array.from(byPeriodMap, ([period, revenue]) => ({ period, revenue })).sort((a, b) =>
    a.period.localeCompare(b.period),
  );

  const byMethodMap = new Map<CommercePaymentMethod, number>();
  for (const payment of payments) {
    byMethodMap.set(payment.method, roundMoney((byMethodMap.get(payment.method) ?? 0) + payment.amount));
  }
  const byMethod = Array.from(byMethodMap, ([method, revenue]) => ({ method, revenue }));

  const grossOrders = orderRevenue(orders);
  const commissions = roundMoney(grossOrders * COMMERCE_MARKETPLACE_COMMISSION_RATE);
  const platformFees = roundMoney(grossOrders * COMMERCE_PLATFORM_FEE_RATE);
  const refunded = roundMoney(
    refunds.filter((refund) => refund.status === 'completed').reduce((sum, refund) => sum + refund.amount, 0),
  );
  const subscriptionRevenue = transactions
    .filter((transaction) => transaction.kind === 'subscription')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    grossRevenue,
    marketplaceRevenue: byStreamMap.get('marketplace') ?? 0,
    advertisingRevenue: byStreamMap.get('advertising') ?? 0,
    subscriptionRevenue: roundMoney(subscriptionRevenue),
    boostedPostsRevenue: byStreamMap.get('boosted-posts') ?? 0,
    featuredListingsRevenue: byStreamMap.get('featured-listings') ?? 0,
    sponsoredListingsRevenue: byStreamMap.get('sponsored-listings') ?? 0,
    vendorMembershipsRevenue: byStreamMap.get('vendor-memberships') ?? 0,
    premiumAnalyticsRevenue: byStreamMap.get('premium-analytics') ?? 0,
    apiAccessRevenue: byStreamMap.get('api-access') ?? 0,
    enterpriseLicensingRevenue: byStreamMap.get('enterprise-licensing') ?? 0,
    aiServicesRevenue: byStreamMap.get('ai-services') ?? 0,
    downloadRevenue: byStreamMap.get('digital-download') ?? 0,
    platformFees,
    commissions,
    refunds: refunded,
    netRevenue: roundMoney(grossRevenue - refunded),
    byStream,
    byPeriod,
    byMethod,
  };
}

/** Group a revenue report into closed monthly accounting periods. */
export function computeFinancialReports(
  report: CommerceRevenueReport,
  currency: CurrencyCode = 'USD',
): CommerceFinancialReport[] {
  return report.byPeriod.map((period) => {
    const periodReport = report.byStream.map((stream) => ({
      stream: stream.stream,
      revenue: roundMoney(stream.revenue),
    }));
    const grossRevenue = period.revenue;
    const commissions = roundMoney(grossRevenue * COMMERCE_MARKETPLACE_COMMISSION_RATE);
    const platformFees = roundMoney(grossRevenue * COMMERCE_PLATFORM_FEE_RATE);
    const refunds = roundMoney(report.refunds / Math.max(1, report.byPeriod.length));
    return {
      id: `financial-report-${period.period}`,
      period: period.period,
      currency,
      grossRevenue,
      platformFees,
      commissions,
      refunds,
      netRevenue: roundMoney(grossRevenue - refunds),
      revenueByStream: periodReport,
      generatedAt: new Date().toISOString().slice(0, 10),
    };
  });
}

/** Aggregate platform analytics across the whole commercial engine. */
export function computePlatformAnalytics(input: {
  orders: readonly CommerceOrder[];
  payments: readonly CommercePayment[];
  refunds: readonly CommerceRefund[];
  subscriptions: readonly CommerceSubscription[];
  wallets: readonly CommerceWallet[];
  escrows: readonly CommerceEscrow[];
  settlements: readonly CommerceSettlement[];
  coupons: readonly { timesUsed: number }[];
  products: readonly CommerceProduct[];
}): CommercePlatformAnalytics {
  const { orders, refunds, subscriptions, wallets, escrows, settlements, coupons, products } = input;
  const revenue = orderRevenue(orders);
  const completedOrders = orders.filter((order) => order.status === 'completed').length;
  const averageOrderValue = orders.length > 0 ? roundMoney(revenue / orders.length) : 0;
  const mrr = calculateMrr(subscriptions);
  const active = activeSubscriptions(subscriptions);
  const totalWalletBalance = roundMoney(wallets.reduce((sum, wallet) => sum + wallet.balance, 0));
  const completedRefunds = refunds.filter((refund) => refund.status === 'completed').reduce((sum, refund) => sum + refund.amount, 0);
  const refundRate = orders.length > 0 ? Math.round((completedRefunds / revenue) * 10000) / 100 : 0;
  const impressions = products.reduce((sum, product) => sum + (product.featured ? 1000 : 500), 0);
  const conversionRate = impressions > 0 ? Math.round((orders.length / impressions) * 10000) / 100 : 0;
  const firstHalf = orders.filter((order) => order.placedAt.slice(0, 7) < '2026-06-01').reduce((sum, order) => sum + order.total, 0);
  const secondHalf = orders.filter((order) => order.placedAt.slice(0, 7) >= '2026-06-01').reduce((sum, order) => sum + order.total, 0);
  const growthPercent = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;

  return {
    totalOrders: orders.length,
    completedOrders,
    totalRevenue: revenue,
    averageOrderValue,
    activeSubscriptions: active.length,
    mrr,
    arr: roundMoney(mrr * 12),
    totalWallets: wallets.length,
    totalWalletBalance,
    activeEscrows: activeEscrows(escrows).length,
    pendingPayouts: pendingSettlements(settlements).length,
    completedSettlements: completedSettlements(settlements).length,
    couponsUsed: coupons.reduce((sum, coupon) => sum + coupon.timesUsed, 0),
    refundRate,
    conversionRate,
    growthPercent,
  };
}

/** Aggregate headline statistics for the Commerce module. */
export function computeCommerceStatistics(input: {
  products: readonly CommerceProduct[];
  orders: readonly CommerceOrder[];
  refunds: readonly CommerceRefund[];
  subscriptions: readonly CommerceSubscription[];
  coupons: readonly CommerceCoupon[];
  promotions: readonly CommercePromotion[];
  wallets: readonly CommerceWallet[];
  escrows: readonly CommerceEscrow[];
  settlements: readonly CommerceSettlement[];
  vendors: readonly { id: string }[];
  gatewayProviders: readonly CommerceGatewayProvider[];
}): CommerceStatistics {
  const { products, orders, refunds, subscriptions, coupons, promotions, wallets, escrows, settlements, vendors, gatewayProviders } = input;
  const today = new Date().toISOString();
  const mrr = calculateMrr(subscriptions, today);
  const revenue = orderRevenue(orders);
  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.status === 'active').length,
    totalServices: products.filter((product) => product.type === 'service').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing').length,
    completedOrders: orders.filter((order) => order.status === 'completed').length,
    totalRevenue: revenue,
    totalRefunds: refunds.length,
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: activeSubscriptions(subscriptions, today).length,
    mrr,
    arr: roundMoney(mrr * 12),
    totalCoupons: coupons.length,
    activeCoupons: activeCoupons(coupons, today).length,
    activePromotions: activePromotions(promotions, today).length,
    totalWallets: wallets.length,
    totalWalletBalance: roundMoney(wallets.reduce((sum, wallet) => sum + wallet.balance, 0)),
    activeEscrows: activeEscrows(escrows).length,
    completedSettlements: completedSettlements(settlements).length,
    totalVendors: vendors.length,
    supportedProviders: enabledGatewayProviders(gatewayProviders).length,
  };
}

/** Aggregate root builder for the Commerce module. */
export function buildCommercePortfolio(input: {
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
  currencies: CommercePortfolio['currencies'];
  exchangeRates: CommercePortfolio['exchangeRates'];
  bundles: CommercePortfolio['bundles'];
  productVariants: CommercePortfolio['productVariants'];
  licenses: CommercePortfolio['licenses'];
  purchaseHistory: CommercePortfolio['purchaseHistory'];
  participantEarnings: CommercePortfolio['participantEarnings'];
  relationships: CommercePortfolio['relationships'];
  lifecycleCoverage: CommercePortfolio['lifecycleCoverage'];
  vendors: readonly { id: string }[];
}): CommercePortfolio {
  return {
    ...input,
    statistics: computeCommerceStatistics(input),
    analytics: computePlatformAnalytics(input),
    revenueReport: computeRevenueReport(input),
  };
}

// ---------------------------------------------------------------------------
// Currency & exchange-rate helpers
// ---------------------------------------------------------------------------

/** Locale-aware currency formatting without any external library. */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/** Convert an amount between two currencies through a quoted rate table. */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: readonly CommerceExchangeRate[],
): { amount: number; rate: number; from: string; to: string } {
  if (from === to) return { amount: roundMoney(amount), rate: 1, from, to };
  const quote = rates.find((rate) => rate.from === from && rate.to === to);
  const rate = quote?.rate ?? 1;
  return { amount: roundMoney(amount * rate), rate, from, to };
}

/** Find a quoted rate between two currencies, either direction. */
export function findExchangeRate(
  rates: readonly CommerceExchangeRate[],
  from: string,
  to: string,
): CommerceExchangeRate | undefined {
  if (from === to) return undefined;
  return rates.find((rate) => rate.from === from && rate.to === to) ??
    rates.find((rate) => rate.from === to && rate.to === from);
}

// ---------------------------------------------------------------------------
// Bundles, variants, licences
// ---------------------------------------------------------------------------

/** Bundle pricing: list total, bundle price, savings, and saving percent. */
export function calculateBundlePrice(input: {
  bundle: Pick<CommerceBundle, 'id' | 'name' | 'description' | 'productIds' | 'currency' | 'status' | 'featured' | 'tags'>;
  products: readonly CommerceProduct[];
  bundlePrice: number;
}): CommerceBundle {
  const members = input.bundle.productIds
    .map((productId) => input.products.find((product) => product.id === productId))
    .filter((product): product is CommerceProduct => product != null);
  const listTotal = roundMoney(members.reduce((sum, product) => sum + effectiveProductPrice(product), 0));
  const savings = roundMoney(Math.max(0, listTotal - input.bundlePrice));
  const savingsPercent = listTotal > 0 ? Math.round((savings / listTotal) * 100) : 0;
  return {
    id: input.bundle.id,
    name: input.bundle.name,
    description: input.bundle.description,
    productIds: input.bundle.productIds,
    currency: input.bundle.currency,
    listTotal,
    bundlePrice: roundMoney(input.bundlePrice),
    savings,
    savingsPercent,
    status: input.bundle.status,
    featured: input.bundle.featured,
    tags: input.bundle.tags,
  };
}

/** Price a specific product configuration (variant) for cart purposes. */
export function variantPrice(variant: CommerceProductVariant): number {
  return roundMoney(variant.unitPrice);
}

// ---------------------------------------------------------------------------
// Settlement, refunds, purchase history
// ---------------------------------------------------------------------------

/** Settlement calculator: what actually lands in a participant's account. */
export function calculateSettlement(input: {
  gross: number;
  commissionRatePercent?: number;
  platformFeeRatePercent?: number;
  withdrawalFeeRatePercent?: number;
  currency?: string;
}): {
  gross: number;
  commission: number;
  platformFee: number;
  withdrawalFee: number;
  net: number;
  currency: string;
} {
  const commission = calculateMarketplaceCommission({ grossAmount: input.gross, ratePercent: input.commissionRatePercent });
  const platformFee = calculatePlatformFee({ amount: input.gross, scope: 'payout', fee: input.platformFeeRatePercent != null ? { id: 'inline', scope: 'payout', ratePercent: input.platformFeeRatePercent, description: 'Inline fee' } : undefined });
  const afterFees = roundMoney(input.gross - commission.amount - platformFee.amount);
  const withdrawalFee = roundMoney(Math.max(1, afterFees * ((input.withdrawalFeeRatePercent ?? COMMERCE_WITHDRAWAL_FEE_RATE * 100) / 100)));
  return {
    gross: roundMoney(input.gross),
    commission: commission.amount,
    platformFee: platformFee.amount,
    withdrawalFee,
    net: roundMoney(Math.max(0, afterFees - withdrawalFee)),
    currency: input.currency ?? 'USD',
  };
}

/** Refunds attached to a specific order. */
export function refundsForOrder(refunds: readonly CommerceRefund[], orderId: string): CommerceRefund[] {
  return refunds.filter((refund) => refund.orderId === orderId);
}

/** Total refunded value attached to an order (completed + processing). */
export function refundedTotalForOrder(refunds: readonly CommerceRefund[], orderId: string): number {
  return roundMoney(
    refundsForOrder(refunds, orderId)
      .filter((refund) => refund.status === 'completed' || refund.status === 'processing')
      .reduce((sum, refund) => sum + refund.amount, 0),
  );
}

/** Whether an order is still eligible for a full refund. */
export function canRefundOrder(order: CommerceOrder): boolean {
  return !['refunded', 'cancelled'].includes(order.status) && order.paymentStatus === 'paid';
}

/** Derive a purchase-history ledger from placed orders. */
export function purchaseHistoryFromOrders(orders: readonly CommerceOrder[]): CommercePurchaseRecord[] {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      id: `ph-${order.id}-${item.productId}`,
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      productType: 'product' as const,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      currency: order.currency,
      purchasedAt: order.placedAt,
    })),
  );
}

// ---------------------------------------------------------------------------
// Sorting & filtering
// ---------------------------------------------------------------------------

export function sortTransactionsByDate(
  transactions: readonly CommerceTransaction[],
  descending = true,
): CommerceTransaction[] {
  return [...transactions].sort((a, b) =>
    descending ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
  );
}

export function filterTransactionsByKind(
  transactions: readonly CommerceTransaction[],
  kinds: readonly CommerceTransactionKind[],
): CommerceTransaction[] {
  return transactions.filter((transaction) => kinds.includes(transaction.kind));
}

export function sortOrdersByDate(orders: readonly CommerceOrder[], descending = true): CommerceOrder[] {
  return [...orders].sort((a, b) =>
    descending ? b.placedAt.localeCompare(a.placedAt) : a.placedAt.localeCompare(b.placedAt),
  );
}

export function filterOrdersByStatus(
  orders: readonly CommerceOrder[],
  statuses: readonly CommerceOrder['status'][],
): CommerceOrder[] {
  return orders.filter((order) => statuses.includes(order.status));
}

// ---------------------------------------------------------------------------
// Participant revenue sharing
// ---------------------------------------------------------------------------

/** Aggregate per-participant earnings for a period from ledger records. */
export function computeParticipantEarnings(input: {
  orders: readonly CommerceOrder[];
  commissions: readonly CommerceCommission[];
  refunds: readonly CommerceRefund[];
  periodStart?: string;
  periodEnd?: string;
}): CommerceParticipantEarnings[] {
  const { orders, commissions, refunds } = input;
  const byParticipant = new Map<string, CommerceParticipantEarnings>();

  const upsert = (id: string, participantType: CommerceRevenueParticipantType, participantId: string, participantName: string, currency: CurrencyCode) => {
    const key = `${participantType}:${participantId}`;
    const existing = byParticipant.get(key);
    if (existing) return existing;
    const entry: CommerceParticipantEarnings = {
      id,
      participantType,
      participantId,
      participantName,
      currency,
      grossRevenue: 0,
      platformFees: 0,
      commissions: 0,
      refunds: 0,
      netRevenue: 0,
      availableBalance: 0,
      pendingBalance: 0,
      lifetimeRevenue: 0,
      periodStart: input.periodStart ?? '2026-01-01',
      periodEnd: input.periodEnd ?? '2026-07-31',
    };
    byParticipant.set(key, entry);
    return entry;
  };

  for (const order of orders) {
    const participantId = order.buyerId;
    if (!participantId) continue;
    const entry = upsert(`earn-${participantId}`, 'researcher', participantId, order.buyerName, order.currency);
    entry.grossRevenue = roundMoney(entry.grossRevenue + order.total);
    entry.lifetimeRevenue = roundMoney(entry.lifetimeRevenue + order.total);
  }

  const vendorByOrder = new Map<string, string>();
  for (const commission of commissions) {
    vendorByOrder.set(commission.orderId, commission.vendorId);
    const entry = upsert(`earn-${commission.vendorId}`, 'vendor', commission.vendorId, `Vendor ${commission.vendorId}`, commission.currency);
    entry.grossRevenue = roundMoney(entry.grossRevenue + commission.grossAmount);
    entry.commissions = roundMoney(entry.commissions + commission.amount);
    entry.lifetimeRevenue = roundMoney(entry.lifetimeRevenue + commission.grossAmount);
  }

  for (const refund of refunds) {
    const vendorId = vendorByOrder.get(refund.orderId);
    if (!vendorId) continue;
    const entry = byParticipant.get(`vendor:${vendorId}`);
    if (entry) entry.refunds = roundMoney(entry.refunds + refund.amount);
  }

  for (const entry of byParticipant.values()) {
    entry.netRevenue = roundMoney(entry.grossRevenue - entry.platformFees - entry.commissions - entry.refunds);
    entry.availableBalance = roundMoney(entry.netRevenue * 0.7);
    entry.pendingBalance = roundMoney(entry.netRevenue * 0.3);
  }

  return Array.from(byParticipant.values());
}

export default {
  calculateOrder,
  calculateDiscount,
  calculateCoupon,
  validateCoupon,
  calculateMarketplaceCommission,
  calculatePlatformFee,
  calculateVendorRevenue,
  calculateTax,
  calculateGrandTotal,
  generateInvoiceNumber,
  generateReceipt,
  createWalletTransaction,
  calculateSubscriptionCost,
  calculateBoostCost,
  estimatePromotionReach,
  calculateRefund,
  formatCurrency,
  convertCurrency,
  calculateBundlePrice,
  calculateSettlement,
  computeParticipantEarnings,
} as const;
