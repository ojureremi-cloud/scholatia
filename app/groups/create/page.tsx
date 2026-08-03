import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { GroupForm } from '@/components/groups';

export default function CreateGroupPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Create a group"
          subtitle="Start a new scholarly community on the Academic Groups Platform — a research group, department, faculty, institution, conference working group, journal editorial group, grant team, laboratory, project team, interest group, or professional network. The new group is owned by the signed-in researcher and seeded with the canonical visibility and verification defaults."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/groups">
                All groups
              </Button>
            </div>
          }
        />

        <div className="mt-10">
          <GroupForm />
        </div>
      </Container>
    </PageLayout>
  );
}
