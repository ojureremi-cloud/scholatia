import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  WorkflowAnalytics,
  WorkflowBrowser,
  WorkflowInsights,
  WorkflowPortfolioCard,
  WorkflowStatistics,
  WorkflowTemplates,
  WorkflowTimeline,
} from '@/components/workflows';
import {
  WORKFLOW_ANALYTICS,
  WORKFLOW_INSIGHTS,
  WORKFLOW_PORTFOLIO,
  WORKFLOW_STATISTICS,
  WORKFLOW_TEMPLATES,
} from '@/constants/placeholder-workflows';

export default function WorkflowsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholarly Workflow Orchestration"
          subtitle="The generic, template-driven workflow engine of SWTROP — every thesis, journal submission, conference submission, grant, ethics review, consultancy, institutional approval, and marketplace delivery is an instance of a template. Templates are data, never code: a template defines stages, roles, deadlines, milestones, and transitions; an instance is a typed aggregate with an append-only audit trail. The pure engine in lib/workflows.ts computes progress, deadlines, milestones, and derived intelligence — this is not a task manager, and it will be consumed by SAES, Thesis Supervision, Journal Editorial, Conference, Grants, Marketplace, and Services in later phases."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/tasks">
                Tasks
              </Button>
              <Button variant="secondary" size="sm" href="/reviews">
                Reviews & Approvals
              </Button>
              <Button variant="outline" size="sm" href="/workbench">
                Workbench
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Workflow statistics"
            description="Headline signals across the workflow graph — total workflows, active and completed instances, stages completed, and overall progress, computed by the pure engine."
          />
          <div className="mt-8">
            <WorkflowStatistics statistics={WORKFLOW_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Workflow analytics"
            description="Progress distribution by kind and status, deadline health, and completion rates — all derived by the engine from the typed workflow aggregate."
          />
          <div className="mt-8">
            <WorkflowAnalytics analytics={WORKFLOW_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Workflow centre"
            description="Search every workflow, filter by kind and status, sort by recency, name, status, priority, or progress, and open the full instance view."
          />
          <div className="mt-8">
            <WorkflowBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Templates"
            title="Workflow templates"
            description="Twelve canonical templates — undergraduate project, masters dissertation, PhD thesis, journal submission, conference submission, book publishing, grant proposal, ethics review, consultancy project, institutional approval, marketplace delivery, and service delivery. Templates define the shape; instances carry the state."
          />
          <div className="mt-8">
            <WorkflowTemplates templates={WORKFLOW_TEMPLATES} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Insights"
            title="Workflow intelligence"
            description="Derived insights over the workflow graph — kinds with the largest pipelines, status bottlenecks, and workflows that need attention."
          />
          <div className="mt-8">
            <WorkflowInsights insights={WORKFLOW_INSIGHTS.slice(0, 4)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Sequence"
            title="Portfolio audit trail"
            description="The append-only workflow log across the portfolio — every transition, revision, and decision references its workflow by ID."
          />
          <div className="mt-8">
            <WorkflowTimeline log={WORKFLOW_PORTFOLIO.log.slice(0, 8)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Aggregate"
            title="Workflow portfolio"
            description="The aggregate root of the workflow engine — statistics, analytics, templates, every instance, deadlines, milestones, and log entries under one roof. Featured workflows below."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW_PORTFOLIO.featured.slice(0, 3).map((workflow) => (
              <WorkflowPortfolioCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Workflow data is illustrative"
            description="All templates, instances, stages, deadlines, milestones, and log entries are placeholder data computed by the pure engine in lib/workflows.ts. Workflows reference canonical source records (theses, journals, conferences, grants, ethics, services, marketplace listings) through sourceId + sourceEntity without duplicating them, and the thesis workflow carries the canonical research lifecycle stage ID. Live ingestion will connect the engine to module events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
