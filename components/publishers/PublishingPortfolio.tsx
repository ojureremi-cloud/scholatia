'use client';

import React from 'react';
import PublisherCard from './PublisherCard';
import PublisherStatistics from './PublisherStatistics';
import { formatCompactNumber } from './format';
import type { PublisherPortfolio as PublisherPortfolioData } from '@/types/publisher';

type PublishingPortfolioProps = {
  portfolio: PublisherPortfolioData;
  className?: string;
};

export default function PublishingPortfolio({ portfolio, className = '' }: PublishingPortfolioProps) {
  const featured = portfolio.publishers.slice(0, 6);
  return (
    <div className={['space-y-10', className].filter(Boolean).join(' ')}>
      <section>
        <PublisherStatistics statistics={portfolio.statistics} />
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Featured publishers</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">Flagship publishing houses</h3>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {featured.map((publisher) => (
            <PublisherCard key={publisher.id} publisher={publisher} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Portfolio</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-slate-900">{portfolio.publishers.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Publishers</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{portfolio.categories.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Publisher types</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(portfolio.statistics.totalJournals)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Journals</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Average trust score: {portfolio.statistics.averageTrustScore}/100
        </p>
      </section>
    </div>
  );
}
