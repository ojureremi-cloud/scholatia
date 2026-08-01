import React from 'react';
import { formatCurrency } from './format';
import type { CommerceVendorEarnings } from '@/types/commerce';

type VendorFinanceCardProps = {
  earnings: CommerceVendorEarnings;
};

export default function VendorFinanceCard({ earnings }: VendorFinanceCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Vendor finance</p>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {formatCurrency(earnings.availableBalance, earnings.currency)} available
        </span>
      </div>

      <p className="mt-4 font-semibold text-slate-900">{earnings.vendorName}</p>
      <p className="mt-0.5 text-xs text-slate-400">
        {earnings.periodStart} – {earnings.periodEnd}
      </p>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(earnings.netEarnings, earnings.currency)}</p>
        <p className="text-xs text-slate-500">Net earnings this period</p>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Gross sales</span>
          <span className="font-medium text-slate-800">{formatCurrency(earnings.grossSales, earnings.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Commissions</span>
          <span className="font-medium text-slate-800">{formatCurrency(earnings.commissions, earnings.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Platform fees</span>
          <span className="font-medium text-slate-800">{formatCurrency(earnings.platformFees, earnings.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Refunds</span>
          <span className="font-medium text-slate-800">{formatCurrency(earnings.refunds, earnings.currency)}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div>
          <p className="text-slate-500">Lifetime earnings</p>
          <p className="mt-0.5 font-semibold text-slate-900">{formatCurrency(earnings.lifetimeEarnings, earnings.currency)}</p>
        </div>
        <div>
          <p className="text-slate-500">Pending</p>
          <p className="mt-0.5 font-semibold text-slate-900">{formatCurrency(earnings.pendingBalance, earnings.currency)}</p>
        </div>
      </div>
    </article>
  );
}
