'use client';

import React from 'react';

type StatisticCardProps = {
  value: string;
  label: string;
  className?: string;
};

export default function StatisticCard({ value, label, className = '' }: StatisticCardProps) {
  return (
    <div className={[ 'rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]', className ].filter(Boolean).join(' ')}>
      <p className="text-4xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
    </div>
  );
}
