import { CRIEBreadcrumb, CRIEHeader, CRIELayout, FederationCrumb } from '@/components/crie';
import { FederationAdmin } from '@/components/crie/administration';

export default function CRIEFederationPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[FederationCrumb()]} />
      <CRIEHeader
        title="Federation"
        subtitle="Governed federation contracts, exchanges, and member sovereignty boundaries."
      />
      <FederationAdmin />
    </CRIELayout>
  );
}
