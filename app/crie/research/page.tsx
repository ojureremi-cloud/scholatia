import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ResearchCrumb } from '@/components/crie';
import { ResearchWorkspace } from '@/components/crie/workspace';

export default function CRIEResearchPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ResearchCrumb()]} />
      <CRIEHeader
        title="Research workspace"
        subtitle="Live cognitive model of your current research entity — lifecycle, questions, hypotheses, aims, and session context."
      />
      <ResearchWorkspace />
    </CRIELayout>
  );
}
