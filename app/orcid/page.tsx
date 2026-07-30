import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OrcidPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="ORCID"
          subtitle="Link and manage your ORCID identifier to ensure your research is uniquely attributed."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Linked ORCID</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">0000-0002-1825-0097</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Your ORCID is connected to your Scholatia identity. Publications, peer review activities, and affiliations linked to this ORCID will appear on your profile.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" href="https://orcid.org/0000-0002-1825-0097">View ORCID record</Button>
            </div>
          </Card>
          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Permissions</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">Trusted organisation</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Scholatia has read/write access to your ORCID record. This allows automatic synchronisation of your publications, affiliations, and peer review activities.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">• Read your ORCID record</li>
              <li className="flex items-center gap-2">• Add/update publications</li>
              <li className="flex items-center gap-2">• Add/update affiliations</li>
              <li className="flex items-center gap-2">• Add/update peer review activities</li>
            </ul>
          </Card>
        </div>
      </Container>
    </PageLayout>
  );
}
