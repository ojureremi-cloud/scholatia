'use client';

import React from 'react';
import { CONVERSATION_TYPE_LABELS, CONVERSATION_TYPES } from '@/types/messages';
import type { ConversationType } from '@/types/messages';

type ConversationTypeTabsProps = {
  active: 'all' | ConversationType;
  onChange: (value: 'all' | ConversationType) => void;
  counts?: Partial<Record<ConversationType, number>>;
};

export default function ConversationTypeTabs({ active, onChange, counts = {} }: ConversationTypeTabsProps) {
  const tabs: { label: string; value: 'all' | ConversationType }[] = [
    { label: 'All', value: 'all' },
    ...CONVERSATION_TYPES.map((entry) => ({ label: CONVERSATION_TYPE_LABELS[entry], value: entry })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const count = tab.value === 'all' ? undefined : counts[tab.value as ConversationType];
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={[
              'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
              isActive ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tab.label}
            {count !== undefined ? <span className={isActive ? 'ml-1 text-sky-100' : 'ml-1 text-slate-400'}>({count})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
