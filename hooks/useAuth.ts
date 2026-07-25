'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AuthUser, SessionState } from '@/types/security';
import { createAuthUser } from '@/lib/auth';

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);

  const signIn = useCallback((nextUser: AuthUser, nextSession: SessionState) => {
    setUser(nextUser);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setSession(null);
  }, []);

  const refreshSession = useCallback((nextSession: SessionState) => {
    setSession(nextSession);
  }, []);

  return useMemo(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user && session),
      signIn,
      signOut,
      refreshSession,
      currentUser: user ?? createAuthUser(),
    }),
    [refreshSession, session, signIn, signOut, user],
  );
}
