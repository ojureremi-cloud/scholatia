'use client';

import React from 'react';

type SponsorCardProps = {
  name: string;
  className?: string;
};

export default function SponsorCard({ name, className = '' }: SponsorCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{name}</p>
    </div>
  );
}
