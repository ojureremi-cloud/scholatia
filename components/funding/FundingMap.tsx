'use client';

import React from 'react';
import { formatAmount } from './format';
import type { ContinentFundingStat, CurrencyCode } from '@/types/funding';

type FundingMapProps = {
  byContinent: ContinentFundingStat[];
  currency: CurrencyCode;
  className?: string;
};

const continentEmoji: Record<string, string> = {
  Africa: '🌍',
  Asia: '🌏',
  Europe: '🌍',
  'North America': '🌎',
  'South America': '🌎',
  Oceania: '🌏',
  Global: '🌐',
};

export default function FundingMap({ byContinent, currency, className = '' }: FundingMapProps) {
  const maxValue = Math.max(1, ...byContinent.map((stat) => stat.value));
  const totalCount = Math.max(1, byContinent.reduce((sum, stat) => sum + stat.count, 0));
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Global funding</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">Funding by continent</h3>
      <ul className="mt-5 space-y-5">
        {byContinent.map((stat) => (
          <li key={stat.continent}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">
                {continentEmoji[stat.continent] ?? '•'} {stat.continent}
              </span>
              <span className="font-semibold text-slate-900">{formatAmount(stat.value, currency)}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-sky-600"
                  style={{ width: `${Math.max(2, Math.round((stat.value / maxValue) * 100))}%` }}
                />
              </div>
              <span className="w-16 flex-shrink-0 text-right text-xs text-slate-400">{stat.count} agencies</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
        {totalCount} agencies across {byContinent.length} continents
      </p>
    </div>
  );
}
