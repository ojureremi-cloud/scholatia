'use client';

import React from 'react';
import { navigationItems, platformModules } from '@/constants/config';

export default function MegaNavigation() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Navigation</h3>
          <div className="mt-4 grid gap-3">
            {navigationItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Platform modules</h3>
          <div className="mt-4 grid gap-3">
            {platformModules.map((module) => (
              <a key={module.href} href={module.href} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                {module.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
