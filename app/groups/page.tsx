import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  GroupAnalytics,
  GroupBrowser,
  GroupInsights,
  GroupPortfolioCard,
  GroupStatistics,
} from '@/components/groups';
import {
  FEATURED_GROUPS,
  GROUP_ANALYTICS,
  GROUP_INSIGHTS,
  GROUP_PORTFOLIO,
  GROUP_STATISTICS,
} from '@/constants/placeholder-groups';
import { GroupDetail } from '@/components/groups';

export default function GroupsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Academic Groups Platform"
          subtitle="The persistent, role-governed scholarly community layer — research groups, department and faculty groups, institution groups, conference working groups, journal editorial groups, grant teams, laboratories, project teams, interest groups, and professional networks. Every group is an aggregate of a governed membership and shared scholarship — publications, events, resources, discussions, announcements, projects, and media — computed by the pure engine in lib/groups.ts. Groups are not messaging, activity, or notifications: they are the stable home all three can attach to."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" href="/groups/create">
                Create group
              </Button>
              <Button variant="secondary" size="sm" href="/collaboration">
                Workspaces
              </Button>
              <Button variant="outline" size="sm" href="/researchers">
                Researchers
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Group statistics"
            description="Headline signals across the group graph: groups, members, publications, events, and resources — computed by the pure engine from the typed group aggregate."
          />
          <div className="mt-8">
            <GroupStatistics statistics={GROUP_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Group analytics"
            description="Average size, public share, leading countries, disciplines, and keywords across the group graph — all derived by the engine."
          />
          <div className="mt-8">
            <GroupAnalytics analytics={GROUP_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Group centre"
            description="Search every group, filter by category, visibility, country, and discipline, sort by recency, membership, output, or research breadth, and explore the shared surface of each scholarly community."
          />
          <div className="mt-8">
            <GroupBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title="Inside a group"
            description="The canonical group aggregate — governed membership with roles, publications, events, resources, discussions, announcements, projects, and media, all under one roof."
          />
          <div className="mt-8">
            <GroupDetail groupId={GROUP_PORTFOLIO.featured[0]?.id ?? FEATURED_GROUPS[0]?.id ?? ''} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Insights"
            title="Group intelligence"
            description="Derived AI insights over the group graph — the largest communities, most productive output, shared research clusters, and open private spaces."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <GroupInsights insights={GROUP_INSIGHTS.slice(0, 4)} />
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-6 sm:grid-cols-2">
                {FEATURED_GROUPS.slice(1, 3).map((group) => (
                  <GroupDetail key={group.id} groupId={group.id} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Aggregate"
            title="Groups portfolio"
            description="The aggregate root of the Academic Groups Foundation — statistics, analytics, every group, member, publication, event, resource, discussion, announcement, project, media item, and insight under one roof."
          />
          <div className="mt-8">
            <GroupPortfolioCard portfolio={GROUP_PORTFOLIO} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Group data is illustrative"
            description="All groups, members, publications, events, resources, discussions, announcements, projects, and media items are derived from existing placeholder modules and computed by the pure engine in lib/groups.ts. Members reference canonical researchers by username, the owning institution references canonical institutions by institutionId, and publications and projects reference canonical source records (projects, research, collaboration workspaces) through sourceId + sourceEntity — no external record is duplicated. Live ingestion will connect the engine to module events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
