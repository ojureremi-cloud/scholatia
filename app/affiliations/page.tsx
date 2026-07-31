import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Badge from '@/components/ui/Badge';
import { PLACEHOLDER_AFFILIATIONS } from '@/constants/placeholder-profile';

export default function AffiliationsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Affiliations"
          subtitle="Institutional, organisational, and professional memberships."
        />
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="Current affiliation" title="Primary institution" description="Your verified current academic affiliation.">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{PLACEHOLDER_AFFILIATIONS.current.type}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{PLACEHOLDER_AFFILIATIONS.current.institution}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {PLACEHOLDER_AFFILIATIONS.current.role} • {PLACEHOLDER_AFFILIATIONS.current.department}
              </p>
              <div className="mt-3">
                <Badge variant="success">Affiliation verified</Badge>
              </div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="Memberships" title="Professional memberships" description="Associations and networks you belong to.">
            <div className="space-y-3">
              {PLACEHOLDER_AFFILIATIONS.memberships.map((membership) => (
                <div
                  key={membership.name}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{membership.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{membership.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">{membership.type}</Badge>
                    <Badge variant="default">Since {membership.since}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="mt-8 max-w-3xl">
          <SectionCard eyebrow="History" title="Institutional history" description="Previous institutions and roles you have held.">
            <div className="space-y-3">
              {PLACEHOLDER_AFFILIATIONS.institutionHistory.map((entry) => (
                <div key={`${entry.institution}-${entry.period}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{entry.institution}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.role}</p>
                  <p className="mt-1 text-sm text-slate-500">{entry.period}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
