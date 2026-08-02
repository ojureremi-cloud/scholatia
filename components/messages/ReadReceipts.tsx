import React from 'react';
import { formatDateTime } from './format';
import type { ReadReceipt as ReadReceiptType } from '@/types/messages';

type ReadReceiptsProps = {
  readReceipts: ReadReceiptType[];
  currentUserId?: string;
};

export default function ReadReceipts({ readReceipts, currentUserId }: ReadReceiptsProps) {
  const others = readReceipts.filter((receipt) => receipt.readerId !== currentUserId);
  if (others.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
      <span className="text-emerald-500">✓✓</span>
      {others.map((receipt) => (
        <span key={receipt.readerId} title={formatDateTime(receipt.readAt)}>
          {receipt.readerName}
        </span>
      ))}
      <span className="text-slate-300">read</span>
    </div>
  );
}
