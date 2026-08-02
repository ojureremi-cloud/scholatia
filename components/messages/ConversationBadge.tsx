import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatConversationType, typeVariant } from './format';
import type { ConversationType } from '@/types/messages';

type ConversationBadgeProps = {
  type: ConversationType;
};

export default function ConversationBadge({ type }: ConversationBadgeProps) {
  return <Badge variant={typeVariant(type)}>{formatConversationType(type)}</Badge>;
}
