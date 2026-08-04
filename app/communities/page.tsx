import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  CommunityAnalytics,
  CommunityGrid,
  CommunityHeader,
  CommunityInsights,
  CommunityProfile,
  CommunityRecommendations,
  CommunitySearch,
} from '@/components/communities';
import {
  COMMUNITY_ANALYTICS,
  COMMUNITY_INSIGHTS,
  COMMUNITY_PORTFOLIO,
  COMMUNITY_STATISTICS,
  FEATURED_COMMUNITIES,
  TRENDING_COMMUNITIES,
} from '@/constants/placeholder-communities';
import { CommunityStatistics } from '@/components/communities';
import { communityUrl } from '@/lib/communities';

export default function CommunitiesPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholarly Communities Platform"
          subtitle="Open scholarly knowledge ecosystems centred around discussion, collaboration, mentoring, networking, learning, and academic exchange. Communities are not groups: they are the open, followable surface every researcher can join and contribute to — announcements, threaded discussions, Q&A, knowledge sharing, events, polls, mentorship pairings, opportunities, scholar spotlights, and explicit moderation, all computed by the pure engine in lib/communities.ts."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" href="/communities/create">
                Create community
              </Button>
              <Button variant="secondary" size="sm" href="/groups">
                Groups
              </Button>
              <Button variant="outline" size="sm" href="/activity">
                Activity
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Community statistics"
            description="Headline signals across the community graph: communities, members, followers, discussions, questions, resources, and events — computed by the pure engine from the typed community aggregate."
          />
          <div className="mt-8">
            <CommunityStatistics statistics={COMMUNITY_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Community analytics"
            description="Average size, followers, activity scores, public share, leading countries, disciplines, keywords, and trending topics across the community graph — all derived by the engine."
          />
          <div className="mt-8">
            <CommunityAnalytics analytics={COMMUNITY_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Discover"
            title="Community centre"
            description="Search every community, filter by category, visibility, country, language, and discipline, sort by activity, recency, membership, followers, or output, and explore the exchange surface of each scholarly ecosystem."
          />
          <div className="mt-8">
            <CommunitySearch />
          </div>
          <div className="mt-8">
            <CommunityGrid communities={FEATURED_COMMUNITIES.slice(0, 6)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title="Inside a community"
            description="The canonical community aggregate — a governed profile, open membership and followers, and a rich exchange surface: announcements, threaded discussions, Q&A, knowledge sharing, events, polls, mentorship, opportunities, and moderation, all under one roof."
          />
          <div className="mt-8">
            <CommunityHeader community={COMMUNITY_PORTFOLIO.featured[0] ?? FEATURED_COMMUNITIES[0]} />
          </div>
          <div className="mt-8">
            <CommunityProfile communityId={(COMMUNITY_PORTFOLIO.featured[0] ?? FEATURED_COMMUNITIES[0]).id} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Trending"
            title="Trending communities"
            description="The communities with the highest weighted activity across discussions, Q&A, knowledge sharing, events, and polls."
          />
          <div className="mt-8">
            <CommunityGrid communities={TRENDING_COMMUNITIES.slice(0, 6)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="For you"
            title="Recommended communities"
            description="Scored recommendations derived by the recommendation engine from research interests, discipline, institution, country, language, keywords, groups membership, and publishing, marketplace, and conference activity."
          />
          <div className="mt-8">
            <CommunityRecommendations recommendations={COMMUNITY_PORTFOLIO.recommendations} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Insights"
            title="Community intelligence"
            description="Derived AI insights over the communities graph — the largest ecosystems, most active knowledge exchanges, dominant research themes, verified growth, and private spaces to open."
          />
          <div className="mt-8">
            <CommunityInsights insights={COMMUNITY_INSIGHTS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Explore further"
            title="Browse every community"
            description="Every community in the graph, linked to its canonical route."
          />
          <div className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COMMUNITY_PORTFOLIO.communities.map((community) => (
                <li key={community.id}>
                  <a
                    href={communityUrl(community)}
                    className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {community.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Community data is illustrative"
            description="All communities, members, followers, mentors, experts, ambassadors, announcements, discussions, questions, resources, events, polls, mentorships, opportunities, spotlights, achievements, bookmarks, trends, reports, and warnings are derived from existing placeholder modules and computed by the pure engine in lib/communities.ts. Creators, members, and followers reference canonical researchers by username; the verification status reuses the canonical InstitutionVerificationStatus vocabulary from the Identity platform; resources may reference canonical DOI and URL records — no external record is duplicated. Live ingestion will connect the engine to module events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
