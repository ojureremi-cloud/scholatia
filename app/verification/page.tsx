import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import VerificationBadge from '@/components/ui/VerificationBadge';
import TrustBadge from '@/components/ui/TrustBadge';
import { VerificationChecklist } from '@/components/identity';
import { VerificationLevel } from '@/types/identity';
import { PLACEHOLDER_VERIFICATION_ITEMS } from '@/constants/placeholder-profile';

export default function VerificationPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Verification"
          subtitle="Manage identity verification, badges, and trust signals."
        />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <VerificationBadge level={VerificationLevel.ORCIDLinked} />
          <TrustBadge score={85} />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard eyebrow="Checklist" title="Verification checklist" description="Track the status of each verification step on your academic identity.">
              <VerificationChecklist items={PLACEHOLDER_VERIFICATION_ITEMS} />
            </SectionCard>
          </div>
          <div className="space-y-8">
            <Alert
              variant="info"
              title="Why verification matters"
              description="Verified details help other researchers, institutions, and publishers trust your academic identity and distinguish your work from others."
            />
            <SectionCard eyebrow="Trust" title="Trust summary" description="Combined signals that make up your trust score.">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Verification score</span>
                  <span className="font-semibold text-slate-900">80</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Identity confidence</span>
                  <span className="font-semibold text-slate-900">90</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Institution confidence</span>
                  <span className="font-semibold text-slate-900">85</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Publication confidence</span>
                  <span className="font-semibold text-slate-900">80</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
