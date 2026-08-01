'use client';

import React from 'react';
import { entityTypeLabel } from './format';
import type { DiscoveryFacet } from '@/types/discovery';

type DiscoveryFacetPanelProps = {
  facets: DiscoveryFacet[];
  activeFilters: string[];
  onToggle?: (facetId: string) => void;
  className?: string;
};

const facetCategoryLabels: Record<DiscoveryFacet['category'], string> = {
  entityType: 'Entity type',
  discipline: 'Discipline',
  country: 'Country',
  continent: 'Continent',
  year: 'Year',
  status: 'Status',
};

export default function DiscoveryFacetPanel({
  facets,
  activeFilters,
  onToggle,
  className = '',
}: DiscoveryFacetPanelProps) {
  const categories = Array.from(new Set(facets.map((facet) => facet.category)));

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      {categories.map((category) => {
        const group = facets.filter((facet) => facet.category === category);
        return (
          <div key={category}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{facetCategoryLabels[category]}</p>
            <ul className="mt-3 space-y-2">
              {group.slice(0, 8).map((facet) => {
                const active = activeFilters.includes(facet.id);
                const label = category === 'entityType' ? entityTypeLabel(facet.name as never) : facet.name;
                return (
                  <li key={facet.id}>
                    <button
                      type="button"
                      disabled={!onToggle}
                      onClick={() => onToggle?.(facet.id)}
                      className={[
                        'flex w-full items-center justify-between gap-2 rounded-full px-3 py-1.5 text-left text-sm transition',
                        active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                        !onToggle ? 'cursor-default' : 'cursor-pointer',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span className="truncate">{label}</span>
                      <span className={['text-xs font-semibold', active ? 'text-white/80' : 'text-slate-400'].join(' ')}>
                        {facet.count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
