'use client';

import React, { useState } from 'react';
import { navigationItems } from '@/constants/config';

export default function ResponsiveMobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open ? (
        <div className="mt-4 space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
