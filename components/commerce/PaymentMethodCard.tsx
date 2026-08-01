import React from 'react';
import { formatPaymentMethod } from './format';
import { providersForMethod } from '@/lib/commerce';
import type { CommerceGatewayProvider, CommercePaymentMethod } from '@/types/commerce';

type PaymentMethodCardProps = {
  method: CommercePaymentMethod;
  gatewayProviders?: readonly CommerceGatewayProvider[];
};

export default function PaymentMethodCard({ method, gatewayProviders = [] }: PaymentMethodCardProps) {
  const providers = providersForMethod(gatewayProviders, method);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Payment method</p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{formatPaymentMethod(method)}</p>

      <div className="mt-4">
        <p className="text-xs text-slate-400">Supported gateways</p>
        {providers.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {providers.map((provider) => (
              <span
                key={provider.id}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {provider.displayName}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">No enabled gateway supports this rail yet.</p>
        )}
      </div>
    </article>
  );
}
