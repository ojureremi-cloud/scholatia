'use client';

import { useMemo } from 'react';
import type { ScholatiaAcademicIdentity } from '@/types/identity';

export default function useIdentity(identity?: ScholatiaAcademicIdentity | null) {
  return useMemo(
    () => ({
      identity,
      isVerified: Boolean(identity?.isVerified),
      said: identity?.said ?? 'SAID-0000-0000-0000',
    }),
    [identity],
  );
}
