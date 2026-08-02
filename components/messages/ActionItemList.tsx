import React from 'react';
import type { ActionItem } from '@/types/messages';

type ActionItemListProps = {
  items: ActionItem[];
};

export default function ActionItemList({ items }: ActionItemListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No action items detected.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-0.5 text-emerald-500">✓</span>
          <span>
            {item.text}
            {item.owner ? <span className="text-slate-400"> · {item.owner}</span> : null}
            {item.due ? <span className="text-slate-400"> · due {item.due}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
