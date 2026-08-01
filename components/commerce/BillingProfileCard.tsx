import React from 'react';
import type { CommerceBillingAddress } from '@/types/commerce';

type BillingProfileCardProps = {
  address: CommerceBillingAddress;
};

export default function BillingProfileCard({ address }: BillingProfileCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Billing profile</p>
        {address.isDefault ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Default</span>
        ) : null}
      </div>

      <p className="mt-4 font-semibold text-slate-900">{address.fullName}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {address.line1}
        {address.line2 ? <>, {address.line2}</> : null}
        <br />
        {address.city}
        {address.state ? `, ${address.state}` : ''}
        {address.postalCode ? ` ${address.postalCode}` : ''}
        <br />
        {address.country}
      </p>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {address.email ? (
          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-medium text-slate-800">{address.email}</span>
          </div>
        ) : null}
        {address.phone ? (
          <div className="flex justify-between">
            <span>Phone</span>
            <span className="font-medium text-slate-800">{address.phone}</span>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-slate-400">Billing address {address.id}</p>
    </article>
  );
}
