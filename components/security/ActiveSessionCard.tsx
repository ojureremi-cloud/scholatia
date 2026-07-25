'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type ActiveSessionCardProps = {
  className?: string;
  title?: string;
  location?: string;
  device?: string;
  lastActive?: string;
  isCurrent?: boolean;
};

export default function ActiveSessionCard({
  className = '',
  title = 'Scholar dashboard',
  location = 'Berlin, Germany',
  device = 'Chrome on Windows',
  lastActive = 'Last active 2 hours ago',
  isCurrent = false,
}: ActiveSessionCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Active session</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{location}</p>
        </div>
        {isCurrent ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Current</span>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">{device}</p>
        <p className="mt-1 text-sm text-slate-600">{lastActive}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary">Sign out</Button>
        <Button variant="secondary">Review session</Button>
      </div>
    </div>
  );
}
