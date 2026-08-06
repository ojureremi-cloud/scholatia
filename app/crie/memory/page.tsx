import { crieMemoryItems } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, MemoryCrumb } from '@/components/crie';
import { MemoryOverview } from '@/components/crie/memory';
import { MemoryList } from '@/components/crie/memory';
import { MemoryRecall } from '@/components/crie/memory';

export default function CRIEMemoryPage() {
  const items = crieMemoryItems();
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[MemoryCrumb()]} />
      <CRIEHeader
        title="Memory"
        subtitle="Unified multi-scale memory — store by type, consolidation pipeline, export, and consent-gated recall."
      />
      <div className="space-y-10">
        <MemoryOverview items={items} />
        <section aria-label="Memory items">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">Memory items</h3>
          <MemoryList items={items} />
        </section>
        <MemoryRecall items={items} />
      </div>
    </CRIELayout>
  );
}
