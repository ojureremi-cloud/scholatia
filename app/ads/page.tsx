import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  AdSetCard,
  AdvertisingAnalytics,
  AdvertisingStatistics,
  AdvertiserCard,
  AudienceCard,
  CampaignAnalyticsCard,
  CampaignCard,
  CreativeCard,
  ForecastCard,
  FraudSignalCard,
  PromotableObjectCard,
  ReviewQueueCard,
  SponsoredPlacementCard,
} from '@/components/ads';
import {
  ADVERTISERS,
  ADVERTISING_PORTFOLIO,
  AD_AUDIENCES,
  AD_CAMPAIGNS,
  AD_CAMPAIGN_ANALYTICS,
  AD_CREATIVES,
  AD_FRAUD_SIGNALS,
  AD_REVIEW_QUEUE,
  AD_SETS,
  AD_STATISTICS,
  AD_ANALYTICS,
  FEATURED_CAMPAIGN,
  FEATURED_CAMPAIGN_ANALYTICS,
  FEATURED_FORECAST,
  FEATURED_PLACEMENT,
  FEATURED_ADVERTISER,
  FEATURED_PROMOTABLE,
  PROMOTABLE_OBJECTS,
  SPONSORED_PLACEMENTS,
} from '@/constants/placeholder-ads';

export default function AdsPage() {
  const advertiserById = new Map(ADVERTISERS.map((advertiser) => [advertiser.id, advertiser]));
  const audienceById = new Map(AD_AUDIENCES.map((audience) => [audience.id, audience]));
  const promotableById = new Map(PROMOTABLE_OBJECTS.map((object) => [object.id, object]));
  const featuredCampaignAdSets = AD_SETS.filter((set) => set.campaignId === FEATURED_CAMPAIGN.id);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Academic Advertising & Sponsored Content"
          subtitle="The platform-wide monetization layer of the Scholatia ecosystem. Every academic object — papers, journals, conferences, funding calls, datasets, publishers, institutions, projects, profiles — is promotable through two advertiser surfaces: Scholatia Promote (internal, verified users promoting their own research) and Scholatia Ads (external advertisers: universities, foundations, publishers, recruiters, suppliers). Campaigns are run through the full Ads Manager structure — campaigns → ad sets → creatives — with the audience engine, sponsored placements, AI forecasts, fraud prevention, and the review pipeline."
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
            eyebrow="Featured forecast"
            title={`${FEATURED_FORECAST.campaignQualityScore} quality · ${FEATURED_FORECAST.adRelevanceScore} relevance`}
            description="The AI-recommended campaign setup for the platform's best-scoring promotion: audience, budget, duration, pricing model, and expected performance."
          />
          <div className="mt-8">
            <ForecastCard
              forecast={FEATURED_FORECAST}
              audience={audienceById.get(FEATURED_FORECAST.recommendedAudienceId)}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="Advertising statistics"
            description="Aggregate signals across the monetization layer: campaigns, promotable objects, advertisers, placements, impressions, conversions, spend, and trust."
          />
          <div className="mt-8">
            <AdvertisingStatistics statistics={AD_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Promotable"
            title={FEATURED_PROMOTABLE.title}
            description="Every record in the ecosystem is promotable. Each object below is a live reference to its source module — the Advertising platform never owns the data it promotes."
          />
          <div className="mt-8">
            <PromotableObjectCard object={FEATURED_PROMOTABLE} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Catalog"
            title="The promotable catalog"
            description="A representative slice of the promotable ecosystem, derived from researchers, journals, conferences, publishers, institutions, datasets, manuscripts, funding, projects, and publications."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVERTISING_PORTFOLIO.promotableObjects.slice(0, 9).map((object) => (
              <PromotableObjectCard key={object.id} object={object} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Campaigns"
            title={FEATURED_CAMPAIGN.name}
            description="Campaigns span the full lifecycle — draft, in review, active, paused, ended, completed — each tied to a promotable object and an advertiser account."
          />
          <div className="mt-8">
            <CampaignCard
              campaign={FEATURED_CAMPAIGN}
              adSets={featuredCampaignAdSets}
              advertiser={advertiserById.get(FEATURED_CAMPAIGN.advertiserId)}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Ads Manager"
            title="All campaigns"
            description="The full campaign portfolio with budget utilization, objective, and advertiser attribution."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_CAMPAIGNS.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                adSets={AD_SETS.filter((set) => set.campaignId === campaign.id)}
                advertiser={advertiserById.get(campaign.advertiserId)}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Ad sets"
            title="Targeting & delivery units"
            description="Each ad set couples an audience with placements, a pricing model, a bid, a budget envelope, and its creatives."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_SETS.map((adSet) => (
              <AdSetCard key={adSet.id} adSet={adSet} audience={audienceById.get(adSet.audienceId)} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Creatives"
            title="Advertisement library"
            description="Sponsored content variants, each carrying a disclosure label, a call to action, and a reference to the promotable object it advertises."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_CREATIVES.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                promotedObject={promotableById.get(creative.promotedObjectId)}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Audience engine"
            title="Target audiences"
            description="Audiences are defined by the academic graph: disciplines, faculties, research interests, academic ranks, career stages, sectors, geographies, and lifecycle stages."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_AUDIENCES.map((audience) => (
              <AudienceCard key={audience.id} audience={audience} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Placements"
            title={FEATURED_PLACEMENT.placement}
            description="Sponsored content appears on natural platform surfaces — home feed, research feed, journal pages, funding page, discovery, AI recommendations, email newsletters, and more."
          />
          <div className="mt-8">
            <SponsoredPlacementCard placement={FEATURED_PLACEMENT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Inventory"
            title="Live sponsored placements"
            description="Every live placement with disclosure label, priority in the auction, delivery, and spend."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SPONSORED_PLACEMENTS.map((placement) => (
              <SponsoredPlacementCard key={placement.id} placement={placement} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Advertisers"
            title={FEATURED_ADVERTISER.name}
            description="Verified Scholatia Promote accounts and external Scholatia Ads organizations, each with billing, verification, and a trust score."
          />
          <div className="mt-8">
            <AdvertiserCard advertiser={FEATURED_ADVERTISER} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Advertiser accounts"
            title="All advertisers"
            description="The internal Promote surface and the external Ads surface operate on the same campaign machinery."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVERTISERS.map((advertiser) => (
              <AdvertiserCard key={advertiser.id} advertiser={advertiser} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Marketplace analytics"
            description="Revenue by objective, campaigns by status, spend by placement, top campaigns, and audience reach by discipline."
          />
          <div className="mt-8">
            <AdvertisingAnalytics analytics={AD_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Campaign analytics"
            title={FEATURED_CAMPAIGN_ANALYTICS.campaignName}
            description="The deepest performance surface for one campaign: funnel, devices, geographies, placement heat, referrals, and time-of-day delivery."
          />
          <div className="mt-8">
            <CampaignAnalyticsCard analytics={FEATURED_CAMPAIGN_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Campaign analytics"
            title="Full analytics surface"
            description="Every campaign's conversion funnel, device mix, geography, placement heat, referrals, and delivery curve."
          />
          <div className="mt-8 space-y-6">
            {AD_CAMPAIGN_ANALYTICS.map((analytics) => (
              <CampaignAnalyticsCard key={analytics.campaignId} analytics={analytics} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Review pipeline"
            title="Review queue"
            description="Every advertisement passes manual moderation, AI moderation, academic-integrity, spam, and fraud checks before it can be placed."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_REVIEW_QUEUE.map((review) => (
              <ReviewQueueCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Fraud prevention"
            title="Fraud signals"
            description="Automated detection of fake clicks, bot traffic, duplicate impressions, click farms, and invalid conversions across the marketplace."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AD_FRAUD_SIGNALS.map((signal) => (
              <FraudSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Advertising data is illustrative"
            description="All campaigns, ad sets, creatives, audiences, placements, forecasts, fraud signals, review records, and analytics are derived from placeholder module data. Live advertising will connect the campaign engine to real payment rails, the review pipeline, the unified index, and the advertising auction."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
