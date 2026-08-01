import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import SectionCard from '@/components/ui/SectionCard';
import Button from '@/components/ui/Button';

type ResearchProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResearchProjectDetailPage({ params }: ResearchProjectDetailPageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research Project"
          subtitle={`Project workspace for ${id}.`}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="warning">Under Development</Badge>
              <Button variant="outline" size="sm" href="/research">
                Back to Research
              </Button>
            </div>
          }
        />
        <Alert
          variant="info"
          title="Coming Soon"
          description={`Detailed project views for ${id} are architecture-ready placeholders. Project timelines, team, funding, and outputs will be implemented as part of the Scholatia research lifecycle in Phase 1.0.`}
        />
        <div className="mt-10">
          <SectionCard eyebrow="Scope" title="What the project workspace will include" description="A unified view of a single research project across the full lifecycle.">
            <ul className="grid gap-3 sm:grid-cols-2">
              {['Project overview and metadata', 'Team and collaborator management', 'Funding and grant tracking', 'Timeline, milestones, and deliverables', 'Linked publications and datasets', 'Research pipeline and status updates'].map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
