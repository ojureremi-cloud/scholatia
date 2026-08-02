import React from 'react';
import { AvailabilityBadge, ProviderBadgeTag, ProviderTypeBadge } from './ServiceBadge';
import { formatDate, formatNumber } from './format';
import { buildProviderUrl, providerSkillNames } from '@/lib/services';
import type { ServiceProvider } from '@/types/services';

type ProviderHeaderProps = {
  provider: ServiceProvider;
};

export default function ProviderHeader({ provider }: ProviderHeaderProps) {
  const skills = providerSkillNames(provider);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white">
            {provider.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold text-slate-900">{provider.name}</h3>
              <ProviderTypeBadge type={provider.type} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              @{provider.username} · {provider.headline}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {provider.country}
              {provider.city ? `, ${provider.city}` : ''}
              {provider.institution ? ` · ${provider.institution}` : ''}
              {provider.department ? ` · ${provider.department}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AvailabilityBadge status={provider.availability.status} />
          <a href={buildProviderUrl(provider.username)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            View profile
          </a>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-slate-600">{provider.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 md:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{provider.rating.average.toFixed(1)} ★</p>
          <p className="text-xs text-slate-500">{formatNumber(provider.rating.count)} reviews</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(provider.completedJobs)}</p>
          <p className="text-xs text-slate-500">jobs completed</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{provider.successRate}%</p>
          <p className="text-xs text-slate-500">success rate</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{provider.responseTime}</p>
          <p className="text-xs text-slate-500">response time</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {provider.badges.map((badge) => (
          <ProviderBadgeTag key={badge} badge={badge} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {skills.slice(0, 10).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Member since {formatDate(provider.memberSince)} · {formatNumber(provider.followers)} followers · trust score {provider.trustScore}
      </p>
    </article>
  );
}
