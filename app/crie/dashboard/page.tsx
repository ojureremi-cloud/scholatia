import { CRIEBreadcrumb, CRIEHeader, CRIELayout, DashboardCrumb } from '@/components/crie';
import { ResearchDashboard } from '@/components/crie/workspace';

export default function CRIEDashboardPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[DashboardCrumb()]} />
      <CRIEHeader
        title="Dashboard"
        subtitle="Your CRIE research dashboard — active entities, lifecycle, sessions, context, and the next best action."
      />
      <ResearchDashboard />
    </CRIELayout>
  );
}
