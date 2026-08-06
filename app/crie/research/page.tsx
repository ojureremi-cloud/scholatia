import { crieContextElements, crieContextPacks, crieEntities, crieRecommendation, crieSession, crieSessionMessages } from '@/lib/crie/access';
import { crieWorkspaceModel } from '@/components/crie/data';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ResearchCrumb } from '@/components/crie';
import { ResearchWorkspace } from '@/components/crie/workspace';

export default function CRIEResearchPage() {
  const entities = crieEntities();
  const session = crieSession();
  if (!session) {
    return (
      <CRIELayout>
        <CRIEBreadcrumb crumbs={[ResearchCrumb()]} />
        <CRIEHeader
          title="Research workspace"
          subtitle="Live cognitive model of your current research entity — lifecycle, questions, hypotheses, aims, and session context."
        />
        <p className="text-sm text-slate-500 dark:text-slate-400">No research session is active.</p>
      </CRIELayout>
    );
  }

  const model = crieWorkspaceModel({ entities, session, recommendation: crieRecommendation() });
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ResearchCrumb()]} />
      <CRIEHeader
        title="Research workspace"
        subtitle="Live cognitive model of your current research entity — lifecycle, questions, hypotheses, aims, and session context."
      />
      <ResearchWorkspace
        entity={model.current}
        otherEntities={model.otherEntities}
        session={session}
        sessionMessages={crieSessionMessages()}
        initialContext={crieContextPacks()}
        contextElements={crieContextElements()}
      />
    </CRIELayout>
  );
}
