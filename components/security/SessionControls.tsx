'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import type { ApiSuccessResponse, SessionResponse } from '@/types/auth';

type SessionControlsProps = {
  className?: string;
};

export default function SessionControls({ className = '' }: SessionControlsProps) {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((body: ApiSuccessResponse<SessionResponse>) => {
        if (active && 'data' in body) {
          setSession(body.data);
        }
      })
      .catch(() => {
        if (active) setSession({ authenticated: false });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Proceed to the login page even if the session could not be revoked.
    } finally {
      window.location.assign('/login');
    }
  }

  if (loading) {
    return (
      <div className={[ 'h-11 w-44 animate-pulse rounded-full bg-slate-200', className ].filter(Boolean).join(' ')} />
    );
  }

  if (!session?.authenticated || !session.user) {
    return (
      <div className={[ 'flex flex-wrap items-center gap-3', className ].filter(Boolean).join(' ')}>
        <Button
          variant="secondary"
          href="/login"
          className="rounded-full border-slate-300 bg-white text-slate-700 shadow-none hover:border-slate-400 hover:bg-slate-50"
        >
          Login
        </Button>
        <Button variant="primary" href="/register" className="rounded-full shadow-md shadow-sky-500/20">
          Register
        </Button>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className={[ 'relative inline-block text-left', className ].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
      >
        <Avatar name={user.displayName} size="sm" />
        <span className="max-w-40 truncate">{user.displayName}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {menuOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          <div className="border-b border-slate-100 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-slate-900">{user.displayName}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="space-y-1 pt-2">
            <a
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Profile
            </a>
            <a
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Account settings
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full rounded-2xl px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
