import React from 'react';
import Logo from '../ui/Logo';
import SessionControls from '../security/SessionControls';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Conferences', href: '/conferences' },
  { label: 'Journals', href: '/journals' },
  { label: 'People', href: '#people' },
  { label: 'Institutions', href: '#institutions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

type NavbarProps = {
  className?: string;
};

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <header className={[ 'sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm', className ].filter(Boolean).join(' ')}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <SessionControls />
        </div>
      </div>
    </header>
  );
}
