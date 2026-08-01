'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { BestPaperAward } from '@/types/conference';

type BestPaperCardProps = {
  award: BestPaperAward;
  className?: string;
};

export default function BestPaperCard({ award, className = '' }: BestPaperCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <Badge variant="warning">{award.category}</Badge>
      <p className="mt-3 text-sm font-semibold leading-5 text-slate-900">{award.title}</p>
      <p className="mt-2 text-sm text-slate-600">{award.authors.join(', ')}</p>
      {award.prize ? <p className="mt-2 text-xs text-slate-500">Prize: {award.prize}</p> : null}
    </div>
  );
}
