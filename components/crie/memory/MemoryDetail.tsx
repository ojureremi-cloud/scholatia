import type { MemoryItem } from '@/types/crie';
import { Panel, Stack, Chip, ConfidenceMeter, ListItem } from '../primitives';
import { confidenceTone, formatDateTime, formatRelative, memoryTypeLabel } from '../format';

type MemoryDetailProps = {
  item: MemoryItem;
};

export function MemoryDetail({ item }: MemoryDetailProps) {
  return (
    <Stack>
      <Panel eyebrow="Memory item" title={memoryTypeLabel(item.memoryType)} icon="🧠">
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{item.content}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip tone="info">{item.memoryType}</Chip>
          <Chip>{item.accessPolicy}</Chip>
          {item.relevance !== undefined ? (
            <Chip tone={confidenceTone({ value: item.relevance, band: 'medium' })}>{Math.round(item.relevance * 100)}% relevance</Chip>
          ) : null}
        </div>
        {item.relevance !== undefined ? (
          <div className="mt-5 max-w-md">
            <ConfidenceMeter
              confidence={{ value: item.relevance, band: item.relevance >= 0.8 ? 'very-high' : item.relevance >= 0.6 ? 'high' : item.relevance >= 0.4 ? 'medium' : 'low' }}
            />
          </div>
        ) : null}
      </Panel>

      <Panel eyebrow="Memory item" title="Provenance" icon="🧾">
        <ul className="space-y-2">
          <ListItem label="Record ID" value={item.id} />
          <ListItem label="Owner" value={item.owner.name ?? item.owner.username} />
          <ListItem label="Created" value={formatDateTime(item.createdAt)} />
          <ListItem label="Updated" value={formatRelative(item.updatedAt)} />
          <ListItem label="Version" value={String(item.version)} />
          {item.expiresAt ? <ListItem label="Expires" value={formatDateTime(item.expiresAt)} /> : null}
        </ul>
      </Panel>

      <Panel eyebrow="Memory item" title="Source" icon="🗂️">
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Source type</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{item.provenance.sourceType}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Source ID</dt>
            <dd className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">{item.provenance.sourceId}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Method</dt>
            <dd className="font-semibold text-slate-900 dark:text-slate-100">{item.provenance.method}</dd>
          </div>
        </dl>
      </Panel>
    </Stack>
  );
}
