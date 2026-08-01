'use client';

import type { ResearcherProfile } from '@/types/researcher';

type SocialProfileCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function SocialProfileCard({ researcher, className = '' }: SocialProfileCardProps) {
  const { socialLinks } = researcher;
  const links = [
    { label: 'LinkedIn', href: socialLinks.linkedin },
    { label: 'Personal website', href: socialLinks.personalWebsite },
    { label: 'Twitter', href: socialLinks.twitter },
    { label: 'GitHub', href: socialLinks.github },
    { label: 'ResearchGate', href: socialLinks.researchGate },
    { label: 'Academia.edu', href: socialLinks.academia },
    { label: 'Blog', href: socialLinks.blog },
    { label: 'YouTube', href: socialLinks.youtube },
  ].filter((link) => link.href);
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Social profiles</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block truncate rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-sky-700 transition hover:border-sky-300"
            >
              {link.label}
            </a>
          </li>
        ))}
        {socialLinks.others.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block truncate rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-sky-700 transition hover:border-sky-300"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {links.length === 0 && socialLinks.others.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">No social profiles linked.</p>
      ) : null}
    </section>
  );
}
