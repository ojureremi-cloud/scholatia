import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { GroupDetail } from '@/components/groups';
import { GROUPS } from '@/constants/placeholder-groups';

type GroupDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = await params;
  const group = GROUPS.find((entry) => entry.slug === id);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title={group ? group.name : 'Group'}
          subtitle={group ? `${group.institution} · ${group.country} · ${group.discipline}` : `Group ${id}`}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/groups">
                All groups
              </Button>
              <Button variant="outline" size="sm" href="/groups/create">
                Create group
              </Button>
            </div>
          }
        />

        {group ? (
          <div className="mt-10">
            <GroupDetail groupId={group.id} />
          </div>
        ) : (
          <div className="mt-10">
            <Alert variant="danger" title="Group not found" description={`No group exists with the slug ${id}.`} />
          </div>
        )}
      </Container>
    </PageLayout>
  );
}
