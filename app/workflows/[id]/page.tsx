import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { WorkflowDetail } from '@/components/workflows';
import { WORKFLOW_INSTANCES } from '@/constants/placeholder-workflows';

type WorkflowDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const { id } = await params;
  const workflow = WORKFLOW_INSTANCES.find((instance) => instance.id === id);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Workflow instance"
          subtitle={workflow ? workflow.title : `Workflow ${id}`}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/workflows">
                All workflows
              </Button>
              <Button variant="outline" size="sm" href="/workbench">
                Workbench
              </Button>
            </div>
          }
        />

        {workflow ? (
          <div className="mt-10">
            <WorkflowDetail workflowId={workflow.id} />
          </div>
        ) : (
          <div className="mt-10">
            <Alert variant="danger" title="Workflow not found" description={`No workflow instance exists with the ID ${id}.`} />
          </div>
        )}
      </Container>
    </PageLayout>
  );
}
