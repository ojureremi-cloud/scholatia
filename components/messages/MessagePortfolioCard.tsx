import React from 'react';
import { formatNumber } from './format';
import type { MessagePortfolio } from '@/types/messages';

type MessagePortfolioCardProps = {
  portfolio: MessagePortfolio;
};

export default function MessagePortfolioCard({ portfolio }: MessagePortfolioCardProps) {
  const { statistics, conversations, messages } = portfolio;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Messaging portfolio</p>
      <p className="mt-1 text-sm text-slate-500">
        The aggregate root of the Messaging Platform — every conversation references a canonical record and every
        message carries structured attachments, mentions, reactions, and read state.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Conversations</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalConversations)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Messages</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalMessages)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Unread</dt>
          <dd className="mt-1 text-2xl font-semibold text-rose-600">{formatNumber(statistics.totalUnread)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Attachments</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalAttachments)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Reactions</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalReactions)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Mentions</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalMentions)}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">By type</p>
          <ul className="mt-2 space-y-1">
            {statistics.byType.slice(0, 6).map((stat) => (
              <li key={stat.type} className="flex items-center justify-between text-sm text-slate-600">
                <span className="capitalize">{stat.type}</span>
                <span className="font-medium text-slate-900">
                  {stat.count} <span className="text-xs text-slate-400">({stat.unread} unread)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live typing</p>
          <ul className="mt-2 space-y-1">
            {portfolio.typing.map((entry) => (
              <li key={entry.participantId} className="text-sm text-slate-600">
                {entry.participantName} is typing in {conversations.find((c) => c.id === entry.conversationId)?.title ?? entry.conversationId}
              </li>
            ))}
            {portfolio.typing.length === 0 ? <li className="text-sm text-slate-400">No one is typing right now.</li> : null}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{messages.length} messages across {conversations.length} conversations.</p>
    </div>
  );
}
