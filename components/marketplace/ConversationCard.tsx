import React from 'react';
import { formatDate } from './format';
import type { MarketplaceConversation } from '@/types/marketplace';

type ConversationCardProps = {
  conversation: MarketplaceConversation;
};

export default function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{conversation.subject ?? 'Conversation'}</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {conversation.participants.join(' · ')}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {conversation.messages.length} messages
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
        {conversation.messages.slice(-2).map((message) => (
          <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700">{message.from}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        {conversation.orderId ? <span>Order {conversation.orderId}</span> : <span>{conversation.listingId ?? ''}</span>}
        <span>Active {formatDate(conversation.lastActivityAt)}</span>
      </div>
    </article>
  );
}
