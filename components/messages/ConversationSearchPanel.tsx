'use client';

import React from 'react';
import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { CONVERSATION_TYPE_LABELS, CONVERSATION_TYPES } from '@/types/messages';
import type { ConversationType } from '@/types/messages';
import type { ConversationSort } from '@/lib/messages';

const sortOptions: { label: string; value: ConversationSort }[] = [
  { label: 'Most recent', value: 'recent' },
  { label: 'Unread first', value: 'unread' },
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'By type', value: 'type' },
];

type ConversationSearchPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
  type: 'all' | ConversationType;
  onTypeChange: (value: 'all' | ConversationType) => void;
  sort: ConversationSort;
  onSortChange: (value: ConversationSort) => void;
  showUnreadOnly: boolean;
  onToggleUnreadOnly: () => void;
};

export default function ConversationSearchPanel({
  query,
  onQueryChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
  showUnreadOnly,
  onToggleUnreadOnly,
}: ConversationSearchPanelProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search messages and conversations..." />

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="min-w-52 flex-1">
          <Select
            label="Type"
            value={type}
            onChange={(event) => onTypeChange(event.target.value as 'all' | ConversationType)}
            options={[
              { label: 'All types', value: 'all' },
              ...CONVERSATION_TYPES.map((entry) => ({ label: CONVERSATION_TYPE_LABELS[entry], value: entry })),
            ]}
          />
        </div>
        <div className="min-w-44 flex-1">
          <Select
            label="Sort by"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ConversationSort)}
            options={sortOptions}
          />
        </div>
        <div className="pb-1">
          <Switch checked={showUnreadOnly} onChange={onToggleUnreadOnly} label="Unread only" />
        </div>
      </div>
    </div>
  );
}
