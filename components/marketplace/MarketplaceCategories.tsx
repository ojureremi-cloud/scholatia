import React from 'react';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_CATEGORY_ICONS, MARKETPLACE_CATEGORY_LABELS, MARKETPLACE_SUBCATEGORIES } from '@/types/marketplace';

type MarketplaceCategoriesProps = {
  withCounts?: boolean;
  active?: string;
};

export default function MarketplaceCategories({ withCounts = true, active = 'all' }: MarketplaceCategoriesProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MARKETPLACE_CATEGORIES.map((category) => {
        const subcategories = MARKETPLACE_SUBCATEGORIES[category];
        const isActive = active === category;
        return (
          <a
            key={category}
            href={`/marketplace?category=${category}`}
            className={[
              'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition',
              isActive ? 'border-sky-600' : 'border-slate-200 hover:border-slate-300',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-2xl">{MARKETPLACE_CATEGORY_ICONS[category]}</span>
              {isActive ? <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Active</span> : null}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{MARKETPLACE_CATEGORY_LABELS[category]}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {subcategories.slice(0, 4).map((subcategory) => (
                <span key={subcategory} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                  {subcategory.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
            {withCounts ? (
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {subcategories.length} subcategories
              </p>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
