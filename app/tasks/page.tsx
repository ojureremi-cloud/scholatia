import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import { TaskAnalytics, TaskBoard, TaskBrowser, TaskCard, TaskStatistics } from '@/components/tasks';
import { DEFAULT_TASK, TASK_ANALYTICS, TASK_BOARD, TASK_STATISTICS } from '@/constants/placeholder-tasks';

export default function TasksPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Task Orchestration"
          subtitle="The task engine of SWTROP — every actionable unit of work, computed by the pure engine in lib/tasks.ts. Tasks attach to workflows by workflowId (and to source records by sourceId + sourceEntity) without ever duplicating them, carry assignments, comments, and an append-only history, and are aggregated into statistics, analytics, and a kanban board. The workflow engine remains the source of truth for stages and transitions; tasks are the execution surface on top."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/workflows">
                Workflows
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
            title="Task statistics"
            description="Headline signals across the task graph — total tasks, open and completed counts, completion rate, and the overdue backlog."
          />
          <div className="mt-8">
            <TaskStatistics statistics={TASK_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Derived intelligence"
            title="Task analytics"
            description="Seven-day creation and completion trend, assignee workloads, and task-health signals derived by the engine."
          />
          <div className="mt-8">
            <TaskAnalytics analytics={TASK_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Browse"
            title="Task centre"
            description="Search every task, filter by status and priority, sort by recency, title, due date, or priority, and inspect each unit of work."
          />
          <div className="mt-8">
            <TaskBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Board"
            title="Kanban board"
            description="Tasks laid out by status across the full lifecycle — todo, in progress, in review, done, and blocked."
          />
          <div className="mt-8">
            <TaskBoard columns={TASK_BOARD} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title="A canonical task"
            description="The canonical task aggregate — assignment, progress, comments, and append-only history."
          />
          <div className="mt-8 max-w-md">
            <TaskCard task={DEFAULT_TASK} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Task data is illustrative"
            description="All tasks, assignments, comments, and history entries are placeholder data computed by the pure engine in lib/tasks.ts. Tasks reference workflows and canonical source records through IDs only — no external record is duplicated. Live ingestion will connect the engine to workflow events in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
