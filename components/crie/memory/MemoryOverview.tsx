import type { MemoryItem } from '@/types/crie';
import { MEMORY_TYPE_IDS } from '@/types/crie';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, ProgressBar, Chip } from '../primitives';
import { formatNumber, formatPercent, memoryTypeLabel } from '../format';
import { MemoryConsolidation } from './MemoryConsolidation';

type MemoryOverviewProps = {
  items: MemoryItem[];
};

export function MemoryOverview({ items }: MemoryOverviewProps) {
  const total = items.length;
  const averageRelevance =
    items.filter((item) => item.relevance !== undefined).reduce((sum, item) => sum + (item.relevance ?? 0), 0) /
    Math.max(1, items.length);
  const byType = MEMORY_TYPE_IDS.map((memoryType) => ({
    memoryType,
    count: items.filter((item) => item.memoryType === memoryType).length,
  })).filter((group) => group.count > 0);

  const stats: CRIEStat[] = [
    { title: 'Memory items', value: formatNumber(total), icon: '🧠' },
    { title: 'Memory types', value: formatNumber(byType.length), icon: '🗂️' },
    { title: 'Avg relevance', value: formatPercent(averageRelevance), icon: '📏' },
    {
      title: 'Expiring',
      value: formatNumber(items.filter((item) => item.expiresAt !== undefined).length),
      icon: '⏳',
    },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <Panel eyebrow="Unified memory" title="Store by type" icon="🧠">
        {byType.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No memory items yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {byType.map((group) => (
              <div key={group.memoryType} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg" aria-hidden="true">🧠</span>
                  <Chip tone="info">{formatNumber(group.count)}</Chip>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{memoryTypeLabel(group.memoryType)}</p>
                <div className="mt-3">
                  <ProgressBar percent={(group.count / Math.max(1, total)) * 100} label={`${memoryTypeLabel(group.memoryType)} share`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <MemoryConsolidation items={items} />
    </Stack>
  );
}
