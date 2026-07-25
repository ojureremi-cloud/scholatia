'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type SecuritySettingsCardProps = {
  className?: string;
  title?: string;
  description?: string;
};

const settings = [
  { label: 'Password policy', value: 'Updated 4 days ago' },
  { label: 'Two-step verification', value: 'Enabled for all admin roles' },
  { label: 'Recovery options', value: 'Backup email and phone configured' },
];

export default function SecuritySettingsCard({
  className = '',
  title = 'Security settings',
  description = 'Review active controls and maintain a secure academic account profile.',
}: SecuritySettingsCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Account controls</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <Button variant="secondary">Manage</Button>
      </div>

      <div className="mt-6 space-y-3">
        {settings.map((setting) => (
          <div key={setting.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{setting.label}</p>
              <p className="text-sm text-slate-600">{setting.value}</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
