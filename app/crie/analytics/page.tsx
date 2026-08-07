import { CRIEBreadcrumb, CRIEHeader, CRIELayout, AnalyticsCrumb } from '@/components/crie';
import { AnalyticsOverview, CollaborationAnalytics, ImpactAnalytics, IntelligenceAnalytics, ProductivityAnalytics } from '@/components/crie/analytics';

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
        <IntelligenceAnalytics />
        <ProductivityAnalytics />
        <ImpactAnalytics />
        <CollaborationAnalytics />
      </div>
    </CRIELayout>
  );
}
