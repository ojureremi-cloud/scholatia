'use client';

import React from 'react';
import { SERVICE_CATEGORY_GROUP_COUNTS } from '@/constants/placeholder-services';

type ServiceCategoryTabsProps = {
  group: string;
  onGroupChange: (value: string) => void;
};

export default function ServiceCategoryTabs({ group, onGroupChange }: ServiceCategoryTabsProps) {
  const options = [{ group: '', label: 'All', icon: '🌐' }, ...SERVICE_CATEGORY_GROUP_COUNTS];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = group === option.group;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onGroupChange(option.group)}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              active
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="mr-1.5">{option.icon}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
