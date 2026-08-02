import React from 'react';
import { formatAttachmentType, formatAttachmentTypeIcon, formatDuration } from './format';
import type { MessageAttachment } from '@/types/messages';

type AttachmentListProps = {
  attachments: MessageAttachment[];
};

function metaOf(attachment: MessageAttachment): string {
  const parts: string[] = [];
  if (attachment.entityId) parts.push(attachment.entityId);
  if (attachment.fileSize) parts.push(`${(attachment.fileSize / 1024 / 1024).toFixed(1)} MB`);
  if (attachment.durationSeconds) parts.push(formatDuration(attachment.durationSeconds));
  return parts.join(' · ');
}

export default function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm"
          title={metaOf(attachment) || undefined}
        >
          <span>{formatAttachmentTypeIcon(attachment.type)}</span>
          <span className="font-medium">{attachment.title}</span>
          <span className="text-slate-400">{formatAttachmentType(attachment.type)}</span>
        </div>
      ))}
    </div>
  );
}
