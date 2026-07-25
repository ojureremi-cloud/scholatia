'use client';

import React from 'react';
import type { ArticleSummary } from '@/types/identity';

type ArticleCardProps = {
  article: ArticleSummary;
  className?: string;
};

export default function ArticleCard({ article, className = '' }: ArticleCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{article.title}</p>
      <p className="mt-2 text-sm text-slate-600">{article.authors.join(', ')}</p>
      <p className="mt-1 text-sm text-slate-500">Status: {article.status}</p>
    </div>
  );
}
