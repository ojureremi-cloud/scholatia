'use client';

import { useMemo } from 'react';
import { createAuthUser } from '@/lib/auth';
import type { AuthUser } from '@/types/security';

export default function useCurrentUser(user?: AuthUser | null) {
  return useMemo(() => user ?? createAuthUser(), [user]);
}
