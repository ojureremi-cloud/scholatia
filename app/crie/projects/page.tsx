import { crieEntities } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ProjectsCrumb } from '@/components/crie';
import { ActiveProjects } from '@/components/crie/workspace';

export default function CRIEProjectsPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ProjectsCrumb()]} />
      <CRIEHeader
        title="Projects"
        subtitle="Active research entities across the platform — your projects and collaborators' work in flight."
      />
      <ActiveProjects entities={crieEntities()} />
    </CRIELayout>
  );
}
