import React from 'react';
import { BoostLevelBadge, DiscountBadge, SponsoredBadge } from './ServiceBadge';
import { formatCompactNumber, formatCurrency, formatDate, formatPercent } from './format';
import { effectiveServicePrice, serviceDiscountPercent } from '@/lib/services';
import type { Service } from '@/types/services';

type ServicePromotionCardProps = {
  service: Service;
};

export default function ServicePromotionCard({ service }: ServicePromotionCardProps) {
  const metrics = service.adMetrics;
  const discount = serviceDiscountPercent(service);

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <a href={service.url} className="font-semibold text-slate-900 hover:text-sky-700">
          {service.title}
        </a>
        <div className="flex flex-wrap gap-1.5">
          {service.sponsored ? <SponsoredBadge /> : null}
          {service.boostLevel ? <BoostLevelBadge level={service.boostLevel} /> : null}
          {discount > 0 ? <DiscountBadge percent={discount} /> : null}
        </div>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        by {service.providerName} · {service.status} · promotable entity
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics ? (
          <>
            <PromotionMetric label="Impressions" value={formatCompactNumber(metrics.impressions)} />
            <PromotionMetric label="Clicks" value={formatCompactNumber(metrics.clicks)} />
            <PromotionMetric label="Inquiries" value={formatCompactNumber(metrics.inquiries)} />
            <PromotionMetric label="Conversions" value={formatCompactNumber(metrics.conversions)} />
            <PromotionMetric label="CTR" value={formatPercent(metrics.ctr)} />
            <PromotionMetric label="CPC" value={formatCurrency(metrics.cpc, 'USD')} />
            <PromotionMetric label="ROI" value={`${metrics.roi.toFixed(1)}×`} />
            <PromotionMetric label="Revenue" value={formatCurrency(effectiveServicePrice(service), service.price.currency)} />
          </>
        ) : (
          <div className="col-span-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            No advertising metrics yet — the service is promotable through the Advertising module.
          </div>
        )}
      </div>

      {service.sponsoredLabel ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Sponsored label: {service.sponsoredLabel}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-slate-400">
        {service.adCampaignId ? `Campaign ${service.adCampaignId} · ` : ''}listed {formatDate(service.dateAdded)}
      </p>
    </article>
  );
}

function PromotionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
