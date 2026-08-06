import { CRIEBreadcrumb, CRIEHeader, CRIELayout, InstitutionsCrumb } from '@/components/crie';
import { InstitutionsAdmin } from '@/components/crie/administration';

export default function CRIEInstitutionsPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[InstitutionsCrumb()]} />
      <CRIEHeader
        title="Institutions"
        subtitle="Enterprise cognitive model and governed institutional knowledge assets (IKOS)."
      />
      <InstitutionsAdmin />
    </CRIELayout>
  );
}
