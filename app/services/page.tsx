import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  DiscoveryCard,
  MilestoneTracker,
  PortfolioCard,
  ProviderHeader,
  RecommendationCard,
  RelatedServicesList,
  ServiceAnalytics,
  ServiceBrowser,
  ServiceBundleCard,
  ServiceCard,
  ServiceCategoryCard,
  ServiceDisputeCard,
  ServiceOrderCard,
  ServicePackageCard,
  ServicePromotionCard,
  ServiceProviderCard,
  ServiceRatingCard,
  ServiceReviewCard,
  ServiceStatistics,
  TestimonialCard,
  formatCurrency,
} from '@/components/services';
import {
  BOUGHT_TOGETHER,
  CHEAPEST_SERVICE_PRICE,
  DISPUTES,
  FEATURED_BUNDLE,
  FEATURED_DISPUTE,
  FEATURED_PROVIDER,
  FEATURED_SERVICE,
  FEATURED_SERVICE_DELIVERY,
  MILESTONES,
  NEWEST_SERVICES,
  ORDERS,
  POPULAR_SERVICES,
  PROVIDERS,
  PROVIDER_STATISTICS,
  RECOMMENDATIONS,
  RELATED_TO_FEATURED,
  REVIEWS,
  SERVICE_ANALYTICS,
  SERVICE_BUNDLES,
  SERVICE_CATEGORY_GROUP_COUNTS,
  SERVICE_DISCOVERY_ITEMS,
  SERVICE_STATISTICS,
  SERVICES,
  TOP_RATED_SERVICES,
} from '@/constants/placeholder-services';
import { servicesByProvider } from '@/lib/services';

export default function ServicesPage() {
  const usernamesById = Object.fromEntries(PROVIDERS.map((provider) => [provider.id, provider.username]));
  const featuredProviderServices = servicesByProvider(SERVICES, FEATURED_PROVIDER.id);
  const promotedServices = SERVICES.filter((service) => service.promoted || service.sponsored).slice(0, 6);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research Services Marketplace"
          subtitle="The professional services layer of the Scholatia ecosystem — Upwork + Fiverr + ResearchGate Consulting specialised for research. Verified academic providers sell writing, editing, statistical analysis, qualitative analysis, grant writing, literature reviews, research design, publication support, conference abstracts, data work, mentoring, and tutoring. Every service is a live reference to its source record, is searchable through Discovery, is promotable through Advertising, and every order, review, milestone, and dispute flows through the Commerce and Trust engines."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/marketplace">
                Marketplace
              </Button>
              <Button variant="secondary" size="sm" href="/commerce">
                Commerce
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
            title="Services statistics"
            description="Headline signals across the services layer: live services, verified providers, revenue, ratings, delivery, milestones, disputes, and promotion — computed by the engine."
          />
          <div className="mt-8">
            <ServiceStatistics statistics={SERVICE_STATISTICS} providers={PROVIDER_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Platform analytics"
            title="Services analytics"
            description="Impressions, views, inquiries, orders, conversion, revenue, and repeat buyers — plus the top services, providers, and markets derived from the order ledger."
          />
          <div className="mt-8">
            <ServiceAnalytics analytics={SERVICE_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Find a research service"
            description="Search the forty service categories, filter by group and price, and sort by relevance, recency, price, rating, popularity, or delivery speed. Search and ranking are derived entirely by the engine."
          />
          <div className="mt-8">
            <ServiceBrowser usernamesById={usernamesById} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Categories"
            title="Browse by category"
            description="Twelve coarse groups organising the forty research-service categories — writing, editing, statistics, qualitative, grants, literature, research, publishing, conference, data, mentoring, and consulting."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICE_CATEGORY_GROUP_COUNTS.map((group) => (
              <ServiceCategoryCard key={group.group} icon={group.icon} label={group.label} services={group.services} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={FEATURED_SERVICE.title}
            description="The featured listing, its tiered packages, and its rating distribution — pricing and delivery estimates are computed by the engine from the category base turnaround."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ServiceCard service={FEATURED_SERVICE} featured providerUsername={usernamesById[FEATURED_SERVICE.providerId]} />
            </div>
            <div className="space-y-6">
              <ServiceRatingCard rating={FEATURED_SERVICE.rating} />
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Delivery estimate</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{FEATURED_SERVICE_DELIVERY.range}</p>
                <p className="mt-1 text-sm text-slate-500">
                  cheapest listing from {formatCurrency(CHEAPEST_SERVICE_PRICE, FEATURED_SERVICE.price.currency)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_SERVICE.packages.map((pkg) => (
              <ServicePackageCard key={pkg.id} service={FEATURED_SERVICE} pkg={pkg} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured"
            title="Top rated services"
            description="The highest-rated services across the marketplace, ranked by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOP_RATED_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} providerUsername={usernamesById[service.providerId]} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="New arrivals"
            title="Newest services"
            description="Freshly listed services on the marketplace, ordered by listing date."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {NEWEST_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} providerUsername={usernamesById[service.providerId]} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Trending"
            title="Popular services"
            description="The most in-demand services ranked by completed jobs, views, and engagement."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POPULAR_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} providerUsername={usernamesById[service.providerId]} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Providers"
            title="Verified providers"
            description="Verified academic providers across the marketplace, each reusing an existing researcher identity when applicable."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROVIDERS.map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured provider"
            title={FEATURED_PROVIDER.name}
            description="A provider profile showing identity reuse, skills, certifications, portfolio, testimonials, and the services they sell."
          />
          <div className="mt-8">
            <ProviderHeader provider={FEATURED_PROVIDER} />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProviderServices.map((service) => (
              <ServiceCard key={service.id} service={service} providerUsername={usernamesById[service.providerId]} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PROVIDER.portfolio.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
            {FEATURED_PROVIDER.testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reviews"
            title="Verified purchase reviews"
            description="Authenticated reviews tied to services and providers, with ratings aggregated by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.slice(0, 9).map((review) => (
              <ServiceReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Orders"
            title="Order lifecycle"
            description="Service orders flow through the Commerce engine: pending, in progress, delivered, completed, cancelled, refunded, and disputed — with milestone-based delivery tracked here."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Active milestones</p>
                <div className="mt-4">
                  <MilestoneTracker milestones={MILESTONES.slice(0, 6)} />
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
              {ORDERS.slice(0, 4).map((order) => (
                <ServiceOrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Disputes"
            title={FEATURED_DISPUTE.subject}
            description="Open, investigating, resolved, and closed disputes raised against orders — with refund state tracked per dispute."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DISPUTES.map((dispute) => (
              <ServiceDisputeCard key={dispute.id} dispute={dispute} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Intelligence"
            title="AI recommendations"
            description="Recommendations surfaced by the Intelligence layer for providers, services, categories, packages, mentors, editors, and statisticians."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDATIONS.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Bundles"
            title={FEATURED_BUNDLE.name}
            description="Curated combinations of services sold below their individual totals — bundle pricing computed by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_BUNDLES.map((bundle) => (
              <ServiceBundleCard key={bundle.id} bundle={bundle} featured={bundle.id === FEATURED_BUNDLE.id} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Related"
            title="Related & bought together"
            description="Services related to the featured listing by category, skills, and research areas, plus services frequently bought alongside it — derived by the engine."
          />
          <div className="mt-8">
            <RelatedServicesList services={RELATED_TO_FEATURED} usernamesById={usernamesById} />
          </div>
          <div className="mt-6">
            <RelatedServicesList services={BOUGHT_TOGETHER} usernamesById={usernamesById} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Advertising"
            title="Promotable services"
            description="Every service is promotable through the Advertising module — boosted services carry placement metrics (impressions, clicks, inquiries, conversions, CTR, CPC, ROI) tracked through campaign analytics."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotedServices.map((service) => (
              <ServicePromotionCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Discovery"
            title="Services in discovery"
            description="Every service is derived into a unified, searchable discovery row with keywords, research areas, and lifecycle stage references."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_DISCOVERY_ITEMS.slice(0, 6).map((item) => (
              <DiscoveryCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Services data is illustrative"
            description="All services, providers, reviews, orders, milestones, disputes, recommendations, bundles, discovery rows, and advertising metrics are derived from existing placeholder modules and computed by the pure engine in lib/services.ts. Every provider reuses an existing researcher identity where applicable, and live delivery will connect the engine to the Commerce rails and the Advertising auction — no real payments or credentials are used here."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
