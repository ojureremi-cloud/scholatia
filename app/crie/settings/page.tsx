import { CRIEBreadcrumb, CRIEHeader, CRIELayout } from '@/components/crie';
import { SettingsOverview } from '@/components/crie/administration';
import { PolicyCentre } from '@/components/crie/administration';
import { EthicsReviewPanel } from '@/components/crie/administration';

export default function CRIESettingsPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[{ label: 'Admin' }]} />
      <CRIEHeader
        title="Administration"
        subtitle="Governance surface for CRIE — policy, research-ethics review, trust, institutions, and federation."
      />
      <div className="space-y-10">
        <SettingsOverview />
        <PolicyCentre />
        <EthicsReviewPanel />
      </div>
    </CRIELayout>
  );
}
