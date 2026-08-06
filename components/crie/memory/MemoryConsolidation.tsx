import type { MemoryItem, MemoryTypeId } from '@/types/crie';
import { Panel, Chip } from '../primitives';
import { formatNumber, memoryTypeLabel } from '../format';

type MemoryConsolidationProps = {
  items: MemoryItem[];
};

type PipelineStage = {
  fromType: MemoryTypeId;
  toType: MemoryTypeId;
  rule: string;
};

const PIPELINE: PipelineStage[] = [
  { fromType: 'short-term', toType: 'episodic', rule: 'Session roll-forward at consolidation checkpoints' },
  { fromType: 'episodic', toType: 'semantic', rule: 'Pattern extraction across repeated experiences' },
  { fromType: 'semantic', toType: 'long-term', rule: 'Generalised knowledge committed to persistent store' },
  { fromType: 'research', toType: 'long-term', rule: 'Project memory folded into researcher store on completion' },
];

export function MemoryConsolidation({ items }: MemoryConsolidationProps) {
  const countFor = (type: string) => items.filter((item) => item.memoryType === type).length;

  return (
    <Panel eyebrow="Unified memory" title="Consolidation pipeline" icon="♻️">
      <ol className="space-y-4">
        {PIPELINE.map((stage) => (
          <li key={`${stage.fromType}-${stage.toType}`} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Chip tone="info">{memoryTypeLabel(stage.fromType)}</Chip>
              <span aria-hidden="true">→</span>
              <Chip tone="success">{memoryTypeLabel(stage.toType)}</Chip>
              <span className="ml-auto text-xs text-slate-400">{formatNumber(countFor(stage.fromType))} items flowing</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{stage.rule}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
