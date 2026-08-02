import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatMessageStatus, formatMessageType, messageStatusVariant } from './format';
import type { MessageStatus, MessageType } from '@/types/messages';

type MessageBadgeProps = {
  type?: MessageType;
  status: MessageStatus;
};

export default function MessageBadge({ type, status }: MessageBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {type ? <Badge variant="default">{formatMessageType(type)}</Badge> : null}
      <Badge variant={messageStatusVariant(status)}>{formatMessageStatus(status)}</Badge>
    </div>
  );
}
