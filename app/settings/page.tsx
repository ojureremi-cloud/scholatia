import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function SettingsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Identity Settings"
          subtitle="Manage privacy, visibility, and profile preferences."
        />
      </Container>
    </PageLayout>
  );
}
