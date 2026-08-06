import { notFound } from 'next/navigation';
import { crieEntities } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ProjectsCrumb } from '@/components/crie';
import { ResearchEntityPanel, ResearchTimeline } from '@/components/crie/workspace';

export default async function CRIEProjectDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const entity = crieEntities().find((candidate) => candidate.id === slug);
  if (!entity) notFound();

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ProjectsCrumb(), { label: entity.title }]} />
      <CRIEHeader title={entity.title} subtitle={`Project — ${entity.kind} · ${entity.model.stage}`} />
      <div className="space-y-10">
        <ResearchTimeline currentStage={entity.model.stage} />
        <ResearchEntityPanel entity={entity} />
      </div>
    </CRIELayout>
  );
}
