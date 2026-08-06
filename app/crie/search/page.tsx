import { crieGraph } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, CRIESearchExplorer } from '@/components/crie';

export default function CRIESearchPage() {
  const graph = crieGraph();
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[{ label: 'Search' }]} />
      <CRIEHeader
        title="Search"
        subtitle="Retrieve and rank over the Research Knowledge Graph — token overlap, calibrated confidence, and freshness."
      />
      <CRIESearchExplorer graph={graph} />
    </CRIELayout>
  );
}
