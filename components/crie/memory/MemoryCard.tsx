import type { MemoryItem } from '@/types/crie';
import { Chip, ConfidenceMeter } from '../primitives';
import { formatRelative, memoryTypeLabel } from '../format';

type MemoryCardProps = {
  item: MemoryItem;
};

export function MemoryCard({ item }: MemoryCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <Chip tone="info" icon="🧠">{memoryTypeLabel(item.memoryType)}</Chip>
        {item.relevance !== undefined ? <Chip tone="warning">{Math.round(item.relevance * 100)}% rel</Chip> : null}
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.content}</p>
      <div className="mt-4 space-y-3">
        {item.relevance !== undefined ? (
          <ConfidenceMeter confidence={{ value: item.relevance, band: item.relevance >= 0.8 ? 'very-high' : item.relevance >= 0.6 ? 'high' : 'medium' }} showLabel={false} />
        ) : null}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>{item.id}</span>
          <span>{formatRelative(item.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
