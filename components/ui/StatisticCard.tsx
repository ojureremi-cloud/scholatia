'use client';

import React from 'react';

type StatisticCardProps = {
  title: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: string;
  className?: string;
};

export default function StatisticCard({ title, value, trend, trendPositive, icon, className = '' }: StatisticCardProps) {
  return (
    <div className={[ 'rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]', className ].filter(Boolean).join(' ')}>
      {icon ? <span className="text-2xl mb-2 block">{icon}</span> : null}
      <p className="text-4xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
      {trend ? <p className={[ 'mt-2 text-xs font-medium', trendPositive ? 'text-emerald-600' : 'text-rose-600' ].filter(Boolean).join(' ')}>{trend}</p> : null}
    </div>
  );
}
