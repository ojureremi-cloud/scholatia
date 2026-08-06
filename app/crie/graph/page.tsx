import { crieGraph } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, GraphCrumb } from '@/components/crie';
import { GraphView } from '@/components/crie/knowledge';

export default function CRIEGraphPage() {
  const graph = crieGraph();
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[GraphCrumb()]} />
      <CRIEHeader
        title="Graph"
        subtitle="Visual view of the Research Knowledge Graph — nodes by entity class and typed semantic relations."
      />
      <GraphView graph={graph} />
    </CRIELayout>
  );
}
