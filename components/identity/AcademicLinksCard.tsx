'use client';

import React from 'react';
import type { ProfileLink } from '@/types/identity';

type AcademicLinksCardProps = {
  links: ProfileLink[];
  className?: string;
};

export default function AcademicLinksCard({ links, className = '' }: AcademicLinksCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Academic links</p>
      <div className="mt-4 space-y-2">
        {links.length === 0 ? (
          <p className="text-sm text-slate-600">No academic links available.</p>
        ) : (
          links.map((link) => (
            <a key={link.href} href={link.href} className="block text-sm font-medium text-sky-700 hover:text-sky-900">
              {link.label}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
