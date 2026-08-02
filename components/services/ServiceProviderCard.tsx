import React from 'react';
import { AvailabilityBadge, ProviderBadgeTag, ProviderTypeBadge } from './ServiceBadge';
import { formatNumber, formatRating } from './format';
import { buildProviderUrl } from '@/lib/services';
import type { ServiceProvider } from '@/types/services';

type ServiceProviderCardProps = {
  provider: ServiceProvider;
};

export default function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
            {provider.name.slice(0, 1)}
          </div>
          <div>
            <a href={buildProviderUrl(provider.username)} className="font-semibold text-slate-900 hover:text-sky-700">
              {provider.name}
            </a>
            <p className="text-xs text-slate-400">@{provider.username}</p>
          </div>
        </div>
        <AvailabilityBadge status={provider.availability.status} />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-800">{provider.headline}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-500">{provider.tagline}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <ProviderTypeBadge type={provider.type} />
        {provider.badges.slice(0, 3).map((badge) => (
          <ProviderBadgeTag key={badge} badge={badge} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-900">{formatRating(provider.rating.average)}</p>
          <p className="text-xs text-slate-400">{formatNumber(provider.rating.count)} reviews</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{formatNumber(provider.completedJobs)}</p>
          <p className="text-xs text-slate-400">jobs done</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{provider.responseTime}</p>
          <p className="text-xs text-slate-400">response</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {provider.country}
        {provider.institution ? ` · ${provider.institution}` : ''} · {formatNumber(provider.followers)} followers
      </p>
    </article>
  );
}
