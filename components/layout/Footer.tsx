import React from 'react';

const footerLinks = [
  { label: 'Conferences', href: '#conferences' },
  { label: 'Journals', href: '#journals' },
  { label: 'People', href: '#people' },
  { label: 'Institutions', href: '#institutions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

type FooterProps = {
  className?: string;
};

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={[ 'bg-white py-12 sm:py-16', className ].filter(Boolean).join(' ')}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Scholatia</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              A global scholarly infrastructure platform built for students, researchers, academics, institutions, journals, conferences, publishers and the academic community.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Platform</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {footerLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Support</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {footerLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
