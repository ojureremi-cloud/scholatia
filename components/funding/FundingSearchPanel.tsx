'use client';

import React, { useMemo, useState } from 'react';
import FundingOpportunityCard from './FundingOpportunityCard';
import type { FundingOpportunity, GrantCategory } from '@/types/funding';

type FundingSearchPanelProps = {
  opportunities: FundingOpportunity[];
  className?: string;
};

export default function FundingSearchPanel({ opportunities, className = '' }: FundingSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GrantCategory | 'all'>('all');
  const [status, setStatus] = useState<'all' | 'open' | 'upcoming' | 'closed'>('all');
  const [region, setRegion] = useState<'all' | 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania'>('all');

  const categories = useMemo(
    () => Array.from(new Set(opportunities.map((opportunity) => opportunity.category))) as GrantCategory[],
    [opportunities]
  );

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return opportunities.filter((opportunity) => {
      if (category !== 'all' && opportunity.category !== category) return false;
      if (status !== 'all' && opportunity.status !== status) return false;
      if (region !== 'all' && !opportunity.continents.includes(region)) return false;
      if (lower) {
        const haystack = `${opportunity.title} ${opportunity.summary} ${opportunity.agencyName} ${opportunity.researchAreas.join(' ')}`.toLowerCase();
        if (!haystack.includes(lower)) return false;
      }
      return true;
    });
  }, [opportunities, query, category, status, region]);

  const selectClass =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none';

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search opportunities, agencies, or research areas…"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value as GrantCategory | 'all')} className={selectClass}>
          <option value="all">All categories</option>
          {categories.map((candidate) => (
            <option key={candidate} value={candidate}>
              {candidate.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | 'open' | 'upcoming' | 'closed')} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="upcoming">Upcoming</option>
          <option value="closed">Closed</option>
        </select>
        <select value={region} onChange={(event) => setRegion(event.target.value as typeof region)} className={selectClass}>
          <option value="all">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {opportunities.length} opportunities
      </p>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((opportunity) => (
          <FundingOpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}
