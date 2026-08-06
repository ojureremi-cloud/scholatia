import { CRIEBreadcrumb, CRIEHeader, CRIELayout, TrustCrumb } from '@/components/crie';
import { TrustCentre } from '@/components/crie/administration';

export default function CRIETrustPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[TrustCrumb()]} />
      <CRIEHeader
        title="Trust"
        subtitle="Propagated trust scores over the knowledge graph with calibrated confidence."
      />
      <TrustCentre />
    </CRIELayout>
  );
}
