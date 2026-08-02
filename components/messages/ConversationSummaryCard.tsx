import React from 'react';
import Badge from '@/components/ui/Badge';
import ActionItemList from './ActionItemList';
import { formatNumber } from './format';
import type { ConversationSummary } from '@/types/messages';

type ConversationSummaryCardProps = {
  summary: ConversationSummary;
};

export default function ConversationSummaryCard({ summary }: ConversationSummaryCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">AI summary</p>
          <p className="mt-1 font-semibold text-slate-900">{summary.title}</p>
        </div>
        <Badge variant="info">{formatNumber(summary.messageCount)} messages</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <span>{summary.participantCount} participants</span>
        <span>{summary.period.from.slice(0, 10)} → {summary.period.to.slice(0, 10)}</span>
      </div>

      {summary.keyTopics.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Key topics</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.keyTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {summary.openQuestions.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Open questions</p>
          <ul className="mt-2 space-y-1">
            {summary.openQuestions.map((question, index) => (
              <li key={index} className="text-sm text-slate-600">• {question}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.actionItems.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Action items</p>
          <ActionItemList items={summary.actionItems.slice(0, 4)} />
        </div>
      ) : null}

      {summary.suggestedReply ? (
        <div className="mt-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Suggested reply</p>
          <p className="mt-1 text-sm text-sky-800">{summary.suggestedReply}</p>
        </div>
      ) : null}
    </div>
  );
}
