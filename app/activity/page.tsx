import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  ActivityAnalytics,
  ActivityBrowser,
  ActivityInsights,
  ActivityPortfolioCard,
  ActivityStatistics,
  ActivityTimeline,
  FeaturedActivity,
  HashtagCard,
  RecommendedFeed,
  TrendingActivity,
} from '@/components/activity';
import {
  ACTIVITY_ANALYTICS,
  ACTIVITY_PORTFOLIO,
  ACTIVITY_STATISTICS,
  ALL_HASHTAGS,
  FEATURED_ACTIVITIES,
  INSIGHTS,
  RECOMMENDATIONS,
  TRENDING,
} from '@/constants/placeholder-activity';

export default function ActivityPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Unified Scholarly Activity Feed"
          subtitle="The platform-wide canonical event stream of the Scholatia ecosystem — every existing and future module emits into this single typed graph, referenced by canonical ID with zero duplication. Ten derived feed kinds (following, institution, discipline, journal, conference, funding, discovery, recommended, trending, and AI-curated) are computed by the pure engine alongside moderation, recommendations, insights, and analytics. This is not messaging and not the notification engine: it is the shared activity backbone both can attach to."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/services">
                Services
              </Button>
              <Button variant="secondary" size="sm" href="/commerce">
                Commerce
              </Button>
              <Button variant="outline" size="sm" href="/marketplace">
                Marketplace
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Activity statistics"
            description="Headline signals across the activity engine: total activities, contributors, reactions, comments, and reposts — computed by the pure engine from the comment, bookmark, and share ledgers."
          />
          <div className="mt-8">
            <ActivityStatistics statistics={ACTIVITY_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Activity analytics"
            description="Engagement and view volumes across the graph, plus the daily activity curve — derived by the engine from the engagement ledgers."
          />
          <div className="mt-8">
            <ActivityAnalytics analytics={ACTIVITY_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Discovery"
            title="Trending now"
            description="Activities ranked by the 72-hour half-life trend score — what the community is engaging with right now."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendingActivity entries={TRENDING} />
            </div>
            <div className="space-y-6">
              {FEATURED_ACTIVITIES.slice(0, 2).map((activity) => (
                <FeaturedActivity key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Feed"
            title="Activity centre"
            description="Search every activity, switch between the ten derived feed kinds, filter by type and visibility, sort by recency or engagement, and interact — react, comment with threaded replies, bookmark, repost, pin, and moderate the review queue."
          />
          <div className="mt-8">
            <ActivityBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendations"
            title="Recommended for you"
            description="Scored recommendations over the activity graph, personalised to the current researcher profile with human-readable reasons."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <RecommendedFeed recommendations={RECOMMENDATIONS.slice(0, 4)} />
            <div className="space-y-6">
              <ActivityInsights insights={INSIGHTS.slice(0, 3)} />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Community"
            title="Trending hashtags"
            description="Hashtags extracted from activity bodies by the engine, ranked by usage."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_HASHTAGS.slice(0, 8).map((hashtag) => (
              <HashtagCard key={hashtag.tag} hashtag={hashtag} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Sequence"
            title="Activity timeline"
            description="The canonical activity stream in chronological order — each entry references its source record by ID and never duplicates it."
          />
          <div className="mt-8">
            <ActivityTimeline activities={ACTIVITY_PORTFOLIO.activities.slice(0, 6)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Aggregate"
            title="Activity portfolio"
            description="The aggregate root of the unified feed — statistics, analytics, ledgers, feeds, trending, recommendations, moderation, and insights under one roof."
          />
          <div className="mt-8">
            <ActivityPortfolioCard portfolio={ACTIVITY_PORTFOLIO} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Activity data is illustrative"
            description="All activities, feeds, trending, recommendations, insights, moderation entries, statistics, and analytics are derived from existing placeholder modules and computed by the pure engine in lib/activity.ts. Every activity references a canonical source record by ID — researchers, journals, conferences, institutions, grants, projects, datasets, manuscripts, publishers, orders, services, listings, campaigns, subscriptions, and more. Live ingestion will connect the engine to module events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
