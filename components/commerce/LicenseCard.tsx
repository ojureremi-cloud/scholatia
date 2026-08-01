import React from 'react';
import { LicenseStatusBadge } from './CommerceBadge';
import { formatCurrency, formatDate } from './format';
import type { CommerceLicense } from '@/types/commerce';

type LicenseCardProps = {
  license: CommerceLicense;
};

export default function LicenseCard({ license }: LicenseCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-900">{license.licenseNumber}</p>
          <p className="mt-0.5 text-xs text-slate-400">{license.productName}</p>
        </div>
        <LicenseStatusBadge status={license.status} />
      </div>

      <p className="mt-4 font-semibold text-slate-900">{license.licenseeName}</p>
      <p className="text-xs text-slate-400">
        {license.licenseeType} · {license.licenseeId}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 px-5 py-4 text-sm">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(license.price, license.currency)}</p>
          <p className="text-xs text-slate-500">licence value</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{license.seats}</p>
          <p className="text-xs text-slate-500">seats · {license.termMonths} months</p>
        </div>
      </div>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Starts</span>
          <span className="font-medium text-slate-800">{formatDate(license.startsAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Expires</span>
          <span className="font-medium text-slate-800">{formatDate(license.expiresAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Issued</span>
          <span className="font-medium text-slate-800">{formatDate(license.issuedAt)}</span>
        </div>
      </div>
    </article>
  );
}
