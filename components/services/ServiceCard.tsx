import React from 'react';
import {
  CategoryBadge,
  DiscountBadge,
  FeaturedBadge,
  GroupBadge,
  ServiceTypeBadge,
  SponsoredBadge,
} from './ServiceBadge';
import { formatCurrency, formatNumber } from './format';
import { buildProviderUrl, buildServiceUrl, effectiveServicePrice, estimateDelivery, serviceDiscountPercent, serviceListPrice } from '@/lib/services';
import type { Service } from '@/types/services';

type ServiceCardProps = {
  service: Service;
  featured?: boolean;
  favorite?: boolean;
  providerUsername?: string;
  onToggleFavorite?: (serviceId: string) => void;
};

export default function ServiceCard({ service, featured = false, favorite = false, providerUsername, onToggleFavorite }: ServiceCardProps) {
  const effective = effectiveServicePrice(service);
  const list = serviceListPrice(service);
  const discount = serviceDiscountPercent(service);
  const delivery = estimateDelivery(service);

  return (
    <article
      className={[
        'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        featured ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <a href={buildServiceUrl(service.id)} className="font-semibold text-slate-900 hover:text-sky-700">
          {service.title}
        </a>
        <div className="flex flex-wrap gap-1.5">
          {service.sponsored ? <SponsoredBadge /> : null}
          {featured || service.featured ? <FeaturedBadge /> : null}
          {onToggleFavorite ? (
            <button
              type="button"
              onClick={() => onToggleFavorite(service.id)}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              {favorite ? '♥' : '♡'}
            </button>
          ) : null}
        </div>
      </div>

      {providerUsername ? (
        <a href={buildProviderUrl(providerUsername)} className="mt-1 text-xs text-slate-400 hover:text-sky-700">
          by {service.providerName}
        </a>
      ) : (
        <p className="mt-1 text-xs text-slate-400">by {service.providerName}</p>
      )}

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">{service.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <CategoryBadge category={service.category} />
        <GroupBadge group={service.group} />
        <ServiceTypeBadge type={service.type} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(effective, service.price.currency)}</p>
            {discount > 0 ? (
              <>
                <span className="text-sm text-slate-400 line-through">{formatCurrency(list, service.price.currency)}</span>
                <DiscountBadge percent={discount} />
              </>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {service.price.interval ? `per ${service.price.interval.replace(/-/g, ' ')}` : 'fixed price'} · {delivery.range} delivery
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-900">{service.rating.average.toFixed(1)} ★</p>
          <p className="text-xs text-slate-400">{formatNumber(service.reviewCount)} reviews</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
        {service.keywords.slice(0, 4).map((keyword) => (
          <span key={keyword} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{formatNumber(service.completedJobs)} completed</span>
        <span>{formatNumber(service.inquiries)} inquiries</span>
        <span>{formatNumber(service.favorites)} favorites</span>
      </div>
    </article>
  );
}
