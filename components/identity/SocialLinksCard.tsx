'use client';

import React from 'react';
import type { ProfileLink } from '@/types/identity';

type SocialLinksCardProps = {
  links: ProfileLink[];
  className?: string;
};

export default function SocialLinksCard({ links, className = '' }: SocialLinksCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Social links</p>
      <div className="mt-4 space-y-2">
        {links.length === 0 ? (
          <p className="text-sm text-slate-600">No social links available.</p>
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
