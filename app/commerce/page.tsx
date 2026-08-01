import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  CheckoutSummary,
  CommissionCard,
  CouponCard,
  DiscountCard,
  EscrowCard,
  FinancialAnalyticsCard,
  InvoiceCard,
  MarketplaceSalesCard,
  OrderCard,
  OrderHistory,
  PayoutCard,
  PricingCard,
  PromotionCard,
  ReceiptCard,
  RevenueDashboard,
  ShoppingCart,
  SubscriptionCard,
  TransactionCard,
  VendorRevenueCard,
  WalletCard,
  WalletHistory,
} from '@/components/commerce';
import { formatCurrency } from '@/components/commerce';
import {
  BOOST_PREVIEWS,
  CARTS,
  COMMERCE_ANALYTICS,
  COMMERCE_REVENUE_REPORT,
  COMMERCE_STATISTICS,
  COMMISSIONS,
  COUPONS,
  ESCROWS,
  FEATURED_CART,
  FEATURED_COUPON,
  FEATURED_ORDER,
  FEATURED_PROMOTION,
  FEATURED_RECEIPT,
  FEATURED_SUBSCRIPTION_PLAN,
  FEATURED_VENDOR_EARNINGS,
  GATEWAY_PROVIDERS,
  INVOICES,
  ORDERS,
  PRODUCTS,
  PROMOTIONS,
  RECEIPTS,
  SETTLEMENTS,
  SUBSCRIPTIONS,
  SUBSCRIPTION_PLANS,
  TRANSACTIONS,
  VENDOR_EARNINGS,
  WALLETS,
  WALLET_TRANSACTIONS,
} from '@/constants/placeholder-commerce';
import { calculateOrder } from '@/lib/commerce';

export default function CommercePage() {
  const checkoutCoupon = COUPONS.find((coupon) => coupon.code === FEATURED_CART.couponCode);
  const checkoutCalculation = calculateOrder(FEATURED_CART.items, {
    coupon: checkoutCoupon,
    taxRatePercent: 5,
    currency: FEATURED_CART.items[0]?.currency,
  });

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Commerce & Marketplace Engine"
          subtitle="The financial operating system of the Scholatia ecosystem. Every product, service, order, invoice, receipt, wallet transaction, subscription, commission, escrow, settlement, and revenue line flows through this engine — provider-independent by design, modelling Paystack, Flutterwave, Stripe, PayPal, Wise, bank transfer, Apple Pay, and Google Pay without live credentials. Marketplace sales, advertising, subscriptions, boosts, featured and sponsored listings, vendor memberships, premium analytics, and future API access and grant disbursements all settle here."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/marketplace">
                Marketplace
              </Button>
              <Button variant="secondary" size="sm" href="/advertising">
                Advertising
              </Button>
              <Button variant="outline" size="sm" href="/funding">
                Funding
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Marketplace overview"
            title="Commerce statistics"
            description="Headline signals across the entire commercial layer: orders, revenue, catalog, conversion, and refund rate computed by the engine."
          />
          <div className="mt-8">
            <MarketplaceSalesCard statistics={COMMERCE_STATISTICS} analytics={COMMERCE_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Shopping"
            title="The catalog"
            description="Products and services reference live marketplace listings, advertising campaigns, publications, and conference records — from research services to boosted posts, featured listings, vendor memberships, premium analytics, API access, and enterprise licences."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <DiscountCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Shopping cart"
            title={FEATURED_CART.id}
            description="Carts hold live references to catalog items with quantity, unit price, and an optional coupon code — the order calculation is derived entirely by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {CARTS.map((cart) => (
              <ShoppingCart key={cart.id} cart={cart} coupons={COUPONS} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Checkout"
            title="Order summary & payment"
            description="The checkout pipeline walks through cart, billing address, payment, review, processing, and confirmation — with the subtotal, discount, tax, platform fee, and payable total all derived from the order engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ShoppingCart cart={FEATURED_CART} coupons={COUPONS} />
            <CheckoutSummary calculation={checkoutCalculation} step="review" />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Orders"
            title="Order lifecycle"
            description="Orders move through pending, confirmed, processing, completed, cancelled, refunded, and disputed states — with payment status tracked per order across every rail."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <OrderHistory orders={ORDERS} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
              {ORDERS.slice(0, 6).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Billing"
            title="Invoices"
            description="Each order is invoiced with itemised lines, discount, tax lines, fees, and a due date."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INVOICES.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Receipts"
            title={FEATURED_RECEIPT.receiptNumber}
            description="Paid orders generate receipts with the merchant, payment method, itemised lines, and the paid date."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RECEIPTS.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Wallet system"
            title="Wallets, credits & debits"
            description="Every researcher, vendor, and institution holds a wallet. Credits, marketplace purchases, subscription payments, commission payouts, refunds, withdrawals, and future grant disbursements are double-entered wallet transactions with a recomputed balance."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {WALLETS.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                transactions={WALLET_TRANSACTIONS.filter((transaction) => transaction.walletId === wallet.id)}
              />
            ))}
          </div>
          <div className="mt-6">
            <WalletHistory
              transactions={WALLET_TRANSACTIONS}
              limit={8}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Subscriptions"
            title={FEATURED_SUBSCRIPTION_PLAN.name}
            description="Researchers, institutions, publishers, journals, conferences, companies, advertisers, and marketplace vendors subscribe on monthly, quarterly, or annual cycles — with per-seat pricing and annual discounts computed by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} featured={plan.featured} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Active subscriptions"
            title="Subscription portfolio"
            description="Live subscriptions with status, billing cycle, monthly and annual equivalents, and the next billing date."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTIONS.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Commissions"
            title="Marketplace commission"
            description="The platform earns a commission on every completed marketplace order, tracked per vendor per order with gross amount, rate, and paid status."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMMISSIONS.map((commission) => (
              <CommissionCard key={commission.id} commission={commission} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Escrow"
            title="Escrow & dispute holding"
            description="High-value or disputed orders hold funds in escrow until delivery is confirmed or the dispute resolves, then release to the vendor or back to the buyer."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ESCROWS.map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Payouts"
            title="Settlements to vendors"
            description="Vendor earnings settle through scheduled payouts across Paystack, Flutterwave, Wise, and bank transfer, tracked through scheduled, processing, and completed states."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SETTLEMENTS.map((settlement) => (
              <PayoutCard key={settlement.id} settlement={settlement} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Vendor revenue"
            title={FEATURED_VENDOR_EARNINGS.vendorName}
            description="Gross sales, commissions, platform fees, refunds, net earnings, available and pending balances for every vendor in the period."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {VENDOR_EARNINGS.map((earnings) => (
              <VendorRevenueCard
                key={earnings.id}
                earnings={earnings}
                featured={earnings.id === FEATURED_VENDOR_EARNINGS.id}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Coupons"
            title={FEATURED_COUPON.code}
            description="Percent or fixed coupons apply to a product, vendor, category, cart, or subscription — validated against minimum spend, usage limits, and validity windows."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COUPONS.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Promotions"
            title={FEATURED_PROMOTION.name}
            description="Seasonal sales, flash sales, launches, boosted and featured campaigns discount groups of products with an estimated audience reach."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROMOTIONS.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Boosts"
            title="Boost previews"
            description="Boosting a post or listing buys amplified reach for a fixed number of days — cost, reach, and CPM computed for each tier."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BOOST_PREVIEWS.map((preview) => (
              <div
                key={preview.tierId}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
              >
                <p className="font-semibold text-slate-900">{preview.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{preview.days} days</p>
                <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(preview.cost, preview.currency)}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {preview.reach.toLocaleString()} reach · {preview.cpm.toFixed(2)} CPM
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Ledger"
            title="Transactions"
            description="Every purchase, subscription, advertising, boost, featured, sponsored, membership, analytics, refund, payout, and disbursement is a ledger line feeding the revenue report."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRANSACTIONS.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Payment gateway abstraction"
            title="Provider-independent payments"
            description="No real payment API is integrated. The abstraction layer models Paystack, Flutterwave, Stripe, PayPal, Wise, bank transfer, Apple Pay, Google Pay, the wallet, and credits — each advertising its currencies, methods, and capabilities."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GATEWAY_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{provider.displayName}</p>
                  <span
                    className={[
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      provider.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {provider.enabled ? (provider.sandbox ? 'Sandbox' : 'Live') : 'Disabled'}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {provider.capabilities.currencies.join(' · ')}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {provider.supportedMethods.map((method) => (
                    <span key={method} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Revenue"
            title="Revenue dashboard"
            description="Gross revenue, commissions, platform fees, refunds, and net revenue — split by stream, period, and payment method from the ledger."
          />
          <div className="mt-8">
            <RevenueDashboard report={COMMERCE_REVENUE_REPORT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Platform analytics"
            title="Financial dashboard"
            description="MRR, ARR, wallet balances, active subscriptions, escrow, payouts, coupon redemptions, and growth across the financial operating system."
          />
          <div className="mt-8">
            <FinancialAnalyticsCard analytics={COMMERCE_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured order"
            title={FEATURED_ORDER.orderNumber}
            description="A live order spanning the whole engine: catalog references, coupon validation, tax, platform fee, invoice, receipt, payment, commission, wallet transaction, and settlement."
          />
          <div className="mt-8">
            <OrderCard order={FEATURED_ORDER} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Commerce data is illustrative"
            description="All products, carts, orders, invoices, receipts, wallet transactions, subscriptions, commissions, escrows, settlements, coupons, promotions, gateway providers, and revenue figures are derived from existing placeholder modules and computed by the pure engine. Live trading will connect the engine to real payment rails, KYC, escrow, and the advertising auction — no real payment API or credentials are used here."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
