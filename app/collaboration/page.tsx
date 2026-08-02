import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  WorkspaceAnalytics,
  WorkspaceBrowser,
  WorkspaceDetail,
  WorkspaceInsights,
  WorkspacePortfolioCard,
  WorkspaceStatistics,
  WorkspaceTimeline,
} from '@/components/collaboration';
import {
  COLLABORATION_ANALYTICS,
  COLLABORATION_PORTFOLIO,
  COLLABORATION_STATISTICS,
  DEFAULT_WORKSPACE,
  FEATURED_WORKSPACES,
  INSIGHTS,
} from '@/constants/placeholder-collaboration';

export default function CollaborationPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Collaboration Workspace Platform"
          subtitle="The shared, role-governed place where research happens together — research groups, labs, project workspaces, institution spaces, conference spaces, journal spaces, and communities. Every workspace is an aggregate of members, tasks, documents, meetings, milestones, discussions, invitations, and an append-only activity log, computed by the pure engine in lib/collaboration.ts. This is not messaging and not the notification engine: it is the working surface both can attach to."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/messages">
                Messages
              </Button>
              <Button variant="secondary" size="sm" href="/activity">
                Activity
              </Button>
              <Button variant="outline" size="sm" href="/notifications">
                Notifications
              </Button>
              <Button variant="outline" size="sm" href="/collaborators">
                Collaborators
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Workspace statistics"
            description="Headline signals across the collaboration graph: workspaces, members, tasks, documents, and meetings — computed by the pure engine from the typed workspace aggregate."
          />
          <div className="mt-8">
            <WorkspaceStatistics statistics={COLLABORATION_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Workspace analytics"
            description="Completion rates, overdue tasks, upcoming meetings, priority distribution, and the daily activity curve across the workspace graph — all derived by the engine."
          />
          <div className="mt-8">
            <WorkspaceAnalytics analytics={COLLABORATION_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Workspace centre"
            description="Search every workspace, filter by kind, visibility, and status, sort by recency, membership, task volume, or progress, and explore the shared surface of each space."
          />
          <div className="mt-8">
            <WorkspaceBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title="Inside a workspace"
            description="The canonical workspace aggregate — members with roles, tasks, documents, meetings, milestones aligned to the research lifecycle, discussions, and invitations, all under one roof."
          />
          <div className="mt-8">
            <WorkspaceDetail workspace={DEFAULT_WORKSPACE} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Insights"
            title="Collaboration intelligence"
            description="Derived AI insights over the workspace graph — active clusters, leading kinds, overdue backlogs, and spotlight workspaces."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <WorkspaceInsights insights={INSIGHTS.slice(0, 4)} />
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-6 sm:grid-cols-2">
                {FEATURED_WORKSPACES.slice(0, 2).map((workspace) => (
                  <WorkspaceDetail key={workspace.id} workspace={workspace} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Sequence"
            title="Workspace activity timeline"
            description="The append-only workspace log in chronological order — every event references its workspace by ID and never duplicates a source record."
          />
          <div className="mt-8">
            <WorkspaceTimeline log={COLLABORATION_PORTFOLIO.log.slice(0, 8)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Aggregate"
            title="Collaboration portfolio"
            description="The aggregate root of the workspace platform — statistics, analytics, every workspace, member, task, document, meeting, milestone, discussion, invitation, and log entry under one roof."
          />
          <div className="mt-8">
            <WorkspacePortfolioCard portfolio={COLLABORATION_PORTFOLIO} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Workspace data is illustrative"
            description="All workspaces, members, tasks, documents, meetings, milestones, discussions, invitations, and activity log entries are derived from existing placeholder modules and computed by the pure engine in lib/collaboration.ts. Members reference canonical researchers by username, milestones carry the canonical research lifecycle stage ID, and workspaces reference canonical source records (projects, institutions, conferences, journals, grants) through sourceId + sourceEntity — no external record is duplicated. Live ingestion will connect the engine to module events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
