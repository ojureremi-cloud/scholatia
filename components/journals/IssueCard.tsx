'use client';

import React from 'react';
import type { IssueSummary } from '@/types/identity';

type IssueCardProps = {
  issue: IssueSummary;
  className?: string;
};

export default function IssueCard({ issue, className = '' }: IssueCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">Issue {issue.issueNumber}</p>
      <p className="mt-2 text-sm text-slate-600">{issue.year}</p>
      <p className="mt-1 text-sm text-slate-500">Status: {issue.status}</p>
    </div>
  );
}
