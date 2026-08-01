'use client';

import React from 'react';
import FundingStatistics from './FundingStatistics';
import FundingAgencyCard from './FundingAgencyCard';
import FundingCard from './FundingCard';
import FundingDeadlineCard from './FundingDeadlineCard';
import { formatAmount } from './format';
import type { FundingPortfolio as FundingPortfolioData } from '@/types/funding';

type FundingPortfolioProps = {
  portfolio: FundingPortfolioData;
  className?: string;
};

export default function FundingPortfolio({ portfolio, className = '' }: FundingPortfolioProps) {
  const featured = portfolio.opportunities.filter(
    (opportunity) => opportunity.status === 'open' || opportunity.status === 'upcoming'
  );
  return (
    <div className={[ 'space-y-10', className ].filter(Boolean).join(' ')}>
      <section>
        <FundingStatistics statistics={portfolio.statistics} />
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Featured calls</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">Top funding opportunities</h3>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {featured.slice(0, 6).map((opportunity) => (
            <FundingCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Agencies</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">Funding agencies</h3>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {portfolio.agencies.slice(0, 6).map((agency) => (
            <FundingAgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Deadlines</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">Upcoming deadlines</h3>
        <div className="mt-6">
          <FundingDeadlineCard deadlines={portfolio.deadlines.slice(0, 6)} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Portfolio</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-slate-900">{portfolio.statistics.totalAwarded.toLocaleString('en-US')}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Total awarded ({portfolio.statistics.currency})</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{portfolio.categories.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-900">{portfolio.grants.length}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Grants</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Average award size: {formatAmount(portfolio.statistics.averageAwardSize, portfolio.statistics.currency)}
        </p>
      </section>
    </div>
  );
}
