import { crieContextPacks, crieEntities, crieGraph, crieMemoryItems, crieRecommendation, crieSession, crieSessionMessages } from '@/lib/crie/access';
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
      <ResearchDashboard
        entities={crieEntities()}
        graph={crieGraph()}
        memoryItems={crieMemoryItems()}
        session={crieSession()}
        sessionMessages={crieSessionMessages()}
        context={crieContextPacks()}
        recommendation={crieRecommendation()}
      />
    </CRIELayout>
  );
}
