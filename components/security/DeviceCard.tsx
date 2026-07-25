'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type DeviceCardProps = {
  className?: string;
  name?: string;
  type?: string;
  location?: string;
  lastSeen?: string;
  isCurrent?: boolean;
  status?: string;
};

export default function DeviceCard({
  className = '',
  name = 'MacBook Pro',
  type = 'Laptop',
  location = 'London, United Kingdom',
  lastSeen = 'Active 10 minutes ago',
  isCurrent = false,
  status = 'Secure',
}: DeviceCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Signed in device</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-600">{type} • {location}</p>
        </div>
        <span className={['rounded-full px-3 py-1 text-xs font-semibold', isCurrent ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'].join(' ')}>
          {isCurrent ? 'Current device' : status}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-600">{lastSeen}</p>
        <Button variant="secondary">Review activity</Button>
      </div>
    </div>
  );
}
