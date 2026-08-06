import { crieClaims, crieEntities, crieEvidence, crieRecommendation, crieSession } from '@/lib/crie/access';
import { crieReasoningModel } from '@/components/crie/data';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ReasoningCrumb } from '@/components/crie';
import { ReasoningOverview } from '@/components/crie/reasoning';
import { ReasoningTraceList } from '@/components/crie/reasoning';
import { ReasoningConclusions } from '@/components/crie/reasoning';

export default function CRIEReasoningPage() {
  const entity = crieEntities()[0];
  const session = crieSession();
  if (!entity || !session) return null;
  const model = crieReasoningModel({
    entity,
    session,
    evidenceRecords: crieEvidence(),
    recommendation: crieRecommendation(),
    claims: crieClaims(),
  });
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ReasoningCrumb()]} />
      <CRIEHeader
        title="Reasoning"
        subtitle="Multi-paradigm reasoning traces — fully explainable steps from premises to evidence-bound conclusions."
      />
      <div className="space-y-10">
        <ReasoningOverview traces={model.traces} />
        <ReasoningTraceList traces={model.traces} />
        <ReasoningConclusions traces={model.traces} />
      </div>
    </CRIELayout>
  );
}
