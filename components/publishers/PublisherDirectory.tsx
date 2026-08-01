'use client';

import React from 'react';
import PublisherBadge from './PublisherBadge';
import type { Publisher } from '@/types/publisher';

type PublisherDirectoryProps = {
  publishers: Publisher[];
  className?: string;
};

export default function PublisherDirectory({ publishers, className = '' }: PublisherDirectoryProps) {
  return (
    <div className={['overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card', className].filter(Boolean).join(' ')}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Headquarters</th>
              <th className="px-6 py-4 text-right">Journals</th>
              <th className="px-6 py-4 text-right">Conferences</th>
              <th className="px-6 py-4 text-right">Trust</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {publishers.map((publisher) => (
              <tr key={publisher.id} className="text-sm text-slate-700">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                      {publisher.logo}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{publisher.name}</p>
                      <p className="text-xs text-slate-500">{publisher.acronym}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{publisher.type.replace(/-/g, ' ')}</td>
                <td className="px-6 py-4">{publisher.headquarters}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {publisher.metrics.journals.toLocaleString('en-US')}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {publisher.metrics.conferences.toLocaleString('en-US')}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">{publisher.trustScore}/100</td>
                <td className="px-6 py-4">
                  <PublisherBadge status={publisher.verificationStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
