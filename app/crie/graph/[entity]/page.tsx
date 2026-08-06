import { notFound } from 'next/navigation';
import { crieGraph } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, GraphCrumb } from '@/components/crie';
import { EntityDetail, EntitySources, EntityTimeline } from '@/components/crie/knowledge';
import { kgEntityLabel } from '@/components/crie/format';

export default async function CRIEGraphEntityPage(props: { params: Promise<{ entity: string }> }) {
  const { entity: entityId } = await props.params;
  const graph = crieGraph();
  const entity = graph.entities.find((candidate) => candidate.crieId === entityId);
  if (!entity) notFound();

  const relations = graph.relations.filter(
    (relation) => relation.subject.crieId === entityId || relation.object.crieId === entityId,
  );

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[GraphCrumb(), { label: kgEntityLabel(entity) }]} />
      <CRIEHeader title={kgEntityLabel(entity)} subtitle={`Knowledge entity · ${entity.crieId} · ${entity.entityClass}`} />
      <div className="space-y-10">
        <EntityDetail entity={entity} relations={relations} />
        <EntityTimeline entities={graph.entities} />
        <EntitySources entities={graph.entities} />
      </div>
    </CRIELayout>
  );
}
