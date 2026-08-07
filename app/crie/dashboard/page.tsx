import { crieAnalytics, crieContextPacks, crieEntities, crieGraph, crieMemoryItems, crieRecommendation, crieSession, crieSessionMessages } from '@/lib/crie/access';
import { indicatorsFromAnalytics, strongestIndicators } from '@/lib/crie/analytics-intelligence';
import { recommendNextStep } from '@/lib/crie/research-recommendations';
import { similarEntities } from '@/lib/crie/graph-reasoning';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, DashboardCrumb } from '@/components/crie';
import { ResearchDashboard } from '@/components/crie/workspace';

export default function CRIEDashboardPage() {
  const entities = crieEntities();
  const graph = crieGraph();
  const entity = entities[0];
  const analyticsList = crieAnalytics();
  const latestAnalytics = analyticsList[analyticsList.length - 1];
  const previousAnalytics = analyticsList.length > 1 ? analyticsList[analyticsList.length - 2] : undefined;
  const kgEntity =
    entity ? graph.entities.find((kg) => kg.attributes?.researchEntityId === entity.id) ?? graph.entities[0] : undefined;
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[DashboardCrumb()]} />
      <CRIEHeader
        title="Dashboard"
        subtitle="Your CRIE research dashboard — active entities, lifecycle, sessions, context, and the next best action."
      />
      <ResearchDashboard
        entities={entities}
        graph={graph}
        memoryItems={crieMemoryItems()}
        session={crieSession()}
        sessionMessages={crieSessionMessages()}
        context={crieContextPacks()}
        recommendation={crieRecommendation()}
        intelligence={{
          indicators: latestAnalytics ? strongestIndicators(indicatorsFromAnalytics(latestAnalytics, previousAnalytics), 5) : [],
          nextRecommendation: entity ? recommendNextStep(entity) : undefined,
          similarEntities: kgEntity ? similarEntities(graph, kgEntity.crieId, 4) : [],
        }}
      />
    </CRIELayout>
  );
}
