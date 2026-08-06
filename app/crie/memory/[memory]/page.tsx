import { notFound } from 'next/navigation';
import { crieMemoryItem } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, MemoryCrumb } from '@/components/crie';
import { MemoryDetail } from '@/components/crie/memory';
import { memoryTypeLabel } from '@/components/crie/format';

export default async function CRIEMemoryDetailPage(props: { params: Promise<{ memory: string }> }) {
  const { memory: memoryId } = await props.params;
  const item = crieMemoryItem(memoryId);
  if (!item) notFound();

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[MemoryCrumb(), { label: memoryTypeLabel(item.memoryType) }]} />
      <CRIEHeader title={memoryTypeLabel(item.memoryType)} subtitle={`Memory item · ${item.id} · ${item.accessPolicy}`} />
      <MemoryDetail item={item} />
    </CRIELayout>
  );
}
