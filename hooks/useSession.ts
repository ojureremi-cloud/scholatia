'use client';

import { useMemo } from 'react';
import { createSessionState } from '@/lib/auth';
import type { SessionState } from '@/types/security';

export default function useSession(initialSession?: SessionState | null) {
  const session = useMemo(() => initialSession ?? createSessionState(), [initialSession]);

  const expiresSoon = new Date(session.expiresAt).getTime() - new Date(session.lastActivityAt).getTime() <= 5 * 60 * 1000;

  return useMemo(
    () => ({
      session,
      isActive: !session.revoked,
      expiresSoon,
    }),
    [expiresSoon, session],
  );
}
