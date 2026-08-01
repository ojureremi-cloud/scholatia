import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  BookingCard,
  BundleCard,
  ConversationCard,
  CouponCard,
  DisputeCard,
  GuestAdvertiserCard,
  InvoiceCard,
  ListingCard,
  MarketplaceAnalytics,
  MarketplaceCategories,
  MarketplaceSearchPanel,
  MarketplaceStatistics,
  NotificationCard,
  OrderCard,
  PaymentCard,
  PromotionCard,
  RecommendationCard,
  RefundCard,
  RevenueDashboard,
  ReviewCard,
  SalesDashboard,
  StorefrontCard,
  VendorCard,
  WishlistCard,
} from '@/components/marketplace';
import {
  BOOKINGS,
  BUNDLES,
  CONVERSATIONS,
  COUPONS,
  DISPUTES,
  FEATURED_BUNDLE,
  FEATURED_COUPON,
  FEATURED_LISTING,
  FEATURED_PROMOTION,
  FEATURED_RECOMMENDATION,
  FEATURED_STOREFRONT,
  FEATURED_VENDOR,
  GUEST_ADVERTISERS,
  INVOICES,
  LISTINGS,
  MARKETPLACE_ANALYTICS,
  MARKETPLACE_REVENUE_DASHBOARD,
  MARKETPLACE_SALES_DASHBOARD,
  MARKETPLACE_STATISTICS,
  NOTIFICATIONS,
  ORDERS,
  PAYMENTS,
  PROMOTIONS,
  RECOMMENDATIONS,
  REFUNDS,
  REVIEWS,
  STOREFRONTS,
  VENDORS,
  WISHLISTS,
} from '@/constants/placeholder-marketplace';

export default function MarketplacePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Academic Marketplace"
          subtitle="The platform-wide commercial and transactional layer of the Scholatia ecosystem — Amazon + LinkedIn + Upwork + Fiverr + Alibaba + ResearchGate Marketplace for academia. Researchers, universities, laboratories, publishers, and companies list services, products, equipment, courses, and jobs; every listing is a live reference to its source record, is searchable through Discovery, and is promotable through Advertising. Buyers search, review, favorite, wishlist, book, order, invoice, pay, refund, and dispute — all through the same lifecycle engine."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/researchers">
                Researchers
              </Button>
              <Button variant="secondary" size="sm" href="/journals">
                Journals
              </Button>
              <Button variant="outline" size="sm" href="/funding">
                Funding
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Marketplace statistics"
            description="Aggregate signals across the transactional layer: vendors, listings, categories, orders, revenue, ratings, bookings, coupons, promotions, disputes, and refunds."
          />
          <div className="mt-8">
            <MarketplaceStatistics statistics={MARKETPLACE_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Twelve category families"
            description="Every academic need maps to a category — research services, writing, publication, conferences, education, laboratory work, equipment, funding, recruitment, consulting, and digital or physical products."
          />
          <div className="mt-8">
            <MarketplaceCategories />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured vendor"
            title={FEATURED_VENDOR.name}
            description="The top-rated storefront on the platform, with live trust score, rating distribution, verified identity, and portfolio."
          />
          <div className="mt-8">
            <VendorCard vendor={FEATURED_VENDOR} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Storefronts"
            title={FEATURED_STOREFRONT.name}
            description="Every vendor opens a storefront at a canonical store URL with its own policies, categories, and featured listings."
          />
          <div className="mt-8">
            <StorefrontCard storefront={FEATURED_STOREFRONT} listings={LISTINGS} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="All storefronts"
            title="The storefront network"
            description="Vendors are researchers, universities, laboratories, publishers, consultancies, and companies — each with a store URL, policies, and curated listings."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STOREFRONTS.map((storefront) => (
              <StorefrontCard key={storefront.vendorId} storefront={storefront} listings={LISTINGS} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="All vendors"
            title="Vendors"
            description="The full vendor network with verification, trust scores, ratings, badges, locations, and their research identity when applicable."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VENDORS.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured listing"
            title={FEATURED_LISTING.title}
            description="The best-scoring listing on the platform: price, discount, rating, inventory, delivery, and the source record it services."
          />
          <div className="mt-8">
            <ListingCard listing={FEATURED_LISTING} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Search"
            title="Browse the catalog"
            description="Free-text search, category filtering, and ranking are all computed by the marketplace engine — every result is an in-stock, active listing."
          />
          <div className="mt-8">
            <MarketplaceSearchPanel listings={LISTINGS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reviews"
            title="Ratings & reviews"
            description="Verified-purchase reviews feed the rating distribution shown across vendors, listings, and storefronts."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.slice(0, 9).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Orders"
            title="Order lifecycle"
            description="Orders move through the full state machine — pending, confirmed, in progress, delivered, completed, cancelled, refunded, disputed — with payment status tracked per order."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ORDERS.slice(0, 9).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Billing"
            title="Invoices"
            description="Each order is invoiced with itemised lines, platform fees, and a payment due date."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INVOICES.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Payments"
            title="Payment rail"
            description="Payments arrive through card, bank transfer, mobile money, PayPal, escrow, wallet, or institution billing — with escrow holding where applicable."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PAYMENTS.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Refunds"
            title="Refund workflow"
            description="Refunds are requested, approved, processed, and completed through the lifecycle engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REFUNDS.map((refund) => (
              <RefundCard key={refund.id} refund={refund} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Disputes"
            title="Dispute resolution"
            description="Buyer disputes are triaged by severity, investigated by Marketplace Support, and resolved through a message thread."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DISPUTES.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Coupons"
            title={FEATURED_COUPON.code}
            description="Coupons apply percent or fixed discounts to a listing, vendor, category, or cart — validated against spend, usage, and validity windows."
          />
          <div className="mt-8">
            <CouponCard coupon={FEATURED_COUPON} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Coupon catalog"
            title="All coupons"
            description="The live coupon ledger with usage counts and eligibility checks."
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
            description="Seasonal sales, flash sales, bundles, and launch campaigns discount groups of listings across the catalog."
          />
          <div className="mt-8">
            <PromotionCard promotion={FEATURED_PROMOTION} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Promotion calendar"
            title="All promotions"
            description="Every windowed promotion with its discount, kind, and covered listings."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROMOTIONS.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Bundles"
            title={FEATURED_BUNDLE.name}
            description="Curated multi-listing packages with a combined list price, bundle discount, and one blended price."
          />
          <div className="mt-8">
            <BundleCard bundle={FEATURED_BUNDLE} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Bundle catalog"
            title="All bundles"
            description="Statistics, publishing, and education bundles built from the live listing catalog."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BUNDLES.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Bookings"
            title="Bookable services"
            description="Consultations, tutoring, and lab sessions are booked against open availability slots with a duration, timezone, and location."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BOOKINGS.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Messaging"
            title="Buyer–vendor conversations"
            description="Orders open conversations between buyers and vendors, tied back to their order and listing."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CONVERSATIONS.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Notifications"
            title="Marketplace notifications"
            description="Order updates, payments, refunds, disputes, messages, reviews, booking reminders, promotions, and price drops land here."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {NOTIFICATIONS.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Wishlists"
            title="Saved for later"
            description="Wishlists group listings for grant season, lab equipment, and course materials."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WISHLISTS.map((wishlist) => (
              <WishlistCard key={wishlist.id} wishlist={wishlist} listings={LISTINGS} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Guest advertisers"
            title="External advertisers"
            description="Companies without Scholatia accounts purchase campaigns and promote marketplace listings through the Scholatia Ads surface — no account required."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GUEST_ADVERTISERS.map((advertiser) => (
              <GuestAdvertiserCard key={advertiser.id} advertiser={advertiser} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="AI recommendations"
            title={FEATURED_RECOMMENDATION.title}
            description="The Intelligence layer recommends the best vendors, listings, services, products, consultants, collaborators, journals, reviewers, grants, conferences, and publishers for each researcher."
          />
          <div className="mt-8">
            <RecommendationCard recommendation={FEATURED_RECOMMENDATION} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendation engine"
            title="All recommendations"
            description="Personalised scores and confidence for every recommendation, bridging marketplace records and non-marketplace modules."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDATIONS.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Vendor analytics"
            title="Sales dashboard"
            description="Gross and net revenue, order volume, conversion, daily revenue curve, and top products for vendors."
          />
          <div className="mt-8">
            <SalesDashboard dashboard={MARKETPLACE_SALES_DASHBOARD} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Platform analytics"
            title="Revenue dashboard"
            description="Gross revenue, platform commission, vendor payouts, refunds, net platform revenue — split by category, country, and payment method."
          />
          <div className="mt-8">
            <RevenueDashboard dashboard={MARKETPLACE_REVENUE_DASHBOARD} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Marketplace analytics"
            description="Impressions, engagement, revenue by category, top listings, and top vendors computed by the engine."
          />
          <div className="mt-8">
            <MarketplaceAnalytics analytics={MARKETPLACE_ANALYTICS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Marketplace data is illustrative"
            description="All vendors, storefronts, listings, reviews, orders, invoices, payments, refunds, disputes, coupons, promotions, bundles, bookings, messages, notifications, wishlists, guest advertisers, recommendations, and analytics are derived from placeholder module data. Live trading will connect the engine to real payment rails, escrow, verification, the unified index, and the advertising auction."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
