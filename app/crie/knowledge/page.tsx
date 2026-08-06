import { crieGraph } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, KnowledgeCrumb } from '@/components/crie';
import { KnowledgeGraphOverview } from '@/components/crie/knowledge';
import { EntityList } from '@/components/crie/knowledge';

export default function CRIEKnowledgePage() {
  const graph = crieGraph();
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[KnowledgeCrumb()]} />
      <CRIEHeader
        title="Knowledge"
        subtitle="The Research Knowledge Graph — entity classes, confidence, and the full catalogue of typed nodes."
      />
      <div className="space-y-10">
        <KnowledgeGraphOverview graph={graph} />
        <section aria-label="Entity catalogue">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">Entity catalogue</h3>
          <EntityList entities={graph.entities} />
        </section>
      </div>
    </CRIELayout>
  );
}
