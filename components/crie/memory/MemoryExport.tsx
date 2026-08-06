import type { MemoryItem } from '@/types/crie';
import { MEMORY_TYPE_IDS } from '@/types/crie';
import { Panel, Chip } from '../primitives';
import { formatDateTime, formatNumber, memoryTypeLabel } from '../format';

type MemoryExportProps = {
  items: MemoryItem[];
};

export function MemoryExport({ items }: MemoryExportProps) {
  const total = items.length;
  const byType = MEMORY_TYPE_IDS.map((memoryType) => ({
    memoryType,
    count: items.filter((item) => item.memoryType === memoryType).length,
  })).filter((group) => group.count > 0);

  return (
    <Panel eyebrow="Unified memory" title="Export & retention" icon="📤">
      {byType.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">Nothing to export yet.</p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2">
            {byType.map((group) => (
              <li key={group.memoryType} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{memoryTypeLabel(group.memoryType)}</span>
                <div className="flex items-center gap-2">
                  <Chip tone="info">{formatNumber(group.count)} items</Chip>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-5 text-slate-400">
            Portability: the researcher can export any memory type on demand (right-to-be-forgotten compliant).
            Retention policies apply via <code className="font-mono">expiresAt</code> on {formatNumber(items.filter((item) => item.expiresAt !== undefined).length)} item(s); soft-delete only — hard deletes are prohibited.
          </p>
          <p className="text-xs text-slate-400">Last computed {formatDateTime(new Date().toISOString())} · {formatNumber(total)} items across {formatNumber(byType.length)} types.</p>
        </div>
      )}
    </Panel>
  );
}
