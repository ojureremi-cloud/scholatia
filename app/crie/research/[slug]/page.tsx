import { notFound } from 'next/navigation';
import { crieEntities, crieSession, crieSessionMessages } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ResearchCrumb } from '@/components/crie';
import { ResearchCanvas, ResearchEntityPanel, ResearchSession, ResearchTimeline } from '@/components/crie/workspace';

export default async function CRIEResearchEntityPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const entity = crieEntities().find((candidate) => candidate.id === slug);
  if (!entity) notFound();
  const session = crieSession();
  const messages = crieSessionMessages();

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ResearchCrumb(), { label: entity.title }]} />
      <CRIEHeader title={entity.title} subtitle={`Research entity — ${entity.kind} · owner ${entity.owner.name ?? entity.owner.username}`} />
      <div className="space-y-10">
        <ResearchTimeline currentStage={entity.model.stage} />
        <ResearchEntityPanel entity={entity} />
        <ResearchCanvas entity={entity} />
        {session ? <ResearchSession session={session} messages={messages} /> : null}
      </div>
    </CRIELayout>
  );
}
