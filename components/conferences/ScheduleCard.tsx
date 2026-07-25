'use client';

import React from 'react';

type ScheduleCardProps = {
  item: string;
  className?: string;
};

export default function ScheduleCard({ item, className = '' }: ScheduleCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{item}</p>
    </div>
  );
}
