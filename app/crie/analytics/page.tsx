import { CRIEBreadcrumb, CRIEHeader, CRIELayout, AnalyticsCrumb } from '@/components/crie';
import { AnalyticsOverview } from '@/components/crie/analytics';
import { ProductivityAnalytics } from '@/components/crie/analytics';
import { ImpactAnalytics } from '@/components/crie/analytics';
import { CollaborationAnalytics } from '@/components/crie/analytics';

export default function CRIEAnalyticsPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[AnalyticsCrumb()]} />
      <CRIEHeader
        title="Analytics"
        subtitle="Derived research-health indicators across researcher, institution, enterprise, and global scopes — cached, never authoritative."
      />
      <div className="space-y-10">
        <AnalyticsOverview />
        <ProductivityAnalytics />
        <ImpactAnalytics />
        <CollaborationAnalytics />
      </div>
    </CRIELayout>
  );
}
