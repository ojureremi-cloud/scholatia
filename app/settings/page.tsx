import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import { ProfilePreferences } from '@/components/identity';

export default function SettingsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Identity Settings"
          subtitle="Manage privacy, visibility, and profile preferences."
        />
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="Privacy" title="Profile privacy" description="Your profile is currently visible as a public profile. Control visibility across the Scholatia ecosystem.">
            <p className="text-sm leading-6 text-slate-600">
              Public profiles are discoverable by other researchers, institutions, publishers, and funding organisations.
              You can limit what sections are shown and who can contact you.
            </p>
          </SectionCard>
        </div>
        <div className="mt-8">
          <ProfilePreferences />
        </div>
      </Container>
    </PageLayout>
  );
}
