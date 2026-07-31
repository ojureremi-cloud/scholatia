import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Badge from '@/components/ui/Badge';
import { OrcidStatusCard } from '@/components/identity';
import { PLACEHOLDER_ORCID } from '@/constants/placeholder-profile';

export default function OrcidPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="ORCID"
          subtitle="Link and manage your ORCID identifier to ensure your research is uniquely attributed."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <OrcidStatusCard {...PLACEHOLDER_ORCID} />
          <SectionCard eyebrow="Permissions" title="Trusted organisation" description="Scholatia is registered as a trusted organisation with read/write access to your ORCID record.">
            <ul className="space-y-2">
              {PLACEHOLDER_ORCID.permissions.map((permission) => (
                <li key={permission} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">✓</span>
                  {permission}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Badge variant="success">Read / Write access granted</Badge>
            </div>
          </SectionCard>
        </div>
        <div className="mt-8">
          <SectionCard
            eyebrow="About ORCID"
            title="What is ORCID?"
            description="Why a persistent identifier matters for your research."
          >
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">A unique identifier</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  ORCID provides a persistent digital identifier that distinguishes you from every other researcher with a similar name.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Links your work</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your publications, affiliations, and peer review activity remain connected to you even if you change institutions.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Frictionless sharing</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Journals, funders, and universities recognise your ORCID, reducing repeated form-filling and misattribution.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
